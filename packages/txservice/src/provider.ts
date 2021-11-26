import {
  createLoggingContext,
  delay,
  ERC20Abi,
  jsonifyError,
  Logger,
  NxtpError,
  RequestContext,
} from "@connext/nxtp-utils";
import axios from "axios";
import { BigNumber, Signer, Wallet, providers, constants, Contract, utils } from "ethers";
import { okAsync, ResultAsync } from "neverthrow";

import { TransactionServiceConfig, validateProviderConfig, ChainConfig } from "./config";
import {
  ConfigurationError,
  GasEstimateInvalid,
  parseError,
  RpcError,
  TransactionError,
  TransactionReadError,
  TransactionReverted,
  UnpredictableGasLimit,
} from "./error";
import { CachedGas, CachedTransactionCount, ReadTransaction, Transaction } from "./types";

const NO_GAS_MIN_CHAIN_IDS = [10];

const { StaticJsonRpcProvider, FallbackProvider } = providers;

/**
 * @classdesc A transaction service provider wrapper that handles the connections to remote providers and parses
 * the responses.
 */
export class ChainRpcProvider {
  // Saving the list of underlying JsonRpcProviders used in FallbackProvider for the event
  // where we need to do a send() call directly on each one (Fallback doesn't raise that interface).
  private readonly _providers: providers.JsonRpcProvider[];
  private readonly provider: providers.FallbackProvider;
  private readonly signer?: Signer;
  private readonly quorum: number;
  private cachedGas?: CachedGas;
  private lastUsedGasPrice: BigNumber | undefined = undefined;
  private cachedTransactionCount?: CachedTransactionCount;
  private cachedDecimals: Record<string, number> = {};
  protected paused: Error | undefined = undefined;

  public readonly confirmationsRequired: number;
  public readonly confirmationTimeout: number;

  public get isReadOnly(): boolean {
    return !this.signer;
  }

  /**
   * A class for managing the usage of an ethers FallbackProvider, and for wrapping calls in
   * retries. Will ensure provider(s) are ready before any use case.
   *
   * @param logger Logger used for logging.
   * @param signer Signer instance or private key used for signing transactions.
   * @param chainId The ID of the chain for which this class's providers will be servicing.
   * @param chainConfig Configuration for this specified chain, including the providers we'll
   * be using for it.
   * @param config The shared TransactionServiceConfig with general configuration.
   *
   * @throws ChainError.reasons.ProviderNotFound if no valid providers are found in the
   * configuration.
   */
  constructor(
    protected readonly logger: Logger,
    public readonly chainId: number,
    protected readonly chainConfig: ChainConfig,
    protected readonly config: TransactionServiceConfig,
    signer?: string | Signer,
  ) {
    this.confirmationsRequired = chainConfig.confirmations ?? config.defaultConfirmationsRequired;
    this.confirmationTimeout = chainConfig.confirmationTimeout ?? config.defaultConfirmationTimeout;
    // NOTE: Quorum is set to 1 here, but we may want to reconfigure later. Normally it is half the sum of the weights,
    // which might be okay in our case, but for now we have a low bar.
    // NOTE: This only applies to fallback provider case below.
    this.quorum = chainConfig.quorum ?? 1;

    const { requestContext, methodContext } = createLoggingContext("ChainRpcProvider.constructor");

    // Register a provider for each url.
    // Make sure all providers are ready()
    const providerConfigs = chainConfig.providers;
    const filteredConfigs = providerConfigs.filter((config) => {
      const valid = validateProviderConfig(config);
      if (!valid) {
        this.logger.warn("Configuration was invalid for provider.", requestContext, methodContext, {
          config,
        });
      }
      return valid;
    });
    if (filteredConfigs.length > 0) {
      const hydratedConfigs = filteredConfigs.map((config) => ({
        provider: new StaticJsonRpcProvider(
          {
            url: config.url,
            user: config.user,
            password: config.password,
          },
          this.chainId,
        ),
        priority: config.priority ?? 1,
        weight: config.weight ?? 1,
        stallTimeout: config.stallTimeout,
      }));
      this.provider = new FallbackProvider(hydratedConfigs, this.quorum);
      this._providers = hydratedConfigs.map((p) => p.provider);
    } else {
      // Not enough valid providers were found in configuration.
      // We must throw here, as the router won't be able to support this chain without valid provider configs.
      throw new ConfigurationError(
        {
          providers: `No valid providers were supplied in configuration for chain ${this.chainId}.`,
        },
        {
          providers,
        },
      );
    }

    if (signer) {
      this.signer = typeof signer === "string" ? new Wallet(signer, this.provider) : signer.connect(this.provider);
    } else {
      this.signer = undefined;
    }
  }

  /**
   * Send the transaction request to the provider.
   *
   * @remarks This method is set to access protected since it should really only be used by the inheriting class,
   * TransactionDispatch, as of the time of writing this.
   *
   * @param tx The transaction used for the request.
   *
   * @returns The ethers TransactionResponse.
   */
  protected sendTransaction(tx: Transaction): ResultAsync<providers.TransactionResponse, TransactionError> {
    // Do any parsing and value handling work here if necessary.
    const { params } = tx;
    const transaction = {
      ...params,
      value: BigNumber.from(params.value || 0),
    };
    return this.resultWrapper<providers.TransactionResponse>(true, async () => {
      return await this.signer!.sendTransaction(transaction);
    });
  }

  /**
   * Get the receipt for the transaction with the specified hash, optionally blocking
   * until a specified timeout.
   *
   * @param hash The hexadecimal hash string of the transaction.
   * @param confirmations Optional parameter to override the configured number of confirmations
   * required to validate the receipt.
   * @param timeout Optional timeout parameter to override the configured parameter.
   *
   * @returns The ethers TransactionReceipt, if mined, otherwise null.
   */
  public confirmTransaction(
    transaction: Transaction,
    confirmations: number = this.confirmationsRequired,
    timeout: number = this.confirmationTimeout,
  ): ResultAsync<providers.TransactionReceipt | null, TransactionError> {
    return this.resultWrapper<providers.TransactionReceipt>(
      true,
      () => {
        // The only way to access the functionality internal to ethers for handling replacement tx.
        // See issue: https://github.com/ethers-io/ethers.js/issues/1775
        return Promise.race(transaction.responses.map((response) => (response as any).wait(confirmations, timeout)));
      },
      false,
    );
  }

  /**
   * Execute a read transaction using the passed in transaction data, which includes
   * the target contract which we are reading from.
   * @param tx Minimal transaction data needed to read from chain.
   * @returns A string of data read from chain.
   * @throws ChainError.reasons.ContractReadFailure in the event of a failure
   * to read from chain.
   */
  public readTransaction(tx: ReadTransaction): ResultAsync<string, TransactionError> {
    return this.resultWrapper<string>(true, async () => {
      try {
        return await this.provider.call(tx);
      } catch (error) {
        throw new TransactionReadError(TransactionReadError.reasons.ContractReadError, {
          error,
          chainId: this.chainId,
          urls: this._providers.map((p) => p.connection.url),
          tx,
        });
      }
    });
  }

  /**
   * Estimate gas cost for the specified transaction.
   *
   * @remarks
   *
   * Because estimateGas is almost always our "point of failure" - the point where its
   * indicated by the provider that our tx would fail on chain - and ethers obscures the
   * revert error code when it fails through its typical API, we had to implement our own
   * estimateGas call through RPC directly.
   *
   * @param transaction The ethers TransactionRequest data in question.
   *
   * @returns A BigNumber representing the estimated gas value.
   */
  public estimateGas(transaction: providers.TransactionRequest): ResultAsync<BigNumber, TransactionError> {
    return this.resultWrapper<BigNumber>(false, async () => {
      const errors: any[] = [];
      // TODO: #147 If quorum > 1, we should make this call to multiple providers.
      for (const provider of this._providers) {
        let result: string;
        try {
          // This call will prepare the transaction params for us (hexlify tx, etc).
          // TODO: #147 Is there any reason prepare should be called for each iteration?
          const args = provider.prepareRequest("estimateGas", { transaction });
          result = await provider.send(args[0], args[1]);
        } catch (error) {
          const sanitizedError = parseError(error);
          // If we get a TransactionReverted error, we can assume that the transaction will fail,
          // and we ought to just throw here.
          if (sanitizedError.type === TransactionReverted.type) {
            throw sanitizedError;
          } else {
            errors.push(error);
            continue;
          }
        }

        try {
          return BigNumber.from(result);
        } catch (error) {
          throw new GasEstimateInvalid(result, {
            error: error.message,
          });
        }
      }
      if (errors.every((e) => e.type === RpcError.type)) {
        throw new RpcError(RpcError.reasons.FailedToSend, { errors });
      }
      throw new UnpredictableGasLimit({ errors });
    });
  }

  /**
   * Get the current gas price for the chain for which this instance is servicing.
   * @returns The BigNumber value for the current gas price.
   */
  public getGasPrice(context: RequestContext): ResultAsync<BigNumber, TransactionError> {
    const { requestContext, methodContext } = createLoggingContext(this.getGasPrice.name, context);
    const hardcoded = this.chainConfig.defaultInitialGas;
    if (hardcoded) {
      this.logger.info("Using hardcoded gas price for chain", requestContext, methodContext, {
        chainId: this.chainId,
        hardcoded,
      });
      return okAsync(BigNumber.from(hardcoded));
    }

    // If it's been less than a minute since we retrieved gas price, send the last update in gas price.
    // TODO: This should cache per block, not every 3 seconds!
    if (this.cachedGas && Date.now() - this.cachedGas.timestamp < 3_000) {
      return okAsync(this.cachedGas.price);
    }

    return this.resultWrapper<BigNumber>(false, async () => {
      const { gasInitialBumpPercent, gasMinimum, gasPriceMaxIncreaseScalar } = this.config;
      let gasPrice: BigNumber | undefined = undefined;

      // Use gas station APIs, if available.
      const gasStations = this.chainConfig.gasStations ?? [];
      for (let i = 0; i < gasStations.length; i++) {
        const uri = gasStations[i];
        let response: any;
        try {
          response = await axios.get(uri);
          if (!response || !response.data) {
            continue;
          }
          const { rapid, fast } = response.data;
          if (rapid) {
            gasPrice = BigNumber.from(rapid.toString());
            break;
          } else if (fast) {
            gasPrice = utils.parseUnits(fast.toString(), "gwei");
            break;
          } else {
            this.logger.debug("Gas station response did not have expected params", requestContext, methodContext, {
              uri,
              data: response.data,
            });
          }
        } catch (e) {
          this.logger.debug("Gas station not responding correctly", requestContext, methodContext, {
            uri,
            res: response ? (response?.data ? response.data : response) : undefined,
            error: jsonifyError(e),
          });
        }
      }

      if (gasStations.length > 0 && !gasPrice) {
        this.logger.warn("Gas stations failed, using provider call instead", requestContext, methodContext, {
          gasStations,
        });
      } else if (gasStations.length > 0 && gasPrice) {
        // TODO: Remove this unnecessary provider call, used temporarily for debugging / metrics.
        const providerQuote = await this.provider.getGasPrice();
        this.logger.debug("Retrieved gas prices", requestContext, methodContext, {
          chainId: this.chainId,
          gasStationQuote: gasPrice,
          providerQuote,
        });
      }

      // If we did not have a gas station API to use, or the gas station failed, use the provider's getGasPrice method.
      if (!gasPrice) {
        try {
          gasPrice = await this.provider.getGasPrice();
        } catch (error) {
          this.logger.error(
            "getGasPrice failure, attempting to default to backup gas value.",
            requestContext,
            methodContext,
            jsonifyError(error),
            { chainId: this.chainId },
          );
          // Default to initial gas price, if available. Otherwise, throw.
          gasPrice = BigNumber.from(this.chainConfig.defaultInitialGas);
          if (!gasPrice) {
            throw error;
          }
        }
        gasPrice = gasPrice.add(gasPrice.mul(gasInitialBumpPercent).div(100));
      }

      // If the gas price is less than the gas minimum, bump it up to minimum.
      if (!NO_GAS_MIN_CHAIN_IDS.includes(this.chainId)) {
        const min = BigNumber.from(gasMinimum);
        if (gasPrice.lt(min)) {
          gasPrice = min;
        }
      }
      let hitMaximum = false;
      if (
        gasPriceMaxIncreaseScalar !== undefined &&
        gasPriceMaxIncreaseScalar > 100 &&
        this.lastUsedGasPrice !== undefined
      ) {
        // If we have a configured cap scalar, and the gas price is greater than that cap, set it to the cap.
        const max = this.lastUsedGasPrice.mul(gasPriceMaxIncreaseScalar).div(100);
        if (gasPrice.gt(max)) {
          hitMaximum = true;
          gasPrice = max;
        }
        // Update our last used gas price with this tx's gas price. This may be used to determine the cap of
        // subsuquent tx's gas price.
        this.lastUsedGasPrice = gasPrice;
      }

      // Cache the latest gas price, assuming we didn't hit the maximum increase cap.
      // We'll want to re-request the gas price if we did hit the cap.
      if (!hitMaximum) {
        this.cachedGas = { price: gasPrice, timestamp: Date.now() };
      }
      return gasPrice;
    });
  }

  /**
   * Get the current balance for the specified address.
   *
   * @param address The hexadecimal string address whose balance we are getting.
   *
   * @returns A BigNumber representing the current value held by the wallet at the
   * specified address.
   */
  public getBalance(address: string): ResultAsync<BigNumber, TransactionError> {
    return this.resultWrapper<BigNumber>(false, async () => {
      return await this.provider.getBalance(address);
    });
  }

  /**
   * Get the decimals for the ERC20 token contract.
   *
   * @param address The hexadecimal string address of the asset.
   *
   * @returns A number representing the current decimals.
   */
  public getDecimalsForAsset(assetId: string): ResultAsync<number, TransactionError> {
    return this.resultWrapper<number>(false, async () => {
      if (this.cachedDecimals[assetId]) {
        return this.cachedDecimals[assetId];
      }

      if (assetId === constants.AddressZero) {
        this.cachedDecimals[assetId] = 18;
        return 18;
      }

      // Get provider
      const decimals = await new Contract(assetId, ERC20Abi, this.provider).decimals();
      this.cachedDecimals[assetId] = decimals;
      return decimals;
    });
  }

  /**
   * Gets the current blocktime.
   *
   * @returns A number representing the current blocktime.
   */
  public getBlockTime(): ResultAsync<number, TransactionError> {
    return this.resultWrapper<number>(false, async () => {
      const block = await this.provider.getBlock("latest");
      return block.timestamp;
    });
  }

  /**
   * Gets the current block number.
   *
   * @returns A number representing the current block number.
   */
  public getBlock(
    blockHashOrBlockTag: providers.BlockTag | Promise<providers.BlockTag>,
  ): ResultAsync<providers.Block, TransactionError> {
    return this.resultWrapper<providers.Block>(false, async () => {
      const block = await this.provider.getBlock(blockHashOrBlockTag);
      return block;
    });
  }

  /**
   * Gets the current blocktime.
   *
   * @returns A number representing the current blocktime.
   */
  public getBlockNumber(): ResultAsync<number, TransactionError> {
    return this.resultWrapper<number>(false, async () => {
      const number = await this.provider.getBlockNumber();
      return number;
    });
  }

  /**
   * Gets the signer's address.
   *
   * @returns A hash string address belonging to the signer.
   */
  public getAddress(): ResultAsync<string, TransactionError> {
    return this.resultWrapper<string>(true, async () => {
      return await this.signer!.getAddress();
    });
  }

  /**
   * Gets a transaction.
   *
   * @param hash - the transaction hash to get the receipt for.
   *
   * @returns A TransactionReceipt instance.
   */
  public getTransactionReceipt(hash: string): ResultAsync<providers.TransactionReceipt, TransactionError> {
    return this.resultWrapper<providers.TransactionReceipt>(false, async () => {
      const receipt = await this.provider.getTransactionReceipt(hash);
      return receipt;
    });
  }

  /**
   * Gets the current transaction count.
   *
   * @param blockTag - the block tag to get the transaction count for. Use "latest" mined-only transactions.
   * Use "pending" for transactions that have not been mined yet, but will (supposedly) be mined in the pending
   * block (essentially, transactions included in the mempool, but this behavior is not consistent).
   *
   * @returns Number of transactions sent; by default, including transactions in the pending (next) block.
   */
  public getTransactionCount(blockTag = "pending"): ResultAsync<number, TransactionError> {
    // If it's been less than a couple seconds since we retrieved tx count, return the cached value.
    if (this.cachedTransactionCount && Date.now() - this.cachedTransactionCount.timestamp < 2_000) {
      return okAsync(this.cachedTransactionCount.value);
    }

    return this.resultWrapper<number>(true, async () => {
      const value = await this.signer!.getTransactionCount(blockTag);
      this.cachedTransactionCount = { value, timestamp: Date.now() };
      return value;
    });
  }

  /// HELPERS
  /**
   * The result wrapper is used for wrapping and parsing errors, as well as ensuring that providers are ready
   * before any call is made. Also used for executing multiple retries for RPC requests to providers.
   * This is to circumvent any issues related to unreliable internet/network issues, whether locally,
   * or externally (for the provider's network).
   *
   * @param method The method callback to execute and wrap in retries.
   *
   * @returns A ResultAsync instance containing an object of the specified type or an NxtpError.
   */
  private resultWrapper<T>(
    needsSigner: boolean,
    method: () => Promise<T>,
    rpcCanTimeout = true,
  ): ResultAsync<T, NxtpError> {
    const RPC_TIMEOUT = 60_000;
    return ResultAsync.fromPromise(
      this.isReady().then(async () => {
        if (needsSigner && this.isReadOnly) {
          throw new NxtpError("Method requires signer, and no signer was provided.");
        }
        const errors = [];
        let result: T | undefined = undefined;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const _ of Array(5).fill(0)) {
          try {
            const _result = await Promise.race(
              [method()].concat(
                rpcCanTimeout
                  ? [
                      new Promise(async (_res, reject) => {
                        await delay(RPC_TIMEOUT);
                        reject(new RpcError(RpcError.reasons.Timeout));
                      }),
                    ]
                  : [],
              ),
            );
            result = _result;
            break;
          } catch (e) {
            const error = parseError(e);
            // NOTE: If it's an rpc timeout error, we want to go ahead and throw.
            if (error.type === RpcError.type && (error as RpcError).reason != RpcError.reasons.Timeout) {
              errors.push(error);
            } else {
              throw error;
            }
          }
        }
        if (result === undefined) {
          throw new RpcError(RpcError.reasons.FailedToSend, { errors });
        }
        return result;
      }),
      (error) => {
        // Parse error into TransactionError, etc.
        return parseError(error);
      },
    );
  }

  /**
   * Checks whether our providers are ready for execution. Should be called every time we do any
   * operation in this class.
   */
  private async isReady(): Promise<boolean> {
    const method = this.isReady.name;
    // provider.ready returns a Promise which will stall until the network has heen established, ignoring
    // errors due to the target node not being active yet. This will ensure we wait until the node is up
    // and running smoothly.
    const ready = await this.provider.ready;
    if (!ready) {
      // Error out, not enough providers are ready.
      throw new RpcError(RpcError.reasons.OutOfSync, {
        method,
        chainId: this.chainId,
      });
    }
    return true;
  }
}

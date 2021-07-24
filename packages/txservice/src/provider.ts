/* eslint-disable require-jsdoc */
import { jsonifyError } from "@connext/nxtp-utils";
import axios from "axios";
import { BigNumber, Signer, Wallet, providers } from "ethers";
import PriorityQueue from "p-queue";
import { BaseLogger } from "pino";

import { TransactionServiceConfig, ProviderConfig, validateProviderConfig, ChainConfig } from "./config";
import { ChainError } from "./error";
import { FullTransaction, MinimalTransaction, NxtpNonceManager } from "./types";

const { JsonRpcProvider, FallbackProvider } = providers;

type CachedGas = {
  price: BigNumber;
  timestamp: number;
};

/// Could use a more encompassing name, e.g. ChainRpcDispatch, etc

export class ChainRpcProvider {
  // Saving the list of underlying JsonRpcProviders used in FallbackProvider for the event
  // where we need to do a send() call directly on each one (Fallback doesn't raise that interface).
  private _providers: providers.JsonRpcProvider[];
  private provider: providers.FallbackProvider;
  private signer: NxtpNonceManager;
  private queue: PriorityQueue = new PriorityQueue({ concurrency: 1 });
  private readonly quorum: number;
  private cachedGas?: CachedGas;

  public confirmationsRequired: number;
  public confirmationTimeout: number;
  public chainId: number;

  constructor(
    private readonly log: BaseLogger,
    signer: string | Signer,
    chainId: number,
    private readonly chainConfig: ChainConfig,
    providerConfigs: ProviderConfig[],
    private readonly config: TransactionServiceConfig,
  ) {
    this.confirmationsRequired = chainConfig.confirmations ?? config.defaultConfirmationsRequired;
    this.confirmationTimeout = chainConfig.confirmationTimeout ?? config.defaultConfirmationTimeout;
    this.chainId = chainId;
    // TODO: Quorum is set to 1 here, but we may want to reconfigure later. Normally it is half the sum of the weights,
    // which might be okay in our case, but for now we have a low bar.
    // NOTE: This only applies to fallback provider case below.
    this.quorum = 1;

    // Register a provider for each url.
    // Make sure all providers are ready()
    const filteredConfigs = providerConfigs.filter((config) => {
      const valid = validateProviderConfig(config);
      if (!valid) {
        this.log.error({ config }, "Configuration was invalid for provider.");
      }
      return valid;
    });
    if (filteredConfigs.length > 0) {
      const hydratedConfigs = filteredConfigs.map((config) => ({
        provider: new JsonRpcProvider({
          url: config.url,
          user: config.user,
          password: config.password,
        }),
        priority: config.priority ?? 1,
        weight: config.weight ?? 1,
        stallTimeout: config.stallTimeout,
      }));
      this.provider = new FallbackProvider(hydratedConfigs, this.quorum);
      this._providers = hydratedConfigs.map((p) => p.provider);
    } else {
      // Not enough valid providers were found in configuration.
      // We must throw here, as the router won't be able to support this chain without valid provider configs.
      throw new ChainError(ChainError.reasons.ProviderNotFound);
    }

    // Using NonceManager to wrap signer here.
    this.signer = new NxtpNonceManager(
      typeof signer === "string" ? new Wallet(signer, this.provider) : signer.connect(this.provider),
    );
  }

  public async sendTransaction(
    tx: FullTransaction,
  ): Promise<{ response: providers.TransactionResponse | Error; success: boolean }> {
    const method = this.sendTransaction.name;
    await this.isReady();
    // Define task to send tx with proper nonce.
    const task = async (): Promise<{ response: providers.TransactionResponse | Error; success: boolean }> => {
      try {
        // Send transaction using the passed in callback.
        const { to, data, chainId, value, gasPrice, nonce } = tx;
        const response: providers.TransactionResponse | undefined = await this.signer.sendTransaction({
          to,
          data,
          chainId,
          gasPrice,
          nonce,
          value: BigNumber.from(value || 0),
        });
        // Check to see if ethers returned undefined for the response; if so, handle as error case.
        if (typeof response === "undefined") {
          throw new ChainError(ChainError.reasons.FailedToSendTx, { method, ...tx, nonce });
        }
        return { response, success: true };
      } catch (e) {
        return { response: e, success: false };
      }
    };
    // Queue up the execution of the transaction.
    return await this.queue.add(task);
  }

  public async readTransaction(tx: MinimalTransaction): Promise<string> {
    const method = this.readTransaction.name;
    return await this.retryWrapper(method, async () => {
      try {
        const readResult = await this.signer.call({
          to: tx.to,
          data: tx.data,
        });
        return readResult;
      } catch (e) {
        throw new ChainError(ChainError.reasons.ContractReadFailure, { error: jsonifyError(e) });
      }
    });
  }

  public async getGasPrice(): Promise<BigNumber> {
    const method = this.getGasPrice.name;

    // If it's been less than a minute since we retrieved gas price, send the last update in gas price.
    if (this.cachedGas && Date.now() - this.cachedGas.timestamp < 60000) {
      return this.cachedGas.price;
    }

    const { gasInitialBumpPercent, gasMinimum } = this.config;
    return await this.retryWrapper<BigNumber>(method, async () => {
      let gasPrice: BigNumber | undefined = undefined;

      if (this.chainId === 1) {
        try {
          const gasNowResponse = await axios.get(`https://www.gasnow.org/api/v3/gas/price`);
          const { rapid } = gasNowResponse.data;
          gasPrice = typeof rapid !== "undefined" ? BigNumber.from(rapid) : undefined;
        } catch (e) {
          this.log.warn({ error: e }, "Gasnow failed, using provider");
        }
      }

      if (!gasPrice) {
        try {
          gasPrice = await this.provider.getGasPrice();
        } catch (e) {
          this.log.error(
            { chainId: this.chainId, error: jsonifyError(e) },
            "getGasPrice failure, attempting to default to backup gas value.",
          );
          // Default to initial gas price, if available. Otherwise, throw.
          gasPrice = BigNumber.from(this.chainConfig.defaultInitialGas);
          if (!gasPrice) {
            throw e;
          }
        }
        gasPrice = gasPrice.add(gasPrice.mul(gasInitialBumpPercent).div(100));
      }

      // If the gas price is less than the gas minimum, bump it up to minimum.
      if (gasPrice.lt(gasMinimum)) {
        gasPrice = BigNumber.from(gasMinimum);
      }

      // Cache the latest gas price.
      this.cachedGas = { price: gasPrice, timestamp: Date.now() };
      return gasPrice;
    });
  }

  public async getBalance(address: string): Promise<BigNumber> {
    const method = this.getBalance.name;
    return await this.retryWrapper<BigNumber>(method, async () => {
      return await this.provider.getBalance(address);
    });
  }

  public async estimateGas(transaction: providers.TransactionRequest): Promise<BigNumber> {
    const method = this.estimateGas.name;
    return await this.retryWrapper<BigNumber>(method, async () => {
      return await this.provider.estimateGas(transaction);
    });
  }

  private async retryWrapper<T>(method: string, targetMethod: () => Promise<T>): Promise<T> {
    await this.isReady();
    let retries: number;
    const errors: { [attempt: number]: string | undefined } = {};
    for (retries = 1; retries < this.config.rpcProviderMaxRetries; retries++) {
      try {
        return await targetMethod();
      } catch (e) {
        errors[retries] = e.message;
      }
    }
    throw new ChainError(ChainError.reasons.RpcFailure, {
      method,
      chainId: this.chainId,
      errors,
    });
  }

  private async isReady(): Promise<boolean> {
    // TODO: Do we need both ready and the check below, or is this redundant?
    // provider.ready returns a Promise which will stall until the network has heen established, ignoring
    // errors due to the target node not being active yet. This will ensure we wait until the node is up
    // and running smoothly.
    const ready = await this.provider.ready;
    if (!ready) {
      // Error out, not enough providers are ready.
      throw new ChainError(ChainError.reasons.ProviderNotSynced);
    }
    // TODO: Evaluate whether this.provider.ready covers all cases well enough, and whether we need
    // the additional checks below:
    // Ensure that provider(s) are synced.
    // let outOfSync = 0;
    // await Promise.all(
    //   this._providers.map(async (provider) => {
    //     try {
    //       /* If not syncing, will return something like:
    //        * {
    //        *   "id": 1,
    //        *   "jsonrpc": "2.0",
    //        *   "result": false
    //        * }
    //        */
    //       const result = await provider.send("eth_syncing", []);
    //       if (result.result) {
    //         outOfSync++;
    //       }
    //     } catch (e) {
    //       outOfSync++;
    //     }
    //   }),
    // );
    // We base our evaluation on the quorum (by default, 1). If the quorum isn't 1,
    // we may necessarily need >1 provider to be in sync.
    // if (this._providers.length - outOfSync < this.quorum) {
    //   // Error out, not enough providers are ready.
    //   throw new ChainError(ChainError.reasons.ProviderNotSynced);
    // }
    return true;
  }
}

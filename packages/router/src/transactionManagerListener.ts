import { GraphQLClient } from "graphql-request";
import { BaseLogger } from "pino";
import { TransactionData, TransactionFulfilledEvent, TransactionPreparedEvent } from "@connext/nxtp-utils";
import { BigNumber } from "ethers";
import hyperid from "hyperid";

import { getSdk, Sdk, TransactionStatus } from "./graphqlsdk";

const hId = hyperid();

export class SubgraphTransactionManagerListener {
  private sdks: Record<number, Sdk> = {};

  constructor(
    private readonly chainConfig: { [chainId: number]: string },
    private readonly routerAddress: string,
    private readonly logger: BaseLogger,
    private readonly pollInterval = 15_000,
  ) {
    Object.entries(this.chainConfig).forEach(([chainId, subgraphUrl]) => {
      const client = new GraphQLClient(subgraphUrl);
      this.sdks[parseInt(chainId)] = getSdk(client);
    });
  }

  // handler methods need to listen to the subgraph and call handler on any new results that come in
  // we will need to keep track of which txs we have already handled and only call handlers on new results

  /**
   * onSenderPrepare
   * @param handler
   *
   * Queries subgraph to get prepared txs which have not been handled on the receiver side.
   */
  onSenderPrepare(handler: (data: TransactionPreparedEvent) => Promise<void>): void {
    const method = "onSenderPrepare";
    Object.keys(this.chainConfig).forEach(async (cId) => {
      const chainId = parseInt(cId);
      const sdk: Sdk = this.sdks[chainId];
      setInterval(async () => {
        const methodId = hId();
        const query = await sdk.GetSenderPrepareTransactions({
          routerId: this.routerAddress.toLowerCase(),
          sendingChainId: chainId,
        });

        if (query.router?.transactions.length ?? 0 > 0) {
          this.logger.info(
            { method, methodId, transactions: query.router?.transactions, chainId },
            "Queried senderPrepare transactions",
          );
        }
        query.router?.transactions.forEach(async (transaction) => {
          // user prepares sender -> router prepares receiver -> user broadcasts sig -> router fulfills receiver -> router fulfills sender
          // Make sure we didnt *already* prepare receiver tx
          // NOTE: if subgraph is out of date here, worst case is that the tx is
          // reverted. this is fine.
          const receiverTransaction = await this.getTransactionForChain(
            transaction.transactionId,
            transaction.user.id,
            transaction.receivingChainId,
          );
          if (receiverTransaction) {
            this.logger.debug({ method, methodId, receiverTransaction }, "Receiver transaction already prepared");
            return;
          }

          const data: TransactionPreparedEvent = {
            bidSignature: transaction.bidSignature,
            caller: transaction.prepareCaller,
            encodedBid: transaction.encodedBid,
            encryptedCallData: transaction.encryptedCallData,
            txData: {
              user: transaction.user.id,
              router: transaction.router.id,
              sendingAssetId: transaction.sendingAssetId,
              receivingAssetId: transaction.receivingAssetId,
              sendingChainFallback: transaction.sendingChainFallback,
              callTo: transaction.callTo,
              receivingAddress: transaction.receivingAddress,
              callDataHash: transaction.callDataHash,
              transactionId: transaction.transactionId,
              sendingChainId: BigNumber.from(transaction.sendingChainId).toNumber(),
              receivingChainId: BigNumber.from(transaction.receivingChainId).toNumber(),
              amount: transaction.amount,
              expiry: transaction.expiry.toString(),
              preparedBlockNumber: BigNumber.from(transaction.preparedBlockNumber).toNumber(),
            },
          };

          // NOTE: this will call the handler every time the interval runs if the tx status is not changed
          // make sure handlers are idempotent
          handler(data);
        });
      }, this.pollInterval);
    });
  }

  // the only relevant receiver fulfill transactions are the ones where a sender transaction still
  // needs to be fulfilled
  // to determine this:
  // get sender prepared transactions
  // extract receiver chains and tx ids
  // foreach receiver chain, find any matching tx ids with fulfilled status
  onReceiverFulfill(handler: (data: TransactionFulfilledEvent) => void): void {
    const method = "onReceiverFulfill";
    Object.keys(this.chainConfig).forEach(async (cId) => {
      const chainId = parseInt(cId);
      const sdk: Sdk = this.sdks[chainId];
      setInterval(async () => {
        const methodId = hId();
        const senderQuery = await sdk.GetSenderPrepareTransactions({
          routerId: this.routerAddress.toLowerCase(),
          sendingChainId: chainId,
        });

        const txIds =
          senderQuery.router?.transactions.map((tx) => {
            return { txId: tx.transactionId, receivingChainId: tx.receivingChainId };
          }) ?? [];

        const receivingChains: Record<string, string[]> = {};
        txIds.forEach(({ txId, receivingChainId }) => {
          if (receivingChains[receivingChainId]) {
            receivingChains[receivingChainId].push(txId);
          } else {
            receivingChains[receivingChainId] = [txId];
          }
        });

        const queries = await Promise.all(
          Object.entries(receivingChains).map(async ([cId, txIds]) => {
            const _sdk = this.sdks[Number(cId)];
            if (!_sdk) {
              this.logger.error({ chainId: cId, method, methodId }, "No config for chain, this should not happen");
              return [];
            }
            const query = await _sdk.GetFulfilledTransactions({ transactionIds: txIds });
            return query.transactions;
          }),
        );
        const receiverFulfilled = queries.flat();
        if (receiverFulfilled.length ?? 0 > 0) {
          this.logger.info(
            { method, methodId, transactions: receiverFulfilled, chainId },
            "Queried receiverFulfill transactions",
          );
        }
        receiverFulfilled.forEach(async (transaction) => {
          const data: TransactionFulfilledEvent = {
            txData: {
              user: transaction.user.id,
              router: transaction.router.id,
              sendingAssetId: transaction.sendingAssetId,
              receivingAssetId: transaction.receivingAssetId,
              sendingChainFallback: transaction.sendingChainFallback,
              callTo: transaction.callTo,
              receivingAddress: transaction.receivingAddress,
              callDataHash: transaction.callDataHash,
              transactionId: transaction.transactionId,
              sendingChainId: BigNumber.from(transaction.sendingChainId).toNumber(),
              receivingChainId: BigNumber.from(transaction.receivingChainId).toNumber(),
              amount: transaction.amount,
              expiry: transaction.expiry.toString(),
              preparedBlockNumber: BigNumber.from(transaction.preparedBlockNumber).toNumber(),
            },
            signature: transaction.signature,
            relayerFee: transaction.relayerFee,
            callData: transaction.callData ?? "0x",
            caller: transaction.fulfillCaller,
          };

          // NOTE: this will call the handler every time the interval runs if the tx status is not changed
          // make sure handlers are idempotent
          handler(data);
        });
      }, this.pollInterval);
    });
  }

  async getTransactionForChain(
    transactionId: string,
    user: string,
    chainId: number,
  ): Promise<
    | {
        status: TransactionStatus;
        txData: TransactionData;
        encryptedCallData: string;
        encodedBid: string;
        bidSignature: string;
        signature?: string; // only there when fulfilled
        relayerFee?: string; // only there when fulfilled
      }
    | undefined
  > {
    const sdk: Sdk = this.sdks[chainId];
    const { transaction } = await sdk.GetTransaction({
      transactionId: transactionId.toLowerCase() + "-" + user.toLowerCase() + "-" + this.routerAddress.toLowerCase(),
    });
    return transaction
      ? {
          status: transaction.status,
          txData: {
            user: transaction.user.id,
            router: transaction.router.id,
            sendingAssetId: transaction.sendingAssetId,
            receivingAssetId: transaction.receivingAssetId,
            sendingChainFallback: transaction.sendingChainFallback,
            callTo: transaction.callTo,
            receivingAddress: transaction.receivingAddress,
            callDataHash: transaction.callDataHash,
            transactionId: transaction.transactionId,
            sendingChainId: BigNumber.from(transaction.sendingChainId).toNumber(),
            receivingChainId: BigNumber.from(transaction.receivingChainId).toNumber(),
            amount: transaction.amount,
            expiry: transaction.expiry.toString(),
            preparedBlockNumber: BigNumber.from(transaction.preparedBlockNumber).toNumber(),
          },
          encryptedCallData: transaction.encryptedCallData,
          encodedBid: transaction.encodedBid,
          bidSignature: transaction.bidSignature,
          signature: transaction.signature,
          relayerFee: transaction.relayerFee,
        }
      : undefined;
  }

  async getAssetBalance(assetId: string, chainId: number): Promise<BigNumber | undefined> {
    const sdk: Sdk = this.sdks[chainId];
    const assetBalanceId = `${assetId.toLowerCase()}-${this.routerAddress.toLowerCase()}`;
    const res = await sdk.GetAssetBalance({ assetBalanceId });
    return res.assetBalance?.amount ? BigNumber.from(res.assetBalance?.amount) : undefined;
  }
}

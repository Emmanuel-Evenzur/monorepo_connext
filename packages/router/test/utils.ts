import {
  mkAddress,
  mkBytes32,
  InvariantTransactionData,
  VariantTransactionData,
  TransactionData,
  TransactionPreparedEvent,
  TransactionFulfilledEvent,
  AuctionBid,
  encodeAuctionBid,
  mkSig,
} from "@connext/nxtp-utils";
import { providers, constants } from "ethers";

import { NxtpRouterConfig } from "../src/config";

export const fakeTxReceipt = {
  blockHash: "foo",
  blockNumber: 1,
  byzantium: true,
  confirmations: 1,
  contractAddress: mkAddress(),
  cumulativeGasUsed: constants.One,
  from: mkAddress(),
  transactionHash: mkBytes32(),
  gasUsed: constants.One,
  to: mkAddress(),
  logs: [],
  logsBloom: "",
  transactionIndex: 1,
} as unknown as providers.TransactionReceipt;

export const fakeConfig: NxtpRouterConfig = {
  adminToken: "foo",
  authUrl: "http://example.com",
  chainConfig: {
    1337: {
      confirmations: 1,
      providers: ["http://example.com"],
      subgraph: "http://example.com",
      transactionManagerAddress: mkAddress("0xaaa"),
      minGas: "100",
    },
    1338: {
      confirmations: 1,
      providers: ["http://example.com"],
      subgraph: "http://example.com",
      transactionManagerAddress: mkAddress("0xbbb"),
      minGas: "100",
    },
  },
  mnemonic: "hello world",
  natsUrl: "http://example.com",
  logLevel: "info",
  swapPools: [
    {
      name: "TEST",
      assets: [
        { assetId: mkAddress("0xc"), chainId: 1337 },
        { assetId: mkAddress("0xf"), chainId: 1338 },
      ],
    },
  ],
};

export const invariantDataMock: InvariantTransactionData = {
  user: mkAddress("0xa"),
  router: mkAddress("0xb"),
  sendingAssetId: mkAddress("0xc"),
  receivingAssetId: mkAddress("0xd"),
  sendingChainFallback: mkAddress("0xe"),
  receivingAddress: mkAddress("0xf"),
  callTo: mkAddress("0xaa"),
  sendingChainId: 1337,
  receivingChainId: 1338,
  callDataHash: mkBytes32("0xa"),
  transactionId: mkBytes32("0xb"),
};

export const variantDataMock: VariantTransactionData = {
  amount: "123",
  expiry: 123456,
  preparedBlockNumber: 1234,
};

export const auctionBidMock: AuctionBid = {
  user: invariantDataMock.user,
  router: invariantDataMock.router,
  sendingAssetId: invariantDataMock.sendingAssetId,
  receivingAssetId: invariantDataMock.receivingAssetId,
  receivingAddress: invariantDataMock.receivingAddress,
  sendingChainId: invariantDataMock.sendingChainId,
  receivingChainId: invariantDataMock.receivingChainId,
  callTo: invariantDataMock.callTo,
  callDataHash: invariantDataMock.callDataHash,
  transactionId: invariantDataMock.transactionId,
  amount: variantDataMock.amount,
  sendingChainTxManagerAddress: mkAddress("0x1"),
  receivingChainTxManagerAddress: mkAddress("0x2"),
  expiry: variantDataMock.expiry,
  encryptedCallData: "0x",
  amountReceived: "120",
  bidExpiry: 123457,
};

export const txDataMock: TransactionData = {
  ...invariantDataMock,
  ...variantDataMock,
};

export const senderPrepareData: TransactionPreparedEvent = {
  txData: txDataMock,
  caller: mkAddress("0xf"),
  encryptedCallData: "0xabc",
  encodedBid: encodeAuctionBid(auctionBidMock),
  bidSignature: mkSig("0xeee"),
};

export const receiverFulfillDataMock: TransactionFulfilledEvent = {
  txData: txDataMock,
  caller: mkAddress("0xf"),
  relayerFee: "5678",
  callData: "0x",
  signature: "0xdeadbeef",
};

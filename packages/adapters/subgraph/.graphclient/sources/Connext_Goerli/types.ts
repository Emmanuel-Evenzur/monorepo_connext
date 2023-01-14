// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace ConnextGoerliTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  goerli_BigDecimal: any;
  BigInt: any;
  goerli_Bytes: any;
};

export type goerli_AggregateRoot = {
  id: Scalars['ID'];
  root: Scalars['goerli_Bytes'];
  blockNumber: Scalars['BigInt'];
};

export type goerli_AggregateRoot_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  root?: InputMaybe<Scalars['goerli_Bytes']>;
  root_not?: InputMaybe<Scalars['goerli_Bytes']>;
  root_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  root_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  root_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  root_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<goerli_BlockChangedFilter>;
};

export type goerli_AggregateRoot_orderBy =
  | 'id'
  | 'root'
  | 'blockNumber';

export type goerli_Asset = {
  id: Scalars['ID'];
  key?: Maybe<Scalars['goerli_Bytes']>;
  canonicalId?: Maybe<Scalars['goerli_Bytes']>;
  canonicalDomain?: Maybe<Scalars['BigInt']>;
  adoptedAsset?: Maybe<Scalars['goerli_Bytes']>;
  localAsset?: Maybe<Scalars['goerli_Bytes']>;
  blockNumber?: Maybe<Scalars['BigInt']>;
};

export type goerli_AssetBalance = {
  id: Scalars['ID'];
  amount: Scalars['BigInt'];
  router: goerli_Router;
  asset: goerli_Asset;
  feesEarned: Scalars['BigInt'];
};

export type goerli_AssetBalance_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  router?: InputMaybe<Scalars['String']>;
  router_not?: InputMaybe<Scalars['String']>;
  router_gt?: InputMaybe<Scalars['String']>;
  router_lt?: InputMaybe<Scalars['String']>;
  router_gte?: InputMaybe<Scalars['String']>;
  router_lte?: InputMaybe<Scalars['String']>;
  router_in?: InputMaybe<Array<Scalars['String']>>;
  router_not_in?: InputMaybe<Array<Scalars['String']>>;
  router_contains?: InputMaybe<Scalars['String']>;
  router_contains_nocase?: InputMaybe<Scalars['String']>;
  router_not_contains?: InputMaybe<Scalars['String']>;
  router_not_contains_nocase?: InputMaybe<Scalars['String']>;
  router_starts_with?: InputMaybe<Scalars['String']>;
  router_starts_with_nocase?: InputMaybe<Scalars['String']>;
  router_not_starts_with?: InputMaybe<Scalars['String']>;
  router_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  router_ends_with?: InputMaybe<Scalars['String']>;
  router_ends_with_nocase?: InputMaybe<Scalars['String']>;
  router_not_ends_with?: InputMaybe<Scalars['String']>;
  router_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  router_?: InputMaybe<goerli_Router_filter>;
  asset?: InputMaybe<Scalars['String']>;
  asset_not?: InputMaybe<Scalars['String']>;
  asset_gt?: InputMaybe<Scalars['String']>;
  asset_lt?: InputMaybe<Scalars['String']>;
  asset_gte?: InputMaybe<Scalars['String']>;
  asset_lte?: InputMaybe<Scalars['String']>;
  asset_in?: InputMaybe<Array<Scalars['String']>>;
  asset_not_in?: InputMaybe<Array<Scalars['String']>>;
  asset_contains?: InputMaybe<Scalars['String']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']>;
  asset_not_contains?: InputMaybe<Scalars['String']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']>;
  asset_starts_with?: InputMaybe<Scalars['String']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']>;
  asset_not_starts_with?: InputMaybe<Scalars['String']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  asset_ends_with?: InputMaybe<Scalars['String']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  asset_?: InputMaybe<goerli_Asset_filter>;
  feesEarned?: InputMaybe<Scalars['BigInt']>;
  feesEarned_not?: InputMaybe<Scalars['BigInt']>;
  feesEarned_gt?: InputMaybe<Scalars['BigInt']>;
  feesEarned_lt?: InputMaybe<Scalars['BigInt']>;
  feesEarned_gte?: InputMaybe<Scalars['BigInt']>;
  feesEarned_lte?: InputMaybe<Scalars['BigInt']>;
  feesEarned_in?: InputMaybe<Array<Scalars['BigInt']>>;
  feesEarned_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<goerli_BlockChangedFilter>;
};

export type goerli_AssetBalance_orderBy =
  | 'id'
  | 'amount'
  | 'router'
  | 'asset'
  | 'feesEarned';

export type goerli_Asset_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  key?: InputMaybe<Scalars['goerli_Bytes']>;
  key_not?: InputMaybe<Scalars['goerli_Bytes']>;
  key_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  key_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  key_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  key_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  canonicalId?: InputMaybe<Scalars['goerli_Bytes']>;
  canonicalId_not?: InputMaybe<Scalars['goerli_Bytes']>;
  canonicalId_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  canonicalId_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  canonicalId_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  canonicalId_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  canonicalDomain?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_not?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_gt?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_lt?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_gte?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_lte?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_in?: InputMaybe<Array<Scalars['BigInt']>>;
  canonicalDomain_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  adoptedAsset?: InputMaybe<Scalars['goerli_Bytes']>;
  adoptedAsset_not?: InputMaybe<Scalars['goerli_Bytes']>;
  adoptedAsset_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  adoptedAsset_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  adoptedAsset_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  adoptedAsset_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  localAsset?: InputMaybe<Scalars['goerli_Bytes']>;
  localAsset_not?: InputMaybe<Scalars['goerli_Bytes']>;
  localAsset_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  localAsset_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  localAsset_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  localAsset_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<goerli_BlockChangedFilter>;
};

export type goerli_Asset_orderBy =
  | 'id'
  | 'key'
  | 'canonicalId'
  | 'canonicalDomain'
  | 'adoptedAsset'
  | 'localAsset'
  | 'blockNumber';

export type goerli_BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type goerli_Block_height = {
  hash?: InputMaybe<Scalars['goerli_Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type goerli_ConnectorMeta = {
  id: Scalars['ID'];
  spokeDomain?: Maybe<Scalars['BigInt']>;
  hubDomain?: Maybe<Scalars['BigInt']>;
  amb?: Maybe<Scalars['goerli_Bytes']>;
  rootManager?: Maybe<Scalars['goerli_Bytes']>;
  mirrorConnector?: Maybe<Scalars['goerli_Bytes']>;
};

export type goerli_ConnectorMeta_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  spokeDomain?: InputMaybe<Scalars['BigInt']>;
  spokeDomain_not?: InputMaybe<Scalars['BigInt']>;
  spokeDomain_gt?: InputMaybe<Scalars['BigInt']>;
  spokeDomain_lt?: InputMaybe<Scalars['BigInt']>;
  spokeDomain_gte?: InputMaybe<Scalars['BigInt']>;
  spokeDomain_lte?: InputMaybe<Scalars['BigInt']>;
  spokeDomain_in?: InputMaybe<Array<Scalars['BigInt']>>;
  spokeDomain_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  hubDomain?: InputMaybe<Scalars['BigInt']>;
  hubDomain_not?: InputMaybe<Scalars['BigInt']>;
  hubDomain_gt?: InputMaybe<Scalars['BigInt']>;
  hubDomain_lt?: InputMaybe<Scalars['BigInt']>;
  hubDomain_gte?: InputMaybe<Scalars['BigInt']>;
  hubDomain_lte?: InputMaybe<Scalars['BigInt']>;
  hubDomain_in?: InputMaybe<Array<Scalars['BigInt']>>;
  hubDomain_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amb?: InputMaybe<Scalars['goerli_Bytes']>;
  amb_not?: InputMaybe<Scalars['goerli_Bytes']>;
  amb_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  amb_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  amb_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  amb_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  rootManager?: InputMaybe<Scalars['goerli_Bytes']>;
  rootManager_not?: InputMaybe<Scalars['goerli_Bytes']>;
  rootManager_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  rootManager_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  rootManager_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  rootManager_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  mirrorConnector?: InputMaybe<Scalars['goerli_Bytes']>;
  mirrorConnector_not?: InputMaybe<Scalars['goerli_Bytes']>;
  mirrorConnector_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  mirrorConnector_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  mirrorConnector_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  mirrorConnector_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<goerli_BlockChangedFilter>;
};

export type goerli_ConnectorMeta_orderBy =
  | 'id'
  | 'spokeDomain'
  | 'hubDomain'
  | 'amb'
  | 'rootManager'
  | 'mirrorConnector';

export type goerli_DestinationTransfer = {
  id: Scalars['ID'];
  chainId?: Maybe<Scalars['BigInt']>;
  transferId?: Maybe<Scalars['goerli_Bytes']>;
  nonce?: Maybe<Scalars['BigInt']>;
  status?: Maybe<goerli_TransferStatus>;
  routers?: Maybe<Array<goerli_Router>>;
  originDomain?: Maybe<Scalars['BigInt']>;
  destinationDomain?: Maybe<Scalars['BigInt']>;
  canonicalDomain?: Maybe<Scalars['BigInt']>;
  to?: Maybe<Scalars['goerli_Bytes']>;
  delegate?: Maybe<Scalars['goerli_Bytes']>;
  receiveLocal?: Maybe<Scalars['Boolean']>;
  callData?: Maybe<Scalars['goerli_Bytes']>;
  slippage?: Maybe<Scalars['BigInt']>;
  originSender?: Maybe<Scalars['goerli_Bytes']>;
  bridgedAmt?: Maybe<Scalars['BigInt']>;
  normalizedIn?: Maybe<Scalars['BigInt']>;
  canonicalId?: Maybe<Scalars['goerli_Bytes']>;
  asset?: Maybe<goerli_Asset>;
  amount?: Maybe<Scalars['BigInt']>;
  routersFee?: Maybe<Scalars['BigInt']>;
  executedCaller?: Maybe<Scalars['goerli_Bytes']>;
  executedTransactionHash?: Maybe<Scalars['goerli_Bytes']>;
  executedTimestamp?: Maybe<Scalars['BigInt']>;
  executedGasPrice?: Maybe<Scalars['BigInt']>;
  executedGasLimit?: Maybe<Scalars['BigInt']>;
  executedBlockNumber?: Maybe<Scalars['BigInt']>;
  executedTxOrigin?: Maybe<Scalars['goerli_Bytes']>;
  reconciledCaller?: Maybe<Scalars['goerli_Bytes']>;
  reconciledTransactionHash?: Maybe<Scalars['goerli_Bytes']>;
  reconciledTimestamp?: Maybe<Scalars['BigInt']>;
  reconciledGasPrice?: Maybe<Scalars['BigInt']>;
  reconciledGasLimit?: Maybe<Scalars['BigInt']>;
  reconciledBlockNumber?: Maybe<Scalars['BigInt']>;
  reconciledTxOrigin?: Maybe<Scalars['goerli_Bytes']>;
};


export type goerli_DestinationTransferroutersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_Router_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_Router_filter>;
};

export type goerli_DestinationTransfer_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  chainId?: InputMaybe<Scalars['BigInt']>;
  chainId_not?: InputMaybe<Scalars['BigInt']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']>;
  chainId_lt?: InputMaybe<Scalars['BigInt']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']>;
  chainId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  chainId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transferId?: InputMaybe<Scalars['goerli_Bytes']>;
  transferId_not?: InputMaybe<Scalars['goerli_Bytes']>;
  transferId_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  transferId_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  transferId_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  transferId_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  nonce?: InputMaybe<Scalars['BigInt']>;
  nonce_not?: InputMaybe<Scalars['BigInt']>;
  nonce_gt?: InputMaybe<Scalars['BigInt']>;
  nonce_lt?: InputMaybe<Scalars['BigInt']>;
  nonce_gte?: InputMaybe<Scalars['BigInt']>;
  nonce_lte?: InputMaybe<Scalars['BigInt']>;
  nonce_in?: InputMaybe<Array<Scalars['BigInt']>>;
  nonce_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  status?: InputMaybe<goerli_TransferStatus>;
  status_not?: InputMaybe<goerli_TransferStatus>;
  status_in?: InputMaybe<Array<goerli_TransferStatus>>;
  status_not_in?: InputMaybe<Array<goerli_TransferStatus>>;
  routers?: InputMaybe<Array<Scalars['String']>>;
  routers_not?: InputMaybe<Array<Scalars['String']>>;
  routers_contains?: InputMaybe<Array<Scalars['String']>>;
  routers_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  routers_not_contains?: InputMaybe<Array<Scalars['String']>>;
  routers_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  routers_?: InputMaybe<goerli_Router_filter>;
  originDomain?: InputMaybe<Scalars['BigInt']>;
  originDomain_not?: InputMaybe<Scalars['BigInt']>;
  originDomain_gt?: InputMaybe<Scalars['BigInt']>;
  originDomain_lt?: InputMaybe<Scalars['BigInt']>;
  originDomain_gte?: InputMaybe<Scalars['BigInt']>;
  originDomain_lte?: InputMaybe<Scalars['BigInt']>;
  originDomain_in?: InputMaybe<Array<Scalars['BigInt']>>;
  originDomain_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  destinationDomain?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_not?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_gt?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_lt?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_gte?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_lte?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_in?: InputMaybe<Array<Scalars['BigInt']>>;
  destinationDomain_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  canonicalDomain?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_not?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_gt?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_lt?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_gte?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_lte?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_in?: InputMaybe<Array<Scalars['BigInt']>>;
  canonicalDomain_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  to?: InputMaybe<Scalars['goerli_Bytes']>;
  to_not?: InputMaybe<Scalars['goerli_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  to_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  delegate?: InputMaybe<Scalars['goerli_Bytes']>;
  delegate_not?: InputMaybe<Scalars['goerli_Bytes']>;
  delegate_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  delegate_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  delegate_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  delegate_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  receiveLocal?: InputMaybe<Scalars['Boolean']>;
  receiveLocal_not?: InputMaybe<Scalars['Boolean']>;
  receiveLocal_in?: InputMaybe<Array<Scalars['Boolean']>>;
  receiveLocal_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  callData?: InputMaybe<Scalars['goerli_Bytes']>;
  callData_not?: InputMaybe<Scalars['goerli_Bytes']>;
  callData_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  callData_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  callData_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  callData_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  slippage?: InputMaybe<Scalars['BigInt']>;
  slippage_not?: InputMaybe<Scalars['BigInt']>;
  slippage_gt?: InputMaybe<Scalars['BigInt']>;
  slippage_lt?: InputMaybe<Scalars['BigInt']>;
  slippage_gte?: InputMaybe<Scalars['BigInt']>;
  slippage_lte?: InputMaybe<Scalars['BigInt']>;
  slippage_in?: InputMaybe<Array<Scalars['BigInt']>>;
  slippage_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  originSender?: InputMaybe<Scalars['goerli_Bytes']>;
  originSender_not?: InputMaybe<Scalars['goerli_Bytes']>;
  originSender_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  originSender_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  originSender_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  originSender_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  bridgedAmt?: InputMaybe<Scalars['BigInt']>;
  bridgedAmt_not?: InputMaybe<Scalars['BigInt']>;
  bridgedAmt_gt?: InputMaybe<Scalars['BigInt']>;
  bridgedAmt_lt?: InputMaybe<Scalars['BigInt']>;
  bridgedAmt_gte?: InputMaybe<Scalars['BigInt']>;
  bridgedAmt_lte?: InputMaybe<Scalars['BigInt']>;
  bridgedAmt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  bridgedAmt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  normalizedIn?: InputMaybe<Scalars['BigInt']>;
  normalizedIn_not?: InputMaybe<Scalars['BigInt']>;
  normalizedIn_gt?: InputMaybe<Scalars['BigInt']>;
  normalizedIn_lt?: InputMaybe<Scalars['BigInt']>;
  normalizedIn_gte?: InputMaybe<Scalars['BigInt']>;
  normalizedIn_lte?: InputMaybe<Scalars['BigInt']>;
  normalizedIn_in?: InputMaybe<Array<Scalars['BigInt']>>;
  normalizedIn_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  canonicalId?: InputMaybe<Scalars['goerli_Bytes']>;
  canonicalId_not?: InputMaybe<Scalars['goerli_Bytes']>;
  canonicalId_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  canonicalId_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  canonicalId_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  canonicalId_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  asset?: InputMaybe<Scalars['String']>;
  asset_not?: InputMaybe<Scalars['String']>;
  asset_gt?: InputMaybe<Scalars['String']>;
  asset_lt?: InputMaybe<Scalars['String']>;
  asset_gte?: InputMaybe<Scalars['String']>;
  asset_lte?: InputMaybe<Scalars['String']>;
  asset_in?: InputMaybe<Array<Scalars['String']>>;
  asset_not_in?: InputMaybe<Array<Scalars['String']>>;
  asset_contains?: InputMaybe<Scalars['String']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']>;
  asset_not_contains?: InputMaybe<Scalars['String']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']>;
  asset_starts_with?: InputMaybe<Scalars['String']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']>;
  asset_not_starts_with?: InputMaybe<Scalars['String']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  asset_ends_with?: InputMaybe<Scalars['String']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  asset_?: InputMaybe<goerli_Asset_filter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  routersFee?: InputMaybe<Scalars['BigInt']>;
  routersFee_not?: InputMaybe<Scalars['BigInt']>;
  routersFee_gt?: InputMaybe<Scalars['BigInt']>;
  routersFee_lt?: InputMaybe<Scalars['BigInt']>;
  routersFee_gte?: InputMaybe<Scalars['BigInt']>;
  routersFee_lte?: InputMaybe<Scalars['BigInt']>;
  routersFee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  routersFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  executedCaller?: InputMaybe<Scalars['goerli_Bytes']>;
  executedCaller_not?: InputMaybe<Scalars['goerli_Bytes']>;
  executedCaller_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  executedCaller_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  executedCaller_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  executedCaller_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  executedTransactionHash?: InputMaybe<Scalars['goerli_Bytes']>;
  executedTransactionHash_not?: InputMaybe<Scalars['goerli_Bytes']>;
  executedTransactionHash_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  executedTransactionHash_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  executedTransactionHash_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  executedTransactionHash_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  executedTimestamp?: InputMaybe<Scalars['BigInt']>;
  executedTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  executedTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  executedTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  executedTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  executedTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  executedTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  executedTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  executedGasPrice?: InputMaybe<Scalars['BigInt']>;
  executedGasPrice_not?: InputMaybe<Scalars['BigInt']>;
  executedGasPrice_gt?: InputMaybe<Scalars['BigInt']>;
  executedGasPrice_lt?: InputMaybe<Scalars['BigInt']>;
  executedGasPrice_gte?: InputMaybe<Scalars['BigInt']>;
  executedGasPrice_lte?: InputMaybe<Scalars['BigInt']>;
  executedGasPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  executedGasPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  executedGasLimit?: InputMaybe<Scalars['BigInt']>;
  executedGasLimit_not?: InputMaybe<Scalars['BigInt']>;
  executedGasLimit_gt?: InputMaybe<Scalars['BigInt']>;
  executedGasLimit_lt?: InputMaybe<Scalars['BigInt']>;
  executedGasLimit_gte?: InputMaybe<Scalars['BigInt']>;
  executedGasLimit_lte?: InputMaybe<Scalars['BigInt']>;
  executedGasLimit_in?: InputMaybe<Array<Scalars['BigInt']>>;
  executedGasLimit_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  executedBlockNumber?: InputMaybe<Scalars['BigInt']>;
  executedBlockNumber_not?: InputMaybe<Scalars['BigInt']>;
  executedBlockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  executedBlockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  executedBlockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  executedBlockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  executedBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  executedBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  executedTxOrigin?: InputMaybe<Scalars['goerli_Bytes']>;
  executedTxOrigin_not?: InputMaybe<Scalars['goerli_Bytes']>;
  executedTxOrigin_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  executedTxOrigin_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  executedTxOrigin_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  executedTxOrigin_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  reconciledCaller?: InputMaybe<Scalars['goerli_Bytes']>;
  reconciledCaller_not?: InputMaybe<Scalars['goerli_Bytes']>;
  reconciledCaller_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  reconciledCaller_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  reconciledCaller_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  reconciledCaller_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  reconciledTransactionHash?: InputMaybe<Scalars['goerli_Bytes']>;
  reconciledTransactionHash_not?: InputMaybe<Scalars['goerli_Bytes']>;
  reconciledTransactionHash_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  reconciledTransactionHash_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  reconciledTransactionHash_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  reconciledTransactionHash_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  reconciledTimestamp?: InputMaybe<Scalars['BigInt']>;
  reconciledTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  reconciledTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  reconciledTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  reconciledTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  reconciledTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  reconciledTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  reconciledTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  reconciledGasPrice?: InputMaybe<Scalars['BigInt']>;
  reconciledGasPrice_not?: InputMaybe<Scalars['BigInt']>;
  reconciledGasPrice_gt?: InputMaybe<Scalars['BigInt']>;
  reconciledGasPrice_lt?: InputMaybe<Scalars['BigInt']>;
  reconciledGasPrice_gte?: InputMaybe<Scalars['BigInt']>;
  reconciledGasPrice_lte?: InputMaybe<Scalars['BigInt']>;
  reconciledGasPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  reconciledGasPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  reconciledGasLimit?: InputMaybe<Scalars['BigInt']>;
  reconciledGasLimit_not?: InputMaybe<Scalars['BigInt']>;
  reconciledGasLimit_gt?: InputMaybe<Scalars['BigInt']>;
  reconciledGasLimit_lt?: InputMaybe<Scalars['BigInt']>;
  reconciledGasLimit_gte?: InputMaybe<Scalars['BigInt']>;
  reconciledGasLimit_lte?: InputMaybe<Scalars['BigInt']>;
  reconciledGasLimit_in?: InputMaybe<Array<Scalars['BigInt']>>;
  reconciledGasLimit_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  reconciledBlockNumber?: InputMaybe<Scalars['BigInt']>;
  reconciledBlockNumber_not?: InputMaybe<Scalars['BigInt']>;
  reconciledBlockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  reconciledBlockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  reconciledBlockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  reconciledBlockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  reconciledBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  reconciledBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  reconciledTxOrigin?: InputMaybe<Scalars['goerli_Bytes']>;
  reconciledTxOrigin_not?: InputMaybe<Scalars['goerli_Bytes']>;
  reconciledTxOrigin_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  reconciledTxOrigin_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  reconciledTxOrigin_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  reconciledTxOrigin_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<goerli_BlockChangedFilter>;
};

export type goerli_DestinationTransfer_orderBy =
  | 'id'
  | 'chainId'
  | 'transferId'
  | 'nonce'
  | 'status'
  | 'routers'
  | 'originDomain'
  | 'destinationDomain'
  | 'canonicalDomain'
  | 'to'
  | 'delegate'
  | 'receiveLocal'
  | 'callData'
  | 'slippage'
  | 'originSender'
  | 'bridgedAmt'
  | 'normalizedIn'
  | 'canonicalId'
  | 'asset'
  | 'amount'
  | 'routersFee'
  | 'executedCaller'
  | 'executedTransactionHash'
  | 'executedTimestamp'
  | 'executedGasPrice'
  | 'executedGasLimit'
  | 'executedBlockNumber'
  | 'executedTxOrigin'
  | 'reconciledCaller'
  | 'reconciledTransactionHash'
  | 'reconciledTimestamp'
  | 'reconciledGasPrice'
  | 'reconciledGasLimit'
  | 'reconciledBlockNumber'
  | 'reconciledTxOrigin';

/** Defines the order direction, either ascending or descending */
export type goerli_OrderDirection =
  | 'asc'
  | 'desc';

export type goerli_OriginMessage = {
  id: Scalars['ID'];
  transferId?: Maybe<Scalars['goerli_Bytes']>;
  destinationDomain?: Maybe<Scalars['BigInt']>;
  leaf?: Maybe<Scalars['goerli_Bytes']>;
  index?: Maybe<Scalars['BigInt']>;
  message?: Maybe<Scalars['goerli_Bytes']>;
  root?: Maybe<Scalars['goerli_Bytes']>;
  transactionHash?: Maybe<Scalars['goerli_Bytes']>;
  blockNumber?: Maybe<Scalars['BigInt']>;
  rootCount?: Maybe<goerli_RootCount>;
};

export type goerli_OriginMessage_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  transferId?: InputMaybe<Scalars['goerli_Bytes']>;
  transferId_not?: InputMaybe<Scalars['goerli_Bytes']>;
  transferId_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  transferId_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  transferId_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  transferId_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  destinationDomain?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_not?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_gt?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_lt?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_gte?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_lte?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_in?: InputMaybe<Array<Scalars['BigInt']>>;
  destinationDomain_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  leaf?: InputMaybe<Scalars['goerli_Bytes']>;
  leaf_not?: InputMaybe<Scalars['goerli_Bytes']>;
  leaf_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  leaf_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  leaf_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  leaf_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  index?: InputMaybe<Scalars['BigInt']>;
  index_not?: InputMaybe<Scalars['BigInt']>;
  index_gt?: InputMaybe<Scalars['BigInt']>;
  index_lt?: InputMaybe<Scalars['BigInt']>;
  index_gte?: InputMaybe<Scalars['BigInt']>;
  index_lte?: InputMaybe<Scalars['BigInt']>;
  index_in?: InputMaybe<Array<Scalars['BigInt']>>;
  index_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  message?: InputMaybe<Scalars['goerli_Bytes']>;
  message_not?: InputMaybe<Scalars['goerli_Bytes']>;
  message_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  message_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  message_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  message_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  root?: InputMaybe<Scalars['goerli_Bytes']>;
  root_not?: InputMaybe<Scalars['goerli_Bytes']>;
  root_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  root_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  root_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  root_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  transactionHash?: InputMaybe<Scalars['goerli_Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['goerli_Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  transactionHash_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rootCount?: InputMaybe<Scalars['String']>;
  rootCount_not?: InputMaybe<Scalars['String']>;
  rootCount_gt?: InputMaybe<Scalars['String']>;
  rootCount_lt?: InputMaybe<Scalars['String']>;
  rootCount_gte?: InputMaybe<Scalars['String']>;
  rootCount_lte?: InputMaybe<Scalars['String']>;
  rootCount_in?: InputMaybe<Array<Scalars['String']>>;
  rootCount_not_in?: InputMaybe<Array<Scalars['String']>>;
  rootCount_contains?: InputMaybe<Scalars['String']>;
  rootCount_contains_nocase?: InputMaybe<Scalars['String']>;
  rootCount_not_contains?: InputMaybe<Scalars['String']>;
  rootCount_not_contains_nocase?: InputMaybe<Scalars['String']>;
  rootCount_starts_with?: InputMaybe<Scalars['String']>;
  rootCount_starts_with_nocase?: InputMaybe<Scalars['String']>;
  rootCount_not_starts_with?: InputMaybe<Scalars['String']>;
  rootCount_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  rootCount_ends_with?: InputMaybe<Scalars['String']>;
  rootCount_ends_with_nocase?: InputMaybe<Scalars['String']>;
  rootCount_not_ends_with?: InputMaybe<Scalars['String']>;
  rootCount_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  rootCount_?: InputMaybe<goerli_RootCount_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<goerli_BlockChangedFilter>;
};

export type goerli_OriginMessage_orderBy =
  | 'id'
  | 'transferId'
  | 'destinationDomain'
  | 'leaf'
  | 'index'
  | 'message'
  | 'root'
  | 'transactionHash'
  | 'blockNumber'
  | 'rootCount';

export type goerli_OriginTransfer = {
  id: Scalars['ID'];
  chainId?: Maybe<Scalars['BigInt']>;
  transferId?: Maybe<Scalars['goerli_Bytes']>;
  nonce?: Maybe<Scalars['BigInt']>;
  status?: Maybe<goerli_TransferStatus>;
  messageHash?: Maybe<Scalars['goerli_Bytes']>;
  originDomain?: Maybe<Scalars['BigInt']>;
  destinationDomain?: Maybe<Scalars['BigInt']>;
  canonicalDomain?: Maybe<Scalars['BigInt']>;
  to?: Maybe<Scalars['goerli_Bytes']>;
  delegate?: Maybe<Scalars['goerli_Bytes']>;
  receiveLocal?: Maybe<Scalars['Boolean']>;
  callData?: Maybe<Scalars['goerli_Bytes']>;
  slippage?: Maybe<Scalars['BigInt']>;
  originSender?: Maybe<Scalars['goerli_Bytes']>;
  bridgedAmt?: Maybe<Scalars['BigInt']>;
  normalizedIn?: Maybe<Scalars['BigInt']>;
  canonicalId?: Maybe<Scalars['goerli_Bytes']>;
  asset?: Maybe<goerli_Asset>;
  transacting?: Maybe<Scalars['goerli_Bytes']>;
  message?: Maybe<goerli_OriginMessage>;
  relayerFee?: Maybe<Scalars['BigInt']>;
  caller?: Maybe<Scalars['goerli_Bytes']>;
  transactionHash?: Maybe<Scalars['goerli_Bytes']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  gasPrice?: Maybe<Scalars['BigInt']>;
  gasLimit?: Maybe<Scalars['BigInt']>;
  blockNumber?: Maybe<Scalars['BigInt']>;
  txOrigin?: Maybe<Scalars['goerli_Bytes']>;
};

export type goerli_OriginTransfer_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  chainId?: InputMaybe<Scalars['BigInt']>;
  chainId_not?: InputMaybe<Scalars['BigInt']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']>;
  chainId_lt?: InputMaybe<Scalars['BigInt']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']>;
  chainId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  chainId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transferId?: InputMaybe<Scalars['goerli_Bytes']>;
  transferId_not?: InputMaybe<Scalars['goerli_Bytes']>;
  transferId_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  transferId_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  transferId_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  transferId_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  nonce?: InputMaybe<Scalars['BigInt']>;
  nonce_not?: InputMaybe<Scalars['BigInt']>;
  nonce_gt?: InputMaybe<Scalars['BigInt']>;
  nonce_lt?: InputMaybe<Scalars['BigInt']>;
  nonce_gte?: InputMaybe<Scalars['BigInt']>;
  nonce_lte?: InputMaybe<Scalars['BigInt']>;
  nonce_in?: InputMaybe<Array<Scalars['BigInt']>>;
  nonce_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  status?: InputMaybe<goerli_TransferStatus>;
  status_not?: InputMaybe<goerli_TransferStatus>;
  status_in?: InputMaybe<Array<goerli_TransferStatus>>;
  status_not_in?: InputMaybe<Array<goerli_TransferStatus>>;
  messageHash?: InputMaybe<Scalars['goerli_Bytes']>;
  messageHash_not?: InputMaybe<Scalars['goerli_Bytes']>;
  messageHash_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  messageHash_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  messageHash_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  messageHash_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  originDomain?: InputMaybe<Scalars['BigInt']>;
  originDomain_not?: InputMaybe<Scalars['BigInt']>;
  originDomain_gt?: InputMaybe<Scalars['BigInt']>;
  originDomain_lt?: InputMaybe<Scalars['BigInt']>;
  originDomain_gte?: InputMaybe<Scalars['BigInt']>;
  originDomain_lte?: InputMaybe<Scalars['BigInt']>;
  originDomain_in?: InputMaybe<Array<Scalars['BigInt']>>;
  originDomain_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  destinationDomain?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_not?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_gt?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_lt?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_gte?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_lte?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_in?: InputMaybe<Array<Scalars['BigInt']>>;
  destinationDomain_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  canonicalDomain?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_not?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_gt?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_lt?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_gte?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_lte?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_in?: InputMaybe<Array<Scalars['BigInt']>>;
  canonicalDomain_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  to?: InputMaybe<Scalars['goerli_Bytes']>;
  to_not?: InputMaybe<Scalars['goerli_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  to_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  delegate?: InputMaybe<Scalars['goerli_Bytes']>;
  delegate_not?: InputMaybe<Scalars['goerli_Bytes']>;
  delegate_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  delegate_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  delegate_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  delegate_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  receiveLocal?: InputMaybe<Scalars['Boolean']>;
  receiveLocal_not?: InputMaybe<Scalars['Boolean']>;
  receiveLocal_in?: InputMaybe<Array<Scalars['Boolean']>>;
  receiveLocal_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  callData?: InputMaybe<Scalars['goerli_Bytes']>;
  callData_not?: InputMaybe<Scalars['goerli_Bytes']>;
  callData_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  callData_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  callData_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  callData_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  slippage?: InputMaybe<Scalars['BigInt']>;
  slippage_not?: InputMaybe<Scalars['BigInt']>;
  slippage_gt?: InputMaybe<Scalars['BigInt']>;
  slippage_lt?: InputMaybe<Scalars['BigInt']>;
  slippage_gte?: InputMaybe<Scalars['BigInt']>;
  slippage_lte?: InputMaybe<Scalars['BigInt']>;
  slippage_in?: InputMaybe<Array<Scalars['BigInt']>>;
  slippage_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  originSender?: InputMaybe<Scalars['goerli_Bytes']>;
  originSender_not?: InputMaybe<Scalars['goerli_Bytes']>;
  originSender_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  originSender_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  originSender_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  originSender_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  bridgedAmt?: InputMaybe<Scalars['BigInt']>;
  bridgedAmt_not?: InputMaybe<Scalars['BigInt']>;
  bridgedAmt_gt?: InputMaybe<Scalars['BigInt']>;
  bridgedAmt_lt?: InputMaybe<Scalars['BigInt']>;
  bridgedAmt_gte?: InputMaybe<Scalars['BigInt']>;
  bridgedAmt_lte?: InputMaybe<Scalars['BigInt']>;
  bridgedAmt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  bridgedAmt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  normalizedIn?: InputMaybe<Scalars['BigInt']>;
  normalizedIn_not?: InputMaybe<Scalars['BigInt']>;
  normalizedIn_gt?: InputMaybe<Scalars['BigInt']>;
  normalizedIn_lt?: InputMaybe<Scalars['BigInt']>;
  normalizedIn_gte?: InputMaybe<Scalars['BigInt']>;
  normalizedIn_lte?: InputMaybe<Scalars['BigInt']>;
  normalizedIn_in?: InputMaybe<Array<Scalars['BigInt']>>;
  normalizedIn_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  canonicalId?: InputMaybe<Scalars['goerli_Bytes']>;
  canonicalId_not?: InputMaybe<Scalars['goerli_Bytes']>;
  canonicalId_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  canonicalId_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  canonicalId_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  canonicalId_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  asset?: InputMaybe<Scalars['String']>;
  asset_not?: InputMaybe<Scalars['String']>;
  asset_gt?: InputMaybe<Scalars['String']>;
  asset_lt?: InputMaybe<Scalars['String']>;
  asset_gte?: InputMaybe<Scalars['String']>;
  asset_lte?: InputMaybe<Scalars['String']>;
  asset_in?: InputMaybe<Array<Scalars['String']>>;
  asset_not_in?: InputMaybe<Array<Scalars['String']>>;
  asset_contains?: InputMaybe<Scalars['String']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']>;
  asset_not_contains?: InputMaybe<Scalars['String']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']>;
  asset_starts_with?: InputMaybe<Scalars['String']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']>;
  asset_not_starts_with?: InputMaybe<Scalars['String']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  asset_ends_with?: InputMaybe<Scalars['String']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  asset_?: InputMaybe<goerli_Asset_filter>;
  transacting?: InputMaybe<Scalars['goerli_Bytes']>;
  transacting_not?: InputMaybe<Scalars['goerli_Bytes']>;
  transacting_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  transacting_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  transacting_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  transacting_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  message?: InputMaybe<Scalars['String']>;
  message_not?: InputMaybe<Scalars['String']>;
  message_gt?: InputMaybe<Scalars['String']>;
  message_lt?: InputMaybe<Scalars['String']>;
  message_gte?: InputMaybe<Scalars['String']>;
  message_lte?: InputMaybe<Scalars['String']>;
  message_in?: InputMaybe<Array<Scalars['String']>>;
  message_not_in?: InputMaybe<Array<Scalars['String']>>;
  message_contains?: InputMaybe<Scalars['String']>;
  message_contains_nocase?: InputMaybe<Scalars['String']>;
  message_not_contains?: InputMaybe<Scalars['String']>;
  message_not_contains_nocase?: InputMaybe<Scalars['String']>;
  message_starts_with?: InputMaybe<Scalars['String']>;
  message_starts_with_nocase?: InputMaybe<Scalars['String']>;
  message_not_starts_with?: InputMaybe<Scalars['String']>;
  message_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  message_ends_with?: InputMaybe<Scalars['String']>;
  message_ends_with_nocase?: InputMaybe<Scalars['String']>;
  message_not_ends_with?: InputMaybe<Scalars['String']>;
  message_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  message_?: InputMaybe<goerli_OriginMessage_filter>;
  relayerFee?: InputMaybe<Scalars['BigInt']>;
  relayerFee_not?: InputMaybe<Scalars['BigInt']>;
  relayerFee_gt?: InputMaybe<Scalars['BigInt']>;
  relayerFee_lt?: InputMaybe<Scalars['BigInt']>;
  relayerFee_gte?: InputMaybe<Scalars['BigInt']>;
  relayerFee_lte?: InputMaybe<Scalars['BigInt']>;
  relayerFee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  relayerFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  caller?: InputMaybe<Scalars['goerli_Bytes']>;
  caller_not?: InputMaybe<Scalars['goerli_Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  caller_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  caller_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  transactionHash?: InputMaybe<Scalars['goerli_Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['goerli_Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  transactionHash_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasPrice?: InputMaybe<Scalars['BigInt']>;
  gasPrice_not?: InputMaybe<Scalars['BigInt']>;
  gasPrice_gt?: InputMaybe<Scalars['BigInt']>;
  gasPrice_lt?: InputMaybe<Scalars['BigInt']>;
  gasPrice_gte?: InputMaybe<Scalars['BigInt']>;
  gasPrice_lte?: InputMaybe<Scalars['BigInt']>;
  gasPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasLimit?: InputMaybe<Scalars['BigInt']>;
  gasLimit_not?: InputMaybe<Scalars['BigInt']>;
  gasLimit_gt?: InputMaybe<Scalars['BigInt']>;
  gasLimit_lt?: InputMaybe<Scalars['BigInt']>;
  gasLimit_gte?: InputMaybe<Scalars['BigInt']>;
  gasLimit_lte?: InputMaybe<Scalars['BigInt']>;
  gasLimit_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasLimit_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  txOrigin?: InputMaybe<Scalars['goerli_Bytes']>;
  txOrigin_not?: InputMaybe<Scalars['goerli_Bytes']>;
  txOrigin_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  txOrigin_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  txOrigin_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  txOrigin_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<goerli_BlockChangedFilter>;
};

export type goerli_OriginTransfer_orderBy =
  | 'id'
  | 'chainId'
  | 'transferId'
  | 'nonce'
  | 'status'
  | 'messageHash'
  | 'originDomain'
  | 'destinationDomain'
  | 'canonicalDomain'
  | 'to'
  | 'delegate'
  | 'receiveLocal'
  | 'callData'
  | 'slippage'
  | 'originSender'
  | 'bridgedAmt'
  | 'normalizedIn'
  | 'canonicalId'
  | 'asset'
  | 'transacting'
  | 'message'
  | 'relayerFee'
  | 'caller'
  | 'transactionHash'
  | 'timestamp'
  | 'gasPrice'
  | 'gasLimit'
  | 'blockNumber'
  | 'txOrigin';

export type goerli_PooledToken = {
  id: Scalars['ID'];
  asset: Scalars['goerli_Bytes'];
};

export type goerli_PooledToken_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  asset?: InputMaybe<Scalars['goerli_Bytes']>;
  asset_not?: InputMaybe<Scalars['goerli_Bytes']>;
  asset_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  asset_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  asset_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  asset_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<goerli_BlockChangedFilter>;
};

export type goerli_PooledToken_orderBy =
  | 'id'
  | 'asset';

export type Query = {
  goerli_asset?: Maybe<goerli_Asset>;
  goerli_assets: Array<goerli_Asset>;
  goerli_assetBalance?: Maybe<goerli_AssetBalance>;
  goerli_assetBalances: Array<goerli_AssetBalance>;
  goerli_router?: Maybe<goerli_Router>;
  goerli_routers: Array<goerli_Router>;
  goerli_setting?: Maybe<goerli_Setting>;
  goerli_settings: Array<goerli_Setting>;
  goerli_relayer?: Maybe<goerli_Relayer>;
  goerli_relayers: Array<goerli_Relayer>;
  goerli_transferRelayerFee?: Maybe<goerli_TransferRelayerFee>;
  goerli_transferRelayerFees: Array<goerli_TransferRelayerFee>;
  goerli_sequencer?: Maybe<goerli_Sequencer>;
  goerli_sequencers: Array<goerli_Sequencer>;
  goerli_originTransfer?: Maybe<goerli_OriginTransfer>;
  goerli_originTransfers: Array<goerli_OriginTransfer>;
  goerli_destinationTransfer?: Maybe<goerli_DestinationTransfer>;
  goerli_destinationTransfers: Array<goerli_DestinationTransfer>;
  goerli_originMessage?: Maybe<goerli_OriginMessage>;
  goerli_originMessages: Array<goerli_OriginMessage>;
  goerli_aggregateRoot?: Maybe<goerli_AggregateRoot>;
  goerli_aggregateRoots: Array<goerli_AggregateRoot>;
  goerli_connectorMeta?: Maybe<goerli_ConnectorMeta>;
  goerli_connectorMetas: Array<goerli_ConnectorMeta>;
  goerli_rootCount?: Maybe<goerli_RootCount>;
  goerli_rootCounts: Array<goerli_RootCount>;
  goerli_rootMessageSent?: Maybe<goerli_RootMessageSent>;
  goerli_rootMessageSents: Array<goerli_RootMessageSent>;
  goerli_stableSwap?: Maybe<goerli_StableSwap>;
  goerli_stableSwaps: Array<goerli_StableSwap>;
  goerli_pooledToken?: Maybe<goerli_PooledToken>;
  goerli_pooledTokens: Array<goerli_PooledToken>;
  goerli_stableSwapLiquidity?: Maybe<goerli_StableSwapLiquidity>;
  goerli_stableSwapLiquidities: Array<goerli_StableSwapLiquidity>;
  /** Access to subgraph metadata */
  goerli__meta?: Maybe<goerli__Meta_>;
};


export type Querygoerli_assetArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_assetsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_Asset_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_Asset_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_assetBalanceArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_assetBalancesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_AssetBalance_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_AssetBalance_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_routerArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_routersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_Router_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_Router_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_settingArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_settingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_Setting_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_Setting_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_relayerArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_relayersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_Relayer_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_Relayer_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_transferRelayerFeeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_transferRelayerFeesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_TransferRelayerFee_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_TransferRelayerFee_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_sequencerArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_sequencersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_Sequencer_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_Sequencer_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_originTransferArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_originTransfersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_OriginTransfer_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_OriginTransfer_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_destinationTransferArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_destinationTransfersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_DestinationTransfer_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_DestinationTransfer_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_originMessageArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_originMessagesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_OriginMessage_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_OriginMessage_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_aggregateRootArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_aggregateRootsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_AggregateRoot_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_AggregateRoot_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_connectorMetaArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_connectorMetasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_ConnectorMeta_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_ConnectorMeta_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_rootCountArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_rootCountsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_RootCount_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_RootCount_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_rootMessageSentArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_rootMessageSentsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_RootMessageSent_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_RootMessageSent_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_stableSwapArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_stableSwapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_StableSwap_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_StableSwap_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_pooledTokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_pooledTokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_PooledToken_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_PooledToken_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_stableSwapLiquidityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli_stableSwapLiquiditiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_StableSwapLiquidity_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_StableSwapLiquidity_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querygoerli__metaArgs = {
  block?: InputMaybe<goerli_Block_height>;
};

export type goerli_Relayer = {
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  relayer?: Maybe<Scalars['goerli_Bytes']>;
};

export type goerli_Relayer_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  isActive_not?: InputMaybe<Scalars['Boolean']>;
  isActive_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isActive_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  relayer?: InputMaybe<Scalars['goerli_Bytes']>;
  relayer_not?: InputMaybe<Scalars['goerli_Bytes']>;
  relayer_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  relayer_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  relayer_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  relayer_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<goerli_BlockChangedFilter>;
};

export type goerli_Relayer_orderBy =
  | 'id'
  | 'isActive'
  | 'relayer';

export type goerli_RootCount = {
  id: Scalars['ID'];
  count?: Maybe<Scalars['BigInt']>;
};

export type goerli_RootCount_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  count?: InputMaybe<Scalars['BigInt']>;
  count_not?: InputMaybe<Scalars['BigInt']>;
  count_gt?: InputMaybe<Scalars['BigInt']>;
  count_lt?: InputMaybe<Scalars['BigInt']>;
  count_gte?: InputMaybe<Scalars['BigInt']>;
  count_lte?: InputMaybe<Scalars['BigInt']>;
  count_in?: InputMaybe<Array<Scalars['BigInt']>>;
  count_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<goerli_BlockChangedFilter>;
};

export type goerli_RootCount_orderBy =
  | 'id'
  | 'count';

export type goerli_RootMessageSent = {
  id: Scalars['ID'];
  spokeDomain?: Maybe<Scalars['BigInt']>;
  hubDomain?: Maybe<Scalars['BigInt']>;
  root?: Maybe<Scalars['goerli_Bytes']>;
  count?: Maybe<Scalars['BigInt']>;
  caller?: Maybe<Scalars['goerli_Bytes']>;
  transactionHash?: Maybe<Scalars['goerli_Bytes']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  gasPrice?: Maybe<Scalars['BigInt']>;
  gasLimit?: Maybe<Scalars['BigInt']>;
  blockNumber?: Maybe<Scalars['BigInt']>;
};

export type goerli_RootMessageSent_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  spokeDomain?: InputMaybe<Scalars['BigInt']>;
  spokeDomain_not?: InputMaybe<Scalars['BigInt']>;
  spokeDomain_gt?: InputMaybe<Scalars['BigInt']>;
  spokeDomain_lt?: InputMaybe<Scalars['BigInt']>;
  spokeDomain_gte?: InputMaybe<Scalars['BigInt']>;
  spokeDomain_lte?: InputMaybe<Scalars['BigInt']>;
  spokeDomain_in?: InputMaybe<Array<Scalars['BigInt']>>;
  spokeDomain_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  hubDomain?: InputMaybe<Scalars['BigInt']>;
  hubDomain_not?: InputMaybe<Scalars['BigInt']>;
  hubDomain_gt?: InputMaybe<Scalars['BigInt']>;
  hubDomain_lt?: InputMaybe<Scalars['BigInt']>;
  hubDomain_gte?: InputMaybe<Scalars['BigInt']>;
  hubDomain_lte?: InputMaybe<Scalars['BigInt']>;
  hubDomain_in?: InputMaybe<Array<Scalars['BigInt']>>;
  hubDomain_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  root?: InputMaybe<Scalars['goerli_Bytes']>;
  root_not?: InputMaybe<Scalars['goerli_Bytes']>;
  root_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  root_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  root_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  root_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  count?: InputMaybe<Scalars['BigInt']>;
  count_not?: InputMaybe<Scalars['BigInt']>;
  count_gt?: InputMaybe<Scalars['BigInt']>;
  count_lt?: InputMaybe<Scalars['BigInt']>;
  count_gte?: InputMaybe<Scalars['BigInt']>;
  count_lte?: InputMaybe<Scalars['BigInt']>;
  count_in?: InputMaybe<Array<Scalars['BigInt']>>;
  count_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  caller?: InputMaybe<Scalars['goerli_Bytes']>;
  caller_not?: InputMaybe<Scalars['goerli_Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  caller_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  caller_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  transactionHash?: InputMaybe<Scalars['goerli_Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['goerli_Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  transactionHash_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasPrice?: InputMaybe<Scalars['BigInt']>;
  gasPrice_not?: InputMaybe<Scalars['BigInt']>;
  gasPrice_gt?: InputMaybe<Scalars['BigInt']>;
  gasPrice_lt?: InputMaybe<Scalars['BigInt']>;
  gasPrice_gte?: InputMaybe<Scalars['BigInt']>;
  gasPrice_lte?: InputMaybe<Scalars['BigInt']>;
  gasPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasLimit?: InputMaybe<Scalars['BigInt']>;
  gasLimit_not?: InputMaybe<Scalars['BigInt']>;
  gasLimit_gt?: InputMaybe<Scalars['BigInt']>;
  gasLimit_lt?: InputMaybe<Scalars['BigInt']>;
  gasLimit_gte?: InputMaybe<Scalars['BigInt']>;
  gasLimit_lte?: InputMaybe<Scalars['BigInt']>;
  gasLimit_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasLimit_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<goerli_BlockChangedFilter>;
};

export type goerli_RootMessageSent_orderBy =
  | 'id'
  | 'spokeDomain'
  | 'hubDomain'
  | 'root'
  | 'count'
  | 'caller'
  | 'transactionHash'
  | 'timestamp'
  | 'gasPrice'
  | 'gasLimit'
  | 'blockNumber';

export type goerli_Router = {
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  owner?: Maybe<Scalars['goerli_Bytes']>;
  recipient?: Maybe<Scalars['goerli_Bytes']>;
  proposedOwner?: Maybe<Scalars['goerli_Bytes']>;
  proposedTimestamp?: Maybe<Scalars['BigInt']>;
  assetBalances: Array<goerli_AssetBalance>;
};


export type goerli_RouterassetBalancesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_AssetBalance_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_AssetBalance_filter>;
};

export type goerli_Router_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  isActive_not?: InputMaybe<Scalars['Boolean']>;
  isActive_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isActive_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  owner?: InputMaybe<Scalars['goerli_Bytes']>;
  owner_not?: InputMaybe<Scalars['goerli_Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  owner_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  owner_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  recipient?: InputMaybe<Scalars['goerli_Bytes']>;
  recipient_not?: InputMaybe<Scalars['goerli_Bytes']>;
  recipient_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  recipient_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  recipient_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  recipient_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  proposedOwner?: InputMaybe<Scalars['goerli_Bytes']>;
  proposedOwner_not?: InputMaybe<Scalars['goerli_Bytes']>;
  proposedOwner_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  proposedOwner_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  proposedOwner_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  proposedOwner_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  proposedTimestamp?: InputMaybe<Scalars['BigInt']>;
  proposedTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  proposedTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  proposedTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  proposedTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  proposedTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  proposedTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  proposedTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  assetBalances_?: InputMaybe<goerli_AssetBalance_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<goerli_BlockChangedFilter>;
};

export type goerli_Router_orderBy =
  | 'id'
  | 'isActive'
  | 'owner'
  | 'recipient'
  | 'proposedOwner'
  | 'proposedTimestamp'
  | 'assetBalances';

export type goerli_Sequencer = {
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  sequencer?: Maybe<Scalars['goerli_Bytes']>;
};

export type goerli_Sequencer_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  isActive_not?: InputMaybe<Scalars['Boolean']>;
  isActive_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isActive_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  sequencer?: InputMaybe<Scalars['goerli_Bytes']>;
  sequencer_not?: InputMaybe<Scalars['goerli_Bytes']>;
  sequencer_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  sequencer_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  sequencer_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  sequencer_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<goerli_BlockChangedFilter>;
};

export type goerli_Sequencer_orderBy =
  | 'id'
  | 'isActive'
  | 'sequencer';

export type goerli_Setting = {
  id: Scalars['ID'];
  maxRoutersPerTransfer: Scalars['BigInt'];
  caller: Scalars['goerli_Bytes'];
};

export type goerli_Setting_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  maxRoutersPerTransfer?: InputMaybe<Scalars['BigInt']>;
  maxRoutersPerTransfer_not?: InputMaybe<Scalars['BigInt']>;
  maxRoutersPerTransfer_gt?: InputMaybe<Scalars['BigInt']>;
  maxRoutersPerTransfer_lt?: InputMaybe<Scalars['BigInt']>;
  maxRoutersPerTransfer_gte?: InputMaybe<Scalars['BigInt']>;
  maxRoutersPerTransfer_lte?: InputMaybe<Scalars['BigInt']>;
  maxRoutersPerTransfer_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maxRoutersPerTransfer_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  caller?: InputMaybe<Scalars['goerli_Bytes']>;
  caller_not?: InputMaybe<Scalars['goerli_Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  caller_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  caller_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<goerli_BlockChangedFilter>;
};

export type goerli_Setting_orderBy =
  | 'id'
  | 'maxRoutersPerTransfer'
  | 'caller';

export type goerli_StableSwap = {
  id: Scalars['ID'];
  isActive?: Maybe<Scalars['Boolean']>;
  key?: Maybe<Scalars['goerli_Bytes']>;
  canonicalId?: Maybe<Scalars['goerli_Bytes']>;
  domain?: Maybe<Scalars['BigInt']>;
  swapPool?: Maybe<Scalars['goerli_Bytes']>;
  lpToken?: Maybe<Scalars['goerli_Bytes']>;
  initialA?: Maybe<Scalars['BigInt']>;
  futureA?: Maybe<Scalars['BigInt']>;
  initialATime?: Maybe<Scalars['BigInt']>;
  futureATime?: Maybe<Scalars['BigInt']>;
  swapFee?: Maybe<Scalars['BigInt']>;
  adminFee?: Maybe<Scalars['BigInt']>;
  pooledTokens: Array<goerli_PooledToken>;
  tokenPrecisionMultipliers?: Maybe<Array<Scalars['BigInt']>>;
  balances: Array<Scalars['BigInt']>;
  adminFees?: Maybe<Array<Scalars['BigInt']>>;
};


export type goerli_StableSwappooledTokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_PooledToken_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_PooledToken_filter>;
};

export type goerli_StableSwapLiquidity = {
  id: Scalars['ID'];
  provider: Scalars['goerli_Bytes'];
  stableSwap: goerli_StableSwap;
  tokenAmounts: Array<Scalars['BigInt']>;
  fees: Array<Scalars['BigInt']>;
  invariant?: Maybe<Scalars['BigInt']>;
  lpTokenSupply?: Maybe<Scalars['BigInt']>;
};

export type goerli_StableSwapLiquidity_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  provider?: InputMaybe<Scalars['goerli_Bytes']>;
  provider_not?: InputMaybe<Scalars['goerli_Bytes']>;
  provider_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  provider_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  provider_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  provider_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  stableSwap?: InputMaybe<Scalars['String']>;
  stableSwap_not?: InputMaybe<Scalars['String']>;
  stableSwap_gt?: InputMaybe<Scalars['String']>;
  stableSwap_lt?: InputMaybe<Scalars['String']>;
  stableSwap_gte?: InputMaybe<Scalars['String']>;
  stableSwap_lte?: InputMaybe<Scalars['String']>;
  stableSwap_in?: InputMaybe<Array<Scalars['String']>>;
  stableSwap_not_in?: InputMaybe<Array<Scalars['String']>>;
  stableSwap_contains?: InputMaybe<Scalars['String']>;
  stableSwap_contains_nocase?: InputMaybe<Scalars['String']>;
  stableSwap_not_contains?: InputMaybe<Scalars['String']>;
  stableSwap_not_contains_nocase?: InputMaybe<Scalars['String']>;
  stableSwap_starts_with?: InputMaybe<Scalars['String']>;
  stableSwap_starts_with_nocase?: InputMaybe<Scalars['String']>;
  stableSwap_not_starts_with?: InputMaybe<Scalars['String']>;
  stableSwap_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  stableSwap_ends_with?: InputMaybe<Scalars['String']>;
  stableSwap_ends_with_nocase?: InputMaybe<Scalars['String']>;
  stableSwap_not_ends_with?: InputMaybe<Scalars['String']>;
  stableSwap_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  stableSwap_?: InputMaybe<goerli_StableSwap_filter>;
  tokenAmounts?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenAmounts_not?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenAmounts_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenAmounts_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenAmounts_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenAmounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  fees?: InputMaybe<Array<Scalars['BigInt']>>;
  fees_not?: InputMaybe<Array<Scalars['BigInt']>>;
  fees_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  fees_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  fees_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  fees_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  invariant?: InputMaybe<Scalars['BigInt']>;
  invariant_not?: InputMaybe<Scalars['BigInt']>;
  invariant_gt?: InputMaybe<Scalars['BigInt']>;
  invariant_lt?: InputMaybe<Scalars['BigInt']>;
  invariant_gte?: InputMaybe<Scalars['BigInt']>;
  invariant_lte?: InputMaybe<Scalars['BigInt']>;
  invariant_in?: InputMaybe<Array<Scalars['BigInt']>>;
  invariant_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lpTokenSupply?: InputMaybe<Scalars['BigInt']>;
  lpTokenSupply_not?: InputMaybe<Scalars['BigInt']>;
  lpTokenSupply_gt?: InputMaybe<Scalars['BigInt']>;
  lpTokenSupply_lt?: InputMaybe<Scalars['BigInt']>;
  lpTokenSupply_gte?: InputMaybe<Scalars['BigInt']>;
  lpTokenSupply_lte?: InputMaybe<Scalars['BigInt']>;
  lpTokenSupply_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lpTokenSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<goerli_BlockChangedFilter>;
};

export type goerli_StableSwapLiquidity_orderBy =
  | 'id'
  | 'provider'
  | 'stableSwap'
  | 'tokenAmounts'
  | 'fees'
  | 'invariant'
  | 'lpTokenSupply';

export type goerli_StableSwap_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  isActive_not?: InputMaybe<Scalars['Boolean']>;
  isActive_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isActive_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  key?: InputMaybe<Scalars['goerli_Bytes']>;
  key_not?: InputMaybe<Scalars['goerli_Bytes']>;
  key_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  key_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  key_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  key_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  canonicalId?: InputMaybe<Scalars['goerli_Bytes']>;
  canonicalId_not?: InputMaybe<Scalars['goerli_Bytes']>;
  canonicalId_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  canonicalId_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  canonicalId_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  canonicalId_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  domain?: InputMaybe<Scalars['BigInt']>;
  domain_not?: InputMaybe<Scalars['BigInt']>;
  domain_gt?: InputMaybe<Scalars['BigInt']>;
  domain_lt?: InputMaybe<Scalars['BigInt']>;
  domain_gte?: InputMaybe<Scalars['BigInt']>;
  domain_lte?: InputMaybe<Scalars['BigInt']>;
  domain_in?: InputMaybe<Array<Scalars['BigInt']>>;
  domain_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  swapPool?: InputMaybe<Scalars['goerli_Bytes']>;
  swapPool_not?: InputMaybe<Scalars['goerli_Bytes']>;
  swapPool_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  swapPool_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  swapPool_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  swapPool_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  lpToken?: InputMaybe<Scalars['goerli_Bytes']>;
  lpToken_not?: InputMaybe<Scalars['goerli_Bytes']>;
  lpToken_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  lpToken_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  lpToken_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  lpToken_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  initialA?: InputMaybe<Scalars['BigInt']>;
  initialA_not?: InputMaybe<Scalars['BigInt']>;
  initialA_gt?: InputMaybe<Scalars['BigInt']>;
  initialA_lt?: InputMaybe<Scalars['BigInt']>;
  initialA_gte?: InputMaybe<Scalars['BigInt']>;
  initialA_lte?: InputMaybe<Scalars['BigInt']>;
  initialA_in?: InputMaybe<Array<Scalars['BigInt']>>;
  initialA_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  futureA?: InputMaybe<Scalars['BigInt']>;
  futureA_not?: InputMaybe<Scalars['BigInt']>;
  futureA_gt?: InputMaybe<Scalars['BigInt']>;
  futureA_lt?: InputMaybe<Scalars['BigInt']>;
  futureA_gte?: InputMaybe<Scalars['BigInt']>;
  futureA_lte?: InputMaybe<Scalars['BigInt']>;
  futureA_in?: InputMaybe<Array<Scalars['BigInt']>>;
  futureA_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  initialATime?: InputMaybe<Scalars['BigInt']>;
  initialATime_not?: InputMaybe<Scalars['BigInt']>;
  initialATime_gt?: InputMaybe<Scalars['BigInt']>;
  initialATime_lt?: InputMaybe<Scalars['BigInt']>;
  initialATime_gte?: InputMaybe<Scalars['BigInt']>;
  initialATime_lte?: InputMaybe<Scalars['BigInt']>;
  initialATime_in?: InputMaybe<Array<Scalars['BigInt']>>;
  initialATime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  futureATime?: InputMaybe<Scalars['BigInt']>;
  futureATime_not?: InputMaybe<Scalars['BigInt']>;
  futureATime_gt?: InputMaybe<Scalars['BigInt']>;
  futureATime_lt?: InputMaybe<Scalars['BigInt']>;
  futureATime_gte?: InputMaybe<Scalars['BigInt']>;
  futureATime_lte?: InputMaybe<Scalars['BigInt']>;
  futureATime_in?: InputMaybe<Array<Scalars['BigInt']>>;
  futureATime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  swapFee?: InputMaybe<Scalars['BigInt']>;
  swapFee_not?: InputMaybe<Scalars['BigInt']>;
  swapFee_gt?: InputMaybe<Scalars['BigInt']>;
  swapFee_lt?: InputMaybe<Scalars['BigInt']>;
  swapFee_gte?: InputMaybe<Scalars['BigInt']>;
  swapFee_lte?: InputMaybe<Scalars['BigInt']>;
  swapFee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  swapFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  adminFee?: InputMaybe<Scalars['BigInt']>;
  adminFee_not?: InputMaybe<Scalars['BigInt']>;
  adminFee_gt?: InputMaybe<Scalars['BigInt']>;
  adminFee_lt?: InputMaybe<Scalars['BigInt']>;
  adminFee_gte?: InputMaybe<Scalars['BigInt']>;
  adminFee_lte?: InputMaybe<Scalars['BigInt']>;
  adminFee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  adminFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pooledTokens?: InputMaybe<Array<Scalars['String']>>;
  pooledTokens_not?: InputMaybe<Array<Scalars['String']>>;
  pooledTokens_contains?: InputMaybe<Array<Scalars['String']>>;
  pooledTokens_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  pooledTokens_not_contains?: InputMaybe<Array<Scalars['String']>>;
  pooledTokens_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  pooledTokens_?: InputMaybe<goerli_PooledToken_filter>;
  tokenPrecisionMultipliers?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenPrecisionMultipliers_not?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenPrecisionMultipliers_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenPrecisionMultipliers_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenPrecisionMultipliers_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenPrecisionMultipliers_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  balances?: InputMaybe<Array<Scalars['BigInt']>>;
  balances_not?: InputMaybe<Array<Scalars['BigInt']>>;
  balances_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  balances_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  balances_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  balances_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  adminFees?: InputMaybe<Array<Scalars['BigInt']>>;
  adminFees_not?: InputMaybe<Array<Scalars['BigInt']>>;
  adminFees_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  adminFees_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  adminFees_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  adminFees_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<goerli_BlockChangedFilter>;
};

export type goerli_StableSwap_orderBy =
  | 'id'
  | 'isActive'
  | 'key'
  | 'canonicalId'
  | 'domain'
  | 'swapPool'
  | 'lpToken'
  | 'initialA'
  | 'futureA'
  | 'initialATime'
  | 'futureATime'
  | 'swapFee'
  | 'adminFee'
  | 'pooledTokens'
  | 'tokenPrecisionMultipliers'
  | 'balances'
  | 'adminFees';

export type Subscription = {
  goerli_asset?: Maybe<goerli_Asset>;
  goerli_assets: Array<goerli_Asset>;
  goerli_assetBalance?: Maybe<goerli_AssetBalance>;
  goerli_assetBalances: Array<goerli_AssetBalance>;
  goerli_router?: Maybe<goerli_Router>;
  goerli_routers: Array<goerli_Router>;
  goerli_setting?: Maybe<goerli_Setting>;
  goerli_settings: Array<goerli_Setting>;
  goerli_relayer?: Maybe<goerli_Relayer>;
  goerli_relayers: Array<goerli_Relayer>;
  goerli_transferRelayerFee?: Maybe<goerli_TransferRelayerFee>;
  goerli_transferRelayerFees: Array<goerli_TransferRelayerFee>;
  goerli_sequencer?: Maybe<goerli_Sequencer>;
  goerli_sequencers: Array<goerli_Sequencer>;
  goerli_originTransfer?: Maybe<goerli_OriginTransfer>;
  goerli_originTransfers: Array<goerli_OriginTransfer>;
  goerli_destinationTransfer?: Maybe<goerli_DestinationTransfer>;
  goerli_destinationTransfers: Array<goerli_DestinationTransfer>;
  goerli_originMessage?: Maybe<goerli_OriginMessage>;
  goerli_originMessages: Array<goerli_OriginMessage>;
  goerli_aggregateRoot?: Maybe<goerli_AggregateRoot>;
  goerli_aggregateRoots: Array<goerli_AggregateRoot>;
  goerli_connectorMeta?: Maybe<goerli_ConnectorMeta>;
  goerli_connectorMetas: Array<goerli_ConnectorMeta>;
  goerli_rootCount?: Maybe<goerli_RootCount>;
  goerli_rootCounts: Array<goerli_RootCount>;
  goerli_rootMessageSent?: Maybe<goerli_RootMessageSent>;
  goerli_rootMessageSents: Array<goerli_RootMessageSent>;
  goerli_stableSwap?: Maybe<goerli_StableSwap>;
  goerli_stableSwaps: Array<goerli_StableSwap>;
  goerli_pooledToken?: Maybe<goerli_PooledToken>;
  goerli_pooledTokens: Array<goerli_PooledToken>;
  goerli_stableSwapLiquidity?: Maybe<goerli_StableSwapLiquidity>;
  goerli_stableSwapLiquidities: Array<goerli_StableSwapLiquidity>;
  /** Access to subgraph metadata */
  goerli__meta?: Maybe<goerli__Meta_>;
};


export type Subscriptiongoerli_assetArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_assetsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_Asset_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_Asset_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_assetBalanceArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_assetBalancesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_AssetBalance_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_AssetBalance_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_routerArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_routersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_Router_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_Router_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_settingArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_settingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_Setting_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_Setting_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_relayerArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_relayersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_Relayer_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_Relayer_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_transferRelayerFeeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_transferRelayerFeesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_TransferRelayerFee_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_TransferRelayerFee_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_sequencerArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_sequencersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_Sequencer_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_Sequencer_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_originTransferArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_originTransfersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_OriginTransfer_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_OriginTransfer_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_destinationTransferArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_destinationTransfersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_DestinationTransfer_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_DestinationTransfer_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_originMessageArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_originMessagesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_OriginMessage_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_OriginMessage_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_aggregateRootArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_aggregateRootsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_AggregateRoot_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_AggregateRoot_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_connectorMetaArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_connectorMetasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_ConnectorMeta_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_ConnectorMeta_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_rootCountArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_rootCountsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_RootCount_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_RootCount_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_rootMessageSentArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_rootMessageSentsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_RootMessageSent_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_RootMessageSent_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_stableSwapArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_stableSwapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_StableSwap_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_StableSwap_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_pooledTokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_pooledTokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_PooledToken_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_PooledToken_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_stableSwapLiquidityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli_stableSwapLiquiditiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<goerli_StableSwapLiquidity_orderBy>;
  orderDirection?: InputMaybe<goerli_OrderDirection>;
  where?: InputMaybe<goerli_StableSwapLiquidity_filter>;
  block?: InputMaybe<goerli_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptiongoerli__metaArgs = {
  block?: InputMaybe<goerli_Block_height>;
};

export type goerli_TransferRelayerFee = {
  id: Scalars['ID'];
  transferId: Scalars['goerli_Bytes'];
  fee?: Maybe<Scalars['BigInt']>;
};

export type goerli_TransferRelayerFee_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  transferId?: InputMaybe<Scalars['goerli_Bytes']>;
  transferId_not?: InputMaybe<Scalars['goerli_Bytes']>;
  transferId_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  transferId_not_in?: InputMaybe<Array<Scalars['goerli_Bytes']>>;
  transferId_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  transferId_not_contains?: InputMaybe<Scalars['goerli_Bytes']>;
  fee?: InputMaybe<Scalars['BigInt']>;
  fee_not?: InputMaybe<Scalars['BigInt']>;
  fee_gt?: InputMaybe<Scalars['BigInt']>;
  fee_lt?: InputMaybe<Scalars['BigInt']>;
  fee_gte?: InputMaybe<Scalars['BigInt']>;
  fee_lte?: InputMaybe<Scalars['BigInt']>;
  fee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<goerli_BlockChangedFilter>;
};

export type goerli_TransferRelayerFee_orderBy =
  | 'id'
  | 'transferId'
  | 'fee';

export type goerli_TransferStatus =
  | 'XCalled'
  | 'Executed'
  | 'Reconciled'
  | 'CompletedSlow'
  | 'CompletedFast';

export type goerli__Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['goerli_Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type goerli__Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: goerli__Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

  export type QuerySdk = {
      /** null **/
  goerli_asset: InContextSdkMethod<Query['goerli_asset'], Querygoerli_assetArgs, MeshContext>,
  /** null **/
  goerli_assets: InContextSdkMethod<Query['goerli_assets'], Querygoerli_assetsArgs, MeshContext>,
  /** null **/
  goerli_assetBalance: InContextSdkMethod<Query['goerli_assetBalance'], Querygoerli_assetBalanceArgs, MeshContext>,
  /** null **/
  goerli_assetBalances: InContextSdkMethod<Query['goerli_assetBalances'], Querygoerli_assetBalancesArgs, MeshContext>,
  /** null **/
  goerli_router: InContextSdkMethod<Query['goerli_router'], Querygoerli_routerArgs, MeshContext>,
  /** null **/
  goerli_routers: InContextSdkMethod<Query['goerli_routers'], Querygoerli_routersArgs, MeshContext>,
  /** null **/
  goerli_setting: InContextSdkMethod<Query['goerli_setting'], Querygoerli_settingArgs, MeshContext>,
  /** null **/
  goerli_settings: InContextSdkMethod<Query['goerli_settings'], Querygoerli_settingsArgs, MeshContext>,
  /** null **/
  goerli_relayer: InContextSdkMethod<Query['goerli_relayer'], Querygoerli_relayerArgs, MeshContext>,
  /** null **/
  goerli_relayers: InContextSdkMethod<Query['goerli_relayers'], Querygoerli_relayersArgs, MeshContext>,
  /** null **/
  goerli_transferRelayerFee: InContextSdkMethod<Query['goerli_transferRelayerFee'], Querygoerli_transferRelayerFeeArgs, MeshContext>,
  /** null **/
  goerli_transferRelayerFees: InContextSdkMethod<Query['goerli_transferRelayerFees'], Querygoerli_transferRelayerFeesArgs, MeshContext>,
  /** null **/
  goerli_sequencer: InContextSdkMethod<Query['goerli_sequencer'], Querygoerli_sequencerArgs, MeshContext>,
  /** null **/
  goerli_sequencers: InContextSdkMethod<Query['goerli_sequencers'], Querygoerli_sequencersArgs, MeshContext>,
  /** null **/
  goerli_originTransfer: InContextSdkMethod<Query['goerli_originTransfer'], Querygoerli_originTransferArgs, MeshContext>,
  /** null **/
  goerli_originTransfers: InContextSdkMethod<Query['goerli_originTransfers'], Querygoerli_originTransfersArgs, MeshContext>,
  /** null **/
  goerli_destinationTransfer: InContextSdkMethod<Query['goerli_destinationTransfer'], Querygoerli_destinationTransferArgs, MeshContext>,
  /** null **/
  goerli_destinationTransfers: InContextSdkMethod<Query['goerli_destinationTransfers'], Querygoerli_destinationTransfersArgs, MeshContext>,
  /** null **/
  goerli_originMessage: InContextSdkMethod<Query['goerli_originMessage'], Querygoerli_originMessageArgs, MeshContext>,
  /** null **/
  goerli_originMessages: InContextSdkMethod<Query['goerli_originMessages'], Querygoerli_originMessagesArgs, MeshContext>,
  /** null **/
  goerli_aggregateRoot: InContextSdkMethod<Query['goerli_aggregateRoot'], Querygoerli_aggregateRootArgs, MeshContext>,
  /** null **/
  goerli_aggregateRoots: InContextSdkMethod<Query['goerli_aggregateRoots'], Querygoerli_aggregateRootsArgs, MeshContext>,
  /** null **/
  goerli_connectorMeta: InContextSdkMethod<Query['goerli_connectorMeta'], Querygoerli_connectorMetaArgs, MeshContext>,
  /** null **/
  goerli_connectorMetas: InContextSdkMethod<Query['goerli_connectorMetas'], Querygoerli_connectorMetasArgs, MeshContext>,
  /** null **/
  goerli_rootCount: InContextSdkMethod<Query['goerli_rootCount'], Querygoerli_rootCountArgs, MeshContext>,
  /** null **/
  goerli_rootCounts: InContextSdkMethod<Query['goerli_rootCounts'], Querygoerli_rootCountsArgs, MeshContext>,
  /** null **/
  goerli_rootMessageSent: InContextSdkMethod<Query['goerli_rootMessageSent'], Querygoerli_rootMessageSentArgs, MeshContext>,
  /** null **/
  goerli_rootMessageSents: InContextSdkMethod<Query['goerli_rootMessageSents'], Querygoerli_rootMessageSentsArgs, MeshContext>,
  /** null **/
  goerli_stableSwap: InContextSdkMethod<Query['goerli_stableSwap'], Querygoerli_stableSwapArgs, MeshContext>,
  /** null **/
  goerli_stableSwaps: InContextSdkMethod<Query['goerli_stableSwaps'], Querygoerli_stableSwapsArgs, MeshContext>,
  /** null **/
  goerli_pooledToken: InContextSdkMethod<Query['goerli_pooledToken'], Querygoerli_pooledTokenArgs, MeshContext>,
  /** null **/
  goerli_pooledTokens: InContextSdkMethod<Query['goerli_pooledTokens'], Querygoerli_pooledTokensArgs, MeshContext>,
  /** null **/
  goerli_stableSwapLiquidity: InContextSdkMethod<Query['goerli_stableSwapLiquidity'], Querygoerli_stableSwapLiquidityArgs, MeshContext>,
  /** null **/
  goerli_stableSwapLiquidities: InContextSdkMethod<Query['goerli_stableSwapLiquidities'], Querygoerli_stableSwapLiquiditiesArgs, MeshContext>,
  /** Access to subgraph metadata **/
  goerli__meta: InContextSdkMethod<Query['goerli__meta'], Querygoerli__metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  goerli_asset: InContextSdkMethod<Subscription['goerli_asset'], Subscriptiongoerli_assetArgs, MeshContext>,
  /** null **/
  goerli_assets: InContextSdkMethod<Subscription['goerli_assets'], Subscriptiongoerli_assetsArgs, MeshContext>,
  /** null **/
  goerli_assetBalance: InContextSdkMethod<Subscription['goerli_assetBalance'], Subscriptiongoerli_assetBalanceArgs, MeshContext>,
  /** null **/
  goerli_assetBalances: InContextSdkMethod<Subscription['goerli_assetBalances'], Subscriptiongoerli_assetBalancesArgs, MeshContext>,
  /** null **/
  goerli_router: InContextSdkMethod<Subscription['goerli_router'], Subscriptiongoerli_routerArgs, MeshContext>,
  /** null **/
  goerli_routers: InContextSdkMethod<Subscription['goerli_routers'], Subscriptiongoerli_routersArgs, MeshContext>,
  /** null **/
  goerli_setting: InContextSdkMethod<Subscription['goerli_setting'], Subscriptiongoerli_settingArgs, MeshContext>,
  /** null **/
  goerli_settings: InContextSdkMethod<Subscription['goerli_settings'], Subscriptiongoerli_settingsArgs, MeshContext>,
  /** null **/
  goerli_relayer: InContextSdkMethod<Subscription['goerli_relayer'], Subscriptiongoerli_relayerArgs, MeshContext>,
  /** null **/
  goerli_relayers: InContextSdkMethod<Subscription['goerli_relayers'], Subscriptiongoerli_relayersArgs, MeshContext>,
  /** null **/
  goerli_transferRelayerFee: InContextSdkMethod<Subscription['goerli_transferRelayerFee'], Subscriptiongoerli_transferRelayerFeeArgs, MeshContext>,
  /** null **/
  goerli_transferRelayerFees: InContextSdkMethod<Subscription['goerli_transferRelayerFees'], Subscriptiongoerli_transferRelayerFeesArgs, MeshContext>,
  /** null **/
  goerli_sequencer: InContextSdkMethod<Subscription['goerli_sequencer'], Subscriptiongoerli_sequencerArgs, MeshContext>,
  /** null **/
  goerli_sequencers: InContextSdkMethod<Subscription['goerli_sequencers'], Subscriptiongoerli_sequencersArgs, MeshContext>,
  /** null **/
  goerli_originTransfer: InContextSdkMethod<Subscription['goerli_originTransfer'], Subscriptiongoerli_originTransferArgs, MeshContext>,
  /** null **/
  goerli_originTransfers: InContextSdkMethod<Subscription['goerli_originTransfers'], Subscriptiongoerli_originTransfersArgs, MeshContext>,
  /** null **/
  goerli_destinationTransfer: InContextSdkMethod<Subscription['goerli_destinationTransfer'], Subscriptiongoerli_destinationTransferArgs, MeshContext>,
  /** null **/
  goerli_destinationTransfers: InContextSdkMethod<Subscription['goerli_destinationTransfers'], Subscriptiongoerli_destinationTransfersArgs, MeshContext>,
  /** null **/
  goerli_originMessage: InContextSdkMethod<Subscription['goerli_originMessage'], Subscriptiongoerli_originMessageArgs, MeshContext>,
  /** null **/
  goerli_originMessages: InContextSdkMethod<Subscription['goerli_originMessages'], Subscriptiongoerli_originMessagesArgs, MeshContext>,
  /** null **/
  goerli_aggregateRoot: InContextSdkMethod<Subscription['goerli_aggregateRoot'], Subscriptiongoerli_aggregateRootArgs, MeshContext>,
  /** null **/
  goerli_aggregateRoots: InContextSdkMethod<Subscription['goerli_aggregateRoots'], Subscriptiongoerli_aggregateRootsArgs, MeshContext>,
  /** null **/
  goerli_connectorMeta: InContextSdkMethod<Subscription['goerli_connectorMeta'], Subscriptiongoerli_connectorMetaArgs, MeshContext>,
  /** null **/
  goerli_connectorMetas: InContextSdkMethod<Subscription['goerli_connectorMetas'], Subscriptiongoerli_connectorMetasArgs, MeshContext>,
  /** null **/
  goerli_rootCount: InContextSdkMethod<Subscription['goerli_rootCount'], Subscriptiongoerli_rootCountArgs, MeshContext>,
  /** null **/
  goerli_rootCounts: InContextSdkMethod<Subscription['goerli_rootCounts'], Subscriptiongoerli_rootCountsArgs, MeshContext>,
  /** null **/
  goerli_rootMessageSent: InContextSdkMethod<Subscription['goerli_rootMessageSent'], Subscriptiongoerli_rootMessageSentArgs, MeshContext>,
  /** null **/
  goerli_rootMessageSents: InContextSdkMethod<Subscription['goerli_rootMessageSents'], Subscriptiongoerli_rootMessageSentsArgs, MeshContext>,
  /** null **/
  goerli_stableSwap: InContextSdkMethod<Subscription['goerli_stableSwap'], Subscriptiongoerli_stableSwapArgs, MeshContext>,
  /** null **/
  goerli_stableSwaps: InContextSdkMethod<Subscription['goerli_stableSwaps'], Subscriptiongoerli_stableSwapsArgs, MeshContext>,
  /** null **/
  goerli_pooledToken: InContextSdkMethod<Subscription['goerli_pooledToken'], Subscriptiongoerli_pooledTokenArgs, MeshContext>,
  /** null **/
  goerli_pooledTokens: InContextSdkMethod<Subscription['goerli_pooledTokens'], Subscriptiongoerli_pooledTokensArgs, MeshContext>,
  /** null **/
  goerli_stableSwapLiquidity: InContextSdkMethod<Subscription['goerli_stableSwapLiquidity'], Subscriptiongoerli_stableSwapLiquidityArgs, MeshContext>,
  /** null **/
  goerli_stableSwapLiquidities: InContextSdkMethod<Subscription['goerli_stableSwapLiquidities'], Subscriptiongoerli_stableSwapLiquiditiesArgs, MeshContext>,
  /** Access to subgraph metadata **/
  goerli__meta: InContextSdkMethod<Subscription['goerli__meta'], Subscriptiongoerli__metaArgs, MeshContext>
  };

  export type Context = {
      ["Connext_Goerli"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}

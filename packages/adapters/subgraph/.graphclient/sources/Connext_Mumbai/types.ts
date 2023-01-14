// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace ConnextMumbaiTypes {
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
  mumbai_BigDecimal: any;
  BigInt: any;
  mumbai_Bytes: any;
};

export type mumbai_AggregateRoot = {
  id: Scalars['ID'];
  root: Scalars['mumbai_Bytes'];
  blockNumber: Scalars['BigInt'];
};

export type mumbai_AggregateRoot_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  root?: InputMaybe<Scalars['mumbai_Bytes']>;
  root_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  root_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  root_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  root_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  root_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<mumbai_BlockChangedFilter>;
};

export type mumbai_AggregateRoot_orderBy =
  | 'id'
  | 'root'
  | 'blockNumber';

export type mumbai_Asset = {
  id: Scalars['ID'];
  key?: Maybe<Scalars['mumbai_Bytes']>;
  canonicalId?: Maybe<Scalars['mumbai_Bytes']>;
  canonicalDomain?: Maybe<Scalars['BigInt']>;
  adoptedAsset?: Maybe<Scalars['mumbai_Bytes']>;
  localAsset?: Maybe<Scalars['mumbai_Bytes']>;
  blockNumber?: Maybe<Scalars['BigInt']>;
};

export type mumbai_AssetBalance = {
  id: Scalars['ID'];
  amount: Scalars['BigInt'];
  router: mumbai_Router;
  asset: mumbai_Asset;
  feesEarned: Scalars['BigInt'];
};

export type mumbai_AssetBalance_filter = {
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
  router_?: InputMaybe<mumbai_Router_filter>;
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
  asset_?: InputMaybe<mumbai_Asset_filter>;
  feesEarned?: InputMaybe<Scalars['BigInt']>;
  feesEarned_not?: InputMaybe<Scalars['BigInt']>;
  feesEarned_gt?: InputMaybe<Scalars['BigInt']>;
  feesEarned_lt?: InputMaybe<Scalars['BigInt']>;
  feesEarned_gte?: InputMaybe<Scalars['BigInt']>;
  feesEarned_lte?: InputMaybe<Scalars['BigInt']>;
  feesEarned_in?: InputMaybe<Array<Scalars['BigInt']>>;
  feesEarned_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<mumbai_BlockChangedFilter>;
};

export type mumbai_AssetBalance_orderBy =
  | 'id'
  | 'amount'
  | 'router'
  | 'asset'
  | 'feesEarned';

export type mumbai_Asset_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  key?: InputMaybe<Scalars['mumbai_Bytes']>;
  key_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  key_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  key_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  key_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  key_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  canonicalId?: InputMaybe<Scalars['mumbai_Bytes']>;
  canonicalId_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  canonicalId_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  canonicalId_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  canonicalId_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  canonicalId_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  canonicalDomain?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_not?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_gt?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_lt?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_gte?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_lte?: InputMaybe<Scalars['BigInt']>;
  canonicalDomain_in?: InputMaybe<Array<Scalars['BigInt']>>;
  canonicalDomain_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  adoptedAsset?: InputMaybe<Scalars['mumbai_Bytes']>;
  adoptedAsset_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  adoptedAsset_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  adoptedAsset_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  adoptedAsset_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  adoptedAsset_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  localAsset?: InputMaybe<Scalars['mumbai_Bytes']>;
  localAsset_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  localAsset_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  localAsset_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  localAsset_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  localAsset_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<mumbai_BlockChangedFilter>;
};

export type mumbai_Asset_orderBy =
  | 'id'
  | 'key'
  | 'canonicalId'
  | 'canonicalDomain'
  | 'adoptedAsset'
  | 'localAsset'
  | 'blockNumber';

export type mumbai_BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type mumbai_Block_height = {
  hash?: InputMaybe<Scalars['mumbai_Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type mumbai_ConnectorMeta = {
  id: Scalars['ID'];
  spokeDomain?: Maybe<Scalars['BigInt']>;
  hubDomain?: Maybe<Scalars['BigInt']>;
  amb?: Maybe<Scalars['mumbai_Bytes']>;
  rootManager?: Maybe<Scalars['mumbai_Bytes']>;
  mirrorConnector?: Maybe<Scalars['mumbai_Bytes']>;
};

export type mumbai_ConnectorMeta_filter = {
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
  amb?: InputMaybe<Scalars['mumbai_Bytes']>;
  amb_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  amb_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  amb_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  amb_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  amb_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  rootManager?: InputMaybe<Scalars['mumbai_Bytes']>;
  rootManager_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  rootManager_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  rootManager_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  rootManager_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  rootManager_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  mirrorConnector?: InputMaybe<Scalars['mumbai_Bytes']>;
  mirrorConnector_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  mirrorConnector_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  mirrorConnector_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  mirrorConnector_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  mirrorConnector_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<mumbai_BlockChangedFilter>;
};

export type mumbai_ConnectorMeta_orderBy =
  | 'id'
  | 'spokeDomain'
  | 'hubDomain'
  | 'amb'
  | 'rootManager'
  | 'mirrorConnector';

export type mumbai_DestinationTransfer = {
  id: Scalars['ID'];
  chainId?: Maybe<Scalars['BigInt']>;
  transferId?: Maybe<Scalars['mumbai_Bytes']>;
  nonce?: Maybe<Scalars['BigInt']>;
  status?: Maybe<mumbai_TransferStatus>;
  routers?: Maybe<Array<mumbai_Router>>;
  originDomain?: Maybe<Scalars['BigInt']>;
  destinationDomain?: Maybe<Scalars['BigInt']>;
  canonicalDomain?: Maybe<Scalars['BigInt']>;
  to?: Maybe<Scalars['mumbai_Bytes']>;
  delegate?: Maybe<Scalars['mumbai_Bytes']>;
  receiveLocal?: Maybe<Scalars['Boolean']>;
  callData?: Maybe<Scalars['mumbai_Bytes']>;
  slippage?: Maybe<Scalars['BigInt']>;
  originSender?: Maybe<Scalars['mumbai_Bytes']>;
  bridgedAmt?: Maybe<Scalars['BigInt']>;
  normalizedIn?: Maybe<Scalars['BigInt']>;
  canonicalId?: Maybe<Scalars['mumbai_Bytes']>;
  asset?: Maybe<mumbai_Asset>;
  amount?: Maybe<Scalars['BigInt']>;
  routersFee?: Maybe<Scalars['BigInt']>;
  executedCaller?: Maybe<Scalars['mumbai_Bytes']>;
  executedTransactionHash?: Maybe<Scalars['mumbai_Bytes']>;
  executedTimestamp?: Maybe<Scalars['BigInt']>;
  executedGasPrice?: Maybe<Scalars['BigInt']>;
  executedGasLimit?: Maybe<Scalars['BigInt']>;
  executedBlockNumber?: Maybe<Scalars['BigInt']>;
  executedTxOrigin?: Maybe<Scalars['mumbai_Bytes']>;
  reconciledCaller?: Maybe<Scalars['mumbai_Bytes']>;
  reconciledTransactionHash?: Maybe<Scalars['mumbai_Bytes']>;
  reconciledTimestamp?: Maybe<Scalars['BigInt']>;
  reconciledGasPrice?: Maybe<Scalars['BigInt']>;
  reconciledGasLimit?: Maybe<Scalars['BigInt']>;
  reconciledBlockNumber?: Maybe<Scalars['BigInt']>;
  reconciledTxOrigin?: Maybe<Scalars['mumbai_Bytes']>;
};


export type mumbai_DestinationTransferroutersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_Router_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_Router_filter>;
};

export type mumbai_DestinationTransfer_filter = {
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
  transferId?: InputMaybe<Scalars['mumbai_Bytes']>;
  transferId_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  transferId_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  transferId_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  transferId_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  transferId_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  nonce?: InputMaybe<Scalars['BigInt']>;
  nonce_not?: InputMaybe<Scalars['BigInt']>;
  nonce_gt?: InputMaybe<Scalars['BigInt']>;
  nonce_lt?: InputMaybe<Scalars['BigInt']>;
  nonce_gte?: InputMaybe<Scalars['BigInt']>;
  nonce_lte?: InputMaybe<Scalars['BigInt']>;
  nonce_in?: InputMaybe<Array<Scalars['BigInt']>>;
  nonce_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  status?: InputMaybe<mumbai_TransferStatus>;
  status_not?: InputMaybe<mumbai_TransferStatus>;
  status_in?: InputMaybe<Array<mumbai_TransferStatus>>;
  status_not_in?: InputMaybe<Array<mumbai_TransferStatus>>;
  routers?: InputMaybe<Array<Scalars['String']>>;
  routers_not?: InputMaybe<Array<Scalars['String']>>;
  routers_contains?: InputMaybe<Array<Scalars['String']>>;
  routers_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  routers_not_contains?: InputMaybe<Array<Scalars['String']>>;
  routers_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  routers_?: InputMaybe<mumbai_Router_filter>;
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
  to?: InputMaybe<Scalars['mumbai_Bytes']>;
  to_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  to_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  delegate?: InputMaybe<Scalars['mumbai_Bytes']>;
  delegate_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  delegate_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  delegate_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  delegate_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  delegate_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  receiveLocal?: InputMaybe<Scalars['Boolean']>;
  receiveLocal_not?: InputMaybe<Scalars['Boolean']>;
  receiveLocal_in?: InputMaybe<Array<Scalars['Boolean']>>;
  receiveLocal_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  callData?: InputMaybe<Scalars['mumbai_Bytes']>;
  callData_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  callData_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  callData_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  callData_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  callData_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  slippage?: InputMaybe<Scalars['BigInt']>;
  slippage_not?: InputMaybe<Scalars['BigInt']>;
  slippage_gt?: InputMaybe<Scalars['BigInt']>;
  slippage_lt?: InputMaybe<Scalars['BigInt']>;
  slippage_gte?: InputMaybe<Scalars['BigInt']>;
  slippage_lte?: InputMaybe<Scalars['BigInt']>;
  slippage_in?: InputMaybe<Array<Scalars['BigInt']>>;
  slippage_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  originSender?: InputMaybe<Scalars['mumbai_Bytes']>;
  originSender_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  originSender_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  originSender_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  originSender_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  originSender_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
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
  canonicalId?: InputMaybe<Scalars['mumbai_Bytes']>;
  canonicalId_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  canonicalId_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  canonicalId_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  canonicalId_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  canonicalId_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
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
  asset_?: InputMaybe<mumbai_Asset_filter>;
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
  executedCaller?: InputMaybe<Scalars['mumbai_Bytes']>;
  executedCaller_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  executedCaller_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  executedCaller_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  executedCaller_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  executedCaller_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  executedTransactionHash?: InputMaybe<Scalars['mumbai_Bytes']>;
  executedTransactionHash_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  executedTransactionHash_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  executedTransactionHash_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  executedTransactionHash_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  executedTransactionHash_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
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
  executedTxOrigin?: InputMaybe<Scalars['mumbai_Bytes']>;
  executedTxOrigin_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  executedTxOrigin_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  executedTxOrigin_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  executedTxOrigin_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  executedTxOrigin_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  reconciledCaller?: InputMaybe<Scalars['mumbai_Bytes']>;
  reconciledCaller_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  reconciledCaller_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  reconciledCaller_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  reconciledCaller_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  reconciledCaller_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  reconciledTransactionHash?: InputMaybe<Scalars['mumbai_Bytes']>;
  reconciledTransactionHash_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  reconciledTransactionHash_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  reconciledTransactionHash_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  reconciledTransactionHash_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  reconciledTransactionHash_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
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
  reconciledTxOrigin?: InputMaybe<Scalars['mumbai_Bytes']>;
  reconciledTxOrigin_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  reconciledTxOrigin_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  reconciledTxOrigin_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  reconciledTxOrigin_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  reconciledTxOrigin_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<mumbai_BlockChangedFilter>;
};

export type mumbai_DestinationTransfer_orderBy =
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
export type mumbai_OrderDirection =
  | 'asc'
  | 'desc';

export type mumbai_OriginMessage = {
  id: Scalars['ID'];
  transferId?: Maybe<Scalars['mumbai_Bytes']>;
  destinationDomain?: Maybe<Scalars['BigInt']>;
  leaf?: Maybe<Scalars['mumbai_Bytes']>;
  index?: Maybe<Scalars['BigInt']>;
  message?: Maybe<Scalars['mumbai_Bytes']>;
  root?: Maybe<Scalars['mumbai_Bytes']>;
  transactionHash?: Maybe<Scalars['mumbai_Bytes']>;
  blockNumber?: Maybe<Scalars['BigInt']>;
  rootCount?: Maybe<mumbai_RootCount>;
};

export type mumbai_OriginMessage_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  transferId?: InputMaybe<Scalars['mumbai_Bytes']>;
  transferId_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  transferId_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  transferId_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  transferId_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  transferId_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  destinationDomain?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_not?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_gt?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_lt?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_gte?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_lte?: InputMaybe<Scalars['BigInt']>;
  destinationDomain_in?: InputMaybe<Array<Scalars['BigInt']>>;
  destinationDomain_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  leaf?: InputMaybe<Scalars['mumbai_Bytes']>;
  leaf_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  leaf_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  leaf_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  leaf_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  leaf_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  index?: InputMaybe<Scalars['BigInt']>;
  index_not?: InputMaybe<Scalars['BigInt']>;
  index_gt?: InputMaybe<Scalars['BigInt']>;
  index_lt?: InputMaybe<Scalars['BigInt']>;
  index_gte?: InputMaybe<Scalars['BigInt']>;
  index_lte?: InputMaybe<Scalars['BigInt']>;
  index_in?: InputMaybe<Array<Scalars['BigInt']>>;
  index_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  message?: InputMaybe<Scalars['mumbai_Bytes']>;
  message_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  message_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  message_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  message_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  message_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  root?: InputMaybe<Scalars['mumbai_Bytes']>;
  root_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  root_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  root_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  root_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  root_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  transactionHash?: InputMaybe<Scalars['mumbai_Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  transactionHash_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
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
  rootCount_?: InputMaybe<mumbai_RootCount_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<mumbai_BlockChangedFilter>;
};

export type mumbai_OriginMessage_orderBy =
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

export type mumbai_OriginTransfer = {
  id: Scalars['ID'];
  chainId?: Maybe<Scalars['BigInt']>;
  transferId?: Maybe<Scalars['mumbai_Bytes']>;
  nonce?: Maybe<Scalars['BigInt']>;
  status?: Maybe<mumbai_TransferStatus>;
  messageHash?: Maybe<Scalars['mumbai_Bytes']>;
  originDomain?: Maybe<Scalars['BigInt']>;
  destinationDomain?: Maybe<Scalars['BigInt']>;
  canonicalDomain?: Maybe<Scalars['BigInt']>;
  to?: Maybe<Scalars['mumbai_Bytes']>;
  delegate?: Maybe<Scalars['mumbai_Bytes']>;
  receiveLocal?: Maybe<Scalars['Boolean']>;
  callData?: Maybe<Scalars['mumbai_Bytes']>;
  slippage?: Maybe<Scalars['BigInt']>;
  originSender?: Maybe<Scalars['mumbai_Bytes']>;
  bridgedAmt?: Maybe<Scalars['BigInt']>;
  normalizedIn?: Maybe<Scalars['BigInt']>;
  canonicalId?: Maybe<Scalars['mumbai_Bytes']>;
  asset?: Maybe<mumbai_Asset>;
  transacting?: Maybe<Scalars['mumbai_Bytes']>;
  message?: Maybe<mumbai_OriginMessage>;
  relayerFee?: Maybe<Scalars['BigInt']>;
  caller?: Maybe<Scalars['mumbai_Bytes']>;
  transactionHash?: Maybe<Scalars['mumbai_Bytes']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  gasPrice?: Maybe<Scalars['BigInt']>;
  gasLimit?: Maybe<Scalars['BigInt']>;
  blockNumber?: Maybe<Scalars['BigInt']>;
  txOrigin?: Maybe<Scalars['mumbai_Bytes']>;
};

export type mumbai_OriginTransfer_filter = {
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
  transferId?: InputMaybe<Scalars['mumbai_Bytes']>;
  transferId_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  transferId_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  transferId_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  transferId_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  transferId_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  nonce?: InputMaybe<Scalars['BigInt']>;
  nonce_not?: InputMaybe<Scalars['BigInt']>;
  nonce_gt?: InputMaybe<Scalars['BigInt']>;
  nonce_lt?: InputMaybe<Scalars['BigInt']>;
  nonce_gte?: InputMaybe<Scalars['BigInt']>;
  nonce_lte?: InputMaybe<Scalars['BigInt']>;
  nonce_in?: InputMaybe<Array<Scalars['BigInt']>>;
  nonce_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  status?: InputMaybe<mumbai_TransferStatus>;
  status_not?: InputMaybe<mumbai_TransferStatus>;
  status_in?: InputMaybe<Array<mumbai_TransferStatus>>;
  status_not_in?: InputMaybe<Array<mumbai_TransferStatus>>;
  messageHash?: InputMaybe<Scalars['mumbai_Bytes']>;
  messageHash_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  messageHash_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  messageHash_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  messageHash_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  messageHash_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
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
  to?: InputMaybe<Scalars['mumbai_Bytes']>;
  to_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  to_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  to_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  to_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  delegate?: InputMaybe<Scalars['mumbai_Bytes']>;
  delegate_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  delegate_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  delegate_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  delegate_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  delegate_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  receiveLocal?: InputMaybe<Scalars['Boolean']>;
  receiveLocal_not?: InputMaybe<Scalars['Boolean']>;
  receiveLocal_in?: InputMaybe<Array<Scalars['Boolean']>>;
  receiveLocal_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  callData?: InputMaybe<Scalars['mumbai_Bytes']>;
  callData_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  callData_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  callData_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  callData_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  callData_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  slippage?: InputMaybe<Scalars['BigInt']>;
  slippage_not?: InputMaybe<Scalars['BigInt']>;
  slippage_gt?: InputMaybe<Scalars['BigInt']>;
  slippage_lt?: InputMaybe<Scalars['BigInt']>;
  slippage_gte?: InputMaybe<Scalars['BigInt']>;
  slippage_lte?: InputMaybe<Scalars['BigInt']>;
  slippage_in?: InputMaybe<Array<Scalars['BigInt']>>;
  slippage_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  originSender?: InputMaybe<Scalars['mumbai_Bytes']>;
  originSender_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  originSender_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  originSender_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  originSender_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  originSender_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
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
  canonicalId?: InputMaybe<Scalars['mumbai_Bytes']>;
  canonicalId_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  canonicalId_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  canonicalId_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  canonicalId_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  canonicalId_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
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
  asset_?: InputMaybe<mumbai_Asset_filter>;
  transacting?: InputMaybe<Scalars['mumbai_Bytes']>;
  transacting_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  transacting_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  transacting_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  transacting_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  transacting_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
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
  message_?: InputMaybe<mumbai_OriginMessage_filter>;
  relayerFee?: InputMaybe<Scalars['BigInt']>;
  relayerFee_not?: InputMaybe<Scalars['BigInt']>;
  relayerFee_gt?: InputMaybe<Scalars['BigInt']>;
  relayerFee_lt?: InputMaybe<Scalars['BigInt']>;
  relayerFee_gte?: InputMaybe<Scalars['BigInt']>;
  relayerFee_lte?: InputMaybe<Scalars['BigInt']>;
  relayerFee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  relayerFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  caller?: InputMaybe<Scalars['mumbai_Bytes']>;
  caller_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  caller_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  caller_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  transactionHash?: InputMaybe<Scalars['mumbai_Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  transactionHash_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
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
  txOrigin?: InputMaybe<Scalars['mumbai_Bytes']>;
  txOrigin_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  txOrigin_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  txOrigin_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  txOrigin_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  txOrigin_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<mumbai_BlockChangedFilter>;
};

export type mumbai_OriginTransfer_orderBy =
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

export type mumbai_PooledToken = {
  id: Scalars['ID'];
  asset: Scalars['mumbai_Bytes'];
};

export type mumbai_PooledToken_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  asset?: InputMaybe<Scalars['mumbai_Bytes']>;
  asset_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  asset_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  asset_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  asset_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  asset_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<mumbai_BlockChangedFilter>;
};

export type mumbai_PooledToken_orderBy =
  | 'id'
  | 'asset';

export type Query = {
  mumbai_asset?: Maybe<mumbai_Asset>;
  mumbai_assets: Array<mumbai_Asset>;
  mumbai_assetBalance?: Maybe<mumbai_AssetBalance>;
  mumbai_assetBalances: Array<mumbai_AssetBalance>;
  mumbai_router?: Maybe<mumbai_Router>;
  mumbai_routers: Array<mumbai_Router>;
  mumbai_setting?: Maybe<mumbai_Setting>;
  mumbai_settings: Array<mumbai_Setting>;
  mumbai_relayer?: Maybe<mumbai_Relayer>;
  mumbai_relayers: Array<mumbai_Relayer>;
  mumbai_transferRelayerFee?: Maybe<mumbai_TransferRelayerFee>;
  mumbai_transferRelayerFees: Array<mumbai_TransferRelayerFee>;
  mumbai_sequencer?: Maybe<mumbai_Sequencer>;
  mumbai_sequencers: Array<mumbai_Sequencer>;
  mumbai_originTransfer?: Maybe<mumbai_OriginTransfer>;
  mumbai_originTransfers: Array<mumbai_OriginTransfer>;
  mumbai_destinationTransfer?: Maybe<mumbai_DestinationTransfer>;
  mumbai_destinationTransfers: Array<mumbai_DestinationTransfer>;
  mumbai_originMessage?: Maybe<mumbai_OriginMessage>;
  mumbai_originMessages: Array<mumbai_OriginMessage>;
  mumbai_aggregateRoot?: Maybe<mumbai_AggregateRoot>;
  mumbai_aggregateRoots: Array<mumbai_AggregateRoot>;
  mumbai_connectorMeta?: Maybe<mumbai_ConnectorMeta>;
  mumbai_connectorMetas: Array<mumbai_ConnectorMeta>;
  mumbai_rootCount?: Maybe<mumbai_RootCount>;
  mumbai_rootCounts: Array<mumbai_RootCount>;
  mumbai_rootMessageSent?: Maybe<mumbai_RootMessageSent>;
  mumbai_rootMessageSents: Array<mumbai_RootMessageSent>;
  mumbai_stableSwap?: Maybe<mumbai_StableSwap>;
  mumbai_stableSwaps: Array<mumbai_StableSwap>;
  mumbai_pooledToken?: Maybe<mumbai_PooledToken>;
  mumbai_pooledTokens: Array<mumbai_PooledToken>;
  mumbai_stableSwapLiquidity?: Maybe<mumbai_StableSwapLiquidity>;
  mumbai_stableSwapLiquidities: Array<mumbai_StableSwapLiquidity>;
  /** Access to subgraph metadata */
  mumbai__meta?: Maybe<mumbai__Meta_>;
};


export type Querymumbai_assetArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_assetsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_Asset_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_Asset_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_assetBalanceArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_assetBalancesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_AssetBalance_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_AssetBalance_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_routerArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_routersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_Router_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_Router_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_settingArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_settingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_Setting_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_Setting_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_relayerArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_relayersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_Relayer_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_Relayer_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_transferRelayerFeeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_transferRelayerFeesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_TransferRelayerFee_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_TransferRelayerFee_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_sequencerArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_sequencersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_Sequencer_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_Sequencer_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_originTransferArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_originTransfersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_OriginTransfer_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_OriginTransfer_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_destinationTransferArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_destinationTransfersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_DestinationTransfer_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_DestinationTransfer_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_originMessageArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_originMessagesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_OriginMessage_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_OriginMessage_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_aggregateRootArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_aggregateRootsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_AggregateRoot_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_AggregateRoot_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_connectorMetaArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_connectorMetasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_ConnectorMeta_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_ConnectorMeta_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_rootCountArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_rootCountsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_RootCount_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_RootCount_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_rootMessageSentArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_rootMessageSentsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_RootMessageSent_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_RootMessageSent_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_stableSwapArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_stableSwapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_StableSwap_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_StableSwap_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_pooledTokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_pooledTokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_PooledToken_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_PooledToken_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_stableSwapLiquidityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai_stableSwapLiquiditiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_StableSwapLiquidity_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_StableSwapLiquidity_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Querymumbai__metaArgs = {
  block?: InputMaybe<mumbai_Block_height>;
};

export type mumbai_Relayer = {
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  relayer?: Maybe<Scalars['mumbai_Bytes']>;
};

export type mumbai_Relayer_filter = {
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
  relayer?: InputMaybe<Scalars['mumbai_Bytes']>;
  relayer_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  relayer_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  relayer_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  relayer_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  relayer_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<mumbai_BlockChangedFilter>;
};

export type mumbai_Relayer_orderBy =
  | 'id'
  | 'isActive'
  | 'relayer';

export type mumbai_RootCount = {
  id: Scalars['ID'];
  count?: Maybe<Scalars['BigInt']>;
};

export type mumbai_RootCount_filter = {
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
  _change_block?: InputMaybe<mumbai_BlockChangedFilter>;
};

export type mumbai_RootCount_orderBy =
  | 'id'
  | 'count';

export type mumbai_RootMessageSent = {
  id: Scalars['ID'];
  spokeDomain?: Maybe<Scalars['BigInt']>;
  hubDomain?: Maybe<Scalars['BigInt']>;
  root?: Maybe<Scalars['mumbai_Bytes']>;
  count?: Maybe<Scalars['BigInt']>;
  caller?: Maybe<Scalars['mumbai_Bytes']>;
  transactionHash?: Maybe<Scalars['mumbai_Bytes']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  gasPrice?: Maybe<Scalars['BigInt']>;
  gasLimit?: Maybe<Scalars['BigInt']>;
  blockNumber?: Maybe<Scalars['BigInt']>;
};

export type mumbai_RootMessageSent_filter = {
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
  root?: InputMaybe<Scalars['mumbai_Bytes']>;
  root_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  root_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  root_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  root_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  root_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  count?: InputMaybe<Scalars['BigInt']>;
  count_not?: InputMaybe<Scalars['BigInt']>;
  count_gt?: InputMaybe<Scalars['BigInt']>;
  count_lt?: InputMaybe<Scalars['BigInt']>;
  count_gte?: InputMaybe<Scalars['BigInt']>;
  count_lte?: InputMaybe<Scalars['BigInt']>;
  count_in?: InputMaybe<Array<Scalars['BigInt']>>;
  count_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  caller?: InputMaybe<Scalars['mumbai_Bytes']>;
  caller_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  caller_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  caller_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  transactionHash?: InputMaybe<Scalars['mumbai_Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  transactionHash_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
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
  _change_block?: InputMaybe<mumbai_BlockChangedFilter>;
};

export type mumbai_RootMessageSent_orderBy =
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

export type mumbai_Router = {
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  owner?: Maybe<Scalars['mumbai_Bytes']>;
  recipient?: Maybe<Scalars['mumbai_Bytes']>;
  proposedOwner?: Maybe<Scalars['mumbai_Bytes']>;
  proposedTimestamp?: Maybe<Scalars['BigInt']>;
  assetBalances: Array<mumbai_AssetBalance>;
};


export type mumbai_RouterassetBalancesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_AssetBalance_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_AssetBalance_filter>;
};

export type mumbai_Router_filter = {
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
  owner?: InputMaybe<Scalars['mumbai_Bytes']>;
  owner_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  owner_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  owner_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  recipient?: InputMaybe<Scalars['mumbai_Bytes']>;
  recipient_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  recipient_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  recipient_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  recipient_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  recipient_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  proposedOwner?: InputMaybe<Scalars['mumbai_Bytes']>;
  proposedOwner_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  proposedOwner_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  proposedOwner_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  proposedOwner_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  proposedOwner_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  proposedTimestamp?: InputMaybe<Scalars['BigInt']>;
  proposedTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  proposedTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  proposedTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  proposedTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  proposedTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  proposedTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  proposedTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  assetBalances_?: InputMaybe<mumbai_AssetBalance_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<mumbai_BlockChangedFilter>;
};

export type mumbai_Router_orderBy =
  | 'id'
  | 'isActive'
  | 'owner'
  | 'recipient'
  | 'proposedOwner'
  | 'proposedTimestamp'
  | 'assetBalances';

export type mumbai_Sequencer = {
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  sequencer?: Maybe<Scalars['mumbai_Bytes']>;
};

export type mumbai_Sequencer_filter = {
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
  sequencer?: InputMaybe<Scalars['mumbai_Bytes']>;
  sequencer_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  sequencer_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  sequencer_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  sequencer_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  sequencer_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<mumbai_BlockChangedFilter>;
};

export type mumbai_Sequencer_orderBy =
  | 'id'
  | 'isActive'
  | 'sequencer';

export type mumbai_Setting = {
  id: Scalars['ID'];
  maxRoutersPerTransfer: Scalars['BigInt'];
  caller: Scalars['mumbai_Bytes'];
};

export type mumbai_Setting_filter = {
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
  caller?: InputMaybe<Scalars['mumbai_Bytes']>;
  caller_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  caller_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  caller_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<mumbai_BlockChangedFilter>;
};

export type mumbai_Setting_orderBy =
  | 'id'
  | 'maxRoutersPerTransfer'
  | 'caller';

export type mumbai_StableSwap = {
  id: Scalars['ID'];
  isActive?: Maybe<Scalars['Boolean']>;
  key?: Maybe<Scalars['mumbai_Bytes']>;
  canonicalId?: Maybe<Scalars['mumbai_Bytes']>;
  domain?: Maybe<Scalars['BigInt']>;
  swapPool?: Maybe<Scalars['mumbai_Bytes']>;
  lpToken?: Maybe<Scalars['mumbai_Bytes']>;
  initialA?: Maybe<Scalars['BigInt']>;
  futureA?: Maybe<Scalars['BigInt']>;
  initialATime?: Maybe<Scalars['BigInt']>;
  futureATime?: Maybe<Scalars['BigInt']>;
  swapFee?: Maybe<Scalars['BigInt']>;
  adminFee?: Maybe<Scalars['BigInt']>;
  pooledTokens: Array<mumbai_PooledToken>;
  tokenPrecisionMultipliers?: Maybe<Array<Scalars['BigInt']>>;
  balances: Array<Scalars['BigInt']>;
  adminFees?: Maybe<Array<Scalars['BigInt']>>;
};


export type mumbai_StableSwappooledTokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_PooledToken_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_PooledToken_filter>;
};

export type mumbai_StableSwapLiquidity = {
  id: Scalars['ID'];
  provider: Scalars['mumbai_Bytes'];
  stableSwap: mumbai_StableSwap;
  tokenAmounts: Array<Scalars['BigInt']>;
  fees: Array<Scalars['BigInt']>;
  invariant?: Maybe<Scalars['BigInt']>;
  lpTokenSupply?: Maybe<Scalars['BigInt']>;
};

export type mumbai_StableSwapLiquidity_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  provider?: InputMaybe<Scalars['mumbai_Bytes']>;
  provider_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  provider_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  provider_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  provider_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  provider_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
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
  stableSwap_?: InputMaybe<mumbai_StableSwap_filter>;
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
  _change_block?: InputMaybe<mumbai_BlockChangedFilter>;
};

export type mumbai_StableSwapLiquidity_orderBy =
  | 'id'
  | 'provider'
  | 'stableSwap'
  | 'tokenAmounts'
  | 'fees'
  | 'invariant'
  | 'lpTokenSupply';

export type mumbai_StableSwap_filter = {
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
  key?: InputMaybe<Scalars['mumbai_Bytes']>;
  key_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  key_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  key_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  key_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  key_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  canonicalId?: InputMaybe<Scalars['mumbai_Bytes']>;
  canonicalId_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  canonicalId_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  canonicalId_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  canonicalId_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  canonicalId_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  domain?: InputMaybe<Scalars['BigInt']>;
  domain_not?: InputMaybe<Scalars['BigInt']>;
  domain_gt?: InputMaybe<Scalars['BigInt']>;
  domain_lt?: InputMaybe<Scalars['BigInt']>;
  domain_gte?: InputMaybe<Scalars['BigInt']>;
  domain_lte?: InputMaybe<Scalars['BigInt']>;
  domain_in?: InputMaybe<Array<Scalars['BigInt']>>;
  domain_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  swapPool?: InputMaybe<Scalars['mumbai_Bytes']>;
  swapPool_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  swapPool_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  swapPool_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  swapPool_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  swapPool_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  lpToken?: InputMaybe<Scalars['mumbai_Bytes']>;
  lpToken_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  lpToken_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  lpToken_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  lpToken_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  lpToken_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
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
  pooledTokens_?: InputMaybe<mumbai_PooledToken_filter>;
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
  _change_block?: InputMaybe<mumbai_BlockChangedFilter>;
};

export type mumbai_StableSwap_orderBy =
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
  mumbai_asset?: Maybe<mumbai_Asset>;
  mumbai_assets: Array<mumbai_Asset>;
  mumbai_assetBalance?: Maybe<mumbai_AssetBalance>;
  mumbai_assetBalances: Array<mumbai_AssetBalance>;
  mumbai_router?: Maybe<mumbai_Router>;
  mumbai_routers: Array<mumbai_Router>;
  mumbai_setting?: Maybe<mumbai_Setting>;
  mumbai_settings: Array<mumbai_Setting>;
  mumbai_relayer?: Maybe<mumbai_Relayer>;
  mumbai_relayers: Array<mumbai_Relayer>;
  mumbai_transferRelayerFee?: Maybe<mumbai_TransferRelayerFee>;
  mumbai_transferRelayerFees: Array<mumbai_TransferRelayerFee>;
  mumbai_sequencer?: Maybe<mumbai_Sequencer>;
  mumbai_sequencers: Array<mumbai_Sequencer>;
  mumbai_originTransfer?: Maybe<mumbai_OriginTransfer>;
  mumbai_originTransfers: Array<mumbai_OriginTransfer>;
  mumbai_destinationTransfer?: Maybe<mumbai_DestinationTransfer>;
  mumbai_destinationTransfers: Array<mumbai_DestinationTransfer>;
  mumbai_originMessage?: Maybe<mumbai_OriginMessage>;
  mumbai_originMessages: Array<mumbai_OriginMessage>;
  mumbai_aggregateRoot?: Maybe<mumbai_AggregateRoot>;
  mumbai_aggregateRoots: Array<mumbai_AggregateRoot>;
  mumbai_connectorMeta?: Maybe<mumbai_ConnectorMeta>;
  mumbai_connectorMetas: Array<mumbai_ConnectorMeta>;
  mumbai_rootCount?: Maybe<mumbai_RootCount>;
  mumbai_rootCounts: Array<mumbai_RootCount>;
  mumbai_rootMessageSent?: Maybe<mumbai_RootMessageSent>;
  mumbai_rootMessageSents: Array<mumbai_RootMessageSent>;
  mumbai_stableSwap?: Maybe<mumbai_StableSwap>;
  mumbai_stableSwaps: Array<mumbai_StableSwap>;
  mumbai_pooledToken?: Maybe<mumbai_PooledToken>;
  mumbai_pooledTokens: Array<mumbai_PooledToken>;
  mumbai_stableSwapLiquidity?: Maybe<mumbai_StableSwapLiquidity>;
  mumbai_stableSwapLiquidities: Array<mumbai_StableSwapLiquidity>;
  /** Access to subgraph metadata */
  mumbai__meta?: Maybe<mumbai__Meta_>;
};


export type Subscriptionmumbai_assetArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_assetsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_Asset_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_Asset_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_assetBalanceArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_assetBalancesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_AssetBalance_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_AssetBalance_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_routerArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_routersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_Router_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_Router_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_settingArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_settingsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_Setting_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_Setting_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_relayerArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_relayersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_Relayer_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_Relayer_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_transferRelayerFeeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_transferRelayerFeesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_TransferRelayerFee_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_TransferRelayerFee_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_sequencerArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_sequencersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_Sequencer_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_Sequencer_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_originTransferArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_originTransfersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_OriginTransfer_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_OriginTransfer_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_destinationTransferArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_destinationTransfersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_DestinationTransfer_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_DestinationTransfer_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_originMessageArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_originMessagesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_OriginMessage_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_OriginMessage_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_aggregateRootArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_aggregateRootsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_AggregateRoot_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_AggregateRoot_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_connectorMetaArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_connectorMetasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_ConnectorMeta_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_ConnectorMeta_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_rootCountArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_rootCountsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_RootCount_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_RootCount_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_rootMessageSentArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_rootMessageSentsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_RootMessageSent_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_RootMessageSent_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_stableSwapArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_stableSwapsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_StableSwap_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_StableSwap_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_pooledTokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_pooledTokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_PooledToken_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_PooledToken_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_stableSwapLiquidityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai_stableSwapLiquiditiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<mumbai_StableSwapLiquidity_orderBy>;
  orderDirection?: InputMaybe<mumbai_OrderDirection>;
  where?: InputMaybe<mumbai_StableSwapLiquidity_filter>;
  block?: InputMaybe<mumbai_Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptionmumbai__metaArgs = {
  block?: InputMaybe<mumbai_Block_height>;
};

export type mumbai_TransferRelayerFee = {
  id: Scalars['ID'];
  transferId: Scalars['mumbai_Bytes'];
  fee?: Maybe<Scalars['BigInt']>;
};

export type mumbai_TransferRelayerFee_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  transferId?: InputMaybe<Scalars['mumbai_Bytes']>;
  transferId_not?: InputMaybe<Scalars['mumbai_Bytes']>;
  transferId_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  transferId_not_in?: InputMaybe<Array<Scalars['mumbai_Bytes']>>;
  transferId_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  transferId_not_contains?: InputMaybe<Scalars['mumbai_Bytes']>;
  fee?: InputMaybe<Scalars['BigInt']>;
  fee_not?: InputMaybe<Scalars['BigInt']>;
  fee_gt?: InputMaybe<Scalars['BigInt']>;
  fee_lt?: InputMaybe<Scalars['BigInt']>;
  fee_gte?: InputMaybe<Scalars['BigInt']>;
  fee_lte?: InputMaybe<Scalars['BigInt']>;
  fee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<mumbai_BlockChangedFilter>;
};

export type mumbai_TransferRelayerFee_orderBy =
  | 'id'
  | 'transferId'
  | 'fee';

export type mumbai_TransferStatus =
  | 'XCalled'
  | 'Executed'
  | 'Reconciled'
  | 'CompletedSlow'
  | 'CompletedFast';

export type mumbai__Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['mumbai_Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type mumbai__Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: mumbai__Block_;
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
  mumbai_asset: InContextSdkMethod<Query['mumbai_asset'], Querymumbai_assetArgs, MeshContext>,
  /** null **/
  mumbai_assets: InContextSdkMethod<Query['mumbai_assets'], Querymumbai_assetsArgs, MeshContext>,
  /** null **/
  mumbai_assetBalance: InContextSdkMethod<Query['mumbai_assetBalance'], Querymumbai_assetBalanceArgs, MeshContext>,
  /** null **/
  mumbai_assetBalances: InContextSdkMethod<Query['mumbai_assetBalances'], Querymumbai_assetBalancesArgs, MeshContext>,
  /** null **/
  mumbai_router: InContextSdkMethod<Query['mumbai_router'], Querymumbai_routerArgs, MeshContext>,
  /** null **/
  mumbai_routers: InContextSdkMethod<Query['mumbai_routers'], Querymumbai_routersArgs, MeshContext>,
  /** null **/
  mumbai_setting: InContextSdkMethod<Query['mumbai_setting'], Querymumbai_settingArgs, MeshContext>,
  /** null **/
  mumbai_settings: InContextSdkMethod<Query['mumbai_settings'], Querymumbai_settingsArgs, MeshContext>,
  /** null **/
  mumbai_relayer: InContextSdkMethod<Query['mumbai_relayer'], Querymumbai_relayerArgs, MeshContext>,
  /** null **/
  mumbai_relayers: InContextSdkMethod<Query['mumbai_relayers'], Querymumbai_relayersArgs, MeshContext>,
  /** null **/
  mumbai_transferRelayerFee: InContextSdkMethod<Query['mumbai_transferRelayerFee'], Querymumbai_transferRelayerFeeArgs, MeshContext>,
  /** null **/
  mumbai_transferRelayerFees: InContextSdkMethod<Query['mumbai_transferRelayerFees'], Querymumbai_transferRelayerFeesArgs, MeshContext>,
  /** null **/
  mumbai_sequencer: InContextSdkMethod<Query['mumbai_sequencer'], Querymumbai_sequencerArgs, MeshContext>,
  /** null **/
  mumbai_sequencers: InContextSdkMethod<Query['mumbai_sequencers'], Querymumbai_sequencersArgs, MeshContext>,
  /** null **/
  mumbai_originTransfer: InContextSdkMethod<Query['mumbai_originTransfer'], Querymumbai_originTransferArgs, MeshContext>,
  /** null **/
  mumbai_originTransfers: InContextSdkMethod<Query['mumbai_originTransfers'], Querymumbai_originTransfersArgs, MeshContext>,
  /** null **/
  mumbai_destinationTransfer: InContextSdkMethod<Query['mumbai_destinationTransfer'], Querymumbai_destinationTransferArgs, MeshContext>,
  /** null **/
  mumbai_destinationTransfers: InContextSdkMethod<Query['mumbai_destinationTransfers'], Querymumbai_destinationTransfersArgs, MeshContext>,
  /** null **/
  mumbai_originMessage: InContextSdkMethod<Query['mumbai_originMessage'], Querymumbai_originMessageArgs, MeshContext>,
  /** null **/
  mumbai_originMessages: InContextSdkMethod<Query['mumbai_originMessages'], Querymumbai_originMessagesArgs, MeshContext>,
  /** null **/
  mumbai_aggregateRoot: InContextSdkMethod<Query['mumbai_aggregateRoot'], Querymumbai_aggregateRootArgs, MeshContext>,
  /** null **/
  mumbai_aggregateRoots: InContextSdkMethod<Query['mumbai_aggregateRoots'], Querymumbai_aggregateRootsArgs, MeshContext>,
  /** null **/
  mumbai_connectorMeta: InContextSdkMethod<Query['mumbai_connectorMeta'], Querymumbai_connectorMetaArgs, MeshContext>,
  /** null **/
  mumbai_connectorMetas: InContextSdkMethod<Query['mumbai_connectorMetas'], Querymumbai_connectorMetasArgs, MeshContext>,
  /** null **/
  mumbai_rootCount: InContextSdkMethod<Query['mumbai_rootCount'], Querymumbai_rootCountArgs, MeshContext>,
  /** null **/
  mumbai_rootCounts: InContextSdkMethod<Query['mumbai_rootCounts'], Querymumbai_rootCountsArgs, MeshContext>,
  /** null **/
  mumbai_rootMessageSent: InContextSdkMethod<Query['mumbai_rootMessageSent'], Querymumbai_rootMessageSentArgs, MeshContext>,
  /** null **/
  mumbai_rootMessageSents: InContextSdkMethod<Query['mumbai_rootMessageSents'], Querymumbai_rootMessageSentsArgs, MeshContext>,
  /** null **/
  mumbai_stableSwap: InContextSdkMethod<Query['mumbai_stableSwap'], Querymumbai_stableSwapArgs, MeshContext>,
  /** null **/
  mumbai_stableSwaps: InContextSdkMethod<Query['mumbai_stableSwaps'], Querymumbai_stableSwapsArgs, MeshContext>,
  /** null **/
  mumbai_pooledToken: InContextSdkMethod<Query['mumbai_pooledToken'], Querymumbai_pooledTokenArgs, MeshContext>,
  /** null **/
  mumbai_pooledTokens: InContextSdkMethod<Query['mumbai_pooledTokens'], Querymumbai_pooledTokensArgs, MeshContext>,
  /** null **/
  mumbai_stableSwapLiquidity: InContextSdkMethod<Query['mumbai_stableSwapLiquidity'], Querymumbai_stableSwapLiquidityArgs, MeshContext>,
  /** null **/
  mumbai_stableSwapLiquidities: InContextSdkMethod<Query['mumbai_stableSwapLiquidities'], Querymumbai_stableSwapLiquiditiesArgs, MeshContext>,
  /** Access to subgraph metadata **/
  mumbai__meta: InContextSdkMethod<Query['mumbai__meta'], Querymumbai__metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  mumbai_asset: InContextSdkMethod<Subscription['mumbai_asset'], Subscriptionmumbai_assetArgs, MeshContext>,
  /** null **/
  mumbai_assets: InContextSdkMethod<Subscription['mumbai_assets'], Subscriptionmumbai_assetsArgs, MeshContext>,
  /** null **/
  mumbai_assetBalance: InContextSdkMethod<Subscription['mumbai_assetBalance'], Subscriptionmumbai_assetBalanceArgs, MeshContext>,
  /** null **/
  mumbai_assetBalances: InContextSdkMethod<Subscription['mumbai_assetBalances'], Subscriptionmumbai_assetBalancesArgs, MeshContext>,
  /** null **/
  mumbai_router: InContextSdkMethod<Subscription['mumbai_router'], Subscriptionmumbai_routerArgs, MeshContext>,
  /** null **/
  mumbai_routers: InContextSdkMethod<Subscription['mumbai_routers'], Subscriptionmumbai_routersArgs, MeshContext>,
  /** null **/
  mumbai_setting: InContextSdkMethod<Subscription['mumbai_setting'], Subscriptionmumbai_settingArgs, MeshContext>,
  /** null **/
  mumbai_settings: InContextSdkMethod<Subscription['mumbai_settings'], Subscriptionmumbai_settingsArgs, MeshContext>,
  /** null **/
  mumbai_relayer: InContextSdkMethod<Subscription['mumbai_relayer'], Subscriptionmumbai_relayerArgs, MeshContext>,
  /** null **/
  mumbai_relayers: InContextSdkMethod<Subscription['mumbai_relayers'], Subscriptionmumbai_relayersArgs, MeshContext>,
  /** null **/
  mumbai_transferRelayerFee: InContextSdkMethod<Subscription['mumbai_transferRelayerFee'], Subscriptionmumbai_transferRelayerFeeArgs, MeshContext>,
  /** null **/
  mumbai_transferRelayerFees: InContextSdkMethod<Subscription['mumbai_transferRelayerFees'], Subscriptionmumbai_transferRelayerFeesArgs, MeshContext>,
  /** null **/
  mumbai_sequencer: InContextSdkMethod<Subscription['mumbai_sequencer'], Subscriptionmumbai_sequencerArgs, MeshContext>,
  /** null **/
  mumbai_sequencers: InContextSdkMethod<Subscription['mumbai_sequencers'], Subscriptionmumbai_sequencersArgs, MeshContext>,
  /** null **/
  mumbai_originTransfer: InContextSdkMethod<Subscription['mumbai_originTransfer'], Subscriptionmumbai_originTransferArgs, MeshContext>,
  /** null **/
  mumbai_originTransfers: InContextSdkMethod<Subscription['mumbai_originTransfers'], Subscriptionmumbai_originTransfersArgs, MeshContext>,
  /** null **/
  mumbai_destinationTransfer: InContextSdkMethod<Subscription['mumbai_destinationTransfer'], Subscriptionmumbai_destinationTransferArgs, MeshContext>,
  /** null **/
  mumbai_destinationTransfers: InContextSdkMethod<Subscription['mumbai_destinationTransfers'], Subscriptionmumbai_destinationTransfersArgs, MeshContext>,
  /** null **/
  mumbai_originMessage: InContextSdkMethod<Subscription['mumbai_originMessage'], Subscriptionmumbai_originMessageArgs, MeshContext>,
  /** null **/
  mumbai_originMessages: InContextSdkMethod<Subscription['mumbai_originMessages'], Subscriptionmumbai_originMessagesArgs, MeshContext>,
  /** null **/
  mumbai_aggregateRoot: InContextSdkMethod<Subscription['mumbai_aggregateRoot'], Subscriptionmumbai_aggregateRootArgs, MeshContext>,
  /** null **/
  mumbai_aggregateRoots: InContextSdkMethod<Subscription['mumbai_aggregateRoots'], Subscriptionmumbai_aggregateRootsArgs, MeshContext>,
  /** null **/
  mumbai_connectorMeta: InContextSdkMethod<Subscription['mumbai_connectorMeta'], Subscriptionmumbai_connectorMetaArgs, MeshContext>,
  /** null **/
  mumbai_connectorMetas: InContextSdkMethod<Subscription['mumbai_connectorMetas'], Subscriptionmumbai_connectorMetasArgs, MeshContext>,
  /** null **/
  mumbai_rootCount: InContextSdkMethod<Subscription['mumbai_rootCount'], Subscriptionmumbai_rootCountArgs, MeshContext>,
  /** null **/
  mumbai_rootCounts: InContextSdkMethod<Subscription['mumbai_rootCounts'], Subscriptionmumbai_rootCountsArgs, MeshContext>,
  /** null **/
  mumbai_rootMessageSent: InContextSdkMethod<Subscription['mumbai_rootMessageSent'], Subscriptionmumbai_rootMessageSentArgs, MeshContext>,
  /** null **/
  mumbai_rootMessageSents: InContextSdkMethod<Subscription['mumbai_rootMessageSents'], Subscriptionmumbai_rootMessageSentsArgs, MeshContext>,
  /** null **/
  mumbai_stableSwap: InContextSdkMethod<Subscription['mumbai_stableSwap'], Subscriptionmumbai_stableSwapArgs, MeshContext>,
  /** null **/
  mumbai_stableSwaps: InContextSdkMethod<Subscription['mumbai_stableSwaps'], Subscriptionmumbai_stableSwapsArgs, MeshContext>,
  /** null **/
  mumbai_pooledToken: InContextSdkMethod<Subscription['mumbai_pooledToken'], Subscriptionmumbai_pooledTokenArgs, MeshContext>,
  /** null **/
  mumbai_pooledTokens: InContextSdkMethod<Subscription['mumbai_pooledTokens'], Subscriptionmumbai_pooledTokensArgs, MeshContext>,
  /** null **/
  mumbai_stableSwapLiquidity: InContextSdkMethod<Subscription['mumbai_stableSwapLiquidity'], Subscriptionmumbai_stableSwapLiquidityArgs, MeshContext>,
  /** null **/
  mumbai_stableSwapLiquidities: InContextSdkMethod<Subscription['mumbai_stableSwapLiquidities'], Subscriptionmumbai_stableSwapLiquiditiesArgs, MeshContext>,
  /** Access to subgraph metadata **/
  mumbai__meta: InContextSdkMethod<Subscription['mumbai__meta'], Subscriptionmumbai__metaArgs, MeshContext>
  };

  export type Context = {
      ["Connext_Mumbai"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}

import { gql } from "graphql-request";
import { SubgraphQueryMetaParams, XTransferStatus, SubgraphQueryByTimestampMetaParams } from "@connext/nxtp-utils";

import { getContext } from "../../reader";

export const ORIGIN_TRANSFER_ENTITY = `
      id
      # Meta Data
      chainId
      transferId
      nonce
      # call params
      to
      callData
      originDomain
      destinationDomain
      forceSlow
      receiveLocal
      recovery
      callback
      callbackFee
      # Asset Data
      transactingAsset
      transactingAmount
      bridgedAsset
      bridgedAmount
      # Event Data
      relayerFee
      message
      # XCalled Transaction
      caller
      transactionHash
      timestamp
      gasPrice
      gasLimit
      blockNumber
`;

export const DESTINATION_TRANSFER_ENTITY = `
      id
      # Meta Data
      chainId
      transferId
      nonce
      to
      callData
      originDomain
      destinationDomain
      forceSlow
      receiveLocal
      recovery
      callback
      callbackFee
      # Asset Data
      localAsset
      localAmount
      transactingAsset
      transactingAmount
      sponsorVaultRelayerFee
      # Executed event Data
      status
      routers {
        id
      }
      originSender
      # Executed Transaction
      executedCaller
      executedTransactionHash
      executedTimestamp
      executedGasPrice
      executedGasLimit
      executedBlockNumber
      # Reconciled Transaction
      reconciledCaller
      reconciledTransactionHash
      reconciledTimestamp
      reconciledGasPrice
      reconciledGasLimit
      reconciledBlockNumber
`;

export const BLOCK_NUMBER_ENTITY = `
      block {
        number
      }
`;
const lastedBlockNumberQuery = (prefix: string): string => {
  return `${prefix}__meta { ${BLOCK_NUMBER_ENTITY}}`;
};
export const getLastestBlockNumberQuery = (prefixes: string[]): string => {
  let combinedQuery = "";
  for (const prefix of prefixes) {
    combinedQuery += lastedBlockNumberQuery(prefix);
  }

  return gql`    
    query GetBlockNumber { 
      ${combinedQuery}
  }`;
};
export const getAssetBalanceQuery = (prefix: string, router: string, local: string): string => {
  const queryString = `
    ${prefix}_assetBalance(id: "${local}-${router}") {
      amount
      asset {
        canonicalId
        canonicalDomain
        local
        adoptedAsset
        blockNumber
      }
    }`;
  return gql`
    query GetAssetBalance {
      ${queryString}
    }
  `;
};

export const getAssetBalancesQuery = (prefix: string, router: string): string => {
  const queryString = `
    ${prefix}_assetBalances(where: { router: "${router}" }) {
      amount
      asset {
          canonicalId
          canonicalDomain
          local
          adoptedAsset
          blockNumber
      }
    }`;

  return gql`
      query GetAssetBalance {
        ${queryString}
      }
    `;
};

export const getAssetBalancesAllRoutersQuery = (prefix: string): string => {
  const queryString = `
    ${prefix}_routers {
      id
      assetBalances {
        amount
        asset {
          local
          adoptedAsset
          canonicalId
          canonicalDomain
          blockNumber
        }
      }
    }`;

  return gql`
      query getAssetBalancesAllRoutersQuery {
        ${queryString}
      }
    `;
};

export const getRouterQuery = (prefix: string, router: string): string => {
  const queryString = `
    ${prefix}_router(id: "${router}") {
      id
    }`;

  return gql`
    query GetRouter {
      ${queryString}
    }
  `;
};

export const getAssetByLocalQuery = (prefix: string, local: string): string => {
  const queryString = `
    ${prefix}_assets(where: { local: "${local}" }) {
      id
      local
      adoptedAsset
      canonicalId
      canonicalDomain
      blockNumber
    }`;
  return gql`
    query GetAssetByLocal {
      ${queryString}
    }
  `;
};

export const getAssetByCanonicalIdQuery = (prefix: string, canonicalId: string): string => {
  const str = `
    ${prefix}_assets(where: { canonicalId: "${canonicalId}" }, orderBy: blockNumber, orderDirection: desc) {
            id
            local
            adoptedAsset
            canonicalId
            canonicalDomain
            blockNumber
        }
    `;

  return gql`
    query GetAssetByCanonicalId {
        ${str}
    }
  `;
};

export const getOriginTransfersByIdsQuery = (prefix: string, transferIds: string[]): string => {
  const queryStr = `
    ${prefix}_originTransfers(where: { transferId_in: [${transferIds}] }) {${ORIGIN_TRANSFER_ENTITY}}`;
  return gql`
    query GetOriginTransfers {
      ${queryStr}
    }
  `;
};

export const getOriginTransfersByTransactionHashesQuery = (prefix: string, hashes: string[]): string => {
  const queryStr = `
    ${prefix}_originTransfers(where: { transactionHash_in: [${hashes}] }) {${ORIGIN_TRANSFER_ENTITY}}`;
  return gql`
    query GetOriginTransfers {
      ${queryStr}
    }
  `;
};

const originTransferQueryString = (
  prefix: string,
  originDomain: string,
  fromNonce: number,
  destinationDomains: string[],
  maxBlockNumber?: number,
  orderDirection: "asc" | "desc" = "desc",
) => {
  return `${prefix}_originTransfers(
    where: { 
      originDomain: ${originDomain}, 
      nonce_gte: ${fromNonce}, 
      destinationDomain_in: [${destinationDomains}] 
      ${maxBlockNumber ? `, blockNumber_lte: ${maxBlockNumber}` : ""} 
    }, 
    orderBy: blockNumber, 
    orderDirection: ${orderDirection}
  ) {${ORIGIN_TRANSFER_ENTITY}}`;
};

export const getOriginTransfersQuery = (agents: Map<string, SubgraphQueryMetaParams>): string => {
  const { config } = getContext();

  let combinedQuery = "";
  const domains = Object.keys(config.sources);
  for (const domain of domains) {
    const prefix = config.sources[domain].prefix;
    if (agents.has(domain)) {
      combinedQuery += originTransferQueryString(
        prefix,
        domain,
        agents.get(domain)!.latestNonce,
        domains,
        agents.get(domain)!.maxBlockNumber,
        agents.get(domain)!.orderDirection,
      );
    } else {
      console.log(`No agents for domain: ${domain}`);
    }
  }

  return gql`
    query GetOriginTransfers { 
        ${combinedQuery}
      }
  `;
};

const originByXCalledTimestampQueryString = (
  prefix: string,
  originDomain: string,
  fromTimestamp: number,
  destinationDomains: string[],
  maxBlockNumber?: number,
  orderDirection: "asc" | "desc" = "desc",
) => {
  return `${prefix}_originTransfers(
    where: {
      originDomain: ${originDomain},
      timestamp_gte: ${fromTimestamp},
      destinationDomain_in: [${destinationDomains}]
      ${maxBlockNumber ? `, blockNumber_lte: ${maxBlockNumber}` : ""}
    },
    orderBy: timestamp,
    orderDirection: ${orderDirection}
  ) {${ORIGIN_TRANSFER_ENTITY}}`;
};

export const getOriginTransfersByXCallTimestampQuery = (
  params: Map<string, SubgraphQueryByTimestampMetaParams>,
): string => {
  const { config } = getContext();

  let combinedQuery = "";
  const domains = Object.keys(config.sources);
  for (const domain of domains) {
    const prefix = config.sources[domain].prefix;
    if (params.has(domain)) {
      combinedQuery += originByXCalledTimestampQueryString(
        prefix,
        domain,
        params.get(domain)!.fromTimestamp,
        domains,
        params.get(domain)!.maxBlockNumber,
        params.get(domain)!.orderDirection,
      );
    } else {
      console.log(`No agents for domain: ${domain}`);
    }
  }

  return gql`
    query GetOriginTransfersByXCallTimestamp {
        ${combinedQuery}
      }
  `;
};

const destinationTransfersByExecuteTimestampQueryString = (
  prefix: string,
  fromTimestamp: number,
  destinationDomains: string[],
  maxBlockNumber?: number,
  orderDirection: "asc" | "desc" = "desc",
) => {
  return `
  ${prefix}_destinationTransfers(
    where: { 
      executedTimestamp_gte: ${fromTimestamp}, 
      destinationDomain_in: [${destinationDomains}] 
      ${maxBlockNumber ? `, executedBlockNumber_lte: ${maxBlockNumber}` : ""} 
    }, 
    orderBy: executedTimestamp, 
    orderDirection: ${orderDirection}
  ) {${DESTINATION_TRANSFER_ENTITY}}`;
};

export const getDestinationTransfersByExecuteTimestampQuery = (
  params: Map<string, SubgraphQueryByTimestampMetaParams>,
): string => {
  const { config } = getContext();

  let combinedQuery = "";
  const domains = Object.keys(config.sources);
  for (const domain of domains) {
    const prefix = config.sources[domain].prefix;
    if (params.has(domain)) {
      combinedQuery += destinationTransfersByExecuteTimestampQueryString(
        prefix,
        params.get(domain)!.fromTimestamp,
        domains,
        params.get(domain)!.maxBlockNumber,
        params.get(domain)!.orderDirection,
      );
    } else {
      console.log(`No agents for domain: ${domain}`);
    }
  }

  return gql`
    query GetDestinationTransfersByExecuteTimestamp { 
        ${combinedQuery}
      }
  `;
};

const destinationTransfersByReconcileTimestampQueryString = (
  prefix: string,
  fromTimestamp: number,
  destinationDomains: string[],
  maxBlockNumber?: number,
  orderDirection: "asc" | "desc" = "desc",
) => {
  return `
  ${prefix}_destinationTransfers(
    where: { 
      reconciledTimestamp_gte: ${fromTimestamp}, 
      destinationDomain_in: [${destinationDomains}] 
      ${maxBlockNumber ? `, reconciledBlockNumber_lte: ${maxBlockNumber}` : ""} 
    }, 
    orderBy: executedTimestamp, 
    orderDirection: ${orderDirection}
  ) {${DESTINATION_TRANSFER_ENTITY}}`;
};

export const getDestinationTransfersByReconcileTimestampQuery = (
  params: Map<string, SubgraphQueryByTimestampMetaParams>,
): string => {
  const { config } = getContext();

  let combinedQuery = "";
  const domains = Object.keys(config.sources);
  for (const domain of domains) {
    const prefix = config.sources[domain].prefix;
    if (params.has(domain)) {
      combinedQuery += destinationTransfersByReconcileTimestampQueryString(
        prefix,
        params.get(domain)!.fromTimestamp,
        domains,
        params.get(domain)!.maxBlockNumber,
        params.get(domain)!.orderDirection,
      );
    } else {
      console.log(`No agents for domain: ${domain}`);
    }
  }

  return gql`
    query GetDestinationTransfersByReconcileTimestamp { 
        ${combinedQuery}
      }
  `;
};

const destinationTransfersByIdsQueryString = (
  prefix: string,
  transferIds: string[],
  maxBlockNumber?: number,
  status?: XTransferStatus,
) => {
  return `${prefix}_destinationTransfers ( where: { transferId_in: [${transferIds}] ${
    maxBlockNumber ? `, executedBlockNumber_lte: ${maxBlockNumber}, reconciledBlockNumber_lte: ${maxBlockNumber}` : ""
  } ${status ? `, status: ${status}` : ""}}, orderBy: nonce, orderDirection: desc) {${DESTINATION_TRANSFER_ENTITY}}`;
};

export const getDestinationTransfersByIdsQuery = (prefix: string, transferIds: string[]): string => {
  const queryStr = `
    ${prefix}_destinationTransfers(where: { transferId_in: [${transferIds}] }) {${DESTINATION_TRANSFER_ENTITY}}`;
  return gql`
    query GetDestinationTransfers {
      ${queryStr}
    }
  `;
};

export const getDestinationTransfersByDomainAndIdsQuery = (txIdsByDestinationDomain: Map<string, string[]>): string => {
  const { config } = getContext();
  let combinedQuery = "";
  for (const destinationDomain of txIdsByDestinationDomain.keys()) {
    const prefix = config.sources[destinationDomain].prefix;
    combinedQuery += destinationTransfersByIdsQueryString(prefix, txIdsByDestinationDomain.get(destinationDomain)!);
  }
  return gql`
    query GetDestinationTransfers { 
        ${combinedQuery}
      }
  `;
};

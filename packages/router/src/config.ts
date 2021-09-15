///NXTP Config Generator based on vector/modules/router/src/config.ts
import * as fs from "fs";

import { Type, Static } from "@sinclair/typebox";
import { utils } from "ethers";
import {
  ajv,
  ChainData,
  getChainData,
  getDeployedSubgraphUri,
  isNode,
  NATS_AUTH_URL,
  NATS_AUTH_URL_LOCAL,
  NATS_AUTH_URL_TESTNET,
  NATS_CLUSTER_URL,
  NATS_CLUSTER_URL_LOCAL,
  NATS_CLUSTER_URL_TESTNET,
  NATS_WS_URL,
  NATS_WS_URL_LOCAL,
  NATS_WS_URL_TESTNET,
  TAddress,
  TChainId,
  TIntegerString,
} from "@connext/nxtp-utils";
import { config as dotenvConfig } from "dotenv";
import contractDeployments from "@connext/nxtp-contracts/deployments.json";

const MIN_GAS = utils.parseEther("0.1");
const MIN_RELAYER_FEE = "0"; // relayerFee is in respective chain native asset unit
const MIN_SUBGRAPH_SYNC_BUFFER = 25;

dotenvConfig();

/**
 * Returns the address of the `TransactionManager` deployed to the provided chain, or undefined if it has not been deployed
 *
 * @param chainId - The chain you want the address on
 * @returns The deployed address or `undefined` if it has not been deployed yet
 */
export const getDeployedTransactionManagerContract = (chainId: number): { address: string; abi: any } | undefined => {
  const record = (contractDeployments as any)[String(chainId)] ?? {};
  const name = Object.keys(record)[0];
  if (!name) {
    return undefined;
  }
  const contract = record[name]?.contracts?.TransactionManager;
  return { address: contract.address, abi: contract.abi };
};

export const TChainConfig = Type.Object({
  providers: Type.Array(Type.String()),
  confirmations: Type.Number({ minimum: 1 }),
  defaultInitialGas: Type.Optional(TIntegerString),
  subgraph: Type.String(),
  transactionManagerAddress: Type.String(),
  minGas: Type.String(),
  gasStations: Type.Array(Type.String()),
  safeRelayerFee: Type.String(),
  subgraphSyncBuffer: Type.Number({ minimum: 1 }), // If subgraph is out of sync by this number, will not process actions
});

export const TSwapPool = Type.Object({
  name: Type.Optional(Type.String()),
  assets: Type.Array(
    Type.Object({
      chainId: TChainId,
      assetId: TAddress,
    }),
  ),
});

export const NxtpRouterConfigSchema = Type.Object({
  adminToken: Type.String(),
  chainConfig: Type.Record(TIntegerString, TChainConfig),
  logLevel: Type.Union([
    Type.Literal("fatal"),
    Type.Literal("error"),
    Type.Literal("warn"),
    Type.Literal("info"),
    Type.Literal("debug"),
    Type.Literal("trace"),
    Type.Literal("silent"),
  ]),
  natsUrl: Type.String(),
  authUrl: Type.String(),
  mnemonic: Type.String(),
  swapPools: Type.Array(TSwapPool),
  port: Type.Number({ minimum: 1, maximum: 65535 }),
  host: Type.String({ format: "ipv4" }),
  cleanUpMode: Type.Boolean(),
  diagnosticMode: Type.Boolean(),
});

export type NxtpRouterConfig = Static<typeof NxtpRouterConfigSchema>;

/**
 * Gets and validates the router config from the environment.
 *
 * @returns The router config with sensible defaults
 */
export const getEnvConfig = (crossChainData: Map<string, any> | undefined): NxtpRouterConfig => {
  let configJson: Record<string, any> = {};
  let configFile: any = {};

  try {
    let json: string;

    if (process.env.NXTP_CONFIG_FILE) {
      json = fs.readFileSync(process.env.NXTP_CONFIG_FILE, "utf-8");
    } else {
      json = fs.readFileSync("config.json", "utf-8");
    }
    if (json) {
      configFile = JSON.parse(json);
    }
  } catch (e) {}
  // return configFile;

  if (process.env.NXTP_CONFIG) {
    try {
      configJson = JSON.parse(process.env.NXTP_CONFIG || "");
    } catch (e) {
      console.warn("No NXTP_CONFIG exists...");
    }
  }

  const network: "testnet" | "mainnet" | "local" =
    process.env.NXTP_NETWORK || configJson.network || configFile.network || "mainnet";
  let authUrl = process.env.NXTP_AUTH_URL || configJson.authUrl || configFile.authUrl;
  let natsUrl = process.env.NXTP_NATS_URL || configJson.natsUrl || configFile.natsUrl;
  switch (network) {
    case "mainnet": {
      natsUrl = natsUrl ?? (isNode() ? NATS_CLUSTER_URL : NATS_WS_URL);
      authUrl = authUrl ?? NATS_AUTH_URL;
      break;
    }
    case "testnet": {
      natsUrl = natsUrl ?? (isNode() ? NATS_CLUSTER_URL_TESTNET : NATS_WS_URL_TESTNET);
      authUrl = authUrl ?? NATS_AUTH_URL_TESTNET;
      break;
    }
    case "local": {
      natsUrl = natsUrl ?? (isNode() ? NATS_CLUSTER_URL_LOCAL : NATS_WS_URL_LOCAL);
      authUrl = authUrl ?? NATS_AUTH_URL_LOCAL;
      break;
    }
  }

  const nxtpConfig: NxtpRouterConfig = {
    mnemonic: process.env.NXTP_MNEMONIC || configJson.mnemonic || configFile.mnemonic,
    authUrl,
    natsUrl,
    adminToken: process.env.NXTP_ADMIN_TOKEN || configJson.adminToken || configFile.adminToken,
    chainConfig: process.env.NXTP_CHAIN_CONFIG
      ? JSON.parse(process.env.NXTP_CHAIN_CONFIG)
      : configJson.chainConfig
      ? configJson.chainConfig
      : configFile.chainConfig,
    swapPools: process.env.NXTP_SWAP_POOLS
      ? JSON.parse(process.env.NXTP_SWAP_POOLS)
      : configJson.swapPools
      ? configJson.swapPools
      : configFile.swapPools,
    logLevel: process.env.NXTP_LOG_LEVEL || configJson.logLevel || configFile.logLevel || "info",
    port: process.env.NXTP_PORT || configJson.port || configFile.port || 8080,
    host: process.env.NXTP_HOST || configJson.host || configFile.host || "0.0.0.0",
    cleanUpMode: process.env.NXTP_CLEAN_UP_MODE || configJson.cleanUpMode || configFile.cleanUpMode || false,
    diagnosticMode: process.env.NXTP_DIAGNOSTIC_MODE || configJson.diagnosticMode || configFile.diagnosticMode || false,
  };

  const overridechainRecommendedConfirmations =
    process.env.NXTP_OVERRIDE_CHAIN_RECOMMENDED_CONFIRMATIONS ||
    configJson.overridechainRecommendedConfirmations ||
    configFile.overridechainRecommendedConfirmations ||
    false;
  if (!crossChainData && crossChainData!.size == 0 && !overridechainRecommendedConfirmations) {
    throw new Error(
      "Router configuration failed: no chain data provided. (To override, see `overridechainRecommendedConfirmations` in config. Overriding this behavior is not recommended.)",
    );
  }
  const defaultConfirmations =
    crossChainData && crossChainData.has("1") ? parseInt(crossChainData.get("1").confirmations) + 3 : 4;
  // add contract deployments if they exist
  Object.entries(nxtpConfig.chainConfig).forEach(([chainId, chainConfig]) => {
    const chainRecommendedConfirmations =
      crossChainData && crossChainData.has(chainId)
        ? parseInt(crossChainData.get(chainId).confirmations)
        : defaultConfirmations;
    const chainRecommendedGasStations =
      crossChainData && crossChainData.has(chainId) ? crossChainData.get(chainId).gasStations ?? [] : [];

    // allow passed in address to override
    // format: { [chainId]: { [chainName]: { "contracts": { "TransactionManager": { "address": "...." } } } }
    if (!chainConfig.transactionManagerAddress) {
      const res = getDeployedTransactionManagerContract(parseInt(chainId));
      if (!res) {
        throw new Error(`No transactionManager address for chain ${chainId}`);
      }
      nxtpConfig.chainConfig[chainId].transactionManagerAddress = res.address;
    }

    if (!chainConfig.minGas) {
      nxtpConfig.chainConfig[chainId].minGas = MIN_GAS.toString();
    }

    if (!chainConfig.safeRelayerFee) {
      nxtpConfig.chainConfig[chainId].safeRelayerFee = MIN_RELAYER_FEE.toString();
    }

    if (!chainConfig.subgraph) {
      const subgraph = getDeployedSubgraphUri(Number(chainId));
      if (!subgraph) {
        throw new Error(`No subgraph for chain ${chainId}`);
      }
      nxtpConfig.chainConfig[chainId].subgraph = subgraph;
    }

    if (!chainConfig.confirmations) {
      nxtpConfig.chainConfig[chainId].confirmations = chainRecommendedConfirmations;
    }

    if (!chainConfig.subgraphSyncBuffer) {
      const syncBuffer = (chainRecommendedConfirmations ?? 1) * 3;
      nxtpConfig.chainConfig[chainId].subgraphSyncBuffer =
        syncBuffer * 3 > MIN_SUBGRAPH_SYNC_BUFFER ? syncBuffer * 3 : MIN_SUBGRAPH_SYNC_BUFFER; // 25 blocks min
    }

    const addedStations = nxtpConfig.chainConfig[chainId].gasStations ?? [];
    nxtpConfig.chainConfig[chainId].gasStations = addedStations.concat(chainRecommendedGasStations);

    // Validate that confirmations is above acceptable/recommended minimum.
    const confirmations = chainConfig.confirmations ?? chainRecommendedConfirmations;

    // don't validate test chains confirmations
    if (["1337", "1338"].includes(chainId)) {
      return;
    }

    if (confirmations < chainRecommendedConfirmations) {
      if (overridechainRecommendedConfirmations) {
        console.warn(
          `Overriding recommended confirmations required (${chainRecommendedConfirmations}) for chain ${chainId} with value ${confirmations}. Please note that this can cause issues with re-orgs and may result in a loss of funds. I hope you know what you're doing!`,
        );
      } else {
        throw new Error(
          `Value listed for required confirmations for chain ${chainId} is less than the recommended safe minimum. Minimum: ${chainRecommendedConfirmations}; Configured value: ${confirmations}.`,
        );
      }
    }
  });

  const validate = ajv.compile(NxtpRouterConfigSchema);

  const valid = validate(nxtpConfig);

  if (!valid) {
    throw new Error(validate.errors?.map((err: any) => err.message).join(","));
  }

  return nxtpConfig;
};

let nxtpConfig: NxtpRouterConfig | undefined;

/**
 * Caches and returns the environment config
 *
 * @param chainDataOverride - overrides the set chain data; used for debugging, unit tests, etc.
 *
 * @returns The config
 */
export const getConfig = async (chainDataOverride?: Map<string, ChainData>): Promise<NxtpRouterConfig> => {
  if (!nxtpConfig) {
    const chainData = chainDataOverride ?? (await getChainData());
    nxtpConfig = getEnvConfig(chainData);
  }
  return nxtpConfig;
};

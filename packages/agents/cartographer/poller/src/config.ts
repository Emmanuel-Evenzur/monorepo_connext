///NXTP Config Generator based on vector/modules/router/src/config.ts
import { existsSync, readFileSync } from "fs";

import { Type, Static } from "@sinclair/typebox";
import { config as dotenvConfig } from "dotenv";
import { ajv, TLogLevel, TDatabaseConfig, TAddress, ChainData } from "@connext/nxtp-utils";
import { ConnextContractDeployments, ContractPostfix } from "@connext/nxtp-txservice";

const DEFAULT_POLL_INTERVAL = 15_000;

dotenvConfig();

export const TChains = Type.Record(
  Type.String(),
  Type.Object({
    deployments: Type.Object({
      connext: TAddress,
    }),
  }),
);
export const TService = Type.Union([
  Type.Literal("roots"),
  Type.Literal("transfers"),
  Type.Literal("routers"),
  Type.Literal("messages"),
]);

export const Cartographer = Type.Object({
  pollInterval: Type.Integer({ minimum: 1000 }),
  logLevel: TLogLevel,
  database: TDatabaseConfig,
  subgraphPrefix: Type.Optional(Type.String()),
  environment: Type.Union([Type.Literal("staging"), Type.Literal("production")]),
  chains: TChains,
  service: TService,
  healthUrls: Type.Partial(
    Type.Object({
      messages: Type.String({ format: "uri" }),
      roots: Type.String({ format: "uri" }),
      routers: Type.String({ format: "uri" }),
      transfers: Type.String({ format: "uri" }),
    }),
  ),
});

export type CartographerConfig = Static<typeof Cartographer>;

/**
 * Gets and validates the router config from the environment.
 *
 * @returns The router config with sensible defaults
 */
export const getEnvConfig = (
  chainData: Map<string, ChainData>,
  deployments: ConnextContractDeployments,
): CartographerConfig => {
  let configJson: Record<string, any> = {};
  let configFile: any = {};

  try {
    configJson = JSON.parse(process.env.CARTOGRAPHER_CONFIG || "{}");
  } catch (e: unknown) {
    console.info("No CARTOGRAPHER_CONFIG exists, using config file and individual env vars", e);
  }
  try {
    let json: string;

    const path = process.env.CARTOGRAPHER_CONFIG_FILE ?? "config.json";
    if (existsSync(path)) {
      json = readFileSync(path, { encoding: "utf-8" });
      configFile = JSON.parse(json);
    }
  } catch (e: unknown) {
    console.error("Error reading config file!");
    process.exit(1);
  }

  const nxtpConfig: CartographerConfig = {
    pollInterval:
      process.env.CARTOGRAPHER_POLL_INTERVAL ||
      configJson.pollInterval ||
      configFile.pollInterval ||
      DEFAULT_POLL_INTERVAL,
    logLevel:
      process.env.CARTOGRAPHER_LOG_LEVEL ||
      configJson.logLevel ||
      configFile.logLevel ||
      process.env.CARTOGRAPHER_LOG_LEVEL ||
      "info",
    service: process.env.CARTOGRAPHER_SERVICE || configJson.service || configFile.service || "messages",
    database: { url: process.env.DATABASE_URL || configJson.databaseUrl || configFile.databaseUrl },
    subgraphPrefix: process.env.CARTOGRAPHER_SUBGRAPH_PREFIX || configJson.subgraphPrefix || configFile.subgraphPrefix,
    environment:
      process.env.CARTOGRAPHER_ENVIRONMENT || configJson.environment || configFile.environment || "production",
    chains: process.env.CARTOGRAPHER_CHAINS || configJson.chains || configFile.chains || {},
    healthUrls: process.env.CARTOGRAPHER_HEALTH_URLS || configJson.healthUrls || configFile.healthUrls || {},
  };

  const contractPostfix: ContractPostfix =
    nxtpConfig.environment === "production"
      ? ""
      : (`${nxtpConfig.environment[0].toUpperCase()}${nxtpConfig.environment.slice(1)}` as ContractPostfix);

  Object.entries(nxtpConfig.chains).forEach(([domainId, chainConfig]) => {
    const chainDataForChain = chainData.get(domainId);

    // Make sure deployments is filled out correctly.
    // allow passed in address to override
    // format: { [domainId]: { { "deployments": { "connext": <address>, ... } }
    nxtpConfig.chains[domainId].deployments = {
      connext:
        chainConfig.deployments?.connext ??
        (() => {
          const res = chainDataForChain ? deployments.connext(chainDataForChain.chainId, contractPostfix) : undefined;
          if (!res) {
            throw new Error(`No Connext contract address for domain ${domainId}`);
          }
          return res.address;
        })(),
    };
  });

  const validate = ajv.compile(Cartographer);

  const valid = validate(nxtpConfig);

  if (!valid) {
    throw new Error(validate.errors?.map((err: unknown) => JSON.stringify(err, null, 2)).join(","));
  }

  return nxtpConfig;
};

let nxtpConfig: CartographerConfig | undefined;

/**
 * Caches and returns the environment config
 *
 * @returns The config
 */
export const getConfig = async (
  chainData: Map<string, ChainData>,
  deployments: ConnextContractDeployments,
): Promise<CartographerConfig> => {
  if (!nxtpConfig) {
    nxtpConfig = getEnvConfig(chainData, deployments);
  }
  return nxtpConfig;
};

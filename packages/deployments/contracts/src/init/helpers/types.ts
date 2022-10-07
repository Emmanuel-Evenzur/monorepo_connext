import { Type, Static } from "@sinclair/typebox";
import { Contract, providers, Wallet } from "ethers";

// NOTE: Used to do a sanity check when loading default config from json files
export const InitConfigSchema = Type.Object({
  hub: Type.String(),
  supportedDomains: Type.Array(Type.String()),
  assets: Type.Array(
    Type.Object({
      name: Type.String(),
      canonical: Type.Object({
        domain: Type.String(),
        address: Type.String(),
      }),
      representations: Type.Record(Type.String(), Type.Object({ local: Type.String(), adopted: Type.String() })),
    }),
  ),
  agents: Type.Object({
    watchers: Type.Object({
      whitelist: Type.Array(Type.String()),
    }),
    routers: Type.Object({
      whitelist: Type.Array(Type.String()),
    }),
    sequencers: Type.Object({
      whitelist: Type.Array(Type.String()),
    }),
    relayers: Type.Object({
      whitelist: Type.Array(Type.String()),
    }),
  }),
});

export type InitConfig = Static<typeof InitConfigSchema>;

// NOTE: Agents will currently be whitelisted/blacklisted respectively on ALL domains.
export type AgentStack = {
  // Arrays of addresses for each type of agent that requires whitelisting/blacklisting.
  whitelist?: string[];
  blacklist?: string[];
};

export type WhitelistAgents = {
  relayers?: AgentStack; // NOTE: Relayers will be whitelisted for both `execute` and messaging calls.
  sequencers?: AgentStack;
  routers?: AgentStack;
  watchers?: AgentStack;
};

export type AssetStack = {
  name: string;
  canonical: {
    // The canonical domain of the asset.
    domain: string;
    // Address of the official canonical token on the canonical domain.
    address: string;
  };
  representations: {
    [domain: string]: {
      // Address of the bridged asset on this domain.
      local: string;
      // Address of the adopted asset on this domain.
      // NOTE: If adopted is specified, a stableswap will be initialized! If not
      // specified, then we assume the local asset is the adopted asset on this domain.
      adopted?: string;
    };
  };
};

export type Deployment = {
  proxy?: string;
  name: string;
  address: string;
  abi: any[];
  contract: Contract;
};

export type HubMessagingDeployments = {
  RootManager: Deployment;
  MainnetConnector: Deployment;
  HubConnectors: Deployment[];
  WatcherManager: Deployment;
  MerkleTreeManagerForRoot: Deployment;
  MerkleTreeManagerForSpoke: Deployment;
};

export type SpokeMessagingDeployments = {
  SpokeConnector: Deployment;
  MerkleTreeManager: Deployment;
  WatcherManager: Deployment;
};

export type DomainDeployments = {
  // Diamond.
  Connext: Deployment;

  // Messaging Layer.
  // ConnectorManager
  // SendOutboundRootResolver

  // The messaging layer deployments are different depending on whether this
  // is the hub domain or spoke domain.
  messaging: HubMessagingDeployments | SpokeMessagingDeployments;
};

export type NetworkStack = {
  // Meta info.
  chain: string;
  domain: string;

  // RPC provider to use for this network.
  rpc: providers.JsonRpcProvider;

  // NOTE: If deployments are not specified in JSON config, we will attempt to retrieve them locally.
  deployments: DomainDeployments;
};

export type ProtocolStack = {
  deployer: Wallet; // The deployer/admin wallet.
  hub: string; // The hub domain.
  // Network stack should have all info pertaining to each supported domain.
  networks: NetworkStack[];
  // Crosschain ERC20 assets to enroll.
  assets: AssetStack[];
  // Agents that need to be whitelisted (across all domains).
  // Leave undefined if no agents should be whitelisted in this setup.
  agents?: WhitelistAgents;
};

export type CallSchema<T> = {
  deployment: Deployment;
  desired?: T; // Desired value.
  // Read method to call on contract.
  read:
    | {
        method: string;
        args?: (number | string)[];
      }
    | string;
  // Write method to call to update value on contract.
  write?: {
    method: string;
    args?: any[];
  };
};

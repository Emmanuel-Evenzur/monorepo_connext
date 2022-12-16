import { Contract, ethers, Wallet } from "ethers";

import _Deployments from "../../../deployments.json";
import { ConnextInterface } from "../../contracts";

import { Deployment, DomainDeployments } from "./types";

const Deployments = _Deployments as any;

export const getDeployments = (args: {
  deployer: Wallet;
  chainInfo: { chain: string; rpc: ethers.providers.JsonRpcProvider };
  isHub: boolean;
  useStaging: boolean;
}): DomainDeployments => {
  const { chainInfo, isHub, useStaging, deployer: _deployer } = args;
  const chain = chainInfo.chain;
  const deployments = Deployments[chain];
  if (!deployments) {
    throw new Error(`No deployments found for chain ${chain}!`);
  }
  const contracts = deployments[0]["contracts"] as { [contract: string]: any };
  if (!contracts) {
    throw new Error(`No contracts found under deployments for chain ${chain}!`);
  }
  const env = useStaging ? "Staging" : "";

  const deployer = _deployer.connect(chainInfo.rpc);

  // Get all the Hub connectors, if applicable.
  const connectors: Deployment[] = [];
  if (isHub) {
    for (const key of Object.keys(contracts)) {
      // TODO: Use regex? Or a more flexible method?
      // Ignore accidental L2 or Spoke Connector deployments...
      if (key.includes("L2") || key.includes("Spoke")) {
        continue;
      }
      if (key.endsWith("Connector" + env) && !key.includes("Mainnet")) {
        const contract = contracts[key];
        connectors.push({
          name: key,
          address: contract.address,
          abi: contract.abi,
          contract: new Contract(contract.address as string, contract.abi as any[], deployer),
        });
      }
    }
  } else {
    for (const key of Object.keys(contracts)) {
      if (key.endsWith("L2Connector" + env) || key.endsWith("SpokeConnector" + env)) {
        const contract = contracts[key];
        connectors.push({
          name: key,
          address: contract.address,
          abi: contract.abi,
          contract: new Contract(contract.address as string, contract.abi as any[], deployer),
        });
      }
    }
    if (connectors.length > 1) {
      throw new Error(
        `Multiple L2/Spoke Connectors found on spoke chain ${chain} while consulting deployments.json! ` +
          "Please ensure outdated Connector deployment is deleted and removed.",
      );
    }
  }

  // Custom function to format lookup by env and double check that the contract retrieved is not null.
  const getContract = (contract: string, ignoreEnv?: boolean): any => {
    const isConnext = contract.includes("Connext");
    const key = isConnext ? `Connext${env}_DiamondProxy` : ignoreEnv ? contract : contract + env;
    const result = contracts[key];
    if (!result) {
      throw new Error(`Contract ${key} was not found in deployments.json!`);
    } else if (!result.address || !result.abi) {
      throw new Error(`Contract ${key} was missing address or ABI in deployments.json!`);
    }

    // Use the ABI of the implementation contract, if applicable.
    let abi = result.abi as any[];
    const implementation = contract.includes("UpgradeBeaconProxy")
      ? contract.replace("UpgradeBeaconProxy", "")
      : undefined;

    if (implementation) {
      const implementationWithEnv = useStaging ? implementation?.concat("Staging") : implementation;
      const found = contracts[implementationWithEnv];
      if (found && found.abi) {
        abi = found.abi as any[];
      }
    }

    return {
      proxy: key,
      name: isConnext ? "Connext" : implementation ?? contract,
      address: result.address,
      abi,
      contract: new Contract(
        result.address as string,
        // Special case if this is the Connext diamond.
        isConnext ? ConnextInterface : abi,
        deployer,
      ),
    };
  };

  return {
    Connext: getContract("Connext_DiamondProxy"),
    Multisend: getContract("Multisend", true),
    messaging: isHub
      ? {
          RootManager: getContract("RootManager"),
          MainnetConnector: getContract("MainnetSpokeConnector"),
          WatcherManager: getContract("WatcherManager"),
          HubConnectors: connectors,
          MerkleTreeManagerForRoot: getContract("MerkleTreeManagerRootUpgradeBeaconProxy"),
          MerkleTreeManagerForSpoke: getContract("MerkleTreeManagerSpokeUpgradeBeaconProxy"),
          RelayerProxy: getContract("RelayerProxyHub"),
        }
      : {
          SpokeConnector: connectors[0],
          MerkleTreeManager: getContract("MerkleTreeManagerUpgradeBeaconProxy"),
          WatcherManager: getContract("WatcherManager"),
          RelayerProxy: getContract("RelayerProxy"),
        },
  };
};

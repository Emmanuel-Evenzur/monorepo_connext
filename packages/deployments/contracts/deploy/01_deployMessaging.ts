import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployResult } from "hardhat-deploy/types";
import { BigNumber, constants, Wallet } from "ethers";

import { chainIdToDomain, getDeploymentName, getProtocolNetwork } from "../src";
import { HUB_PREFIX, MessagingProtocolConfig, MESSAGING_PROTOCOL_CONFIGS, SPOKE_PREFIX } from "../deployConfig/shared";

// Format the arguments for Connector contract constructor.
const formatConnectorArgs = (
  protocol: MessagingProtocolConfig,
  args: {
    connectorChainId: number;
    deploymentChainId: number;
    mirrorChainId: number;
    rootManager: string;
  },
): any[] => {
  const { deploymentChainId, mirrorChainId, rootManager, connectorChainId } = args;
  const config = protocol.configs[connectorChainId];
  console.log(`using config`, config);

  const isHub = deploymentChainId === protocol.hub;

  // FIXME: settle on domains w/nomad
  const deploymentDomain = BigNumber.from(chainIdToDomain(deploymentChainId).toString());
  const mirrorDomain = BigNumber.from(chainIdToDomain(mirrorChainId).toString());
  const constructorArgs = [
    deploymentDomain,
    // Mirror domain should be known.
    mirrorDomain,
    isHub ? config.ambs.hub : config.ambs.spoke,
    rootManager,
    // Mirror contract address should be configured separately, after deployment.
    constants.AddressZero,
    config.processGas, // mirror process gas
    config.processGas,
    config.reserveGas,
  ];
  console.log(
    `constructorArgs:`,
    constructorArgs.map((c) => c.toString()),
  );
  // console.log(`- domain:`, constructorArgs[0].toString());
  return constructorArgs;
};

// Deploy messaging contracts unique to Eth mainnet, including hub connectors.
const handleDeployHub = async (
  hre: HardhatRuntimeEnvironment,
  deployer: Wallet,
  protocol: MessagingProtocolConfig,
): Promise<void> => {
  // Deploy RootManager.
  console.log("Deploying RootManager...");
  const rootManager = await hre.deployments.deploy(getDeploymentName("RootManager"), {
    contract: "RootManager",
    from: deployer.address,
    args: [],
    skipIfAlreadyDeployed: true,
    log: true,
  });
  console.log(`RootManager deployed to ${rootManager.address}`);

  // Deploy MainnetL1Connector.
  const connectorName = `${protocol.configs[protocol.hub].prefix}${HUB_PREFIX}Connector`;
  console.log(`Deploying ${connectorName}...`);
  const deployment = await hre.deployments.deploy(getDeploymentName(connectorName), {
    contract: connectorName,
    from: deployer.address,
    args: formatConnectorArgs(protocol, {
      connectorChainId: protocol.hub,
      deploymentChainId: protocol.hub,
      mirrorChainId: protocol.hub,
      rootManager: rootManager.address,
    }),
    skipIfAlreadyDeployed: true,
    log: true,
  });
  console.log(`${connectorName} deployed to ${deployment.address}`);

  console.log(`Deploying ${connectorName} SendOutboundRootResolver...`);
  const resolverDeployment = await hre.deployments.deploy(
    getDeploymentName(`${connectorName}SendOutboundRootResolver`),
    {
      contract: "SendOutboundRootResolver",
      from: deployer.address,
      args: [deployment.address, 30 * 60], // 30 min
      skipIfAlreadyDeployed: true,
      log: true,
    },
  );
  console.log(`${connectorName} SendOutboundRootResolver deployed to ${resolverDeployment.address}`);

  // Loop through every HubConnector configuration (except for the actual hub's) and deploy.
  const { configs } = protocol;
  for (const mirrorChain of Object.keys(configs)) {
    const mirrorChainId = +mirrorChain;
    if (mirrorChainId === protocol.hub) {
      // Skip; we're just deploying the spokes' hub-side connectors.
      continue;
    }

    const prefix = configs[mirrorChainId].prefix + HUB_PREFIX;
    const contract = `${prefix}Connector`;
    console.log(`Deploying ${contract}...`);
    const deployment = await hre.deployments.deploy(getDeploymentName(contract), {
      contract,
      from: deployer.address,
      args: formatConnectorArgs(protocol, {
        connectorChainId: mirrorChainId,
        deploymentChainId: protocol.hub,
        mirrorChainId,
        rootManager: rootManager.address,
      }),
      skipIfAlreadyDeployed: true,
      log: true,
    });
    console.log(`${contract} deployed to ${deployment.address}`);

    console.log(`Deploying ${contract} SendOutboundRootResolver...`);
    const resolverDeployment = await hre.deployments.deploy(getDeploymentName(`${contract}SendOutboundRootResolver`), {
      contract: "SendOutboundRootResolver",
      from: deployer.address,
      args: [deployment.address, 30 * 60],
      skipIfAlreadyDeployed: true,
      log: true,
    });
    console.log(`${contract} SendOutboundRootResolver deployed to ${resolverDeployment.address}`);
  }
};

/**
 * @notice Deploys the `Connector` contract on the given domain
 * @param hre
 * @param deployer
 * @param protocol
 * @param deploymentChainId
 * @param rootManager
 */
const handleDeploySpoke = async (
  hre: HardhatRuntimeEnvironment,
  deployer: Wallet,
  protocol: MessagingProtocolConfig,
  deploymentChainId: number,
): Promise<DeployResult> => {
  // Get hub root manager from deployments. if it does not exist, error (should always
  // deploy hub chain first in series of chain deployments)
  const rootManagerDeployment = await hre.companionNetworks["hub"].deployments.getOrNull(
    getDeploymentName("RootManager"),
  );
  if (!rootManagerDeployment) {
    throw new Error(`RootManager (hub) not deployed`);
  }

  // Deploy the Connector contract for this Spoke chain.
  const { configs } = protocol;
  const prefix = configs[deploymentChainId].prefix + SPOKE_PREFIX;
  const contract = `${prefix}Connector`;
  console.log(`Deploying ${contract}...`);
  const deployment = await hre.deployments.deploy(getDeploymentName(contract), {
    contract,
    from: deployer.address,
    args: formatConnectorArgs(protocol, {
      connectorChainId: deploymentChainId,
      deploymentChainId,
      mirrorChainId: protocol.hub,
      rootManager: rootManagerDeployment.address,
    }),
    skipIfAlreadyDeployed: true,
    log: true,
  });
  console.log(`${contract} deployed to ${deployment.address}`);

  console.log(`Deploying ${contract} SendOutboundRootResolver...`);
  const resolverDeployment = await hre.deployments.deploy(getDeploymentName(`${contract}SendOutboundRootResolver`), {
    contract: "SendOutboundRootResolver",
    from: deployer.address,
    args: [deployment.address, 30 * 60], // 30 min
    skipIfAlreadyDeployed: true,
    log: true,
  });
  console.log(`${contract} SendOutboundRootResolver deployed to ${resolverDeployment.address}`);
  return deployment;
};

/**
 * Hardhat task for deploying the AMB Messaging Layer contracts.
 *
 * @param hre Hardhat environment to deploy to
 */
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  const chain = await hre.getChainId();

  let _deployer: any;
  ({ deployer: _deployer } = await hre.ethers.getNamedSigners());
  if (!_deployer) {
    [_deployer] = await hre.ethers.getUnnamedSigners();
  }
  const deployer = _deployer as Wallet;
  console.log("\n============================= Deploying Messaging Contracts ===============================");
  console.log("deployer: ", deployer.address);

  const network = getProtocolNetwork(chain);
  console.log("Network: ", network, chain);
  const protocol = MESSAGING_PROTOCOL_CONFIGS[network];

  if (!protocol.configs[+chain] && +chain !== protocol.hub) {
    throw new Error(`Network ${network} is not supported for chain ${chain}!`);
  }

  const isHub = chain === protocol.hub.toString();

  // Handle deployment for Connector(s) and RootManager, if applicable.
  if (isHub) {
    console.log("Deploying hub messaging contracts...");
    await handleDeployHub(hre, deployer, protocol);
  } else {
    if (!hre.companionNetworks["hub"]) {
      throw new Error(`Cannot handle deployments for Spoke chain ${chain}; hub deployments not found!`);
    }
    console.log("Deploying spoke messaging contracts...");
    if (!Object.keys(protocol.configs).includes(chain)) {
      throw new Error(`Invalid chain (${chain}) for deployment!`);
    }

    await handleDeploySpoke(hre, deployer, protocol, +chain);
  }
};

export default func;

func.tags = ["Messaging", "prod", "local", "mainnet"];
func.dependencies = [];

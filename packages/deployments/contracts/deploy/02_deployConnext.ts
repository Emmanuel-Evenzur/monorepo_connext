import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import * as configuration from "@nomad-xyz/configuration";

import { MAINNET_CHAINS, SKIP_SETUP, WRAPPED_ETH_MAP } from "../src/constants";
import { getDomainInfoFromChainId } from "../src/nomad";

/**
 * Hardhat task defining the contract deployments for nxtp
 *
 * @param hre Hardhat environment to deploy to
 */
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  const chainId = await hre.getChainId();

  let deployer: any;
  ({ deployer } = await hre.ethers.getNamedSigners());
  if (!deployer) {
    [deployer] = await hre.ethers.getUnnamedSigners();
  }
  console.log("============================= Deploying Connext ===============================");
  console.log("deployer: ", deployer.address);

  const env = MAINNET_CHAINS.includes(+chainId) ? "production" : "development";
  const nomadConfig = configuration.getBuiltin(env);
  if (!nomadConfig) {
    throw new Error(`No nomad config found for ${env}`);
  }
  console.log("nomadConfig: ", nomadConfig);
  const { domainInfo } = getDomainInfoFromChainId(+chainId);

  // Get BridgeRouter and TokenRegistry deployments.
  const bridgeRouterDeployment = await hre.deployments.getOrNull("BridgeRouterUpgradeBeaconProxy");
  if (!bridgeRouterDeployment) {
    throw new Error(`BridgeRouter not deployed`);
  }
  const bridge = new hre.ethers.Contract(
    bridgeRouterDeployment.address,
    (await hre.deployments.getOrNull("BridgeRouter"))!.abi,
  ).connect(deployer);

  const tokenRegistryDeployment = await hre.deployments.getOrNull("TokenRegistryUpgradeBeaconProxy");
  if (!tokenRegistryDeployment) {
    throw new Error(`TokenRegistry not deployed`);
  }
  const tokenRegistry = new hre.ethers.Contract(
    tokenRegistryDeployment.address,
    (await hre.deployments.getOrNull("TokenRegistry"))!.abi,
  ).connect(deployer);

  // Deploy Connext logic libraries
  const assetLogic = await hre.deployments.deploy("AssetLogic", {
    from: deployer.address,
    log: true,
  });
  const connextUtils = await hre.deployments.deploy("ConnextUtils", {
    from: deployer.address,
    log: true,
  });
  const routerPermissionsManagerLogic = await hre.deployments.deploy("RouterPermissionsManagerLogic", {
    from: deployer.address,
    log: true,
  });

  // Deploy connext contract
  const connext = await hre.deployments.deploy("Connext", {
    from: deployer.address,
    log: true,
    libraries: {
      AssetLogic: assetLogic.address,
      ConnextUtils: connextUtils.address,
      RouterPermissionsManagerLogic: routerPermissionsManagerLogic.address,
    },
    proxy: {
      execute: {
        init: {
          methodName: "initialize",
          args: [domainInfo.domain, bridge.address, tokenRegistry.address, WRAPPED_ETH_MAP.get(+chainId)],
        },
      },
      proxyContract: "OpenZeppelinTransparentProxy",
      viaAdminContract: "ConnextProxyAdmin",
    },
  });
  const connextAddress = connext.address;
  console.log("connextAddress: ", connextAddress);

  // Add tm to bridge
  if ((await bridge.connext()) !== connextAddress) {
    console.log("setting connext on bridge");
    const addTm = await bridge.connect(deployer).setConnext(connextAddress);
    await addTm.wait();
  } else {
    console.log("bridge connext set");
  }

  if (WRAPPED_ETH_MAP.has(+chainId)) {
    console.log("Deploying ConnextPriceOracle to configured chain");

    let deployedPriceOracleAddress;
    try {
      deployedPriceOracleAddress = (await hre.deployments.get("ConnextPriceOracle")).address;
    } catch (e: unknown) {
      console.log("ConnextPriceOracle not deployed yet:", (e as Error).message);
    }
    await hre.deployments.deploy("ConnextPriceOracle", {
      from: deployer.address,
      args: [WRAPPED_ETH_MAP.get(+chainId)],
      log: true,
      skipIfAlreadyDeployed: true,
    });

    const priceOracleDeployment = await hre.deployments.get("ConnextPriceOracle");
    const newPriceOracleAddress = priceOracleDeployment.address;
    if (deployedPriceOracleAddress && deployedPriceOracleAddress != newPriceOracleAddress) {
      console.log("Setting v1PriceOracle, v1PriceOracle: ", deployedPriceOracleAddress);
      const priceOracleContract = await hre.ethers.getContractAt("ConnextPriceOracle", newPriceOracleAddress);
      const tx = await priceOracleContract.setV1PriceOracle(deployedPriceOracleAddress, { from: deployer });
      console.log("setV1PriceOracle tx: ", tx);
      await tx.wait();
    }
  }

  console.log("Deploying multicall to configured chain");
  let deployment = await hre.deployments.deploy("Multicall", {
    from: deployer.address,
    log: true,
    skipIfAlreadyDeployed: true,
  });

  if (!SKIP_SETUP.includes(parseInt(chainId))) {
    console.log("Deploying test token on non-mainnet chain");
    deployment = await hre.deployments.deploy("TestERC20", {
      from: deployer.address,
      log: true,
      // salt: keccak256("amarokrulez"),
      skipIfAlreadyDeployed: true,
    });
    // deployment = await dep.deploy();
    console.log("TestERC20: ", deployment.address);
  } else {
    console.log("Skipping test setup on chainId: ", chainId);
  }
};

export default func;
func.tags = ["Connext"];
func.dependencies = ["Nomad"];

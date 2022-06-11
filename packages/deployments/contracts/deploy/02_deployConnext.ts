import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { constants, Contract, Wallet } from "ethers";
import { ethers } from "hardhat";

import { SKIP_SETUP, WRAPPED_ETH_MAP } from "../src/constants";
import { getDeploymentName } from "../src/utils";
import { getDomainInfoFromChainId } from "../src/nomad";
import { deployConfigs } from "../deployConfig";

import { deployNomadBeaconProxy } from "./01_deployNomad";

/**
 * Hardhat task defining the contract deployments for nxtp
 *
 * @param hre Hardhat environment to deploy to
 */
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
  const chainId = await hre.getChainId();

  let _deployer: any;
  ({ deployer: _deployer } = await hre.ethers.getNamedSigners());
  if (!_deployer) {
    [_deployer] = await hre.ethers.getUnnamedSigners();
  }
  const deployer = _deployer as Wallet;
  console.log("\n============================= Deploying Connext Contracts ===============================");
  console.log("deployer: ", deployer.address);

  const network = await hre.ethers.provider.getNetwork();
  console.log("network: ", network);
  const domainConfig = getDomainInfoFromChainId(network.chainId);
  console.log("domainConfig: ", domainConfig);
  const price = await hre.ethers.provider.getGasPrice();
  console.log("price: ", price.toString());

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("balance: ", balance.toString());

  // Get xapp connection manager
  const deployConfig = deployConfigs[chainId];
  let xappConnectionManagerAddress = deployConfig.XAppConnectionManager;
  if (!xappConnectionManagerAddress) {
    const xappConnectionManagerDeployment = await hre.deployments.getOrNull(getDeploymentName("XAppConnectionManager"));
    if (!xappConnectionManagerDeployment) {
      throw new Error(`XappConnectionManager not deployed`);
    }
    xappConnectionManagerAddress = xappConnectionManagerDeployment.address;
  }

  console.log("Fetching token registry...");
  let tokenRegistryAddress = deployConfig.TokenRegistry;
  if (!tokenRegistryAddress) {
    const tokenRegistryDeployment = await hre.deployments.getOrNull(
      getDeploymentName("TokenRegistryUpgradeBeaconProxy"),
    );
    if (!tokenRegistryDeployment) {
      throw new Error(`TokenRegistry not deployed`);
    }
    tokenRegistryAddress = tokenRegistryDeployment.address;
  }

  // Deploy relayer fee router
  console.log("Deploying relayer fee router...");
  const relayerFeeRouter = (
    await deployNomadBeaconProxy("RelayerFeeRouter", [xappConnectionManagerAddress], deployer, hre)
  ).connect(deployer);
  console.log("relayer fee router address:", relayerFeeRouter.address);
  console.log("relayer fee router owner:", await relayerFeeRouter.owner());

  // Deploy promise router
  console.log("Deploying promise router...");
  const promiseRouter = (
    await deployNomadBeaconProxy("PromiseRouter", [xappConnectionManagerAddress], deployer, hre)
  ).connect(deployer);
  console.log("promise router address:", promiseRouter.address);
  console.log("promise router owner:", await promiseRouter.owner());

  const tokenRegistry = await hre.ethers.getContractAt("TokenRegistry", tokenRegistryAddress, deployer);

  const lpTokenDeployment = await hre.deployments.deploy("LPToken", {
    from: deployer.address,
    log: true,
    skipIfAlreadyDeployed: true,
  });

  if (lpTokenDeployment.newlyDeployed) {
    await hre.deployments.execute(
      "LPToken",
      { from: deployer.address, log: true },
      "initialize",
      "Nxtp Stable LP Token",
      "NxtpStableLPToken",
    );
  }

  // Deploy Connext logic libraries
  console.log("Deploying libraries...");
  const assetLogicDeployment = await hre.deployments.deploy(getDeploymentName("AssetLogic"), {
    from: deployer.address,
    log: true,
    contract: "AssetLogic",
  });

  const amplificationUtilsDeployment = await hre.deployments.deploy(getDeploymentName("AmplificationUtils"), {
    from: deployer.address,
    log: true,
    skipIfAlreadyDeployed: true,
    contract: "AmplificationUtils",
  });

  const swapUtilsDeployment = await hre.deployments.deploy(getDeploymentName("SwapUtils"), {
    from: deployer.address,
    log: true,
    skipIfAlreadyDeployed: true,
    contract: "SwapUtils",
  });

  // Deploy connext diamond contract
  console.log("Deploying connext diamond...");
  const connext = await hre.deployments.diamond.deploy(getDeploymentName("ConnextHandler"), {
    from: deployer.address,
    owner: deployer.address,
    log: true,
    facets: [
      { name: getDeploymentName("AssetFacet"), contract: "AssetFacet", args: [] },
      {
        name: getDeploymentName("BridgeFacet"),
        contract: "BridgeFacet",
        args: [],
        libraries: { AssetLogic: assetLogicDeployment.address },
      },
      { name: getDeploymentName("NomadFacet"), contract: "NomadFacet", args: [] },
      { name: getDeploymentName("ProposedOwnableFacet"), contract: "ProposedOwnableFacet", args: [] },
      { name: getDeploymentName("RelayerFacet"), contract: "RelayerFacet", args: [] },
      {
        name: getDeploymentName("RoutersFacet"),
        contract: "RoutersFacet",
        args: [],
        libraries: { AssetLogic: assetLogicDeployment.address },
      },
      {
        name: getDeploymentName("StableSwapFacet"),
        contract: "StableSwapFacet",
        args: [],
        libraries: { SwapUtils: swapUtilsDeployment.address, AmplificationUtils: amplificationUtilsDeployment.address },
      },
      {
        name: getDeploymentName("PortalFacet"),
        contract: "PortalFacet",
        args: [],
        libraries: { AssetLogic: assetLogicDeployment.address },
      },
      { name: getDeploymentName("VersionFacet"), contract: "VersionFacet", args: [] },
    ],
    defaultOwnershipFacet: false,
    execute: {
      contract: "DiamondInit",
      methodName: "init",
      args: [
        domainConfig.domain,
        xappConnectionManagerAddress,
        tokenRegistry.address,
        WRAPPED_ETH_MAP.get(+chainId) ?? constants.AddressZero,
        relayerFeeRouter.address,
        promiseRouter.address,
      ],
    },
    // deterministicSalt: keccak256(utils.toUtf8Bytes("connextDiamondProxyV1")),
  });
  const connextAddress = connext.address;
  console.log("connextAddress: ", connextAddress);

  // Sanity check: did token registry set
  const contract = new Contract(connext.address, connext.abi, ethers.provider);
  if ((await contract.tokenRegistry()).toLowerCase() !== tokenRegistry.address.toLowerCase()) {
    console.log("expected token registry:", tokenRegistry.address);
    console.log("init-d token registry:", await contract.tokenRegistry());
    throw new Error(`Improperly init-d token registry`);
  }

  // Add connext to relayer fee router
  if ((await relayerFeeRouter.connext()) !== connextAddress) {
    console.log("setting connext on relayer fee router");
    const addTm = await relayerFeeRouter.connect(deployer).setConnext(connextAddress);
    await addTm.wait();
  } else {
    console.log("relayer fee router connext set");
  }

  // Add connext to promise router
  if ((await promiseRouter.connext()) !== connextAddress) {
    console.log("setting connext on promiseRouter router");
    const addTm = await promiseRouter.connect(deployer).setConnext(connextAddress);
    await addTm.wait();
  } else {
    console.log("promise router connext set");
  }

  console.log("Deploying multicall...");
  const multicallName = getDeploymentName("Multicall");
  let deployment = await hre.deployments.deploy(multicallName, {
    from: deployer.address,
    log: true,
    skipIfAlreadyDeployed: true,
    contract: "Multicall",
  });

  if (!SKIP_SETUP.includes(parseInt(chainId))) {
    console.log("Deploying test token on non-mainnet chain...");
    // Note: NOT using special token for staging envs
    deployment = await hre.deployments.deploy("TestERC20", {
      from: deployer.address,
      log: true,
      //deterministicDeployment: keccak256(utils.toUtf8Bytes("connextTestERC20")),
      skipIfAlreadyDeployed: true,
    });
    console.log("TestERC20: ", deployment.address);
  } else {
    console.log("Skipping test setup on chainId: ", chainId);
  }
};

export default func;

func.tags = ["Connext", "mainnet"];

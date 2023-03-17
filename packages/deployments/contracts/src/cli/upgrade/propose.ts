import { writeFileSync } from "fs";
import { resolve } from "path";
import { exec } from "child_process";
import * as util from "util";

import { Contract, providers } from "ethers";
import commandLineArgs from "command-line-args";
import { FacetCut } from "hardhat-deploy/types";
import { HardhatUserConfig } from "hardhat/types";

import { getProposedFacetCuts } from "../../../deployHelpers/getProposedFacetCuts";
import { Env, getDeploymentName } from "../../utils";
import { hardhatNetworks, SUPPORTED_CHAINS } from "../../config";

import { FORK_BLOCKS, getDeployments } from "./helpers";

const execAsync = util.promisify(exec);

const DEFAULT_TAG = "relayer-fee-upgrade";

export const optionDefinitions = [
  { name: "env", type: String },
  { name: "network", type: String },
  { name: "chains", type: Number, multiple: true },
  { name: "tag", type: String, defaultValue: DEFAULT_TAG },
];

type NetworkContext = {
  name: string;
  config: HardhatUserConfig;
  rpc: string;
};

type ForkContext = {
  default: NetworkContext;
  fork: NetworkContext;
};

// sanitation checks before running the `hardhat deploy` command
const preflight = async (tag: string, networkInfo: ForkContext) => {
  if (tag === "relayer-fee-upgrade") {
    // Should delete the existing deployment from the copied-over fork
    // to ensure the deployment is not reused

    // fork names are in format: 5_staging_fork
    const env = networkInfo.fork.name.includes("staging") ? "staging" : "production";
    const file = getDeploymentName("BridgeFacet", env);
    const path = resolve(`./deployments/${networkInfo.fork.name}/${file}.json`);
    const remove = `rm -rf ${path}`;
    console.log(`\ntrying to remove ${file}:`, remove);
    await execAsync(remove);
    return;
  }
  throw new Error(`Ensure no preflight needed for ${tag}`);
};

const deployAgainstForks = async (chains: number[], tag: string): Promise<string[]> => {
  // for each chain, start an anvil fork and store the rpc url
  const networkInfo: Record<number, ForkContext> = {};

  // create all the forks + populate the network info
  for (const chain of chains) {
    const forkBlock = (FORK_BLOCKS as any)[chain];
    // get the hardhat config
    const [forkName, forkConfig] = Object.entries(hardhatNetworks).find(([name, networkConfig]) => {
      return name.includes(`fork`) && (networkConfig as any)?.chainId === chain;
    }) as any;
    const [name, config] = Object.entries(hardhatNetworks).find(([name, networkConfig]) => {
      return !name.includes(`fork`) && (networkConfig as any)?.chainId === chain;
    }) as any;
    if (!config?.url || !forkConfig?.url) {
      throw new Error(`Could not find url for chainId: ${chain}`);
    }
    const port = +forkConfig.url.split("http://")[1].split(":")[1];
    const command = `anvil --fork-url ${config.url} --fork-block-number ${forkBlock} --port ${port} --block-time 2 >/dev/null 2>&1 &`;
    console.log(`\ntrying to create fork:`, command);
    await execAsync(command);
    // update network info
    networkInfo[chain] = {
      default: { name, config, rpc: config.url! },
      fork: { name: forkName, config: forkConfig, rpc: forkConfig.url },
    };
  }

  // copy all current deployments to the `deployments` folder
  for (const chain of chains) {
    const forkDirectory = resolve(`./deployments/${networkInfo[chain].fork.name}`);
    const sourceDirectory = resolve(`./deployments/${networkInfo[chain].default.name}`);
    console.log(`chain`, chain);
    // remove all deployments from chain
    const remove = `rm -rf ${forkDirectory}`;
    console.log(`\ntrying to remove deployments:`, remove);
    await execAsync(remove);

    const copy = `cp -R ${sourceDirectory} ${forkDirectory}`;
    console.log(`\ntrying to copy over deployments:`, copy);
    await execAsync(copy);
    console.log(`completed deployment on ${chain}`);

    // run preflight
    await preflight(tag, networkInfo[chain]);
  }

  // deploy all the facets
  for (const chain of chains) {
    const deploy = `yarn workspace @connext/smart-contracts hardhat deploy --network ${networkInfo[chain].fork.name} --tags "${tag}"`;
    console.log(`\ntrying to run deploy cmd:`, deploy);
    const { stderr, stdout } = await execAsync(deploy);
    if (stderr) {
      console.log(stderr);
      continue;
    }
    console.log(stdout);
    console.log(`completed deployment of facets on ${chain}`);
  }

  // return fork rpcs
  return Object.values(networkInfo).map((info) => info.fork.rpc);
};

export const getDiamondUpgradeProposal = async () => {
  let cmdArgs: any;
  try {
    cmdArgs = commandLineArgs(optionDefinitions);
  } catch (err: any) {
    throw new Error(`Parsing arguments failed, cmdArgs: ${process.argv}`);
  }

  // Validate command line arguments
  // const chains = [1, 10, 56, 100, 137, 42161];
  const { env: _env, chains: _chains, network: _network, tag } = cmdArgs;
  const network: "testnet" | "mainnet" = _network ?? process.env.NETWORK ?? "testnet";
  const env: Env = _env ?? process.env.ENV ?? "staging";
  const chains: number[] = _chains ?? SUPPORTED_CHAINS[network];
  if (!["testnet", "mainnet"].includes(network as string)) {
    throw new Error(`Environment should be either staging or production, env: ${env}`);
  }

  if (!["staging", "production"].includes(env as string)) {
    throw new Error(`Environment should be either staging or production, env: ${env}`);
  }

  // deploy all the facets against a fork of the chain. when proposing, will use the
  // current `Connext` deployment on the mirroring fork chain
  const rpcs = await deployAgainstForks(chains, tag as string);

  const chainCuts: Record<number, { proposal: FacetCut[]; connext: string; numberOfCuts: number }> & {
    chains: number[];
    rpcs: string[];
    passed: false;
  } = { chains, rpcs, passed: false };
  for (const chain of chains) {
    // get the hardhat config
    const [, config]: any = Object.entries(hardhatNetworks).find(
      ([name, c]: [string, any]) => c.chainId === chain && name.includes("fork"),
    );
    if (!config?.url) {
      throw new Error(`Could not find url for chainId: ${chain}`);
    }
    // get provider for fork chain
    const forkProvider = new providers.JsonRpcProvider(config.url as string);
    // get all the deployments
    const deployments = getDeployments(`${chain}`, env);

    // generate the facet options
    const { Connext, ...facets } = deployments;
    const facetOptions = Object.values(facets).map((deployment) => {
      return {
        name: deployment.name,
        contract: deployment.contract.connect(forkProvider),
      };
    });

    // this is the connext address / abi of the non-fork deployment on the
    // forked chain
    const connext = new Contract(Connext.address, Connext.abi, forkProvider);

    // get the proposed cut
    const namedCuts = await getProposedFacetCuts(facetOptions, connext);
    // write to file without `name` field (matching contract call)
    chainCuts[chain] = {
      numberOfCuts: namedCuts.length,
      connext: Connext.address,
      proposal: namedCuts,
    };
  }

  // write cuts output to json file
  writeFileSync("cuts.json", JSON.stringify(chainCuts), { encoding: "utf-8" });

  // run the forge fork tests
  const forgeTest = `yarn forge test -vv --ffi --match-path '*/upgrade/**.sol'`;
  console.log(`\nrunning forge fork tests with command:`, forgeTest);
  const { stderr, stdout } = await execAsync(forgeTest);
  console.log("forge stdout", stdout);

  if (stderr) {
    console.log("forge stderr", stderr);
  } else {
    // write that tests passed to file
    writeFileSync("cuts.json", JSON.stringify({ ...chainCuts, passed: true }), { encoding: "utf-8" });
  }

  // kill all the forks
  const kill = `pkill -f anvil`;
  console.log(`\ntrying to kill all forks:`, kill);
  await execAsync(kill);
};

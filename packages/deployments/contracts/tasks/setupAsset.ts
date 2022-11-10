import { constants } from "ethers";
import { defaultAbiCoder, hexlify, solidityKeccak256 } from "ethers/lib/utils";
import { task } from "hardhat/config";

import { canonizeId } from "../src";
import { Env, getDeploymentName, mustGetEnv } from "../src/utils";

type TaskArgs = {
  canonical: string;
  domain: string;
  decimals: string;
  representationName: string;
  representationSymbol: string;
  adopted: string;
  local?: string;
  withDeployedRepresentation?: string;
  pool?: string;
  cap?: string;
  connextAddress?: string;
  env?: Env;
};

export default task("setup-asset", "Configures an asset")
  .addParam("canonical", "Canonical token address")
  .addParam("domain", "Canonical token domain")
  .addParam("decimals", "Canonical token decimals")
  .addParam("representationName", "Representation token name")
  .addParam("representationSymbol", "Representation token symbol")
  .addParam("adopted", "Adopted token address")
  .addOptionalParam("local", "Local token address")
  .addOptionalParam("withDeployedRepresentation", "Should setup asset with deployed representation")
  .addOptionalParam("pool", "Stable swap pool for adopted <> local asset")
  .addOptionalParam("cap", "Cap for the token")
  .addOptionalParam("connextAddress", "Override connext address")
  .addOptionalParam("env", "Environment of contracts")
  .setAction(
    async (
      {
        canonical,
        domain,
        decimals,
        representationName,
        representationSymbol,
        adopted,
        local,
        withDeployedRepresentation: _withDeployedRepresentation,
        pool: _pool,
        cap: _cap,
        connextAddress: _connextAddress,
        env: _env,
      }: TaskArgs,
      { deployments, ethers },
    ) => {
      let { deployer } = await ethers.getNamedSigners();
      if (!deployer) {
        [deployer] = await ethers.getUnnamedSigners();
      }

      const env = mustGetEnv(_env);

      // defaults
      const withDeployedRepresentation = _withDeployedRepresentation === "true" ? true : false;
      if (withDeployedRepresentation && !local) {
        throw "setupWithDeployedRepresentation requires local";
      }
      const pool = _pool ?? constants.AddressZero;
      const cap = _cap ?? 0;
      let connextAddress = _connextAddress;
      if (!connextAddress) {
        const connextName = getDeploymentName("Connext", env);
        const connextDeployment = await deployments.get(connextName);
        connextAddress = connextDeployment.address;
      }

      console.log("canonical:", canonical);
      console.log("domain:", domain);
      console.log("decimals:", decimals);
      console.log("representation name:", representationName);
      console.log("representation symbol:", representationSymbol);
      console.log("adopted: ", adopted);
      console.log("pool: ", pool);
      console.log("cap: ", cap);
      console.log("domain: ", domain);
      console.log("deployer: ", deployer.address);
      const connext = await ethers.getContractAt("Connext", connextAddress);
      console.log("connextAddress: ", connextAddress);

      const canonicalTokenId = {
        id: hexlify(canonizeId(canonical)),
        domain: +domain,
      };
      const key = solidityKeccak256(
        ["bytes"],
        [defaultAbiCoder.encode(["bytes32", "uint32"], [canonicalTokenId.id, canonicalTokenId.domain])],
      );

      console.log("key: ", key);
      const [approved] = connext.interface.decodeFunctionResult(
        "approvedAssets(bytes32)",
        await deployer.call({
          to: connext.address,
          value: constants.Zero,
          data: connext.interface.encodeFunctionData("approvedAssets(bytes32)", [key]),
        }),
      );
      console.log("approved: ", approved);
      if (approved) {
        // check that the correct domain is set
        // check that the correct adopted asset is set

        // get the current adopted asset
        const [currentAdopted] = connext.interface.decodeFunctionResult(
          "canonicalToAdopted(bytes32)",
          await deployer.call({
            to: connext.address,
            data: connext.interface.encodeFunctionData("canonicalToAdopted(bytes32)", [key]),
          }),
        );
        console.log("currentAdopted: ", currentAdopted);

        // get the current representation asset
        const [currentRepresentation] = connext.interface.decodeFunctionResult(
          "canonicalToRepresentation(bytes32)",
          await deployer.call({
            to: connext.address,
            data: connext.interface.encodeFunctionData("canonicalToRepresentation(bytes32)", [key]),
          }),
        );
        console.log("currentRepresentation: ", currentRepresentation);

        // check that the correct domain is set
        // const currentCanonical = await connext.adoptedToCanonical(currentAdopted);
        const [currentCanonical] = connext.interface.decodeFunctionResult(
          "adoptedToCanonical(address)",
          await deployer.call({
            to: connext.address,
            data: connext.interface.encodeFunctionData("adoptedToCanonical(address)", [currentAdopted]),
          }),
        );
        console.log("currentCanonical", currentCanonical);
        const correctCanonical =
          currentCanonical.domain === canonicalTokenId.domain &&
          currentCanonical.id.toLowerCase() === canonicalTokenId.id.toLowerCase();

        // check that the correct adopted asset is set + correct domain
        if (!adopted) {
          throw "Must specify adopted";
        }
        if (currentAdopted.toLowerCase() === adopted.toLowerCase() && correctCanonical) {
          console.log("approved, no need to add");
          return;
        }
        console.log("approved with different adopted asset or canonical id:");
        console.log(" - current adopted  :", currentAdopted);
        console.log(" - current canonical:", currentCanonical.id, "on", currentCanonical.domain.toString());
        console.log("removing asset and readding");
        const remove = await deployer.sendTransaction({
          to: connext.address,
          data: connext.interface.encodeFunctionData("removeAssetId(bytes32,address,address)", [
            key,
            currentAdopted,
            currentRepresentation,
          ]),
          value: constants.Zero,
        });
        console.log("remove tx:", remove.hash);
        const receipt = await remove.wait();
        console.log("remove tx mined:", receipt.transactionHash);
      }

      let tx;
      if (withDeployedRepresentation) {
        tx = await connext.setupAssetWithDeployedRepresentation(canonicalTokenId, local, adopted, pool, cap);
        console.log("setupAssetWithDeployedRepresentation tx: ", tx);
      } else {
        tx = await connext.setupAsset(
          canonicalTokenId,
          decimals,
          representationName,
          representationSymbol,
          adopted,
          pool,
          cap,
        );
        console.log("setupAsset tx: ", tx);
      }

      const receipt = await tx.wait(1);
      console.log("tx mined: ", receipt.transactionHash);

      const [isAssetApproved] = connext.interface.decodeFunctionResult(
        "approvedAssets(bytes32)",
        await deployer.call({
          to: connext.address,
          value: constants.Zero,
          data: connext.interface.encodeFunctionData("approvedAssets(bytes32)", [key]),
        }),
      );

      console.log("isAssetApproved: ", isAssetApproved);
    },
  );

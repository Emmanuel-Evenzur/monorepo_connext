import { domainToChainId } from "@connext/nxtp-contracts";
import { getCanonicalHash, RequestContext } from "@connext/nxtp-utils";
import { BigNumber, BigNumberish, constants } from "ethers";

import { ConnextInterface, getErc20Interface } from "../mockable";
import { Verifier, VerifierContext, AssetInfo, VerifyResponse } from "../types";

export class AssetVerifier extends Verifier {
  constructor(context: VerifierContext, public readonly assets: AssetInfo[]) {
    super(context);
  }

  /**
   * @notice Validate whether the watched asset(s) are violating the invariant statement (summing error).
   * @dev Should compare totalMintedAssets and totalLockedAssets according to the invariant statement. If
   * the invariant is violated, should return a value to indicate that the caller/consumer should escalate.
   *
   * @returns boolean - Whether the invariant was verified. `true` if ALL were verified (no pause needed).
   * `false` if the invariant was violated (pause is needed) for ANY assets!
   */
  public override async checkInvariant(_requestContext: RequestContext): Promise<VerifyResponse> {
    for (const asset of this.assets) {
      const totalMinted = await this.totalMintedAssets(asset);
      const totalLocked = await this.totalLockedAssets(asset);
      // Invariant: totalMintedAssets <= totalLockedAssets
      if (totalMinted.gt(totalLocked)) {
        return {
          needsPause: true,
          reason: `totalMintedAssets (${totalMinted.toString()}) is less than or equal to totalLockedAssets (${totalLocked.toString()})`,
        };
      }
    }
    return {
      needsPause: false,
    };
  }

  /**
   * @notice Get the total amount of minted bridge assets across all chain for a given xchain asset.
   * @param asset - AssetInfo for the target asset.
   * @returns BigNumber representing the total number of representative assets minted.
   */
  public async totalMintedAssets(asset: AssetInfo): Promise<BigNumber> {
    const erc20 = getErc20Interface();
    const assetKey = getCanonicalHash(asset.canonicalDomain, asset.canonicalId);

    // Loop through all domains, adding up the minted amount for the asset on each one.
    let totalMintedAmount = BigNumber.from(0);
    for (const domain of this.context.domains) {
      const chainId = domainToChainId(+domain);
      const connext = this.getConnextDeployment(chainId);

      // 1. Get the representation asset address on each domain using the canonical key.
      const canonicalToRepresentationCalldata = ConnextInterface.encodeFunctionData(
        "canonicalToRepresentation(bytes32)",
        [assetKey],
      );
      const representationRes = await this.context.txservice.readTx({
        domain: +domain,
        to: connext.address,
        data: canonicalToRepresentationCalldata,
      });

      this.context.logger.debug("Queried for representation asset", undefined, undefined, {
        domain,
        chainId,
        connext: connext.address,
        asset,
        assetKey,
        data: canonicalToRepresentationCalldata,
        result: representationRes,
      });

      const representation = ConnextInterface.decodeFunctionResult(
        "canonicalToRepresentation(bytes32)",
        representationRes,
      )[0];
      if (representation === constants.AddressZero) {
        // If this is address(0), then there is no mintable token for this asset on this domain
        continue;
      }

      // 2. Read total supply from the representation contract.
      const totalSupplyCalldata = erc20.encodeFunctionData("totalSupply");
      const totalSupplyRes = await this.context.txservice.readTx({
        domain: +domain,
        to: representation,
        data: totalSupplyCalldata,
      });
      let totalSupply: BigNumberish;
      try {
        totalSupply = erc20.decodeFunctionResult("totalSupply", totalSupplyRes)[0];
      } catch (e: any) {
        throw new Error(
          "Failed to convert totalSupply response to BigNumber. " +
            `token: ${representation}, Received: ${totalSupplyRes}; Error: ${e.toString()}`,
        );
      }

      // 3. Add to total.
      totalMintedAmount = totalMintedAmount.add(totalSupply);
    }

    return totalMintedAmount;
  }

  /**
   * @notice Get the total number of locked (custodied) assets on the canonical chain for a
   * given xchain asset.
   * @param asset - The AssetInfo for the target asset.
   * @returns BigNumber representing the total number of tokens locked.
   */
  public async totalLockedAssets(asset: AssetInfo): Promise<BigNumber> {
    const assetKey = getCanonicalHash(asset.canonicalDomain, asset.canonicalId);

    const chainId = domainToChainId(+asset.canonicalDomain);
    const connext = this.getConnextDeployment(chainId);

    // 1. Call `getCustodiedAmount` (see: TokenFacet getters), will get `custodied` value from tokenConfig.
    const getCustodiedAmountCalldata = ConnextInterface.encodeFunctionData("getCustodiedAmount", [assetKey]);
    const amountRes = await this.context.txservice.readTx({
      domain: +asset.canonicalDomain,
      to: connext.address,
      data: getCustodiedAmountCalldata,
    });
    try {
      return ConnextInterface.decodeFunctionResult("getCustodiedAmount", amountRes)[0];
    } catch (e: any) {
      throw new Error(
        "Failed to convert getCustodiedAmount response to BigNumber. " +
          `Received: ${amountRes}; Error: ${e.toString()}`,
      );
    }
  }
}

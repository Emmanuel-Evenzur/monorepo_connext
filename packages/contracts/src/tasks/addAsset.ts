import { task } from "hardhat/config";

import { TransactionManager } from "../../typechain";

export default task("add-asset", "Add a asset")
  .addParam("assetId", "Token address")
  .addOptionalParam("txManagerAddress", "Override tx manager address")
  .setAction(async ({ assetId, txManagerAddress: _txManagerAddress }, { deployments, getNamedAccounts, ethers }) => {
    const namedAccounts = await getNamedAccounts();

    console.log("assetId: ", assetId);
    console.log("namedAccounts: ", namedAccounts);

    let txManagerAddress = _txManagerAddress;
    if (!txManagerAddress) {
      const txManagerDeployment = await deployments.get("TransactionManager");
      txManagerAddress = txManagerDeployment.address;
    }
    console.log("txManagerAddress: ", txManagerAddress);

    const txManager: TransactionManager = await ethers.getContractAt("TransactionManager", txManagerAddress);
    const tx = await txManager.addAssetId(assetId, { from: namedAccounts.deployer });
    console.log("addAssetId tx: ", tx);
  });

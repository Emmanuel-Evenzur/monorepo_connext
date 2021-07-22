import { task } from "hardhat/config";

import { TransactionManager, TestERC20 } from "../../typechain";

export default task("add-liquidity", "Add liquidity for a router")
  .addParam("router", "Router address")
  .addParam("assetId", "Token address")
  .addParam("amount", "Amount (real units)")
  .addOptionalParam("txManagerAddress", "Override tx manager address")
  .setAction(
    async (
      { assetId, router, txManagerAddress: _txManagerAddress, amount },
      { deployments, getNamedAccounts, ethers },
    ) => {
      const namedAccounts = await getNamedAccounts();

      console.log("router: ", router);
      console.log("assetId: ", assetId);
      console.log("namedAccounts: ", namedAccounts);

      let txManagerAddress = _txManagerAddress;
      if (!txManagerAddress) {
        const txManagerDeployment = await deployments.get("TransactionManager");
        txManagerAddress = txManagerDeployment.address;
      }
      console.log("txManagerAddress: ", txManagerAddress);

      const txManager: TransactionManager = await ethers.getContractAt("TransactionManager", txManagerAddress);
      if (assetId !== ethers.constants.AddressZero) {
        const erc20: TestERC20 = await ethers.getContractAt("TestERC20", assetId);
        const allowance = await erc20.allowance(namedAccounts.deployer, txManager.address);
        if (allowance.lt(amount)) {
          const approveTx = await erc20.approve(txManager.address, ethers.constants.MaxUint256);
          console.log("approveTx: ", approveTx.hash);
          await approveTx.wait();
          console.log("approveTx mined");
        } else {
          console.log(`Sufficient allowance: ${allowance.toString()}`);
        }
      }

      const tx = await txManager.addLiquidity(amount, assetId, router, {
        from: namedAccounts.deployer,
        value: assetId === ethers.constants.AddressZero ? amount : 0,
      });
      console.log("addLiquidity tx: ", tx);
    },
  );

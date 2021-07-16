import { ethers, waffle } from "hardhat";
import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import {
  InvariantTransactionData,
  signCancelTransactionPayload,
  signFulfillTransactionPayload,
  VariantTransactionData,
  getInvariantTransactionDigest,
  getVariantTransactionDigest,
} from "@connext/nxtp-utils";
use(solidity);

import { hexlify, keccak256, randomBytes } from "ethers/lib/utils";
import { Wallet, BigNumber, BigNumberish, constants, Contract, ContractReceipt, utils } from "ethers";

// import types
import { FulfillInterpreter, Counter, TransactionManager, TestERC20, ERC20 } from "../typechain";
import { getOnchainBalance } from "./utils";

const { AddressZero } = constants;
const EmptyBytes = "0x";
const EmptyCallDataHash = keccak256(EmptyBytes);

const advanceBlockTime = async (desiredTimestamp: number) => {
  await ethers.provider.send("evm_setNextBlockTimestamp", [desiredTimestamp]);
};

const createFixtureLoader = waffle.createFixtureLoader;
describe("TransactionManager", function () {
  const [wallet, router, user, receiver, other] = waffle.provider.getWallets() as Wallet[];
  let transactionManager: TransactionManager;
  let transactionManagerReceiverSide: TransactionManager;
  let counter: Counter;
  let tokenA: TestERC20;
  let tokenB: TestERC20;
  const sendingChainId = 1337;
  const receivingChainId = 1338;

  const fixture = async () => {
    const transactionManagerFactory = await ethers.getContractFactory("TransactionManager");
    const counterFactory = await ethers.getContractFactory("Counter");
    const testERC20Factory = await ethers.getContractFactory("TestERC20");
    const interpreterFactory = await ethers.getContractFactory("FulfillInterpreter");

    const interpreter = (await interpreterFactory.deploy()) as FulfillInterpreter;

    transactionManager = (await transactionManagerFactory.deploy(
      sendingChainId,
      interpreter.address,
    )) as TransactionManager;
    transactionManagerReceiverSide = (await transactionManagerFactory.deploy(
      receivingChainId,
      interpreter.address,
    )) as TransactionManager;

    tokenA = (await testERC20Factory.deploy()) as TestERC20;
    tokenB = (await testERC20Factory.deploy()) as TestERC20;

    counter = (await counterFactory.deploy()) as Counter;

    return { transactionManager, transactionManagerReceiverSide, tokenA, tokenB };
  };

  const addPrivileges = async (tm: TransactionManager, routers: string[], assets: string[]) => {
    for (const router of routers) {
      const tx = await tm.addRouter(router);
      await tx.wait();
      expect(await tm.approvedRouters(router)).to.be.true;
    }

    for (const assetId of assets) {
      const tx = await tm.addAssetId(assetId);
      await tx.wait();
      expect(await tm.approvedAssets(assetId)).to.be.true;
    }
  };

  let loadFixture: ReturnType<typeof createFixtureLoader>;
  before("create fixture loader", async () => {
    loadFixture = createFixtureLoader([wallet, router, user, receiver, other]);
  });

  beforeEach(async function () {
    ({ transactionManager, transactionManagerReceiverSide, tokenA, tokenB } = await loadFixture(fixture));

    const liq = "10000";
    let tx = await tokenA.connect(wallet).transfer(router.address, liq);
    await tx.wait();
    tx = await tokenB.connect(wallet).transfer(router.address, liq);
    await tx.wait();

    const prepareFunds = "10000";
    tx = await tokenA.connect(wallet).transfer(user.address, prepareFunds);
    await tx.wait();
    tx = await tokenB.connect(wallet).transfer(user.address, prepareFunds);
    await tx.wait();

    // Prep contracts with router and assets
    await addPrivileges(transactionManager, [router.address], [AddressZero, tokenA.address, tokenB.address]);

    await addPrivileges(
      transactionManagerReceiverSide,
      [router.address],
      [AddressZero, tokenA.address, tokenB.address],
    );
  });

  const getTransactionData = async (
    txOverrides: Partial<InvariantTransactionData> = {},
    recordOverrides: Partial<VariantTransactionData> = {},
  ): Promise<{ transaction: InvariantTransactionData; record: VariantTransactionData }> => {
    const transaction = {
      user: user.address,
      router: router.address,
      sendingAssetId: AddressZero,
      receivingAssetId: AddressZero,
      sendingChainFallback: user.address,
      callTo: AddressZero,
      receivingAddress: receiver.address,
      callDataHash: EmptyCallDataHash,
      transactionId: hexlify(randomBytes(32)),
      sendingChainId: (await transactionManager.chainId()).toNumber(),
      receivingChainId: (await transactionManagerReceiverSide.chainId()).toNumber(),
      ...txOverrides,
    };

    const day = 24 * 60 * 60;
    const record = {
      amount: "10",
      expiry: Math.floor(Date.now() / 1000) + day + 5_000,
      preparedBlockNumber: 10,
      ...recordOverrides,
    };

    return { transaction, record };
  };

  const approveTokens = async (amount: BigNumberish, approver: Wallet, spender: string, token: ERC20 = tokenA) => {
    const approveTx = await token.connect(approver).approve(spender, amount);
    await approveTx.wait();
    const allowance = await token.allowance(approver.address, spender);
    expect(allowance).to.be.at.least(amount);
  };

  const assertObject = (expected: any, returned: any) => {
    const keys = Object.keys(expected);
    keys.map((k) => {
      if (typeof expected[k] === "object" && !BigNumber.isBigNumber(expected[k])) {
        expect(typeof returned[k] === "object");
        assertObject(expected[k], returned[k]);
      } else {
        expect(returned[k]).to.be.deep.eq((expected as any)[k]);
      }
    });
  };

  const assertReceiptEvent = async (receipt: ContractReceipt, eventName: string, expected: any) => {
    expect(receipt.status).to.be.eq(1);
    const idx = receipt.events?.findIndex((e) => e.event === eventName) ?? -1;
    expect(idx).to.not.be.eq(-1);
    const decoded = receipt.events![idx].decode!(receipt.events![idx].data, receipt.events![idx].topics);
    assertObject(expected, decoded);
  };

  const addAndAssertLiquidity = async (
    amount: BigNumberish,
    assetId: string = AddressZero,
    _router: Wallet = router,
    instance: Contract = transactionManagerReceiverSide,
  ) => {
    // Get starting + expected  balance
    const routerAddr = router.address;
    const startingBalance = await getOnchainBalance(assetId, routerAddr, ethers.provider);
    const expectedBalance = startingBalance.sub(amount);

    const startingLiquidity = await instance.routerBalances(routerAddr, assetId);
    const expectedLiquidity = startingLiquidity.add(amount);

    const tx = await instance
      .connect(_router)
      .addLiquidity(amount, assetId, router.address, assetId === AddressZero ? { value: BigNumber.from(amount) } : {});

    const receipt = await tx.wait();
    // const [receipt, payload] = await Promise.all([tx.wait(), event]);
    // expect(payload).to.be.ok;

    // Verify receipt + attached events
    expect(receipt.status).to.be.eq(1);
    await assertReceiptEvent(receipt, "LiquidityAdded", { router: routerAddr, assetId, amount });

    // Check liquidity
    const liquidity = await instance.routerBalances(routerAddr, assetId);
    expect(liquidity).to.be.eq(expectedLiquidity);

    // Check balances
    const balance = await getOnchainBalance(assetId, routerAddr, ethers.provider);
    expect(balance).to.be.eq(expectedBalance.sub(assetId === AddressZero ? tx.gasPrice.mul(receipt.gasUsed) : 0));
  };

  const removeAndAssertLiquidity = async (
    amount: BigNumberish,
    assetId: string = AddressZero,
    _router?: Wallet,
    instance: Contract = transactionManagerReceiverSide,
  ) => {
    const router = _router ?? instance.signer;

    // Get starting + expected  balance
    const startingBalance = await getOnchainBalance(assetId, await router.getAddress(), ethers.provider);
    const expectedBalance = startingBalance.add(amount);

    const startingLiquidity = await instance.routerBalances(await router.getAddress(), assetId);
    const expectedLiquidity = startingLiquidity.sub(amount);

    // TODO: debug event emission wtf
    // const event = new Promise(resolve => {
    //   transactionManager.once("LiquidityRemoved", data => resolve(data));
    // });
    const tx = await instance.connect(router).removeLiquidity(amount, assetId, await router.getAddress());

    const receipt = await tx.wait();
    expect(receipt.status).to.be.eq(1);
    // const [receipt, payload] = await Promise.all([tx.wait(), event]);
    // expect(payload).to.be.ok;

    // Verify receipt events
    const routerAddress = await router.getAddress();
    await assertReceiptEvent(receipt, "LiquidityRemoved", {
      router: routerAddress,
      assetId,
      amount,
      recipient: routerAddress,
    });

    // Check liquidity
    const liquidity = await instance.routerBalances(await router.getAddress(), assetId);
    expect(liquidity).to.be.eq(expectedLiquidity);

    // Check balance
    const finalBalance = await getOnchainBalance(assetId, await router.getAddress(), ethers.provider);
    expect(finalBalance).to.be.eq(
      assetId !== AddressZero ? expectedBalance : expectedBalance.sub(receipt.cumulativeGasUsed!.mul(tx.gasPrice!)),
    );
  };

  const prepareAndAssert = async (
    txOverrides: Partial<InvariantTransactionData>,
    recordOverrides: Partial<VariantTransactionData> = {},
    preparer: Wallet = user,
    instance: TransactionManager = transactionManager,
  ): Promise<ContractReceipt> => {
    const { transaction, record } = await getTransactionData(txOverrides, recordOverrides);

    // Check if its the user
    const userSending = preparer.address !== transaction.router;

    // Get initial balances
    const initialContractAmount = await getOnchainBalance(
      userSending ? transaction.sendingAssetId : transaction.receivingAssetId,
      instance.address,
      ethers.provider,
    );
    const initialPreparerAmount = userSending
      ? await getOnchainBalance(transaction.sendingAssetId, preparer.address, ethers.provider)
      : await instance.routerBalances(transaction.router, transaction.receivingAssetId);

    const invariantDigest = getInvariantTransactionDigest(transaction);

    expect(await instance.variantTransactionData(invariantDigest)).to.be.eq(utils.formatBytes32String(""));
    // Send tx
    const prepareTx = await instance
      .connect(preparer)
      .prepare(
        transaction,
        record.amount,
        record.expiry,
        EmptyBytes,
        EmptyBytes,
        EmptyBytes,
        transaction.sendingAssetId === AddressZero && preparer.address !== transaction.router
          ? { value: record.amount }
          : {},
      );
    const receipt = await prepareTx.wait();
    expect(receipt.status).to.be.eq(1);

    const variantDigest = getVariantTransactionDigest({
      amount: record.amount,
      expiry: record.expiry,
      preparedBlockNumber: receipt.blockNumber,
    });

    expect(await instance.variantTransactionData(invariantDigest)).to.be.eq(variantDigest);
    // expect(await instance.activeTransactionBlocks(preparer.address));

    // const activeBlock = await instance.activeTransactionBlocks(transaction.user, 0);

    // console.log(activeBlock);
    // Verify receipt event
    await assertReceiptEvent(receipt, "TransactionPrepared", {
      user: transaction.user,
      router: transaction.router,
      transactionId: transaction.transactionId,
      txData: { ...transaction, ...record, preparedBlockNumber: receipt.blockNumber },
      caller: preparer.address,
      bidSignature: EmptyBytes,
      encodedBid: EmptyBytes,
    });

    // Verify amount has been deducted from preparer
    const finalPreparerAmount = userSending
      ? await getOnchainBalance(transaction.sendingAssetId, preparer.address, ethers.provider)
      : await instance.routerBalances(transaction.router, transaction.receivingAssetId);
    const expected = initialPreparerAmount.sub(record.amount);
    expect(finalPreparerAmount).to.be.eq(
      transaction.sendingAssetId === AddressZero && userSending
        ? expected.sub(prepareTx.gasPrice!.mul(receipt.cumulativeGasUsed!))
        : expected,
    );

    // TODO: add `getTransactionsByUser` assertion

    // Verify amount has been added to contract
    if (!userSending) {
      // Router does not send funds
      return receipt;
    }
    const finalContractAmount = await getOnchainBalance(transaction.sendingAssetId, instance.address, ethers.provider);
    expect(finalContractAmount).to.be.eq(initialContractAmount.add(record.amount));

    return receipt;
  };

  const fulfillAndAssert = async (
    transaction: InvariantTransactionData,
    record: VariantTransactionData,
    relayerFee: string,
    fulfillingForSender: boolean,
    submitter: Wallet,
    instance: TransactionManager,
    callData: string = EmptyBytes,
  ) => {
    // Get pre-fulfull balance. If fulfilling on sender side, router
    // liquidity of sender asset will increase. If fulfilling on receiving
    // side, user balance of receiving asset will increase + relayer paid
    const initialIncrease = fulfillingForSender
      ? await getOnchainBalance(transaction.receivingAssetId, transaction.receivingAddress, ethers.provider)
      : await instance.routerBalances(router.address, transaction.sendingAssetId);
    const expectedIncrease = initialIncrease.add(record.amount).sub(fulfillingForSender ? relayerFee : 0);

    // Check for relayer balances
    const initialRelayer = await getOnchainBalance(transaction.receivingAssetId, submitter.address, ethers.provider);

    // Check for values that remain flat
    const initialFlat = fulfillingForSender
      ? await instance.routerBalances(router.address, transaction.receivingAssetId)
      : await getOnchainBalance(transaction.sendingAssetId, user.address, ethers.provider);

    // Generate signature from user
    const signature = await signFulfillTransactionPayload(transaction.transactionId, relayerFee, user);

    const invariantDigest = getInvariantTransactionDigest(transaction);
    const variantDigestBeforeFulfill = getVariantTransactionDigest({
      amount: record.amount,
      expiry: record.expiry,
      preparedBlockNumber: record.preparedBlockNumber,
    });

    expect(await instance.variantTransactionData(invariantDigest)).to.be.eq(variantDigestBeforeFulfill);
    // Send tx
    const tx = await instance.connect(submitter).fulfill(
      {
        ...transaction,
        ...record,
      },
      relayerFee,
      signature,
      callData,
    );
    const receipt = await tx.wait();
    expect(receipt.status).to.be.eq(1);

    const variantDigest = getVariantTransactionDigest({
      amount: record.amount,
      expiry: record.expiry,
      preparedBlockNumber: 0,
    });

    expect(await instance.variantTransactionData(invariantDigest)).to.be.eq(variantDigest);
    // Assert event
    await assertReceiptEvent(receipt, "TransactionFulfilled", {
      user: transaction.user,
      router: transaction.router,
      transactionId: transaction.transactionId,
      txData: { ...transaction, ...record },
      relayerFee,
      signature,
      caller: submitter.address,
    });

    // Verify final balances
    const finalIncreased = fulfillingForSender
      ? await getOnchainBalance(transaction.receivingAssetId, transaction.receivingAddress, ethers.provider)
      : await instance.routerBalances(router.address, transaction.sendingAssetId);

    const finalFlat = fulfillingForSender
      ? await instance.routerBalances(router.address, transaction.receivingAssetId)
      : await getOnchainBalance(transaction.sendingAssetId, user.address, ethers.provider);

    // Assert relayer fee if needed
    if (fulfillingForSender && submitter.address !== user.address) {
      // Assert relayer got fees
      const expectedRelayer = initialRelayer.add(relayerFee);
      const finalRelayer = await getOnchainBalance(transaction.receivingAssetId, submitter.address, ethers.provider);
      expect(finalRelayer).to.be.eq(
        transaction.receivingAssetId === AddressZero
          ? expectedRelayer.sub(tx.gasPrice!.mul(receipt.gasUsed!))
          : expectedRelayer,
      );
    }

    const gas = tx.gasPrice!.mul(receipt.gasUsed!).toString();

    if (callData == EmptyBytes) {
      expect(finalIncreased).to.be.eq(
        !fulfillingForSender ||
          user.address !== submitter.address ||
          transaction.receivingAssetId !== AddressZero ||
          user.address !== transaction.receivingAddress
          ? expectedIncrease
          : expectedIncrease.add(relayerFee).sub(gas),
      );
    }
    expect(finalFlat).to.be.eq(initialFlat);
  };

  const cancelAndAssert = async (
    transaction: InvariantTransactionData,
    record: VariantTransactionData,
    canceller: Wallet,
    instance: Contract,
    relayerFee: BigNumber = constants.Zero,
    _signature?: string,
  ): Promise<void> => {
    const sendingSideCancel = (await instance.chainId()).toNumber() === transaction.sendingChainId;

    const startingBalance = !sendingSideCancel
      ? await instance.routerBalances(transaction.router, transaction.receivingAssetId)
      : await getOnchainBalance(transaction.sendingAssetId, transaction.user, ethers.provider);
    const expectedBalance =
      canceller == user || (await instance.chainId()).toNumber() == transaction.receivingChainId
        ? startingBalance.add(record.amount)
        : startingBalance.add(record.amount).sub(relayerFee);

    const signature =
      _signature ?? (await signCancelTransactionPayload(transaction.transactionId, relayerFee.toString(), user));
    const tx = await instance.connect(canceller).cancel({ ...transaction, ...record }, relayerFee, signature);
    const receipt = await tx.wait();
    await assertReceiptEvent(receipt, "TransactionCancelled", {
      user: transaction.user,
      router: transaction.router,
      transactionId: transaction.transactionId,
      txData: { ...transaction, ...record },
      caller: canceller.address,
    });

    const balance = !sendingSideCancel
      ? await instance.routerBalances(transaction.router, transaction.receivingAssetId)
      : await getOnchainBalance(transaction.sendingAssetId, transaction.user, ethers.provider);
    expect(balance).to.be.eq(expectedBalance);
  };

  it("should deploy", async () => {
    expect(transactionManager.address).to.be.a("string");
  });

  it("constructor initialize", async () => {
    expect(await transactionManager.chainId()).to.eq(1337);
  });

  describe("renounce", () => {
    it("should fail if not called by owner", async () => {
      await expect(transactionManager.connect(other).renounce()).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should work and allow unregistered assets", async () => {
      const tx = await transactionManager.renounce();
      await tx.wait();
      await addAndAssertLiquidity(1, AddressZero, router, transactionManager);
    });
  });

  describe("addRouter", () => {
    it("should fail if not called by owner", async () => {
      const toAdd = Wallet.createRandom().address;
      await expect(transactionManager.connect(other).addRouter(toAdd)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      );
    });

    it("should work", async () => {
      const toAdd = Wallet.createRandom().address;
      const tx = await transactionManager.addRouter(toAdd);
      await tx.wait();
      expect(await transactionManager.approvedRouters(toAdd)).to.be.true;
    });
  });

  describe("removeRouter", () => {
    it("should fail if not called by owner", async () => {
      const toAdd = Wallet.createRandom().address;
      await expect(transactionManager.connect(other).removeRouter(toAdd)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      );
    });

    it("should work", async () => {
      const tx = await transactionManager.removeRouter(router.address);
      await tx.wait();
      expect(await transactionManager.approvedRouters(router.address)).to.be.false;
    });
  });

  describe("addAssetId", () => {
    it("should fail if not called by owner", async () => {
      await expect(transactionManager.connect(other).addAssetId(Wallet.createRandom().address)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      );
    });

    it("should work", async () => {
      const assetId = Wallet.createRandom().address;
      const tx = await transactionManager.addAssetId(assetId);
      await tx.wait();
      expect(await transactionManager.approvedAssets(assetId)).to.be.true;
    });
  });

  describe("removeAssetId", () => {
    it("should fail if not called by owner", async () => {
      await expect(transactionManager.connect(other).removeAssetId(Wallet.createRandom().address)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      );
    });

    it("should work", async () => {
      const assetId = AddressZero;
      const tx = await transactionManager.removeAssetId(assetId);
      await tx.wait();
      expect(await transactionManager.approvedAssets(assetId)).to.be.false;
    });
  });

  describe("#addLiquidity", () => {
    it("should revert if param router address is addressZero", async () => {
      const amount = "1";
      const assetId = AddressZero;

      await expect(transactionManager.connect(router).addLiquidity(amount, assetId, AddressZero)).to.be.revertedWith(
        "addLiquidity: ROUTER_EMPTY",
      );
      expect(await transactionManager.routerBalances(router.address, assetId)).to.eq(BigNumber.from(0));
    });

    it("should fail if amount is 0", async () => {
      const amount = "0";
      const assetId = AddressZero;

      await expect(transactionManager.connect(router).addLiquidity(amount, assetId, router.address)).to.be.revertedWith(
        "addLiquidity: AMOUNT_IS_ZERO",
      );
    });

    it("should fail if its an unapproved asset", async () => {
      const amount = "10";
      const assetId = AddressZero;

      // Remove asset
      const remove = await transactionManager.removeAssetId(assetId);
      await remove.wait();
      expect(await transactionManager.approvedAssets(assetId)).to.be.false;

      await expect(transactionManager.connect(router).addLiquidity(amount, assetId, router.address)).to.be.revertedWith(
        "addLiquidity: BAD_ASSET",
      );
    });

    it("should error if value is not present for Ether/Native token", async () => {
      const amount = "1";
      const assetId = AddressZero;

      await expect(transactionManager.connect(router).addLiquidity(amount, assetId, router.address)).to.be.revertedWith(
        "addLiquidity: VALUE_MISMATCH",
      );
      expect(await transactionManager.routerBalances(router.address, assetId)).to.eq(BigNumber.from(0));
    });

    it("should error if value is not equal to amount param for Ether/Native token", async () => {
      const amount = "1";
      const falseValue = "2";
      const assetId = AddressZero;

      await expect(
        transactionManager.connect(router).addLiquidity(amount, assetId, router.address, { value: falseValue }),
      ).to.be.revertedWith("addLiquidity: VALUE_MISMATCH");
      expect(await transactionManager.routerBalances(router.address, assetId)).to.eq(BigNumber.from(0));
    });

    it("should error if value is non-zero for ERC20 token", async () => {
      // addLiquidity: ETH_WITH_ERC_TRANSFER;
      const amount = "1";
      const assetId = tokenA.address;
      await expect(
        transactionManager.connect(router).addLiquidity(amount, assetId, router.address, { value: amount }),
      ).to.be.revertedWith("addLiquidity: ETH_WITH_ERC_TRANSFER");
      expect(await transactionManager.routerBalances(router.address, assetId)).to.eq(BigNumber.from(0));
    });

    it("should error if transaction manager isn't approve for respective amount if ERC20", async () => {
      const amount = "1";
      const assetId = tokenA.address;
      await expect(transactionManager.connect(router).addLiquidity(amount, assetId, router.address)).to.be.revertedWith(
        "ERC20: transfer amount exceeds allowance",
      );
      expect(await transactionManager.routerBalances(router.address, assetId)).to.eq(BigNumber.from(0));
    });

    it("should work if it is renounced and using an unapproved asset", async () => {
      const amount = "1";
      const assetId = AddressZero;

      // Remove asset
      const remove = await transactionManager.removeAssetId(assetId);
      await remove.wait();
      expect(await transactionManager.approvedAssets(assetId)).to.be.false;

      // Renounce ownership
      const renounce = await transactionManager.renounce();
      await renounce.wait();
      expect(await transactionManager.renounced()).to.be.true;

      await addAndAssertLiquidity(amount, assetId);
    });

    it("happy case: addLiquity Native/Ether token", async () => {
      const amount = "1";
      const assetId = AddressZero;
      await addAndAssertLiquidity(amount, assetId);
    });

    it("happy case: addLiquity ERC20", async () => {
      const amount = "1";
      const assetId = tokenA.address;
      await approveTokens(amount, router, transactionManagerReceiverSide.address, tokenA);
      await addAndAssertLiquidity(amount, assetId);
    });
  });

  describe("#removeLiquidity", () => {
    it("should revert if param recipient address is addressZero", async () => {
      const amount = "1";
      const assetId = AddressZero;

      await expect(transactionManager.connect(router).removeLiquidity(amount, assetId, AddressZero)).to.be.revertedWith(
        "removeLiquidity: RECIPIENT_EMPTY",
      );
    });

    it("should error if router Balance is lower than amount", async () => {
      const amount = "1";
      const assetId = AddressZero;

      await expect(
        transactionManager.connect(router).removeLiquidity(amount, assetId, router.address),
      ).to.be.revertedWith("removeLiquidity: INSUFFICIENT_FUNDS");
    });

    it("happy case: removeLiquidity Native/Ether token", async () => {
      const amount = "1";
      const assetId = AddressZero;

      await addAndAssertLiquidity(amount, assetId);

      await removeAndAssertLiquidity(amount, assetId, router);
    });

    it("happy case: removeLiquidity ERC20", async () => {
      const amount = "1";
      const assetId = tokenA.address;
      await approveTokens(amount, router, transactionManagerReceiverSide.address);
      await addAndAssertLiquidity(amount, assetId);

      await removeAndAssertLiquidity(amount, assetId, router);
    });
  });

  describe("#prepare", () => {
    // TODO: revert and emit event test cases
    // reentrant cases
    it("should revert if param user is addressZero", async () => {
      const { transaction, record } = await getTransactionData({ user: AddressZero });
      await expect(
        transactionManager
          .connect(user)
          .prepare(transaction, record.amount, record.expiry, EmptyBytes, EmptyBytes, EmptyBytes, {
            value: record.amount,
          }),
      ).to.be.revertedWith("prepare: USER_EMPTY");
    });

    it("should revert if param router is addressZero", async () => {
      const { transaction, record } = await getTransactionData({ router: AddressZero });
      await expect(
        transactionManager
          .connect(user)
          .prepare(transaction, record.amount, record.expiry, EmptyBytes, EmptyBytes, EmptyBytes, {
            value: record.amount,
          }),
      ).to.be.revertedWith("prepare: ROUTER_EMPTY");
    });

    it("should revert if param receiving address is addressZero", async () => {
      const { transaction, record } = await getTransactionData({ receivingAddress: AddressZero });
      await expect(
        transactionManager
          .connect(user)
          .prepare(transaction, record.amount, record.expiry, EmptyBytes, EmptyBytes, EmptyBytes, {
            value: record.amount,
          }),
      ).to.be.revertedWith("prepare: RECEIVING_ADDRESS_EMPTY");
    });

    it("should fail if amount is 0", async () => {
      const { transaction, record } = await getTransactionData({}, { amount: "0" });
      await expect(
        transactionManager
          .connect(user)
          .prepare(transaction, record.amount, record.expiry, EmptyBytes, EmptyBytes, EmptyBytes, {
            value: record.amount,
          }),
      ).to.be.revertedWith("prepare: AMOUNT_IS_ZERO");
    });

    it("should fail if its an unapproved router and it has not been renounced", async () => {
      const { transaction, record } = await getTransactionData({ router: Wallet.createRandom().address });
      await expect(
        transactionManager
          .connect(user)
          .prepare(transaction, record.amount, record.expiry, EmptyBytes, EmptyBytes, EmptyBytes, {
            value: record.amount,
          }),
      ).to.be.revertedWith("prepare: BAD_ROUTER");
    });

    it("should revert if param sendingChainFallback address is addressZero", async () => {
      const { transaction, record } = await getTransactionData({ sendingChainFallback: AddressZero });
      await expect(
        transactionManager
          .connect(user)
          .prepare(transaction, record.amount, record.expiry, EmptyBytes, EmptyBytes, EmptyBytes, {
            value: record.amount,
          }),
      ).to.be.revertedWith("prepare: SENDING_CHAIN_FALLBACK_EMPTY");
    });

    it("should revert if expiry is lower than min_timeout", async () => {
      const { transaction, record } = await getTransactionData();
      const hours12 = 12 * 60 * 60;
      const expiry = (Math.floor(Date.now() / 1000) + hours12 + 5_000).toString();
      await expect(
        transactionManager
          .connect(user)
          .prepare(transaction, record.amount, expiry, EmptyBytes, EmptyBytes, EmptyBytes, {
            value: record.amount,
          }),
      ).to.be.revertedWith("prepare: TIMEOUT_TOO_LOW");
    });

    it("should revert if expiry is higher than max_timeout", async () => {
      const { transaction, record } = await getTransactionData();
      const days31 = 31 * 24 * 60 * 60;
      const expiry = (Math.floor(Date.now() / 1000) + days31 + 5_000).toString();
      await expect(
        transactionManager
          .connect(user)
          .prepare(transaction, record.amount, expiry, EmptyBytes, EmptyBytes, EmptyBytes, {
            value: record.amount,
          }),
      ).to.be.revertedWith("prepare: TIMEOUT_TOO_HIGH");
    });

    it("should revert if param sending and receiving chainId are same", async () => {
      const { transaction, record } = await getTransactionData({ sendingChainId: 1337, receivingChainId: 1337 });
      await expect(
        transactionManager
          .connect(user)
          .prepare(transaction, record.amount, record.expiry, EmptyBytes, EmptyBytes, EmptyBytes, {
            value: record.amount,
          }),
      ).to.be.revertedWith("prepare: SAME_CHAINIDS");
    });

    it("should revert if param sending or receiving chainId doesn't match chainId variable", async () => {
      const { transaction, record } = await getTransactionData({ sendingChainId: 1340, receivingChainId: 1341 });
      await expect(
        transactionManager
          .connect(user)
          .prepare(transaction, record.amount, record.expiry, EmptyBytes, EmptyBytes, EmptyBytes, {
            value: record.amount,
          }),
      ).to.be.revertedWith("prepare: INVALID_CHAINIDS");
    });

    it("should revert if param sending or receiving chainId and amount is zero", async () => {
      const { transaction, record } = await getTransactionData({});
      await expect(
        transactionManager.connect(user).prepare(transaction, 0, record.expiry, EmptyBytes, EmptyBytes, EmptyBytes, {
          value: record.amount,
        }),
      ).to.be.revertedWith("prepare: AMOUNT_IS_ZERO");
    });

    it("should revert if digest already exist", async () => {
      const { transaction, record } = await getTransactionData();

      await prepareAndAssert(transaction, record, user, transactionManager);

      await expect(
        transactionManager
          .connect(user)
          .prepare(transaction, record.amount, record.expiry, EmptyBytes, EmptyBytes, EmptyBytes, {
            value: record.amount,
          }),
      ).to.be.revertedWith("prepare: DIGEST_EXISTS");
    });

    it("should revert if value is not present for Ether/Native token", async () => {
      const { transaction, record } = await getTransactionData();

      await expect(
        transactionManager
          .connect(user)
          .prepare(transaction, record.amount, record.expiry, EmptyBytes, EmptyBytes, EmptyBytes),
      ).to.be.revertedWith("prepare: VALUE_MISMATCH");
    });

    it("should revert if value is not equal to amount param for Ether/Native token", async () => {
      const { transaction, record } = await getTransactionData();
      const falseAmount = "20";
      await expect(
        transactionManager
          .connect(user)
          .prepare(transaction, record.amount, record.expiry, EmptyBytes, EmptyBytes, EmptyBytes, {
            value: falseAmount,
          }),
      ).to.be.revertedWith("prepare: VALUE_MISMATCH");
    });

    it("should revert if value is non-zero for ERC20 token", async () => {
      const { transaction, record } = await getTransactionData({ sendingAssetId: tokenA.address });

      await expect(
        transactionManager
          .connect(user)
          .prepare(transaction, record.amount, record.expiry, EmptyBytes, EmptyBytes, EmptyBytes, {
            value: record.amount,
          }),
      ).to.be.revertedWith("prepare: ETH_WITH_ERC_TRANSFER");
    });

    it("should revert if transaction manager isn't approve for respective amount", async () => {
      const { transaction, record } = await getTransactionData({ sendingAssetId: tokenA.address });

      await expect(
        transactionManager
          .connect(user)
          .prepare(transaction, record.amount, record.expiry, EmptyBytes, EmptyBytes, EmptyBytes),
      ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
    });

    it("should fail if its an unapproved asset and it has not been renounced", async () => {
      const { transaction, record } = await getTransactionData({ sendingAssetId: Wallet.createRandom().address });
      await expect(
        transactionManager
          .connect(user)
          .prepare(transaction, record.amount, record.expiry, EmptyBytes, EmptyBytes, EmptyBytes, {
            value: record.amount,
          }),
      ).to.be.revertedWith("prepare: BAD_ASSET");
    });

    it("should revert iff senderChainId not equal to chainId and sender is diff from router", async () => {
      const { transaction, record } = await getTransactionData();

      await expect(
        transactionManagerReceiverSide
          .connect(user)
          .prepare(transaction, record.amount, record.expiry, EmptyBytes, EmptyBytes, EmptyBytes),
      ).to.be.revertedWith("prepare: ROUTER_MISMATCH");
    });

    it("should revert iff senderChainId not equal to chainId and msg.value is non-zero", async () => {
      const { transaction, record } = await getTransactionData();

      await expect(
        transactionManagerReceiverSide
          .connect(router)
          .prepare(transaction, record.amount, record.expiry, EmptyBytes, EmptyBytes, EmptyBytes, {
            value: record.amount,
          }),
      ).to.be.revertedWith("prepare: ETH_WITH_ROUTER_PREPARE");
    });

    it("should revert iff senderChainId not equal to chainId and router liquidity is lower than amount", async () => {
      const { transaction, record } = await getTransactionData({}, { amount: "1000000" });

      await expect(
        transactionManagerReceiverSide
          .connect(router)
          .prepare(transaction, record.amount, record.expiry, EmptyBytes, EmptyBytes, EmptyBytes),
      ).to.be.revertedWith("prepare: INSUFFICIENT_LIQUIDITY");
    });

    it("should work if the contract has been renounced and using unapproved router", async () => {
      const prepareAmount = "10";

      // Remove router
      const remove = await transactionManager.removeRouter(router.address);
      await remove.wait();
      expect(await transactionManager.approvedRouters(router.address)).to.be.false;

      // Renounce ownership
      const renounce = await transactionManager.renounce();
      await renounce.wait();
      expect(await transactionManager.renounced()).to.be.true;

      // Prepare
      await prepareAndAssert(
        {
          sendingAssetId: AddressZero,
          receivingAssetId: tokenB.address,
        },
        {
          amount: prepareAmount,
        },
      );
    });

    it("should work if the contract has been renounced and using unapproved asset", async () => {
      const prepareAmount = "10";
      const assetId = AddressZero;

      // Remove asset
      const remove = await transactionManager.removeAssetId(assetId);
      await remove.wait();
      expect(await transactionManager.approvedAssets(assetId)).to.be.false;

      // Renounce ownership
      const renounce = await transactionManager.renounce();
      await renounce.wait();
      expect(await transactionManager.renounced()).to.be.true;

      // Prepare
      await prepareAndAssert(
        {
          sendingAssetId: assetId,
          receivingAssetId: tokenB.address,
        },
        {
          amount: prepareAmount,
        },
      );
    });

    it("happy case: prepare by Bob for ERC20 with CallData", async () => {
      const prepareAmount = "10";
      const assetId = tokenA.address;

      // Get calldata
      const callData = counter.interface.encodeFunctionData("incrementAndSend", [
        assetId,
        other.address,
        prepareAmount,
      ]);
      const callDataHash = utils.keccak256(callData);

      const { transaction, record } = await getTransactionData({
        sendingAssetId: assetId,
        receivingAssetId: tokenB.address,
        callTo: counter.address,
        callDataHash: callDataHash,
      });
      await approveTokens(prepareAmount, user, transactionManager.address);

      await prepareAndAssert(
        transaction,
        {
          amount: prepareAmount,
        },
        user,
        transactionManager,
      );
    });

    it("happy case: prepare by Bob for ERC20", async () => {
      const prepareAmount = "10";
      const assetId = tokenA.address;

      await approveTokens(prepareAmount, user, transactionManager.address);

      await prepareAndAssert(
        {
          sendingAssetId: assetId,
          receivingAssetId: tokenB.address,
        },
        {
          amount: prepareAmount,
        },
        user,
        transactionManager,
      );
    });

    it("happy case: prepare by Bob for Ether/Native token", async () => {
      const prepareAmount = "10";

      await prepareAndAssert(
        {
          sendingAssetId: AddressZero,
          receivingAssetId: tokenB.address,
        },
        {
          amount: prepareAmount,
        },
      );
    });

    it("happy case: prepare by Router for ERC20", async () => {
      const prepareAmount = "100";
      const assetId = tokenA.address;

      await approveTokens(prepareAmount, router, transactionManager.address, tokenA);
      await addAndAssertLiquidity(prepareAmount, assetId, router, transactionManager);

      await prepareAndAssert(
        {
          sendingAssetId: tokenB.address,
          receivingAssetId: assetId,
          sendingChainId: 1338,
          receivingChainId: 1337,
        },
        { amount: prepareAmount },
        router,
      );
    });

    it("happy case: prepare by Router for Ether/Native token", async () => {
      const prepareAmount = "100";
      const assetId = AddressZero;

      await addAndAssertLiquidity(prepareAmount, assetId, router, transactionManagerReceiverSide);

      await prepareAndAssert(
        {
          sendingAssetId: assetId,
          receivingAssetId: assetId,
          sendingChainId: 1337,
          receivingChainId: 1338,
        },
        { amount: prepareAmount },
        router,
        transactionManagerReceiverSide,
      );
    });

    it("happy case: prepare by Bob, sent by relayer", async () => {
      const prepareAmount = "10";
      const assetId = AddressZero;

      const { transaction, record } = await getTransactionData(
        { sendingAssetId: assetId, receivingAssetId: tokenB.address },
        { amount: prepareAmount },
      );

      await prepareAndAssert(transaction, record, other, transactionManager);
    });
  });

  describe("#fulfill", () => {
    // TODO: reentrant cases
    it("should revert if transactionStatus for respective digest isn't pending", async () => {
      const { transaction, record } = await getTransactionData();
      const relayerFee = "10";

      const invariantDigest = getInvariantTransactionDigest(transaction);
      expect(await transactionManager.variantTransactionData(invariantDigest)).to.be.eq(utils.formatBytes32String(""));

      const signature = await signFulfillTransactionPayload(transaction.transactionId, relayerFee, user);
      await expect(
        transactionManager.connect(router).fulfill(
          {
            ...transaction,
            ...record,
          },
          relayerFee,
          signature,
          EmptyBytes,
        ),
      ).to.be.revertedWith("fulfill: INVALID_VARIANT_DATA");
    });

    it("should revert if expiry of transaction is behind current blockstamp", async () => {
      const { transaction, record } = await getTransactionData();

      const relayerFee = "10";

      const { blockNumber } = await prepareAndAssert(transaction, record, user, transactionManager);

      const invariantDigest = getInvariantTransactionDigest(transaction);
      const variant = {
        amount: record.amount,
        expiry: record.expiry,
        preparedBlockNumber: blockNumber,
      };
      const variantDigestBeforeFulfill = getVariantTransactionDigest(variant);

      expect(await transactionManager.variantTransactionData(invariantDigest)).to.be.eq(variantDigestBeforeFulfill);

      await advanceBlockTime(+record.expiry + 1_000);

      const signature = await signFulfillTransactionPayload(transaction.transactionId, relayerFee, user);

      await expect(
        transactionManager.connect(router).fulfill(
          {
            ...transaction,
            ...variant,
          },
          relayerFee,
          signature,
          EmptyBytes,
        ),
      ).to.be.revertedWith("fulfill: EXPIRED");
    });

    it("should revert if transaction is already fulfilled", async () => {
      const { transaction, record } = await getTransactionData();
      const relayerFee = "1";
      const { blockNumber } = await prepareAndAssert(transaction, record, user, transactionManager);
      const signature = await signFulfillTransactionPayload(transaction.transactionId, relayerFee, user);

      // User fulfills
      await fulfillAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        relayerFee,
        false,
        router,
        transactionManager,
      );

      await expect(
        transactionManager.connect(router).fulfill(
          {
            ...transaction,
            amount: record.amount,
            expiry: record.expiry,
            preparedBlockNumber: 0,
          },
          relayerFee,
          signature,
          EmptyBytes,
        ),
      ).to.be.revertedWith("fulfill: ALREADY_COMPLETED");
    });

    it("should revert if param user didn't sign the signature", async () => {
      const { transaction, record } = await getTransactionData();
      const relayerFee = "10";
      const { blockNumber } = await prepareAndAssert(transaction, record, user, transactionManager);

      const variant = {
        amount: record.amount,
        expiry: record.expiry,
        preparedBlockNumber: blockNumber,
      };

      const signature = await signFulfillTransactionPayload(
        transaction.transactionId,
        relayerFee,
        Wallet.createRandom(),
      );

      await expect(
        transactionManager.connect(router).fulfill(
          {
            ...transaction,
            ...variant,
          },
          relayerFee,
          signature,
          EmptyBytes,
        ),
      ).to.be.revertedWith("fulfill: INVALID_SIGNATURE");
    });

    it("should revert if relayer fee is higher than amount", async () => {
      const { transaction, record } = await getTransactionData();
      const relayerFee = "10000000000";
      const { blockNumber } = await prepareAndAssert(transaction, record, user, transactionManager);

      const variant = {
        amount: record.amount,
        expiry: record.expiry,
        preparedBlockNumber: blockNumber,
      };

      const signature = await signFulfillTransactionPayload(transaction.transactionId, relayerFee, user);

      await expect(
        transactionManager.connect(router).fulfill(
          {
            ...transaction,
            ...variant,
          },
          relayerFee,
          signature,
          EmptyBytes,
        ),
      ).to.be.revertedWith("fulfill: INVALID_RELAYER_FEE");
    });

    it("should revert iff it's sending chain and interacting party is not router", async () => {
      const { transaction, record } = await getTransactionData();
      const relayerFee = "1";
      const { blockNumber } = await prepareAndAssert(transaction, record, user, transactionManager);

      const variant = {
        amount: record.amount,
        expiry: record.expiry,
        preparedBlockNumber: blockNumber,
      };

      const signature = await signFulfillTransactionPayload(transaction.transactionId, relayerFee, user);

      await expect(
        transactionManager.connect(user).fulfill(
          {
            ...transaction,
            ...variant,
          },
          relayerFee,
          signature,
          EmptyBytes,
        ),
      ).to.be.revertedWith("fulfill: ROUTER_MISMATCH");
    });

    it("happy case: router fulfills in native asset", async () => {
      const prepareAmount = "100";
      const assetId = AddressZero;
      const relayerFee = "10";

      // Add receiving liquidity
      await addAndAssertLiquidity(prepareAmount, assetId, router, transactionManagerReceiverSide);

      const { transaction, record } = await getTransactionData(
        {
          sendingAssetId: assetId,
          receivingAssetId: assetId,
        },
        { amount: prepareAmount },
      );

      // User prepares
      await approveTokens(prepareAmount, user, transactionManagerReceiverSide.address, tokenB);
      const { blockNumber } = await prepareAndAssert(transaction, record, user);

      // Router fulfills
      await fulfillAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        relayerFee,
        false,
        router,
        transactionManager,
      );
    });

    it("happy case: router fulfills in ERC20", async () => {
      const prepareAmount = "100";
      const assetId = tokenA.address;
      const relayerFee = "10";

      // Add receiving liquidity
      await approveTokens(prepareAmount, router, transactionManagerReceiverSide.address, tokenA);
      await addAndAssertLiquidity(prepareAmount, assetId, router, transactionManagerReceiverSide);

      const { transaction, record } = await getTransactionData(
        {
          sendingAssetId: AddressZero,
          receivingAssetId: assetId,
        },
        { amount: prepareAmount },
      );

      // User prepares
      await approveTokens(prepareAmount, user, transactionManagerReceiverSide.address, tokenB);
      const { blockNumber } = await prepareAndAssert(transaction, record, user);

      // Router fulfills
      await fulfillAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        relayerFee,
        false,
        router,
        transactionManager,
      );
    });

    it("happy case: user fulfills in native asset", async () => {
      const prepareAmount = "100";
      const assetId = AddressZero;
      const relayerFee = "10";

      // Add receiving liquidity
      await addAndAssertLiquidity(prepareAmount, assetId, router, transactionManagerReceiverSide);

      const { transaction, record } = await getTransactionData(
        {
          sendingChainId: (await transactionManager.chainId()).toNumber(),
          receivingChainId: (await transactionManagerReceiverSide.chainId()).toNumber(),
          sendingAssetId: assetId,
          receivingAssetId: assetId,
        },
        { amount: prepareAmount },
      );

      // Router prepares
      const { blockNumber } = await prepareAndAssert(transaction, record, router, transactionManagerReceiverSide);

      // User fulfills
      await fulfillAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        relayerFee,
        true,
        user,
        transactionManagerReceiverSide,
      );
    });

    it("happy case: user fulfills in ERC20", async () => {
      const prepareAmount = "100";
      const assetId = tokenB.address;
      const relayerFee = "10";

      // Add receiving liquidity
      await approveTokens(prepareAmount, router, transactionManagerReceiverSide.address, tokenB);
      await addAndAssertLiquidity(prepareAmount, assetId);

      const { transaction, record } = await getTransactionData(
        {
          sendingChainId: (await transactionManager.chainId()).toNumber(),
          receivingChainId: (await transactionManagerReceiverSide.chainId()).toNumber(),
          sendingAssetId: tokenA.address,
          receivingAssetId: assetId,
        },
        { amount: prepareAmount },
      );

      // Router prepares
      const { blockNumber } = await prepareAndAssert(transaction, record, router, transactionManagerReceiverSide);

      // User fulfills
      await fulfillAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        relayerFee,
        true,
        user,
        transactionManagerReceiverSide,
      );
    });

    it("should handle external calls with ERC20 (external calls do not revert)", async () => {
      const prepareAmount = "100";
      const assetId = tokenB.address;
      const relayerFee = "10";
      const counterAmount = BigNumber.from(prepareAmount).sub(relayerFee);

      // Get calldata
      const callData = counter.interface.encodeFunctionData("incrementAndSend", [
        assetId,
        other.address,
        counterAmount.toString(),
      ]);
      const callDataHash = utils.keccak256(callData);

      // Add receiving liquidity
      await approveTokens(prepareAmount, router, transactionManagerReceiverSide.address, tokenB);
      await addAndAssertLiquidity(prepareAmount, assetId);

      const { transaction, record } = await getTransactionData(
        {
          sendingAssetId: tokenA.address,
          receivingAssetId: assetId,
          callDataHash,
          callTo: counter.address,
        },
        { amount: prepareAmount },
      );

      // Router prepares
      const { blockNumber } = await prepareAndAssert(transaction, record, router, transactionManagerReceiverSide);

      const preExecute = await counter.count();
      const balance = await getOnchainBalance(assetId, other.address, other.provider);

      // User fulfills
      await fulfillAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        relayerFee,
        true,
        user,
        transactionManagerReceiverSide,
        callData,
      );

      expect(await counter.count()).to.be.eq(preExecute.add(1));
      expect(await getOnchainBalance(assetId, other.address, other.provider)).to.be.eq(balance.add(counterAmount));
    });

    it("should handle external calls with native asset (external calls do not revert)", async () => {
      const prepareAmount = "10";
      const relayerFee = "1";
      const counterAmount = BigNumber.from(prepareAmount).sub(relayerFee);

      // Get calldata
      const callData = counter.interface.encodeFunctionData("incrementAndSend", [
        AddressZero,
        other.address,
        counterAmount.toString(),
      ]);
      const callDataHash = utils.keccak256(callData);

      const { transaction, record } = await getTransactionData(
        {
          sendingAssetId: AddressZero,
          receivingAssetId: AddressZero,
          callTo: counter.address,
          callDataHash: callDataHash,
        },
        { amount: prepareAmount },
      );

      await addAndAssertLiquidity(prepareAmount, transaction.receivingAssetId, router, transactionManagerReceiverSide);
      const { blockNumber } = await prepareAndAssert(transaction, record, router, transactionManagerReceiverSide);

      const preExecute = await counter.count();
      const balance = await other.getBalance();

      await fulfillAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        relayerFee,
        true,
        user,
        transactionManagerReceiverSide,
        callData,
      );

      expect(await counter.count()).to.be.eq(preExecute.add(1));
      expect(await other.getBalance()).to.be.eq(balance.add(counterAmount));
    });

    it("should handle external calls with ERC20 that revert (sends to fallback address)", async () => {
      const prepareAmount = "100";
      const assetId = tokenB.address;
      const relayerFee = "10";
      const counterAmount = BigNumber.from(prepareAmount).sub(relayerFee);

      // Set to revert
      const revert = await counter.setShouldRevert(true);
      await revert.wait();
      expect(await counter.shouldRevert()).to.be.true;

      // Get calldata
      const callData = counter.interface.encodeFunctionData("incrementAndSend", [
        assetId,
        other.address,
        counterAmount.toString(),
      ]);
      const callDataHash = utils.keccak256(callData);

      // Add receiving liquidity
      await approveTokens(prepareAmount, router, transactionManagerReceiverSide.address, tokenB);
      await addAndAssertLiquidity(prepareAmount, assetId);

      const { transaction, record } = await getTransactionData(
        {
          sendingAssetId: tokenA.address,
          receivingAssetId: assetId,
          callDataHash,
          callTo: counter.address,
        },
        { amount: prepareAmount },
      );

      // Router prepares
      const { blockNumber } = await prepareAndAssert(transaction, record, router, transactionManagerReceiverSide);

      const preExecute = await counter.count();
      const otherBalance = await getOnchainBalance(assetId, other.address, other.provider);
      const fallbackBalance = await getOnchainBalance(assetId, transaction.receivingAddress, other.provider);

      // User fulfills
      await fulfillAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        relayerFee,
        true,
        user,
        transactionManagerReceiverSide,
        callData,
      );

      expect(await counter.count()).to.be.eq(preExecute);
      expect(await getOnchainBalance(assetId, other.address, other.provider)).to.be.eq(otherBalance);
      expect(await getOnchainBalance(assetId, transaction.receivingAddress, other.provider)).to.be.eq(
        fallbackBalance.add(counterAmount),
      );
    });

    it("should handle external calls with native asset that revert (sends to fallback address)", async () => {
      const prepareAmount = "10";
      const relayerFee = "1";
      const counterAmount = BigNumber.from(prepareAmount).sub(relayerFee);

      // Set to revert
      const revert = await counter.setShouldRevert(true);
      await revert.wait();
      expect(await counter.shouldRevert()).to.be.true;

      // Get calldata
      const callData = counter.interface.encodeFunctionData("incrementAndSend", [
        AddressZero,
        other.address,
        counterAmount.toString(),
      ]);
      const callDataHash = utils.keccak256(callData);

      const fallback = Wallet.createRandom().connect(ethers.provider);

      const { transaction, record } = await getTransactionData(
        {
          sendingAssetId: AddressZero,
          receivingAssetId: AddressZero,
          callTo: counter.address,
          callDataHash: callDataHash,
          receivingAddress: fallback.address,
        },
        { amount: prepareAmount },
      );

      await addAndAssertLiquidity(prepareAmount, transaction.receivingAssetId, router, transactionManagerReceiverSide);
      const { blockNumber } = await prepareAndAssert(transaction, record, router, transactionManagerReceiverSide);

      const preExecute = await counter.count();
      const fallbackBalance = await fallback.getBalance();
      const otherBalance = await other.getBalance();

      await fulfillAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        relayerFee,
        true,
        user,
        transactionManagerReceiverSide,
        callData,
      );

      expect(await counter.count()).to.be.eq(preExecute);
      expect(await other.getBalance()).to.be.eq(otherBalance);
      expect(await fallback.getBalance()).to.be.eq(fallbackBalance.add(counterAmount));
    });
  });

  describe("#cancel", () => {
    it("should error if invalid txData", async () => {
      const prepareAmount = "10";
      const assetId = AddressZero;
      const relayerFee = constants.Zero;

      // Add receiving liquidity
      await addAndAssertLiquidity(prepareAmount, assetId, router, transactionManagerReceiverSide);

      const { transaction, record } = await getTransactionData({}, { amount: prepareAmount });

      const { blockNumber } = await prepareAndAssert(transaction, record, router, transactionManagerReceiverSide);

      const signature = await signCancelTransactionPayload(transaction.transactionId, relayerFee.toString(), user);
      await expect(
        transactionManagerReceiverSide
          .connect(user)
          .cancel(
            { ...transaction, amount: record.amount, expiry: record.expiry, preparedBlockNumber: 0 },
            relayerFee,
            signature,
          ),
      ).to.be.revertedWith("cancel: INVALID_VARIANT_DATA");
    });

    it("should error if transaction is already fulfilled/cancelled", async () => {
      const prepareAmount = "10";
      const assetId = AddressZero;
      const relayerFee = constants.Zero;

      // Add receiving liquidity
      await addAndAssertLiquidity(prepareAmount, assetId, router, transactionManagerReceiverSide);

      const { transaction, record } = await getTransactionData({}, { amount: prepareAmount });

      const { blockNumber } = await prepareAndAssert(transaction, record, router, transactionManagerReceiverSide);
      // User fulfills
      await fulfillAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        relayerFee.toString(),
        true,
        user,
        transactionManagerReceiverSide,
      );

      const signature = await signCancelTransactionPayload(transaction.transactionId, relayerFee.toString(), user);
      await expect(
        transactionManagerReceiverSide
          .connect(user)
          .cancel(
            { ...transaction, amount: record.amount, expiry: record.expiry, preparedBlockNumber: 0 },
            relayerFee,
            signature,
          ),
      ).to.be.revertedWith("cancel: ALREADY_COMPLETED");
    });

    it("should error iff it's sendingChainId and expiry didn't pass yet & cancellation initiator isn't router", async () => {
      const relayerFee = constants.Zero;
      const prepareAmount = "10";

      const { transaction, record } = await getTransactionData(
        {
          sendingAssetId: AddressZero,
          receivingAssetId: tokenB.address,
        },
        {
          amount: prepareAmount,
        },
      );

      const { blockNumber } = await prepareAndAssert(transaction, record, user, transactionManager);

      const signature = await signCancelTransactionPayload(transaction.transactionId, relayerFee.toString(), user);
      await expect(
        transactionManager
          .connect(receiver)
          .cancel(
            { ...transaction, amount: record.amount, expiry: record.expiry, preparedBlockNumber: blockNumber },
            relayerFee,
            signature,
          ),
      ).to.be.revertedWith("cancel: ROUTER_MUST_CANCEL");
    });

    it("should error iff it's sendingChainId & expiry is pass & relayer fee is provided & signature is invalid & user is not sending", async () => {
      const relayerFee = BigNumber.from(1);
      const prepareAmount = "10";

      const { transaction, record } = await getTransactionData(
        {
          sendingAssetId: AddressZero,
          receivingAssetId: tokenB.address,
        },
        {
          amount: prepareAmount,
        },
      );

      const { blockNumber } = await prepareAndAssert(transaction, record, user, transactionManager);

      await advanceBlockTime(+record.expiry + 1_000);
      const signature = await signCancelTransactionPayload(transaction.transactionId, relayerFee.toString(), receiver);
      await expect(
        transactionManager
          .connect(receiver)
          .cancel(
            { ...transaction, amount: record.amount, expiry: record.expiry, preparedBlockNumber: blockNumber },
            relayerFee,
            signature,
          ),
      ).to.be.revertedWith("cancel: INVALID_SIGNATURE");
    });

    it("should work iff it's sendingChainId & expiry is pass & relayer fee is provided & signature is invalid & user is sending", async () => {
      const prepareAmount = "10";
      const assetId = AddressZero;
      const relayerFee = BigNumber.from(1);

      // Add receiving liquidity
      await addAndAssertLiquidity(prepareAmount, assetId, router, transactionManagerReceiverSide);

      const { transaction, record } = await getTransactionData({}, { amount: prepareAmount });

      const { blockNumber } = await prepareAndAssert(transaction, record, router, transactionManagerReceiverSide);

      await advanceBlockTime(+record.expiry + 1_000);

      await cancelAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        user,
        transactionManagerReceiverSide,
        relayerFee,
        await signCancelTransactionPayload(transaction.transactionId, relayerFee.toString(), receiver),
      );
    });

    it("should error iff it's receivingChainId & within expiry & signature is invalid && user did not send", async () => {
      const relayerFee = BigNumber.from(1);
      const prepareAmount = "10";
      const assetId = AddressZero;

      // Add receiving liquidity
      await addAndAssertLiquidity(prepareAmount, assetId, router, transactionManagerReceiverSide);

      const { transaction, record } = await getTransactionData({}, { amount: prepareAmount });

      const { blockNumber } = await prepareAndAssert(transaction, record, router, transactionManagerReceiverSide);

      const signature = await signCancelTransactionPayload(transaction.transactionId, relayerFee.toString(), receiver);
      await expect(
        transactionManagerReceiverSide
          .connect(receiver)
          .cancel(
            { ...transaction, amount: record.amount, expiry: record.expiry, preparedBlockNumber: blockNumber },
            relayerFee,
            signature,
          ),
      ).to.be.revertedWith("cancel: INVALID_SIGNATURE");
    });

    it("should work iff it's receivingChainId & within expiry & signature is invalid && user is sending", async () => {
      const relayerFee = BigNumber.from(1);
      const prepareAmount = "10";
      const assetId = AddressZero;

      // Add receiving liquidity
      await addAndAssertLiquidity(prepareAmount, assetId, router, transactionManagerReceiverSide);

      const { transaction, record } = await getTransactionData({}, { amount: prepareAmount });

      const { blockNumber } = await prepareAndAssert(transaction, record, router, transactionManagerReceiverSide);

      const signature = await signCancelTransactionPayload(transaction.transactionId, relayerFee.toString(), receiver);

      await cancelAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        user, // To avoid balance checks for eth
        transactionManagerReceiverSide,
        undefined,
        signature,
      );
    });

    it("happy case: user cancels ETH before expiry", async () => {
      const prepareAmount = "10";
      const assetId = AddressZero;

      // Add receiving liquidity
      await addAndAssertLiquidity(prepareAmount, assetId, router, transactionManagerReceiverSide);

      const { transaction, record } = await getTransactionData({}, { amount: prepareAmount });

      const { blockNumber } = await prepareAndAssert(transaction, record, router, transactionManagerReceiverSide);

      await cancelAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        user, // To avoid balance checks for eth
        transactionManagerReceiverSide,
      );
    });

    it("happy case: user cancels ERC20 before expiry", async () => {
      const prepareAmount = "10";

      // Add receiving liquidity
      await approveTokens(prepareAmount, router, transactionManagerReceiverSide.address, tokenB);
      await addAndAssertLiquidity(prepareAmount, tokenB.address, router, transactionManagerReceiverSide);

      const { transaction, record } = await getTransactionData(
        {
          sendingAssetId: tokenA.address,
          receivingAssetId: tokenB.address,
        },
        { amount: prepareAmount },
      );

      const { blockNumber } = await prepareAndAssert(transaction, record, router, transactionManagerReceiverSide);

      await cancelAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        user, // To avoid balance checks for eth
        transactionManagerReceiverSide,
      );
    });

    it("happy case: router cancels ETH before expiry", async () => {
      const prepareAmount = "10";

      const { transaction, record } = await getTransactionData(
        {
          sendingAssetId: AddressZero,
          receivingAssetId: tokenB.address,
        },
        {
          amount: prepareAmount,
        },
      );

      const { blockNumber } = await prepareAndAssert(transaction, record, user, transactionManager);

      await cancelAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        router, // To avoid balance checks for eth
        transactionManager,
      );
    });

    it("happy case: router cancels ERC20 before expiry", async () => {
      const prepareAmount = "10";

      const { transaction, record } = await getTransactionData(
        {
          sendingAssetId: tokenA.address,
          receivingAssetId: tokenB.address,
        },
        {
          amount: prepareAmount,
        },
      );

      await approveTokens(prepareAmount, user, transactionManager.address, tokenA);
      const { blockNumber } = await prepareAndAssert(transaction, record, user, transactionManager);

      await cancelAndAssert(transaction, { ...record, preparedBlockNumber: blockNumber }, router, transactionManager);
    });

    it("happy case: user cancels ETH after expiry", async () => {
      const prepareAmount = "10";
      const assetId = AddressZero;
      const relayerFee = BigNumber.from(1);

      // Add receiving liquidity
      await addAndAssertLiquidity(prepareAmount, assetId, router, transactionManagerReceiverSide);

      const { transaction, record } = await getTransactionData({}, { amount: prepareAmount });

      const { blockNumber } = await prepareAndAssert(transaction, record, router, transactionManagerReceiverSide);

      await advanceBlockTime(+record.expiry + 1_000);

      await cancelAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        user,
        transactionManagerReceiverSide,
        relayerFee,
      );
    });

    it("happy case: user cancels ERC20 after expiry", async () => {
      const prepareAmount = "10";
      const relayerFee = BigNumber.from(1);

      // Add receiving liquidity
      await approveTokens(prepareAmount, router, transactionManagerReceiverSide.address, tokenB);
      await addAndAssertLiquidity(prepareAmount, tokenB.address, router, transactionManagerReceiverSide);

      const { transaction, record } = await getTransactionData(
        {
          sendingAssetId: tokenA.address,
          receivingAssetId: tokenB.address,
        },
        { amount: prepareAmount },
      );

      const { blockNumber } = await prepareAndAssert(transaction, record, router, transactionManagerReceiverSide);

      await advanceBlockTime(+record.expiry + 1_000);
      await cancelAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        user,
        transactionManagerReceiverSide,
        relayerFee,
      );
    });

    it("happy case: router cancels ETH after expiry", async () => {
      const prepareAmount = "10";
      const relayerFee = BigNumber.from(1);

      const { transaction, record } = await getTransactionData(
        {
          sendingAssetId: AddressZero,
          receivingAssetId: tokenB.address,
        },
        {
          amount: prepareAmount,
        },
      );

      const { blockNumber } = await prepareAndAssert(transaction, record, user, transactionManager);

      await advanceBlockTime(+record.expiry + 1_000);
      await cancelAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        router,
        transactionManager,
        relayerFee,
      );
    });

    it("happy case: router cancels ERC20 after expiry", async () => {
      const prepareAmount = "10";
      const relayerFee = BigNumber.from(1);

      const { transaction, record } = await getTransactionData(
        {
          sendingAssetId: tokenA.address,
          receivingAssetId: tokenB.address,
        },
        {
          amount: prepareAmount,
        },
      );

      await approveTokens(prepareAmount, user, transactionManager.address, tokenA);
      const { blockNumber } = await prepareAndAssert(transaction, record, user, transactionManager);

      await advanceBlockTime(+record.expiry + 1_000);
      await cancelAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        router,
        transactionManager,
        relayerFee,
      );
    });

    it("happy case: thirdParty cancels at sender-side ETH after expiry", async () => {
      const prepareAmount = "10";
      const relayerFee = BigNumber.from(1);

      const { transaction, record } = await getTransactionData(
        {
          sendingAssetId: AddressZero,
          receivingAssetId: tokenB.address,
        },
        {
          amount: prepareAmount,
        },
      );

      const { blockNumber } = await prepareAndAssert(transaction, record, user, transactionManager);

      await advanceBlockTime(+record.expiry + 1_000);
      await cancelAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        other,
        transactionManager,
        relayerFee,
      );
    });

    it("happy case: thirdParty cancels at receiver-side ETH after expiry", async () => {
      const prepareAmount = "10";
      const assetId = AddressZero;
      const relayerFee = BigNumber.from(1);

      // Add receiving liquidity
      await addAndAssertLiquidity(prepareAmount, assetId, router, transactionManagerReceiverSide);

      const { transaction, record } = await getTransactionData({}, { amount: prepareAmount });

      const { blockNumber } = await prepareAndAssert(transaction, record, router, transactionManagerReceiverSide);

      await advanceBlockTime(+record.expiry + 1_000);

      await cancelAndAssert(
        transaction,
        { ...record, preparedBlockNumber: blockNumber },
        other,
        transactionManagerReceiverSide,
        relayerFee,
      );
    });
  });
});

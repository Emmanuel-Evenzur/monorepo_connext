import { ethers, waffle } from "hardhat";
import { expect, use } from "chai";
import { utils } from "ethers";
import { solidity } from "ethereum-waffle";

use(solidity);

// import types
import { LibAssetTest } from "../../typechain/LibAssetTest";
import { TestERC20 } from "../../typechain/TestERC20";
import { BigNumber, constants } from "ethers";

const { AddressZero } = constants;

const createFixtureLoader = waffle.createFixtureLoader;
describe("LibAsset", () => {
  const [wallet, other, receiver] = waffle.provider.getWallets();

  let libAssetTest: LibAssetTest;
  let token: TestERC20;

  const fixture = async () => {
    const libAssetTestFactory = await ethers.getContractFactory("LibAssetTest");
    const testERC20Factory = await ethers.getContractFactory("TestERC20");

    libAssetTest = (await libAssetTestFactory.deploy()) as LibAssetTest;
    token = (await testERC20Factory.deploy()) as TestERC20;
    return { libAssetTest, token };
  };

  let loadFixture: ReturnType<typeof createFixtureLoader>;
  before("create fixture loader", async () => {
    loadFixture = createFixtureLoader([wallet, other]);
  });

  beforeEach(async () => {
    ({ libAssetTest, token } = await loadFixture(fixture));
  });

  it("should deploy", async () => {
    expect(libAssetTest.address).to.be.a("string");
    expect(token.address).to.be.a("string");
  });

  describe("#isEther", () => {
    it("should return true if assetId is AddressZero", async () => {
      const res = await libAssetTest.isEther(AddressZero);
      expect(res).to.be.true;
    });

    it("should return false if assetId is Non-AddressZero", async () => {
      const res = await libAssetTest.isEther("0x0f5d2fb29fb7d3cfee444a200298f468908cc942");
      expect(res).to.be.false;
    });
  });

  describe("#getOwnBalance", () => {
    it("should error if erc20 contract doesn't exist", async () => {
      await expect(libAssetTest.getOwnBalance("0x0f5d2fb29fb7d3cfee444a200298f468908cc940")).to.be.reverted;
    });

    it.skip("should return native asset balance if AddressZero", async () => {
      const amount = BigNumber.from(1);
      // const signer = await wallet.getSigner();

      await wallet.sendTransaction({
        to: libAssetTest.address,
        value: utils.parseEther(amount.toString()),
        gasLimit: 21000,
      });

      const res = await libAssetTest.getOwnBalance(AddressZero);
      expect(BigNumber.isBigNumber(res)).to.be.true;
      expect(res).to.be.eq(BigNumber.from(amount));
    });

    it("should return Erc20 asset balance if Non-AddressZero", async () => {
      const amount = BigNumber.from(1);
      const Erc20TokenAddress = token.address;

      await token.connect(wallet).transfer(libAssetTest.address, amount);
      const res = await libAssetTest.connect(other).getOwnBalance(Erc20TokenAddress);

      expect(BigNumber.isBigNumber(res)).to.be.true;
      expect(res).to.be.eq(amount);
    });
  });

  describe("#transferEther", () => {
    it("should fail if transferring ether fails", async () => {
      await expect(libAssetTest.connect(wallet).transferEther(wallet.address, BigNumber.from(10_000))).to.be.reverted;
    });

    it.skip("happy case: transferEther", async () => {
      const amount = BigNumber.from(1);

      await wallet.sendTransaction({
        to: libAssetTest.address,
        value: utils.parseEther(amount.toString()),
        gasLimit: 21000,
      });

      await libAssetTest.connect(wallet).transferEther(receiver.address, amount);
    });
  });

  describe("#transferERC20", () => {
    it("happy case: transferERC20", async () => {
      const amount = BigNumber.from(1);

      await token.connect(wallet).transfer(libAssetTest.address, amount);

      const approveRes = await token.connect(wallet).approve(libAssetTest.address, amount);
      await approveRes.wait();

      expect(await token.balanceOf(receiver.address)).to.be.eq(0);

      const res = await libAssetTest.connect(wallet).transferERC20(token.address, receiver.address, amount);
      await res.wait();

      expect(await token.balanceOf(receiver.address)).to.be.eq(amount);
    });
  });
});

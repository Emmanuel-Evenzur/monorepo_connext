import { createStubInstance, reset, restore, SinonStubbedInstance, stub } from "sinon";
import { expect, mkAddress, XTransferStatus, getRandomBytes32, Logger } from "@connext/nxtp-utils";
import { ChainReader } from "@connext/nxtp-txservice";
import { mock } from "./mock";
import { NxtpSdkUtils } from "../src/sdkUtils";
import { getEnvConfig } from "../src/config";
import { ChainDataUndefined, UriInvalid } from "../src/lib/errors";

import * as ConfigFns from "../src/config";
import * as SharedFns from "../src/lib/helpers/shared";

const mockConfig = mock.config();
const mockChainData = mock.chainData();
const mockDeployments = mock.contracts.deployments();
const chainId = 1337;

describe("SdkUtils", () => {
  let nxtpUtils: NxtpSdkUtils;
  let config: ConfigFns.NxtpSdkConfig;
  let logger: Logger;

  beforeEach(async () => {
    config = getEnvConfig(mockConfig, mockChainData, mockDeployments);
    logger = new Logger({ name: "NxtpSdkUtils", level: config.logLevel });

    stub(ConfigFns, "getConfig").resolves(config);
    stub(SharedFns, "getChainIdFromDomain").resolves(chainId);
    stub(SharedFns, "axiosGetRequest").resolves({ data: {} });

    nxtpUtils = await NxtpSdkUtils.create(mockConfig, undefined, mockChainData);
  });

  afterEach(() => {
    restore();
    reset();
  });

  describe("#create", () => {
    it("happy: should work", async () => {
      expect(nxtpUtils).to.not.be.undefined;
      expect(nxtpUtils.config).to.not.be.null;
      expect(nxtpUtils.chainData).to.not.be.null;

      expect(nxtpUtils.getRoutersData).to.be.a("function");
      expect(nxtpUtils.getAssetsData).to.be.a("function");
      expect(nxtpUtils.getTransfers).to.be.a("function");
    });

    it("should error if chaindata is undefined", async () => {
      stub(SharedFns, "getChainData").resolves(undefined);
      await expect(NxtpSdkUtils.create(config)).to.be.rejectedWith(ChainDataUndefined);
    });
  });

  describe("#getRoutersData", () => {
    it("happy: should work", async () => {
      (nxtpUtils as any).config.cartographerUrl = config.cartographerUrl;
      const res = await nxtpUtils.getRoutersData();

      expect(res.data).to.not.be.undefined;
    });

    it("should error if validateUri fails", async () => {
      (nxtpUtils as any).config.cartographerUrl = "invalidUrl";

      await expect(nxtpUtils.getRoutersData()).to.be.rejectedWith(UriInvalid);
    });
  });

  describe("#getAssetsData", () => {
    it("happy: should work", async () => {
      (nxtpUtils as any).config.cartographerUrl = config.cartographerUrl;
      const res = await nxtpUtils.getAssetsData();

      expect(res.data).to.not.be.undefined;
    });

    it("should error if validateUri fails", async () => {
      (nxtpUtils as any).config.cartographerUrl = "invalidUrl";

      await expect(nxtpUtils.getAssetsData()).to.be.rejectedWith(UriInvalid);
    });
  });

  describe("#getTransfers", () => {
    it("happy: should work with userAddress", async () => {
      (nxtpUtils as any).config.cartographerUrl = config.cartographerUrl;
      const res = await nxtpUtils.getTransfers({
        userAddress: mockConfig.signerAddress,
      });

      expect(res.data).to.not.be.undefined;
    });

    it("happy: should work with routerAddress", async () => {
      (nxtpUtils as any).config.cartographerUrl = config.cartographerUrl;
      const res = await nxtpUtils.getTransfers({
        routerAddress: mock.address.router,
      });

      expect(res.data).to.not.be.undefined;
    });

    it("happy: should work with status", async () => {
      (nxtpUtils as any).config.cartographerUrl = config.cartographerUrl;
      const res = await nxtpUtils.getTransfers({
        status: XTransferStatus.XCalled,
      });

      expect(res.data).to.not.be.undefined;
    });

    it("happy: should work with transferId", async () => {
      (nxtpUtils as any).config.cartographerUrl = config.cartographerUrl;
      const res = await nxtpUtils.getTransfers({
        transferId: getRandomBytes32(),
      });

      expect(res.data).to.not.be.undefined;
    });

    it("happy: should work with transactionHash", async () => {
      (nxtpUtils as any).config.cartographerUrl = config.cartographerUrl;
      const res = await nxtpUtils.getTransfers({
        transactionHash: getRandomBytes32(),
      });

      expect(res.data).to.not.be.undefined;
    });

    it("happy: should work with range", async () => {
      (nxtpUtils as any).config.cartographerUrl = config.cartographerUrl;
      const res = await nxtpUtils.getTransfers({
        range: {
          limit: 100,
          offset: 20,
        },
      });

      expect(res.data).to.not.be.undefined;
    });

    it("happy: should work with all params", async () => {
      (nxtpUtils as any).config.cartographerUrl = config.cartographerUrl;
      const res = await nxtpUtils.getTransfers({
        userAddress: mockConfig.signerAddress,
        routerAddress: mock.address.router,
        status: XTransferStatus.XCalled,
        transferId: getRandomBytes32(),
        transactionHash: getRandomBytes32(),
        range: {
          limit: 100,
          offset: 20,
        },
      });

      expect(res.data).to.not.be.undefined;
    });

    it("should error if validateUri fails", async () => {
      (nxtpUtils as any).config.cartographerUrl = "invalidUrl";

      await expect(nxtpUtils.getTransfers({})).to.be.rejectedWith(UriInvalid);
    });
  });
});

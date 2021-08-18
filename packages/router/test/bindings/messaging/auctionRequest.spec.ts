import {
  AuctionBid,
  AuctionPayload,
  createRequestContext,
  expect,
  mkAddress,
  mkBytes32,
  mkSig,
} from "@connext/nxtp-utils";
import { reset, restore, SinonStub, stub } from "sinon";
import { auctionRequestBinding } from "../../../src/bindings/messaging/auctionRequest";
import { messagingMock } from "../../globalTestHook";
import * as operations from "../../../src/lib/operations";
import { AuctionExpired } from "../../../src/lib/errors";

let newAuctionStub: SinonStub;

const auctionPayload: AuctionPayload = {
  user: mkAddress("0xa"),
  sendingChainId: 1337,
  sendingAssetId: mkAddress("0xc"),
  amount: "10000",
  receivingChainId: 1338,
  receivingAssetId: mkAddress("0xf"),
  receivingAddress: mkAddress("0xd"),
  expiry: Math.floor(Date.now() / 1000) + 24 * 3600 * 3,
  transactionId: mkBytes32("0xa"),
  encryptedCallData: "0x",
  callDataHash: mkBytes32("0xb"),
  callTo: mkAddress("0xe"),
  dryRun: false,
};

const bid: AuctionBid = {
  user: auctionPayload.user,
  router: mkAddress("0xccc"),
  sendingChainId: auctionPayload.sendingChainId,
  sendingAssetId: auctionPayload.sendingAssetId,
  amount: auctionPayload.amount,
  receivingChainId: auctionPayload.receivingChainId,
  receivingAssetId: auctionPayload.receivingAssetId,
  amountReceived: auctionPayload.amount,
  bidExpiry: auctionPayload.expiry,
  receivingAddress: auctionPayload.receivingAddress,
  transactionId: auctionPayload.transactionId,
  expiry: auctionPayload.expiry,
  callDataHash: auctionPayload.callDataHash,
  callTo: auctionPayload.callTo,
  encryptedCallData: auctionPayload.encryptedCallData,
  sendingChainTxManagerAddress: mkAddress("0xab"),
  receivingChainTxManagerAddress: mkAddress("0xbc"),
};
const bidSignature = mkSig("0xeee");

const err = new AuctionExpired(800).toJson();

const inbox = "inbox";

const requestContext = createRequestContext("auctionRequestBinding");

describe("auctionRequestBinding", () => {
  beforeEach(async () => {
    newAuctionStub = stub().resolves({ bid, bidSignature });
    stub(operations, "getOperations").returns({
      newAuction: newAuctionStub,
    } as any);
  });

  afterEach(() => {
    restore();
    reset();
  });

  it("should work", async () => {
    await auctionRequestBinding(inbox, auctionPayload, undefined, requestContext);

    expect(newAuctionStub.calledOnceWithExactly(auctionPayload, requestContext)).to.be.true;
    expect(messagingMock.publishAuctionResponse.calledOnceWithExactly(inbox, { bid, bidSignature })).to.be.true;
  });

  it("should not proceed if there is an error", async () => {
    await auctionRequestBinding(inbox, auctionPayload, err);
    expect(messagingMock.publishAuctionResponse.callCount).to.be.eq(0);
    expect(newAuctionStub.callCount).to.be.eq(0);
  });

  it("should not proceed if there is no data", async () => {
    await auctionRequestBinding(inbox, undefined);
    expect(messagingMock.publishAuctionResponse.callCount).to.be.eq(0);
    expect(newAuctionStub.callCount).to.be.eq(0);
  });

  it("should throw if newAuction fails", async () => {
    newAuctionStub.rejects(new Error("fail"));
    await expect(auctionRequestBinding(inbox, auctionPayload)).to.be.rejectedWith("fail");
    expect(messagingMock.publishAuctionResponse.callCount).to.be.eq(0);
  });

  it("should throw if messaging.publishAuctionResponse fails", async () => {
    messagingMock.publishAuctionResponse.rejects(new Error("fail"));
    await expect(auctionRequestBinding(inbox, auctionPayload, undefined, requestContext)).to.be.rejectedWith("fail");
    expect(newAuctionStub.calledOnceWithExactly(auctionPayload, requestContext)).to.be.true;
  });
});

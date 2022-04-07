import { Logger, expect, mock, mkAddress, ExecuteArgs, BidStatus, getRandomBytes32 } from "@connext/nxtp-utils";
import { AuctionsCache } from "../../../src/index";
import { StoreChannel } from "../../../src/lib/entities";

const logger = new Logger({ level: "debug" });
const RedisMock = require("ioredis-mock");
let auctions: AuctionsCache;

const mockTransferId = getRandomBytes32();

const mockExecuteArgs: ExecuteArgs[] = [
  {
    ...mock.entity.executeArgs(),
    router: mkAddress("0xa"),
    feePercentage: "0.1",
    amount: "10",
    relayerSignature: "0xsigsigsig",
  },
  {
    ...mock.entity.executeArgs(),
    router: mkAddress("0xb"),
    feePercentage: "0.1",
    amount: "10",
    relayerSignature: "0xsigsigsig",
  },
];

const mockBids = [
  mock.entity.bid(mockTransferId, mockExecuteArgs[0]),
  mock.entity.bid(mockTransferId, mockExecuteArgs[1]),
  mock.entity.bid(),
];

describe("AuctionCache", () => {
  let RedisSub: any;
  beforeEach(async () => {
    logger.debug(`Subscribing to Channels for Redis Pub/Sub`);
    RedisSub = new RedisMock();

    RedisSub.subscribe(StoreChannel.NewBid);

    auctions = new AuctionsCache({ host: "mock", port: 1234, mock: true, logger });
  });

  afterEach(async () => {
    RedisSub.flushall();
  });

  describe("AuctionCache", () => {
    describe("#storeBid", () => {
      it("happy case: should return the number of bids", async () => {
        let count = await auctions.storeBid(mockBids[0]);
        expect(count).to.be.eq(1);
        count = await auctions.storeBid(mockBids[1]);
        expect(count).to.be.eq(2);
      });
    });

    describe("#updateBid", () => {
      it("happy case: should return 1 if added", async () => {
        const result = await auctions.updateBid(mockBids[2], BidStatus.Pending);
        expect(result).to.be.eq(1);
      });

      it("happy case: should return 0 if updated", async () => {
        const result = await auctions.updateBid(mockBids[2], BidStatus.Sent);
        expect(result).to.be.eq(0);
      });
    });

    describe("#getBidsByTransactionId", () => {
      it("should return empty array if no exists", async () => {
        const res = await auctions.getBidsByTransactionId("0x111");
        expect(res.length).to.be.eq(0);
      });

      it("happy case: should return data", async () => {
        const res = await auctions.getBidsByTransactionId(mockTransferId);
        expect(res[0].payload.transferId).to.be.eq(mockTransferId);
        expect(res[1].payload.transferId).to.be.eq(mockTransferId);
      });
    });
    describe("#getAllTransactionsIdsWithPendingBids", () => {
      it("should return transacionIds with pending bids", async () => {
        const res = await auctions.getAllTransactionsIdsWithPendingBids();
        expect(res[0]).to.be.eq(mockTransferId);
        expect(res.length).to.be.eq(1);
      });
    });

    describe("#updateAllBidsWithTransactionId", () => {
      it("should be ok", async () => {
        await auctions.storeBid(mockBids[0]);
        let txids = await auctions.getAllTransactionsIdsWithPendingBids();
        expect(txids[0]).to.be.eq(mockTransferId);
        expect(txids.length).to.be.eq(1);
        const res = await auctions.updateAllBidsWithTransactionId(mockTransferId, BidStatus.Sent);
        txids = await auctions.getAllTransactionsIdsWithPendingBids();
        expect(txids.length).to.be.eq(0);
      });
    });
  });
});

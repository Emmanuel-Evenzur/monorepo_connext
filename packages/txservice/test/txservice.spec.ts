import { Signer } from "ethers";
import Sinon, { restore, reset, createStubInstance, SinonStubbedInstance } from "sinon";
import { expect } from "chai";
import pino from "pino";

import { TransactionService } from "../src/txservice";
import { Transaction } from "../src/transaction";
import { ChainRpcProvider } from "../src/provider";
import { tx, txReceipt, txResponse } from "./constants";

const logger = pino({ level: process.env.LOG_LEVEL ?? "silent", name: "TransactionServiceTest" });

let signer: SinonStubbedInstance<Signer>;
let txService: TransactionService;
let transaction: SinonStubbedInstance<Transaction>;

/// In these tests, we are testing the outer shell of txservice - the interface, not the core functionality.
/// For core functionality tests, see transaction.spec.ts and provider.spec.ts.
describe("TransactionService unit test", () => {
  beforeEach(() => {
    const chainProvider = createStubInstance(ChainRpcProvider);
    // chainProvider.confirmationTimeout = 60_000;
    // chainProvider.confirmationsRequired = txReceipt.confirmations;

    const chains = {
      "1337": {
        providers: [{ url: "https://-------------.com" }],
        confirmations: 1,
      },
      "1338": {
        providers: [{ url: "https://-------------.com" }],
        confirmations: 1,
      },
    };

    txService = new TransactionService(logger, signer, { chains });
    (txService as any).getProvider = () => chainProvider;
  });

  afterEach(() => {
    restore();
    reset();
  });

  // TODO: Test read and events/listeners.

  describe.skip("sendTx", () => {
    // TODO: Error cases to handle:
    // nonce is expired
    // invalid data ?

    // TODO: Fix issue with this unit test.
    it.skip("errors if cannot get provider", async () => {
      // Replacing this method with the original fn not working.
      (txService as any).getProvider = (TransactionService as any).getProvider;
      await expect(txService.sendTx(99999, tx)).to.be.rejectedWith(ChainError.reasons.ProviderNotFound);
    });

    it("retries transaction with higher gas price", async () => {
      // We would expect transaction to reject with confirmation timeout in this edge case.
      transaction.confirm.onCall(0).rejects(new ChainError(ChainError.reasons.ConfirmationTimeout));
      transaction.confirm.onCall(1).resolves(txReceipt);
      // This should send the tx, then attempt to confirm, fail, bump gas, and receive confirmation the second time.
      const result = await txService.sendTx(1337, tx);
      expect(result).to.deep.eq(txReceipt);
      expect(transaction.confirm.callCount).to.equal(2);
      expect(transaction.bumpGasPrice.callCount).to.equal(1);
    });

    it("should throw if gas price goes above maximum", async () => {
      transaction.bumpGasPrice.rejects(new ChainError(ChainError.reasons.MaxGasPriceReached));
    });

    it("happy: tx sent and confirmed", async () => {
      const result = await txService.sendTx(tx);
      expect(result).to.deep.eq(txReceipt);
    });
  });

  describe("readTx", () => {});
});

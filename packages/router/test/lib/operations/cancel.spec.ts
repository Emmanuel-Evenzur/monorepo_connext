import { SinonStub } from "sinon";
import { expect } from "@connext/nxtp-utils/src/expect";
import { createRequestContext } from "@connext/nxtp-utils";
import { invariantDataMock, txReceiptMock } from "@connext/nxtp-utils/src/mock";

import { cancelInputMock } from "../../utils";
import { contractWriterMock } from "../../globalTestHook";
import { cancel, senderCancelling } from "../../../src/lib/operations/cancel";

const requestContext = createRequestContext("TEST");

describe("Cancel Sender Operation", () => {
  describe("#cancelSender", () => {
    it("should not cancel if already cancelling", async () => {
      senderCancelling.set(invariantDataMock.transactionId, true);
      const receipt = await cancel(invariantDataMock, cancelInputMock, requestContext);
      expect(receipt).to.be.undefined;
      senderCancelling.set(invariantDataMock.transactionId, false);
    });

    it("should release lock if contract fn errors", async () => {
      (contractWriterMock.cancel as SinonStub).rejects("foo");
      try {
        await cancel(invariantDataMock, cancelInputMock, requestContext);
      } catch (e) {}
      expect(senderCancelling.get(invariantDataMock.transactionId)).to.be.undefined;
    });

    it("happy: should cancel for sender chain", async () => {
      const receipt = await cancel(invariantDataMock, cancelInputMock, requestContext);

      expect(receipt).to.deep.eq(txReceiptMock);

      expect(contractWriterMock.cancel).to.be.calledOnceWithExactly(
        invariantDataMock.sendingChainId,
        {
          txData: {
            ...invariantDataMock,
            amount: cancelInputMock.amount,
            expiry: cancelInputMock.expiry,
            preparedBlockNumber: cancelInputMock.preparedBlockNumber,
          },
          signature: "0x",
        },
        requestContext,
      );
    });
  });
});

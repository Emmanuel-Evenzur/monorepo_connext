import {
  ajv,
  createLoggingContext,
  getNtpTimeSeconds,
  InvariantTransactionData,
  InvariantTransactionDataSchema,
  RequestContext,
} from "@connext/nxtp-utils";
import { providers } from "ethers";

import { getContext } from "../../router";
import { ParamsInvalid, ReceiverTxExists } from "../errors";
import { CancelInput, CancelInputSchema } from "../entities";
import { TransactionStatus } from "../../adapters/subgraph/runtime/graphqlsdk";
import { SenderTxTooNew } from "../errors/cancel";

export const SENDER_PREPARE_BUFFER_TIME = 60 * 13; // 13 mins (780s)
// bsc has 3s block time, is often given 250 lag blocks

export const cancel = async (
  invariantData: InvariantTransactionData,
  input: CancelInput,
  _requestContext: RequestContext<string>,
): Promise<providers.TransactionReceipt | undefined> => {
  const { requestContext, methodContext } = createLoggingContext(cancel.name, _requestContext);

  const { logger, contractWriter, contractReader, txService } = getContext();
  logger.info("Method start", requestContext, methodContext, { invariantData, input });

  // Validate InvariantData schema
  const validateInvariantData = ajv.compile(InvariantTransactionDataSchema);
  const validInvariantData = validateInvariantData(invariantData);
  if (!validInvariantData) {
    const error = validateInvariantData.errors?.map((err: any) => `${err.instancePath} - ${err.message}`).join(",");
    throw new ParamsInvalid({
      methodContext,
      invariantData,
      paramsError: error,
      requestContext,
    });
  }

  // Validate Prepare Input schema
  const validateInput = ajv.compile(CancelInputSchema);
  const validInput = validateInput(input);
  if (!validInput) {
    const error = validateInput.errors?.map((err: any) => `${err.instancePath} - ${err.message}`).join(",");
    throw new ParamsInvalid({
      input,
      paramsError: error,
      requestContext,
      methodContext,
    });
  }

  const { side, preparedTransactionHash, ...variant } = input;

  let cancelChain: number;
  if (side === "sender") {
    cancelChain = invariantData.sendingChainId;
    const existing = await contractReader.getTransactionForChain(
      invariantData.transactionId,
      invariantData.user,
      invariantData.receivingChainId,
    );
    const currentTime = await getNtpTimeSeconds();
    if (existing && existing.status !== TransactionStatus.Cancelled && currentTime < existing?.txData.expiry) {
      throw new ReceiverTxExists(invariantData.transactionId, invariantData.receivingChainId, {
        requestContext,
        methodContext,
        existing,
        currentTime,
      });
    }

    // prepare at 1000, 1000 > 2000 - 750
    // https://developer.offchainlabs.com/docs/time_in_arbitrum#ethereum-block-numbers-within-arbitrum
    const receipt = await txService.getTransactionReceipt(invariantData.sendingChainId, preparedTransactionHash);
    const preparedBlock = await txService.getBlock(invariantData.sendingChainId, receipt.blockNumber);

    if (!preparedBlock || currentTime < preparedBlock.timestamp + SENDER_PREPARE_BUFFER_TIME) {
      throw new SenderTxTooNew(
        invariantData.transactionId,
        invariantData.sendingChainId,
        preparedBlock?.timestamp ?? 0,
        currentTime,
        {
          requestContext,
          methodContext,
          preparedBlock,
          currentTime,
        },
      );
    }
  } else {
    cancelChain = invariantData.receivingChainId;
  }

  // Send to tx service
  logger.info("Sending cancel tx", requestContext, methodContext, { side });

  const receipt = await contractWriter.cancel(
    cancelChain,
    {
      txData: { ...invariantData, ...variant },
      signature: "0x",
    },
    requestContext,
  );
  logger.info("Method complete", requestContext, methodContext, { transactionHash: receipt.transactionHash });
  return receipt;
};

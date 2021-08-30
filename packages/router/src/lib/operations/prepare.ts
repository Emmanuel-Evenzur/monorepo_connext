import {
  ajv,
  getUuid,
  InvariantTransactionData,
  InvariantTransactionDataSchema,
  RequestContext,
} from "@connext/nxtp-utils";
import { BigNumber, providers } from "ethers/lib/ethers";

import { getContext } from "../../router";
import { PrepareInput, PrepareInputSchema } from "../entities";
import {
  ParamsInvalid,
  AuctionSignerInvalid,
  ExpiryInvalid,
  NotEnoughLiquidity,
  SenderChainDataInvalid,
  BidExpiryInvalid,
} from "../errors";
import {
  decodeAuctionBid,
  getNtpTimeSeconds,
  getReceiverAmount,
  getReceiverExpiryBuffer,
  recoverAuctionBid,
  validBidExpiry,
  validExpiryBuffer,
} from "../helpers";

export const prepare = async (
  invariantData: InvariantTransactionData,
  input: PrepareInput,
  requestContext: RequestContext,
): Promise<providers.TransactionReceipt | undefined> => {
  const method = "prepare";
  const methodId = getUuid();

  const { logger, wallet, contractWriter, contractReader, txService, cache } = getContext();
  logger.info({ method, methodId, invariantData, input, requestContext }, "Method start");

  // Validate InvariantData schema
  const validateInvariantData = ajv.compile(InvariantTransactionDataSchema);
  const validInvariantData = validateInvariantData(invariantData);
  if (!validInvariantData) {
    const error = validateInvariantData.errors?.map((err: any) => `${err.instancePath} - ${err.message}`).join(",");
    logger.error(
      { method, methodId, error: validateInvariantData.errors, invariantData },
      "Invalid invariantData params",
    );
    throw new ParamsInvalid({
      method,
      methodId,
      paramsError: error,
      requestContext,
    });
  }

  // Validate Prepare Input schema
  const validateInput = ajv.compile(PrepareInputSchema);
  const validInput = validateInput(input);
  if (!validInput) {
    const error = validateInput.errors?.map((err: any) => `${err.instancePath} - ${err.message}`).join(",");
    logger.error({ method, methodId, error: validateInput.errors, input }, "Invalid input params");
    throw new ParamsInvalid({
      method,
      methodId,
      paramsError: error,
      requestContext,
    });
  }

  const { encryptedCallData, encodedBid, bidSignature, senderAmount, senderExpiry } = input;

  // Validate the prepare data
  const bid = decodeAuctionBid(encodedBid);
  logger.info({ method, methodId, requestContext, bid }, "Decoded bid from event");

  const recovered = recoverAuctionBid(bid, bidSignature);
  if (recovered !== wallet.address) {
    // cancellable error
    throw new AuctionSignerInvalid(wallet.address, recovered, { method, methodId, requestContext });
  }

  if (!BigNumber.from(bid.amount).eq(senderAmount) || bid.transactionId !== invariantData.transactionId) {
    // cancellable error
    throw new SenderChainDataInvalid({ method, methodId, requestContext });
  }

  const inputDecimals = await txService.getDecimalsForAsset(invariantData.sendingChainId, invariantData.sendingAssetId);

  const outputDecimals = await txService.getDecimalsForAsset(
    invariantData.receivingChainId,
    invariantData.receivingAssetId,
  );

  const receiverAmount = await getReceiverAmount(senderAmount, inputDecimals, outputDecimals);

  const routerBalance = await contractReader.getAssetBalance(
    invariantData.receivingAssetId,
    invariantData.receivingChainId,
  );
  if (routerBalance.lt(receiverAmount)) {
    // cancellable error
    throw new NotEnoughLiquidity(invariantData.receivingChainId, { method, methodId, requestContext });
  }

  // Handle the expiries.
  // Some notes on expiries -- each participant should be using a neutral NTP time source rather than
  // Date.now() to avoid local clock errors

  // Get current time
  const currentTime = await getNtpTimeSeconds();

  if (!validBidExpiry(bid.expiry, currentTime)) {
    // cancellable error
    throw new BidExpiryInvalid(bid.bidExpiry, currentTime, {
      method,
      methodId,
      requestContext,
    });
  }

  // Get buffers
  const senderBuffer = senderExpiry - currentTime;
  const receiverBuffer = getReceiverExpiryBuffer(senderBuffer);

  // Calculate receiver expiry
  const receiverExpiry = receiverBuffer + currentTime;

  if (!validExpiryBuffer(receiverBuffer)) {
    // cancellable error
    throw new ExpiryInvalid(receiverExpiry, {
      method,
      methodId,
      requestContext,
      senderExpiry,
      senderBuffer,
      receiverBuffer,
    });
  }

  logger.info({ method, methodId, requestContext }, "Validated input");

  logger.info(
    { method, methodId, requestContext, transactionId: invariantData.transactionId },
    "Sending receiver prepare tx",
  );

  const receipt = await contractWriter.prepare(
    invariantData.receivingChainId,
    {
      txData: invariantData,
      amount: receiverAmount,
      expiry: receiverExpiry,
      bidSignature,
      encodedBid,
      encryptedCallData,
    },
    requestContext,
  );

  await cache.removeOutstandingLiquidity({
    assetId: invariantData.receivingAssetId,
    chainId: invariantData.receivingChainId,
    transactionId: invariantData.transactionId,
  });

  logger.info({ method, methodId, transactionId: invariantData.transactionId }, "Sent receiver prepare tx");
  return receipt;
};

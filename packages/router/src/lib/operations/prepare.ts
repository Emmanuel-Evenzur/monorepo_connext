import {
  ajv,
  createLoggingContext,
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
import { calculateGasFeeInReceivingToken } from "../helpers/shared";

export const prepare = async (
  invariantData: InvariantTransactionData,
  input: PrepareInput,
  _requestContext: RequestContext<string>,
): Promise<providers.TransactionReceipt | undefined> => {
  const { requestContext, methodContext } = createLoggingContext(prepare.name, _requestContext);

  const { logger, wallet, contractWriter, contractReader, txService } = getContext();
  logger.info("Method start", requestContext, methodContext, { invariantData, input, requestContext });

  // Validate InvariantData schema
  const validateInvariantData = ajv.compile(InvariantTransactionDataSchema);
  const validInvariantData = validateInvariantData(invariantData);
  if (!validInvariantData) {
    const msg = validateInvariantData.errors?.map((err: any) => `${err.instancePath} - ${err.message}`).join(",");
    throw new ParamsInvalid({
      paramsError: msg,
      invariantData,
    });
  }

  // Validate Prepare Input schema
  const validateInput = ajv.compile(PrepareInputSchema);
  const validInput = validateInput(input);
  if (!validInput) {
    const msg = validateInput.errors?.map((err: any) => `${err.instancePath} - ${err.message}`).join(",");
    throw new ParamsInvalid({
      paramsError: msg,
      input,
    });
  }

  const { encryptedCallData, encodedBid, bidSignature, senderAmount, senderExpiry } = input;

  // Validate the prepare data
  const bid = decodeAuctionBid(encodedBid);
  logger.info("Decoded bid from event", requestContext, methodContext, { bid });

  const routerAddress = await wallet.getAddress();
  const recovered = recoverAuctionBid(bid, bidSignature);
  if (recovered !== routerAddress) {
    // cancellable error
    throw new AuctionSignerInvalid(routerAddress, recovered, { methodContext, requestContext });
  }

  if (!BigNumber.from(bid.amount).eq(senderAmount) || bid.transactionId !== invariantData.transactionId) {
    // cancellable error
    throw new SenderChainDataInvalid({ methodContext, requestContext });
  }

  const inputDecimals = await txService.getDecimalsForAsset(invariantData.sendingChainId, invariantData.sendingAssetId);

  const outputDecimals = await txService.getDecimalsForAsset(
    invariantData.receivingChainId,
    invariantData.receivingAssetId,
  );

  let receiverAmount = await getReceiverAmount(senderAmount, inputDecimals, outputDecimals);
  const amountReceivedInBigNum = BigNumber.from(receiverAmount);
  const gasFeeInReceivingToken = await calculateGasFeeInReceivingToken(
    invariantData.sendingAssetId,
    invariantData.sendingChainId,
    invariantData.receivingAssetId,
    invariantData.receivingChainId,
    outputDecimals,
    requestContext,
  );
  logger.info("Got gas fee in receiving token", requestContext, methodContext, {
    gasFeeInReceivingToken: gasFeeInReceivingToken.toString(),
  });
  receiverAmount = amountReceivedInBigNum.sub(gasFeeInReceivingToken).toString();

  const routerBalance = await contractReader.getAssetBalance(
    invariantData.receivingAssetId,
    invariantData.receivingChainId,
  );
  if (routerBalance.lt(receiverAmount)) {
    // double check balance on chain
    const onChainBalance = await contractWriter.getRouterBalance(
      invariantData.receivingChainId,
      invariantData.router,
      invariantData.receivingAssetId,
    );
    if (onChainBalance.lt(receiverAmount)) {
      // cancellable error
      throw new NotEnoughLiquidity(
        invariantData.receivingChainId,
        invariantData.receivingAssetId,
        onChainBalance.toString(),
        receiverAmount.toString(),
        { methodContext, requestContext },
      );
    } else {
      logger.error("Router balance is different onchain vs subgraph", requestContext, methodContext, undefined, {
        onChainBalance: onChainBalance.toString(),
        subgraphBalance: routerBalance.toString(),
      });
    }
  }

  // Handle the expiries.
  // Some notes on expiries -- each participant should be using a neutral NTP time source rather than
  // Date.now() to avoid local clock errors

  // Get current time
  const currentTime = await getNtpTimeSeconds();

  if (!validBidExpiry(bid.expiry, currentTime)) {
    // cancellable error
    throw new BidExpiryInvalid(bid.bidExpiry, currentTime, {
      methodContext,
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
      methodContext,
      requestContext,
      senderExpiry,
      senderBuffer,
      receiverBuffer,
    });
  }

  logger.info("Validated input", requestContext, methodContext);
  logger.info("Sending receiver prepare tx", requestContext, methodContext);

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
  logger.info("Sent receiver prepare tx", requestContext, methodContext, { transactionHash: receipt.transactionHash });
  return receipt;
};

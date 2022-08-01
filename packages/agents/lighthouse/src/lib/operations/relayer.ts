import { constants } from "ethers";
import { RequestContext, createLoggingContext, ExecuteArgs } from "@connext/nxtp-utils";

import { getContext } from "../../lighthouse";
import { getHelpers } from "../helpers";

export const sendToRelayer = async (
  args: ExecuteArgs,
  encodedData: string,
  transferId: string,
  _requestContext: RequestContext,
): Promise<void> => {
  const {
    logger,
    chainData,
    config,
    adapters: { chainreader, relayer },
  } = getContext();

  const {
    relayer: { getGelatoRelayerAddress, connextRelayerSend },
  } = getHelpers();

  const { requestContext, methodContext } = createLoggingContext(sendToRelayer.name, _requestContext);
  logger.debug(`Method start: ${sendToRelayer.name}`, requestContext, methodContext, { args });

  const originChainId = chainData.get(args.params.originDomain)!.chainId;
  const destinationChainId = chainData.get(args.params.destinationDomain)!.chainId;

  const destinationConnextAddress = config.chains[args.params.destinationDomain].deployments.connext;

  const relayerFee = {
    amount: "0",
    // TODO: should handle relayer fee paid in alternative assets once that is implemented.
    asset: constants.AddressZero,
  };

  // TODO: Might want to move this logic inside the `relayer.send` method below.
  // Try sending the tx to the custom configured relayer, if applicable.
  // If this fails, we'll resort to using the default relayer network.
  if (config.relayerUrl) {
    try {
      const result = await connextRelayerSend(config.relayerUrl, destinationChainId, {
        fee: {
          chain: originChainId,
          amount: relayerFee.amount,
          token: relayerFee.asset,
        },
        to: destinationConnextAddress,
        data: encodedData,
      });
      const { taskId } = result;
      logger.info("Sent meta transaction to Connext relayer", requestContext, methodContext, {
        transferId: transferId,
        taskId,
      });
      return;
    } catch (error: unknown) {
      logger.warn("Failed to send meta transaction to Connext relayer", requestContext, methodContext, {
        transferId: transferId,
        error,
      });
    }
  }

  // Validate the bid's fulfill call will succeed on chain.
  const relayerAddress = await getGelatoRelayerAddress(destinationChainId);

  logger.debug("Getting gas estimate", requestContext, methodContext, {
    chainId: destinationChainId,
    to: destinationConnextAddress,
    data: encodedData,
    from: relayerAddress,
    transferId: transferId,
  });
  const gas = await chainreader.getGasEstimateWithRevertCode(Number(args.params.destinationDomain), {
    chainId: destinationChainId,
    to: destinationConnextAddress,
    data: encodedData,
    from: relayerAddress,
  });

  logger.info("Sending meta tx to relayer", requestContext, methodContext, {
    relayer: relayerAddress,
    connext: destinationConnextAddress,
    domain: args.params.destinationDomain,
    gas: gas.toString(),
    relayerFee,
    transferId: transferId,
  });

  const result = await relayer.send(destinationChainId, destinationConnextAddress, encodedData, _requestContext);
  logger.info(`Sent meta tx to the external relayer`, requestContext, methodContext, {
    relayer: relayerAddress,
    connext: destinationConnextAddress,
    domain: args.params.destinationDomain,
    relayerFee,
    result,
    transferId: transferId,
  });
};

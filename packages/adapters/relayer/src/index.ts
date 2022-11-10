import {
  createLoggingContext,
  jsonifyError,
  Logger,
  NxtpError,
  RelayerTaskStatus,
  RelayerType,
  RequestContext,
} from "@connext/nxtp-utils";
import { ChainReader } from "@connext/nxtp-txservice";

import { setupRelayer as _setupGelatoRelayer } from "./gelato";
import { setupRelayer as _setupConnextRelayer } from "./connext";
import { RelayerSendFailed } from "./errors";

export type Relayer = {
  getRelayerAddress: (chainId: number, logger: Logger) => Promise<string>;
  send: (
    chainId: number,
    domain: string,
    destinationAddress: string,
    encodedData: string,
    gelatoApiKey: string,
    chainReader: ChainReader,
    logger: Logger,
    _requestContext?: RequestContext,
  ) => Promise<string>;
  getTaskStatus: (taskId: string, logger?: Logger) => Promise<RelayerTaskStatus>;
  waitForTaskCompletion: (
    taskId: string,
    logger: Logger,
    _requestContext: RequestContext,
    _timeout?: number,
    _pollInterval?: number,
  ) => Promise<RelayerTaskStatus>;
};

export const setupGelatoRelayer = _setupGelatoRelayer;
export const setupConnextRelayer = _setupConnextRelayer;

export const sendWithRelayerWithBackup = async (
  chainId: number,
  domain: string,
  destinationAddress: string,
  data: string,
  relayers: { instance: Relayer; apiKey: string; type: RelayerType }[],
  chainReader: ChainReader,
  logger: Logger,
  _requestContext: RequestContext,
): Promise<{ taskId: string }> => {
  const { methodContext, requestContext } = createLoggingContext(sendWithRelayerWithBackup.name, _requestContext);

  for (const relayer of relayers) {
    logger.info(`Sending tx with ${relayer.type} relayer`, requestContext, methodContext, {
      chainId,
      domain,
      destinationAddress,
      data,
    });
    try {
      const taskId = await relayer.instance.send(
        chainId,
        domain,
        destinationAddress,
        data,
        relayer.apiKey,
        chainReader,
        logger,
        requestContext,
      );
      return { taskId };
    } catch (err: unknown) {
      logger.error(
        `Failed to sent data with ${relayer.type}`,
        requestContext,
        methodContext,
        jsonifyError(err as NxtpError),
      );
    }
  }

  throw new RelayerSendFailed({
    requestContext,
    methodContext,
    chainId,
    domain,
    data,
    destinationAddress,
    relayers: relayers.map((relayer) => relayer.type),
  });
};

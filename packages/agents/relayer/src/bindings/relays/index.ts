import { BigNumber, providers } from "ethers";
import { createLoggingContext, jsonifyError, RelayerTaskStatus } from "@connext/nxtp-utils";
import interval from "interval-promise";
import { CachedTaskData } from "@connext/nxtp-adapters-cache/dist/lib/caches/tasks";

import { getContext } from "../../relayer";

export const MIN_GAS_LIMIT = BigNumber.from(2_000_000);
export const DEFAULT_POLL_INTERVAL = 1_000;

export const bindRelays = async (_pollInterval?: number) => {
  const { config } = getContext();
  const pollInterval = _pollInterval ?? DEFAULT_POLL_INTERVAL;
  interval(async (_, stop) => {
    if (config.mode.cleanup) {
      stop();
    } else {
      await pollCache();
    }
  }, pollInterval);
};

export const pollCache = async () => {
  const {
    config,
    adapters: { cache, wallet },
    logger,
    chainToDomainMap,
  } = getContext();
  const { requestContext, methodContext } = createLoggingContext(pollCache.name);

  // Retrieve all pending tasks.
  const pending = await cache.tasks.getPending();
  if (pending.length === 0) {
    return;
  }
  logger.debug("Retrieved pending tasks", requestContext, methodContext, { pending });

  // Organize pending tasks by chain property.
  const tasksByChain: { [chainId: number]: (CachedTaskData & { id: string })[] } = {};
  for (const taskId of pending) {
    const task: CachedTaskData | undefined = await cache.tasks.getTask(taskId);
    if (!task) {
      // Sanity: task should exist.
      logger.warn("Task entry not found for task ID", requestContext, methodContext, { taskId });
      continue;
    }
    const { chain } = task;
    if (!tasksByChain[chain]) {
      tasksByChain[chain] = [];
    }
    tasksByChain[chain].push({
      ...task,
      id: taskId,
    });
  }

  // TODO: Promise.all with map for each chain.
  for (const chainIdKey of Object.keys(tasksByChain)) {
    // Set up context for this chain: get domain, provider, and connect a signer.
    const chain = Number(chainIdKey);
    const domain = chainToDomainMap.get(chain)!;
    const provider = new providers.JsonRpcProvider(config.chains[domain].providers[0]);
    const signer = wallet.connect(provider);

    for (const task of tasksByChain[chain]) {
      // TODO: Sanity check: should have enough balance to pay for gas on the specified chain.
      const taskId = task.id;
      const status = await cache.tasks.getStatus(taskId);
      if (status !== RelayerTaskStatus.ExecPending) {
        // Sanity: task should be pending.
        // Possible in the event of a race while updating the cache.
        logger.debug("Task status was not pending task ID", requestContext, methodContext, { taskId });
        continue;
      }

      const { data, to } = task;

      // TODO: Queue up fee claiming for this transfer after this (assuming transaction is successful)!
      try {
        const transaction = {
          chainId: chain,
          to,
          data,
          from: await wallet.getAddress(),
        };
        // Estimate gas limit.
        // TODO: For `proveAndProcess` calls, we should be providing:
        // gas limit = expected gas cost + PROCESS_GAS + RESERVE_GAS
        // We need to read those values from on-chain IFF this is a `proveAndProcess` call.
        const gasLimit = await signer.estimateGas(transaction);

        // Execute the calldata.
        // TODO: Debugging, remove and use txservice.
        const tx = await signer.sendTransaction({
          ...transaction,
          gasLimit: gasLimit.gt(MIN_GAS_LIMIT) ? gasLimit : MIN_GAS_LIMIT,
        });

        // Wait for confirmation.
        const { confirmations } = config.chains[domain];
        logger.debug("Sent transaction to network. Awaiting confirmations...", requestContext, methodContext, {
          chain,
          taskId,
          hash: tx.hash,
          confirmations,
        });
        const receipt = await tx.wait(confirmations);
        await cache.tasks.setHash(taskId, receipt.transactionHash);
        logger.info("Transaction confirmed.", requestContext, methodContext, {
          chain,
          taskId,
          hash: receipt.transactionHash,
        });
      } catch (error: any) {
        // Save the error to the cache for this transfer. If the error was not previously recorded, log it.
        await cache.tasks.setError(taskId, JSON.stringify(error));
        logger.error("Error executing task", requestContext, methodContext, jsonifyError(error as Error), {
          chain,
          taskId,
          data,
        });
      }
    }
  }
};

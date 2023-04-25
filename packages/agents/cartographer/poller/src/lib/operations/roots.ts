import {
  createLoggingContext,
  AggregatedRoot,
  PropagatedRoot,
  ReceivedAggregateRoot,
  Snapshot,
  SnapshotRoot,
  OptimisticRootFinalized,
  OptimisticRootPropagated,
} from "@connext/nxtp-utils";

import { getContext } from "../../shared";

export const updateAggregatedRoots = async () => {
  const {
    adapters: { subgraph, database },
    logger,
    domains,
  } = getContext();
  const { requestContext, methodContext } = createLoggingContext(updateAggregatedRoots.name);

  const metas = await subgraph.getConnectorMeta(domains);
  const hubs = new Set(metas.map((m) => m.hubDomain));

  for (const hub of [...hubs]) {
    const offset = await database.getCheckPoint("aggregated_root_" + hub);
    const limit = 100;
    logger.debug("Retrieving aggregated roots", requestContext, methodContext, {
      hub: hub,
      offset: offset,
      limit: limit,
    });

    const aggregatedRoots: AggregatedRoot[] = await subgraph.getGetAggregatedRootsByDomain([
      { hub, index: offset, limit },
    ]);

    // Reset offset at the end of the cycle.
    const newOffset = aggregatedRoots.length == 0 ? 0 : aggregatedRoots[aggregatedRoots.length - 1].index;
    if (offset === 0 || newOffset > offset) {
      await database.saveAggregatedRoots(aggregatedRoots);

      await database.saveCheckPoint("aggregated_root_" + hub, newOffset);
      logger.debug("Saved aggregated roots", requestContext, methodContext, { hub: hub, offset: newOffset });
    }
  }
};

export const updateProposedSnapshots = async () => {
  const {
    adapters: { subgraph, database },
    logger,
    domains,
  } = getContext();
  const { requestContext, methodContext } = createLoggingContext(updateProposedSnapshots.name);

  const metas = await subgraph.getConnectorMeta(domains);
  const hubs = new Set(metas.map((m) => m.hubDomain));

  for (const hub of [...hubs]) {
    const offset = await database.getCheckPoint("proposed_optimistic_root" + hub);
    const limit = 100;
    logger.debug("Retrieving proposed aggregated root snapshot", requestContext, methodContext, {
      hub: hub,
      offset: offset,
      limit: limit,
    });

    const snapshots: Snapshot[] = await subgraph.getProposedSnapshotsByDomain([{ hub, snapshotId: offset, limit }]);

    // Reset offset at the end of the cycle.
    // TODO: Pagination criteria off by one ?
    const newOffset = snapshots.length == 0 ? 0 : offset + snapshots.length - 1;
    if (offset === 0 || newOffset > offset) {
      await database.saveProposedSnapshots(snapshots);

      await database.saveCheckPoint("proposed_optimistic_root" + hub, newOffset);
      logger.debug("Saved proposed aggregated root snapshot", requestContext, methodContext, {
        hub: hub,
        offset: newOffset,
      });
    }
  }
};

export const updateFinalizedRoots = async () => {
  const {
    adapters: { subgraph, database },
    logger,
    domains,
  } = getContext();
  const { requestContext, methodContext } = createLoggingContext(updateFinalizedRoots.name);

  const metas = await subgraph.getConnectorMeta(domains);
  const hubs = new Set(metas.map((m) => m.hubDomain));

  for (const hub of [...hubs]) {
    const offset = await database.getCheckPoint("finalized_optimistic_root_" + hub);
    const limit = 100;
    logger.debug("Retrieving finalized aggregated root", requestContext, methodContext, {
      hub: hub,
      offset: offset,
      limit: limit,
    });

    const roots: OptimisticRootFinalized[] = await subgraph.getFinalizedRootsByDomain([
      { hub, timestamp: offset, limit },
    ]);

    // Reset offset at the end of the cycle.
    // TODO: Pagination criteria off by one ?
    const newOffset = roots.length == 0 ? 0 : offset + roots.length - 1;
    if (offset === 0 || newOffset > offset) {
      await database.saveFinalizedRoots(roots);

      await database.saveCheckPoint("finalized_root_" + hub, newOffset);
      logger.debug("Saved finalized aggregated root", requestContext, methodContext, {
        hub: hub,
        offset: newOffset,
      });
    }
  }
};

export const updatePropagatedOptmisticRoots = async () => {
  const {
    adapters: { subgraph, database },
    logger,
    domains,
  } = getContext();
  const { requestContext, methodContext } = createLoggingContext(updatePropagatedOptmisticRoots.name);

  const metas = await subgraph.getConnectorMeta(domains);
  const hubs = new Set(metas.map((m) => m.hubDomain));

  for (const hub of [...hubs]) {
    const offset = await database.getCheckPoint("propagated_optimistic_root_" + hub);
    const limit = 100;
    logger.debug("Retrieving propagated optimistic aggregated root", requestContext, methodContext, {
      hub: hub,
      offset: offset,
      limit: limit,
    });

    const snapshots: OptimisticRootPropagated[] = await subgraph.getPropagatedOptimisticRootsByDomain([
      { hub, timestamp: offset, limit },
    ]);

    // Reset offset at the end of the cycle.
    // TODO: Pagination criteria off by one ?
    const newOffset = snapshots.length == 0 ? 0 : offset + snapshots.length - 1;
    if (offset === 0 || newOffset > offset) {
      await database.savePropagatedOptimisticRoots(snapshots);

      await database.saveCheckPoint("propagated_optimistic_root_" + hub, newOffset);
      logger.debug("Saved propagagted optimistic aggregated root", requestContext, methodContext, {
        hub: hub,
        offset: newOffset,
      });
    }
  }
};

export const retrieveSavedSnapshotRoot = async () => {
  const {
    adapters: { subgraph, database },
    logger,
    domains,
  } = getContext();
  const { requestContext, methodContext } = createLoggingContext(retrieveSavedSnapshotRoot.name);

  for (const domain of domains) {
    const offset = await database.getCheckPoint("saved_snapshoted_root_" + domain);
    const limit = 100;
    logger.debug("Retrieving saved snapshot roots", requestContext, methodContext, {
      domain: domain,
      offset: offset,
      limit: limit,
    });

    const roots: SnapshotRoot[] = await subgraph.getSavedSnapshotRootsByDomain([
      { hub: domain, snapshotId: offset, limit },
    ]);

    // Reset offset at the end of the cycle.
    const newOffset = roots.length == 0 ? 0 : Math.max(...roots.map((root) => root.timestamp ?? 0));

    await database.saveSnapshotRoots(roots);

    if (roots.length > 0 && newOffset > offset) {
      await database.saveCheckPoint("saved_snapshoted_root_" + domain, newOffset);
    }

    logger.debug("Saved snapshot roots", requestContext, methodContext, { domain: domain, offset: newOffset });
  }
};

export const updatePropagatedRoots = async () => {
  const {
    adapters: { subgraph, database },
    logger,
    domains,
  } = getContext();
  const { requestContext, methodContext } = createLoggingContext(updatePropagatedRoots.name);

  const metas = await subgraph.getConnectorMeta(domains);
  const hubs = new Set(metas.map((m) => m.hubDomain));
  for (const hub of [...hubs]) {
    const offset = await database.getCheckPoint("propagated_root_" + hub);
    const limit = 100;

    logger.debug("Retrieving propagated roots", requestContext, methodContext, {
      domain: hub,
      offset: offset,
      limit: limit,
    });

    const propagatedRoots: PropagatedRoot[] = await subgraph.getGetPropagatedRoots(hub, offset, limit);

    // Reset offset at the end of the cycle.
    const newOffset = propagatedRoots.length == 0 ? 0 : propagatedRoots[propagatedRoots.length - 1].count;
    if (offset === 0 || newOffset > offset) {
      // TODO: Add a working transaction wraper
      await database.savePropagatedRoots(propagatedRoots);

      await database.saveCheckPoint("propagated_root_" + hub, newOffset);
      logger.debug("Saved propageted roots", requestContext, methodContext, { offset: newOffset });
    }
  }
};

export const updateReceivedAggregateRoots = async () => {
  const {
    adapters: { subgraph, database },
    logger,
    domains,
  } = getContext();
  const { requestContext, methodContext } = createLoggingContext(updateReceivedAggregateRoots.name);

  for (const domain of domains) {
    const offset = await database.getCheckPoint("received_aggregate_root_" + domain);
    const limit = 100;
    logger.debug("Retrieving received aggregate root", requestContext, methodContext, {
      domain: domain,
      offset: offset,
      limit: limit,
    });

    const receivedRoots: ReceivedAggregateRoot[] = await subgraph.getReceivedAggregatedRootsByDomain([
      { domain, offset, limit },
    ]);

    const newOffset = receivedRoots.length == 0 ? 0 : Math.max(...receivedRoots.map((root) => root.blockNumber ?? 0));

    if (receivedRoots.length > 0 && newOffset > offset) {
      await database.saveReceivedAggregateRoot(receivedRoots);
      await database.saveCheckPoint("received_aggregate_root_" + domain, newOffset);
    }

    logger.debug("Saved received roots", requestContext, methodContext, { domain: domain, offset: newOffset });
  }
};

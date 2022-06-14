import { XTransfer, XTransferStatus, RouterBalance, convertFromDbTransfer } from "@connext/nxtp-utils";
import { Pool } from "pg";
import * as db from "zapatos/db";
import { raw } from "zapatos/db";
import type * as s from "zapatos/schema";
import { BigNumber } from "ethers";

import { pool } from "./index";

const convertToDbTransfer = (transfer: XTransfer): s.transfers.Insertable => {
  return {
    destination_domain: transfer.destinationDomain,
    origin_domain: transfer.originDomain,

    nonce: transfer.nonce,

    to: transfer.xparams?.to,
    call_data: transfer.xparams?.callData,
    callback: transfer.xparams?.callback,
    callback_fee: transfer.xparams?.callbackFee as any,
    recovery: transfer.xparams?.recovery,

    force_slow: transfer.xparams?.forceSlow,
    receive_local: transfer.xparams?.receiveLocal,

    transfer_id: transfer.transferId,

    origin_chain: transfer.origin?.chain,
    origin_transacting_asset: transfer.origin?.assets.transacting.asset,
    origin_transacting_amount: transfer.origin?.assets.transacting.amount as any,
    origin_bridged_asset: transfer.origin?.assets.bridged.asset,
    origin_bridged_amount: transfer.origin?.assets.bridged.amount as any,
    xcall_caller: transfer.origin?.xcall.caller,
    xcall_transaction_hash: transfer.origin?.xcall?.transactionHash,
    xcall_timestamp: transfer.origin?.xcall?.timestamp,
    xcall_gas_price: transfer.origin?.xcall?.gasPrice as any,
    xcall_gas_limit: transfer.origin?.xcall?.gasLimit as any,
    xcall_relayer_fee: transfer.origin?.xcall?.relayerFee as any,
    xcall_block_number: transfer.origin?.xcall?.blockNumber,

    destination_chain: transfer.destination?.chain,
    status: transfer.destination?.status,
    routers: transfer.destination?.routers,
    destination_transacting_asset: transfer.destination?.assets.transacting?.asset,
    destination_transacting_amount: transfer.destination?.assets.transacting?.amount as any,
    destination_local_asset: transfer.destination?.assets.local?.asset,
    destination_local_amount: transfer.destination?.assets.local?.amount as any,

    execute_caller: transfer.destination?.execute?.caller,
    execute_transaction_hash: transfer.destination?.execute?.transactionHash,
    execute_timestamp: transfer.destination?.execute?.timestamp,
    execute_gas_price: transfer.destination?.execute?.gasPrice as any,
    execute_gas_limit: transfer.destination?.execute?.gasLimit as any,
    execute_block_number: transfer.destination?.execute?.blockNumber,
    execute_origin_sender: transfer.destination?.execute?.originSender,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    execute_relayer_fee: transfer.destination?.execute?.relayerFee as any,

    reconcile_caller: transfer.destination?.reconcile?.caller,
    reconcile_transaction_hash: transfer.destination?.reconcile?.transactionHash,
    reconcile_timestamp: transfer.destination?.reconcile?.timestamp,
    reconcile_gas_price: transfer.destination?.reconcile?.gasPrice as any,
    reconcile_gas_limit: transfer.destination?.reconcile?.gasLimit as any,
    reconcile_block_number: transfer.destination?.reconcile?.blockNumber,
  };
};

const sanitizeNull = (obj: { [s: string]: any }): any => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
};

export const saveTransfers = async (xtransfers: XTransfer[], _pool?: Pool): Promise<void> => {
  const poolToUse = _pool ?? pool;
  const transfers: s.transfers.Insertable[] = xtransfers.map(convertToDbTransfer);

  // TODO: make this a single query! we should be able to do this with postgres
  // TODO: Perfomance implications to be evaluated. Upgrade to batching of configured batch size N.
  for (const oneTransfer of transfers) {
    const transfer = sanitizeNull(oneTransfer);
    await db.sql<s.transfers.SQL, s.transfers.JSONSelectable[]>`INSERT INTO ${"transfers"} (${db.cols(transfer)})
    VALUES (${db.vals(transfer)}) ON CONFLICT ("transfer_id") DO UPDATE SET (${db.cols(transfer)}) = (${db.vals(
      transfer,
    )}) RETURNING *`.run(poolToUse);
  }
};

export const getTransferByTransferId = async (transfer_id: string, _pool?: Pool): Promise<XTransfer | undefined> => {
  const poolToUse = _pool ?? pool;
  const x = await db.sql<s.transfers.SQL, s.transfers.JSONSelectable[]>`SELECT * FROM ${"transfers"} WHERE ${{
    transfer_id,
  }}`.run(poolToUse);
  return x.length ? convertFromDbTransfer(x[0]) : undefined;
};

export const getTransfersByStatus = async (
  status: XTransferStatus,
  limit: number,
  offset = 0,
  orderDirection: "ASC" | "DESC" = "ASC",
  _pool?: Pool,
): Promise<XTransfer[]> => {
  const poolToUse = _pool ?? pool;
  const x = await db.sql<s.transfers.SQL, s.transfers.JSONSelectable[]>`SELECT * FROM ${"transfers"} WHERE ${{
    status,
  }} ORDER BY "xcall_timestamp" ${raw(`${orderDirection}`)} NULLS LAST LIMIT ${db.param(limit)} OFFSET ${db.param(
    offset,
  )}`.run(poolToUse);
  return x.map(convertFromDbTransfer);
};

export const getLatestXCallTimestamp = async (domain: string, _pool?: Pool): Promise<number> => {
  const poolToUse = _pool ?? pool;
  const transfer = await db.sql<s.transfers.SQL, s.transfers.JSONSelectable[]>`SELECT * FROM ${"transfers"} WHERE ${{
    origin_domain: domain,
  }} ORDER BY "xcall_timestamp" DESC NULLS LAST LIMIT 1`.run(poolToUse);
  return BigNumber.from(transfer[0]?.xcall_timestamp ?? 0).toNumber();
};

export const getLatestExecuteTimestamp = async (domain: string, _pool?: Pool): Promise<number> => {
  const poolToUse = _pool ?? pool;
  const transfer = await db.sql<s.transfers.SQL, s.transfers.JSONSelectable[]>`SELECT * FROM ${"transfers"} WHERE ${{
    destination_domain: domain,
  }} ORDER BY "execute_timestamp" DESC NULLS LAST LIMIT 1`.run(poolToUse);
  return BigNumber.from(transfer[0]?.execute_timestamp ?? 0).toNumber();
};

export const getLatestReconcileTimestamp = async (domain: string, _pool?: Pool): Promise<number> => {
  const poolToUse = _pool ?? pool;
  const transfer = await db.sql<s.transfers.SQL, s.transfers.JSONSelectable[]>`SELECT * FROM ${"transfers"} WHERE ${{
    destination_domain: domain,
  }} ORDER BY "reconcile_timestamp" DESC NULLS LAST LIMIT 1`.run(poolToUse);
  return BigNumber.from(transfer[0]?.reconcile_timestamp ?? 0).toNumber();
};

export const saveRouterBalances = async (routerBalances: RouterBalance[], _pool?: Pool): Promise<void> => {
  const poolToUse = _pool ?? pool;
  const routers: s.routers.Insertable[] = routerBalances.map((router) => {
    return { address: router.router };
  });

  // TODO: make this a single query! we should be able to do this with postgres
  for (const router of routers) {
    await db.sql<s.routers.SQL, s.routers.JSONSelectable>`
    INSERT INTO ${"routers"} (${db.cols(router)}) VALUES (${db.vals(
      router,
    )}) ON CONFLICT ("address") DO NOTHING RETURNING *
    `.run(poolToUse);

    const balances = (routerBalances.find((r) => r.router === router.address) ?? {}).assets ?? [];
    const dbBalances: { balance: s.asset_balances.Insertable; asset: s.assets.Insertable }[] = balances.map((b) => {
      return {
        balance: {
          asset_canonical_id: b.canonicalId,
          asset_domain: b.domain,
          router_address: router.address,
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          balance: b.balance as any,
        },
        asset: {
          local: b.local,
          adopted: b.adoptedAsset,
          canonical_id: b.canonicalId,
          canonical_domain: b.canonicalDomain,
          domain: b.domain,
        },
      };
    });

    for (const balance of dbBalances) {
      await db.sql<s.assets.SQL, s.assets.JSONSelectable>`
      INSERT INTO ${"assets"} (${db.cols(balance.asset)}) VALUES (${db.vals(
        balance.asset,
      )}) ON CONFLICT ("canonical_id", "domain") DO UPDATE SET (${db.cols(balance.asset)}) = (${db.vals(
        balance.asset,
      )}) RETURNING *
    `.run(poolToUse);

      await db.sql<s.asset_balances.SQL, s.asset_balances.JSONSelectable>`
      INSERT INTO ${"asset_balances"} (${db.cols(balance.balance)}) VALUES (${db.vals(
        balance.balance,
      )}) ON CONFLICT ("asset_canonical_id", "asset_domain", "router_address") DO UPDATE SET (${db.cols(
        balance.balance,
      )}) = (${db.vals(balance.balance)}) RETURNING *
    `.run(poolToUse);
    }
  }
};

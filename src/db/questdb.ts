// QuestDB access over the Postgres wire protocol. One pool, one function per
// query the API exposes. Kept deliberately tiny for the MVP: VWAP + price-at.

import pg from "pg";
import { config } from "../config.js";

const pool = new pg.Pool({
  host: config.questdb.host,
  port: config.questdb.port,
  user: config.questdb.user,
  password: config.questdb.password,
  database: config.questdb.database,
  max: 8,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

/** Health check — returns true if QuestDB answers a trivial query. */
export async function ping(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

/** get_vwap: volume-weighted average price over a trailing window (minutes). */
export async function getVwap(
  symbol: string,
  windowMin = 5,
): Promise<{ symbol: string; vwap: number | null; window_min: number }> {
  const { rows } = await pool.query(
    `SELECT sum(price * size) / sum(size) AS vwap
       FROM trades
      WHERE symbol = $1 AND ts > dateadd('m', $2, now())`,
    [symbol, -Math.abs(windowMin)],
  );
  const vwap = rows[0]?.vwap;
  return { symbol, vwap: vwap == null ? null : Number(vwap), window_min: windowMin };
}

/** get_price_proof source: latest price at-or-before `at` (ISO 8601). */
export async function getPriceAt(
  symbol: string,
  atIso: string,
): Promise<{ source_ts: string; price: number; source: string } | null> {
  const { rows } = await pool.query(
    `SELECT ts AS source_ts, price, source
       FROM trades
      WHERE symbol = $1 AND ts <= $2
      LATEST ON ts PARTITION BY symbol`,
    [symbol, atIso],
  );
  const r = rows[0];
  if (!r) return null;
  return {
    source_ts: new Date(r.source_ts).toISOString(),
    price: Number(r.price),
    source: r.source ?? config.dataSource,
  };
}

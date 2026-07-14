-- IoMarkets.ai — QuestDB schema (minimal, MVP scope).
-- Load in the QuestDB web console (http://localhost:9000) after `docker compose up -d`.
--
-- One trades table feeds the live signals. VWAP + a point-in-time price proof are
-- the two services listed for the OKX.AI A2MCP MVP; both read from `trades`.

CREATE TABLE IF NOT EXISTS trades (
  ts        TIMESTAMP,        -- exchange event time
  symbol    SYMBOL CAPACITY 256 CACHE,
  price     DOUBLE,
  size      DOUBLE,
  side      SYMBOL CAPACITY 4 CACHE,   -- 'buy' | 'sell'
  source    SYMBOL CAPACITY 16 CACHE   -- venue, e.g. 'okx'
) TIMESTAMP(ts) PARTITION BY DAY WAL;

-- ── get_vwap : volume-weighted average price over a trailing window ────────────
-- (parameterized in db/questdb.ts; here for reference / manual testing)
-- SELECT symbol, sum(price * size) / sum(size) AS vwap
-- FROM trades
-- WHERE symbol = 'BTC-USDC' AND ts > dateadd('m', -5, now())
-- SAMPLE BY 5m;

-- ── get_price_proof : latest price at-or-before a timestamp (LATEST ON) ────────
-- SELECT ts AS source_ts, price, source
-- FROM trades
-- WHERE symbol = 'BTC-USDC' AND ts <= now()
-- LATEST ON ts PARTITION BY symbol;

-- Optional: a couple of sample rows so the endpoints return something before the
-- live ingester is wired. Delete once real ingest is running.
INSERT INTO trades VALUES (now(), 'BTC-USDC', 63000.12, 0.5, 'buy',  'okx');
INSERT INTO trades VALUES (now(), 'BTC-USDC', 63010.40, 0.3, 'sell', 'okx');

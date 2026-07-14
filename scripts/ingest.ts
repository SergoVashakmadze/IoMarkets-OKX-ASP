// OKX public WebSocket → QuestDB ingester.
//
// Streams live trades from OKX's public v5 WebSocket and writes them into the
// QuestDB `trades` table over ILP (HTTP, port 9000). This is what makes get_vwap
// return real market state instead of the sample rows in sql/schema.sql.
//
//   pnpm ingest              # streams config.ingest.pairs (default BTC-USDC)
//   DATA_PAIRS=BTC-USDT,ETH-USDT pnpm ingest
//
// Resilient by design: auto-reconnect with backoff, OKX ping/pong keepalive, and
// periodic ILP flush. Ctrl-C flushes and closes cleanly.

import WebSocket from "ws";
import { Sender } from "@questdb/nodejs-client";
import { config } from "../src/config.js";

const PAIRS = config.ingest.pairs;
const WS_URL = config.ingest.wsUrl;
const ILP_CONF = `http::addr=${config.questdb.host}:${config.questdb.ilpPort}`;

// OKX closes idle connections after 30s; send a literal "ping" every 20s and it
// replies "pong". Also reconnect if we stop hearing anything for a while.
const PING_MS = 20_000;
const FLUSH_MS = 1_000;
const IDLE_TIMEOUT_MS = 40_000;

type OkxTrade = { instId: string; px: string; sz: string; side: string; ts: string };
type OkxMessage =
  | { event: "subscribe" | "error"; arg?: unknown; msg?: string; code?: string }
  | { arg: { channel: string; instId: string }; data: OkxTrade[] };

let sender: Sender;
let ws: WebSocket | undefined;
let reconnectDelay = 1_000;
let lastMessageAt = Date.now();
let pingTimer: NodeJS.Timeout | undefined;
let flushTimer: NodeJS.Timeout | undefined;
let idleTimer: NodeJS.Timeout | undefined;
let stopping = false;
let written = 0;

async function writeTrade(t: OkxTrade): Promise<void> {
  await sender
    .table("trades")
    .symbol("symbol", t.instId)
    .symbol("side", t.side)
    .symbol("source", "okx")
    .floatColumn("price", Number(t.px))
    .floatColumn("size", Number(t.sz))
    .at(Number(t.ts), "ms"); // OKX ts is epoch milliseconds
  written++;
}

function clearTimers(): void {
  for (const t of [pingTimer, flushTimer, idleTimer]) if (t) clearInterval(t);
}

function connect(): void {
  if (stopping) return;
  console.log(`Connecting to OKX WS ${WS_URL} …`);
  ws = new WebSocket(WS_URL);

  ws.on("open", () => {
    reconnectDelay = 1_000;
    lastMessageAt = Date.now();
    const sub = {
      op: "subscribe",
      args: PAIRS.map((instId) => ({ channel: "trades", instId })),
    };
    ws!.send(JSON.stringify(sub));
    console.log(`Subscribed to trades: ${PAIRS.join(", ")}`);

    pingTimer = setInterval(() => ws?.readyState === WebSocket.OPEN && ws.send("ping"), PING_MS);
    flushTimer = setInterval(() => {
      sender.flush().catch((e) => console.error("ILP flush failed:", (e as Error).message));
    }, FLUSH_MS);
    idleTimer = setInterval(() => {
      if (Date.now() - lastMessageAt > IDLE_TIMEOUT_MS) {
        console.warn("No messages for a while — forcing reconnect.");
        ws?.terminate();
      }
    }, IDLE_TIMEOUT_MS / 2);
  });

  ws.on("message", async (raw) => {
    lastMessageAt = Date.now();
    const text = raw.toString();
    if (text === "pong") return; // keepalive reply
    let msg: OkxMessage;
    try {
      msg = JSON.parse(text);
    } catch {
      return;
    }
    if ("event" in msg) {
      if (msg.event === "error") console.error("OKX subscribe error:", msg.code, msg.msg);
      return;
    }
    if (msg.arg?.channel === "trades" && Array.isArray(msg.data)) {
      for (const t of msg.data) {
        try {
          await writeTrade(t);
        } catch (e) {
          console.error("write failed:", (e as Error).message);
        }
      }
      if (written % 100 === 0 && written > 0) console.log(`  ${written} trades written…`);
    }
  });

  ws.on("close", () => {
    clearTimers();
    if (stopping) return;
    console.warn(`WS closed — reconnecting in ${reconnectDelay}ms`);
    setTimeout(connect, reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, 30_000);
  });

  ws.on("error", (e) => console.error("WS error:", (e as Error).message)); // 'close' handles reconnect
}

async function shutdown(): Promise<void> {
  stopping = true;
  clearTimers();
  console.log(`\nFlushing ${written} trades and closing…`);
  try {
    ws?.close();
    await sender.flush();
    await sender.close();
  } catch (e) {
    console.error("shutdown error:", (e as Error).message);
  }
  process.exit(0);
}

async function main(): Promise<void> {
  sender = await Sender.fromConfig(ILP_CONF);
  console.log(`ILP → QuestDB ${ILP_CONF}`);
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  connect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

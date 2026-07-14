// A2MCP tool manifest — the service list a calling agent reads to discover what
// IoMarkets.ai offers and what each call costs. Mirrors the OKX.AI listing and
// the paywall prices in config.ts (single source of truth for price = config).

import { config } from "../config.js";

export interface McpTool {
  name: string;
  description: string;
  price: string; // per-call, USDT0
  paid: boolean;
  input_schema: Record<string, unknown>;
  output_example: Record<string, unknown>;
}

export const tools: McpTool[] = [
  {
    name: "get_vwap",
    description:
      "Volume-weighted average price for a trading pair over a trailing window (minutes). Live crypto market signal, pay-per-call.",
    price: config.prices.get_vwap,
    paid: true,
    input_schema: {
      type: "object",
      properties: {
        pair: { type: "string", description: "e.g. BTC-USDC", default: "BTC-USDC" },
        window_min: { type: "number", description: "trailing window in minutes", default: 5 },
      },
    },
    output_example: { symbol: "BTC-USDC", vwap: 63000.12, window_min: 5 },
  },
  {
    name: "get_price_proof",
    description:
      "Signed point-in-time price attestation for a pair. Returns an ed25519 signature over a canonical payload, anchored to the x402 settlement tx on X Layer — independently verifiable offline against the published public key.",
    price: config.prices.get_price_proof,
    paid: true,
    input_schema: {
      type: "object",
      properties: {
        pair: { type: "string", description: "e.g. BTC-USDC", default: "BTC-USDC" },
        at: { type: "string", description: "ISO-8601 timestamp (optional; defaults to now)" },
      },
    },
    output_example: {
      payload: {
        symbol: "BTC-USDC",
        price: 63000,
        source: "okx",
        chain: "x-layer",
        settlement_txid: "0x…",
      },
      signature: "…",
    },
  },
];

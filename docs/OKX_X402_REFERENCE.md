# OKX.AI A2MCP — confirmed reference (pulled from OKX docs, 2026-07-14)

Source: OKX.AI ASP tutorial (`okx.ai/tutorial/asp`) + A2MCP Guide
(`web3.okx.com/onchainos/dev-docs/okxai/howtomcp`). These are the real values —
no more guessing.

## Registration is agent-driven (no web form)

You register by installing an OKX skill into an AI agent and issuing prompts —
**Claude Code is explicitly supported**. Flow:

1. **Install an agent:** OpenClaw / Hermes / **Claude Code** / Codex (or cloud-hosted).
2. **Install Onchain OS skills:**
   ```
   npx skills add okx/onchainos-skills --yes -g
   ```
3. **Log in to the Agentic Wallet** (have your email ready) — prompt your agent:
   > Log in to Agentic Wallet on Onchain OS with my email

   → this provisions your **X Layer wallet 0x address** (your `payTo`).
4. **Register the A2MCP ASP** — prompt:
   > Help me register an A2MCP ASP on OKX.AI using OKX Agent Identity from Onchain OS

   The agent asks for **name, description, service list, default pricing**.
5. **List the ASP** — prompt:
   > Help me list my ASP on OKX.AI using Onchain OS

   Reviewed **within 24h**; result → Agentic Wallet email + agent chat.
   Note: even before/without passing review, the service is reachable **via its Agent ID**.

## x402 endpoint spec (paid A2MCP)

- **Two integration options.** (A, recommended) OKX Payment SDK **`@okxweb3/x402-*`**
  — available for **Node.js / Go / Rust / Java / Python**; attach the payment
  middleware, set receiving address + network + price, it does the 402 + on-chain
  verification. (B) implement x402 yourself (compliant 402, verify EIP-3009 header,
  replay protection, settlement).
- **Endpoint must be public HTTPS on a domain.** Self-check before registering:
  ```
  curl -i -X POST https://your-domain/your-path
  # paid → HTTP 402 + PAYMENT-REQUIRED header
  # free → HTTP 200 + result
  ```

### Standard 402 challenge (v2) — the confirmed field values

Base64-encode this and put it in the **`PAYMENT-REQUIRED`** response header (that
header is what the marketplace validates, not the body). The SDK does this for you.

```json
{
  "x402Version": 2,
  "resource": {
    "url": "https://<your public endpoint>/...",
    "description": "<your service description>",
    "mimeType": "application/json"
  },
  "accepts": [
    {
      "scheme": "exact",
      "network": "eip155:196",
      "asset": "0x779ded0c9e1022225f8e0630b35a9b54be713736",
      "amount": "10000",
      "payTo": "0x<your X Layer wallet>",
      "maxTimeoutSeconds": 300,
      "extra": { "name": "USD₮0", "version": "1" }
    }
  ]
}
```

| Field | Confirmed value |
|---|---|
| Network (CAIP-2) | `eip155:196` (X Layer mainnet) |
| Settlement token | **USDT0** (USD₮0), contract `0x779ded0c9e1022225f8e0630b35a9b54be713736`, **decimals 6** |
| Amount units | min units — `10000` = 0.01 USDT0 |
| Scheme | `exact` (EIP-3009) |
| Payment header | `PAYMENT-REQUIRED` (base64 challenge), x402Version 2 |

> **Correction vs earlier plan:** settlement is **USDT0, not USDC.** Price our
> services in USDT0 min units: `get_vwap` $0.002 → `2000`; `get_price_proof`
> $0.01 → `10000`.

## Live marketplace reality (from okx.ai/tasks, 2026-07-14)

- **Total volume just $899** across 8,853 tasks posted — the marketplace is brand
  new. For the hackathon, *being live + a strong demo + #OKXAI buzz* matters more
  than earned volume.
- **Tasks pay in USDT**, sub-dollar (0.001–5).
- **Finance demand is real but skews to analysis, not raw feeds:** "analyze US
  stock trend next month," "HK IPO strategy," "smart money address tracking,"
  "wallet behavior analysis," "meme smart-money signal," "prediction market /
  World Cup." A hot **WORLD CUP** category (2026).
- **Fit note:** raw BTC-USDC VWAP has weak direct demand; the pull is toward
  *analysis + on-chain intelligence + verifiable outputs*. Our signed-proof angle
  is unique here — lean into "verifiable market truth," and consider an analysis
  wrapper service later (see roadmap).

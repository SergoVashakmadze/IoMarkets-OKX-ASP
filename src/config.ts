// Central config, read from the environment. See .env.example for every knob.
// No secrets are hard-coded; the process reads .env at start (loaded by tsx's
// --env-file or your process manager).

function req(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (v === undefined) throw new Error(`missing required env: ${name}`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? "3000"),
  publicBaseUrl: process.env.PUBLIC_BASE_URL ?? "",
  dataSource: process.env.DATA_SOURCE ?? "okx",

  questdb: {
    host: req("QUESTDB_HOST", "127.0.0.1"),
    port: Number(process.env.QUESTDB_PORT ?? "8812"),
    user: req("QUESTDB_USER", "admin"),
    password: req("QUESTDB_PASSWORD", "quest"),
    database: req("QUESTDB_DATABASE", "qdb"),
  },

  // Verification tier. Empty until you run `pnpm gen-key`; the proof endpoint
  // returns 503 while unset so it can't emit an unsigned "proof".
  proofPrivateKey: process.env.PROOF_PRIVATE_KEY ?? "",
  proofPublicKey: process.env.PROOF_PUBLIC_KEY ?? "",

  // x402 payment config — wired to the OKX Payment SDK (@okxweb3/x402-*). The SDK
  // builds the 402 challenge, verifies the EIP-3009 payment, and settles on X
  // Layer via the OKX facilitator; we only write business logic. Confirmed values:
  // web3.okx.com/onchainos/dev-docs/okxai/howtomcp + .../payments/service-seller-sdk
  x402: {
    // payTo = your OKX Agentic Wallet 0x address (provisioned when you log in via
    // the Onchain OS agent with your email). Fill after wallet login.
    payTo: process.env.X402_PAY_TO ?? "",
    // CAIP-2 network. X Layer mainnet = eip155:196, testnet = eip155:1952.
    network: process.env.X402_NETWORK ?? "eip155:196",
    // OKX facilitator credentials — apply at the OKX Developer Portal.
    apiKey: process.env.OKX_API_KEY ?? "",
    secretKey: process.env.OKX_SECRET_KEY ?? "",
    passphrase: process.env.OKX_PASSPHRASE ?? "",
    // Prices are USD strings; the SDK converts to the network stablecoin (USDT0).
    // Kept here so routes + landing + MCP manifest share one source of truth.
  },

  // Per-call prices (USDT0). Single source of truth for the paywall + landing +
  // MCP manifest so they never drift.
  prices: {
    get_vwap: "$0.002",
    get_price_proof: "$0.01",
  },
} as const;

export const proofConfigured = () =>
  config.proofPrivateKey.length > 0 && config.proofPublicKey.length > 0;

/** True once the OKX facilitator creds + receiving wallet are configured. */
export const x402Configured = () =>
  config.x402.payTo.startsWith("0x") &&
  config.x402.apiKey.length > 0 &&
  config.x402.secretKey.length > 0 &&
  config.x402.passphrase.length > 0;

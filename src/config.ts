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

  // x402 paywall description (advertised to callers / the OKX broker). These
  // don't move money on their own — OKX's Broker settles on X Layer.
  x402: {
    payTo: process.env.X402_PAY_TO ?? "",
    network: process.env.X402_NETWORK ?? "eip155:196", // X Layer mainnet
    asset: process.env.X402_ASSET ?? "",
    facilitatorUrl: process.env.X402_FACILITATOR_URL ?? "",
  },

  // Per-call prices (USDC). Single source of truth for the paywall + landing +
  // MCP manifest so they never drift.
  prices: {
    get_vwap: "$0.002",
    get_price_proof: "$0.01",
  },
} as const;

export const proofConfigured = () =>
  config.proofPrivateKey.length > 0 && config.proofPublicKey.length > 0;

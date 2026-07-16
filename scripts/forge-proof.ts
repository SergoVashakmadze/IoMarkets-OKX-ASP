// Adversarial fixture: mint a *fake* attestation signed with a throwaway key.
//
//   pnpm forge forged.json         # then: pnpm verify forged.json  -> PROOF REJECTED
//
// Why this exists: verifying a signature against the pubkey carried *inside* the
// payload is circular — anyone can sign with their own key and embed it. This script
// produces exactly that attack, so the verifier's key-pinning can be demonstrated
// rather than asserted. If `pnpm verify` ever ACCEPTS this file, the trust model is
// broken and the proof claim is worthless.

import { writeFileSync } from "node:fs";
import { sign, generateKeypair } from "../src/proof/sign.js";

const out = process.argv[2] ?? "forged.json";
const attacker = generateKeypair();

const forged = sign(
  {
    query_ts: new Date().toISOString(),
    symbol: "BTC-USDC",
    source_ts: new Date().toISOString(),
    price: 1.0, // a lie: BTC is not $1
    source: "okx",
    chain: "x-layer",
    settlement_txid: "0xdeadbeef",
  },
  attacker.privateKey,
);

writeFileSync(out, JSON.stringify(forged, null, 2));
console.log(`forged attestation → ${out}`);
console.log(`  claims price      : ${forged.payload.price}`);
console.log(`  signed with key   : ${forged.payload.server_pubkey}`);
console.log(`  published key is  : a95fc43400976d6f324427765987cd8676e69fddaf0a49b57d309d4db2743cf4`);

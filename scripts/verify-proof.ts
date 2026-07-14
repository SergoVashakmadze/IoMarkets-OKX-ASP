// Standalone third-party verifier — proves the attestation needs no trust in us.
//   pnpm verify attestation.json
// Step 1 (this script): check the ed25519 signature against the payload's pubkey.
// Step 2 (manual): confirm payload.settlement_txid actually settled on X Layer
//   via the block explorer.

import { readFileSync } from "node:fs";
import { verifySignature, type Attestation } from "../src/proof/sign.js";

const path = process.argv[2];
if (!path) {
  console.error("usage: pnpm verify <attestation.json>");
  process.exit(2);
}

const att = JSON.parse(readFileSync(path, "utf8")) as Attestation;
const ok = verifySignature(att);

console.log(`Signature: ${ok ? "VALID" : "INVALID"}`);
if (att.payload?.settlement_txid) {
  console.log(`Next: confirm settlement on ${att.payload.chain}:`);
  console.log(`  txid = ${att.payload.settlement_txid}`);
}
process.exit(ok ? 0 : 1);

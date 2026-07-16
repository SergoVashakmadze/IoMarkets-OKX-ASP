// Standalone third-party verifier — proves the attestation needs no trust in us.
//   pnpm verify <attestation.json> [expected-pubkey]
//
// Step 1: the payload's `server_pubkey` MUST equal the server's *published* key.
//   Checking the signature against the key carried inside the payload is circular —
//   anyone can sign with their own keypair, embed that pubkey, and pass. Pinning to
//   the independently published key is what makes the proof mean anything.
//   Published at: https://okx.iomarkets.ai/v1/proof/pubkey
// Step 2: check the ed25519 signature over canonicalize(payload).
// Step 3 (manual): confirm payload.settlement_txid actually settled on X Layer
//   via the block explorer.

import { readFileSync } from "node:fs";
import { verifySignature, type Attestation } from "../src/proof/sign.js";

/** The key served at /v1/proof/pubkey. Override via argv[3] or $PROOF_PUBLIC_KEY. */
const PUBLISHED_PUBKEY =
  "a95fc43400976d6f324427765987cd8676e69fddaf0a49b57d309d4db2743cf4";

const path = process.argv[2];
if (!path) {
  console.error("usage: pnpm verify <attestation.json> [expected-pubkey]");
  process.exit(2);
}

const expected = (
  process.argv[3] ??
  process.env.PROOF_PUBLIC_KEY ??
  PUBLISHED_PUBKEY
)
  .trim()
  .toLowerCase();

const att = JSON.parse(readFileSync(path, "utf8")) as Attestation;
const actual = (att.payload?.server_pubkey ?? "").trim().toLowerCase();

const keyOk = actual.length > 0 && actual === expected;
const sigOk = verifySignature(att);

if (keyOk) {
  console.log("Signing key: MATCHES the published IoMarkets.ai key");
  console.log(`Signature:   ${sigOk ? "VALID" : "INVALID"}`);
} else {
  console.log("Signing key: UNKNOWN — this is NOT the published IoMarkets.ai key");
  console.log(`  expected ${expected}`);
  console.log(`  got      ${actual || "(missing)"}`);
  // Deliberately not called "VALID": a signature that only checks out against a key
  // the attacker chose proves self-consistency, nothing more.
  console.log(
    `Signature:   ${sigOk ? "self-consistent, but signed by an unknown key" : "INVALID"}`,
  );
}

const ok = keyOk && sigOk;

if (ok && att.payload?.settlement_txid) {
  console.log(`\nNext: confirm settlement on ${att.payload.chain}:`);
  console.log(`  txid = ${att.payload.settlement_txid}`);
}

console.log(ok ? "\nPROOF ACCEPTED" : "\nPROOF REJECTED");
process.exit(ok ? 0 : 1);

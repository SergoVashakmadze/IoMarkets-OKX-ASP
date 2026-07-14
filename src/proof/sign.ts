// The proof signing scheme — the differentiator. Every verification response is a
// canonical payload signed with the server's ed25519 keypair. A buyer (or any
// third party) can re-verify offline:
//   1. check the signature against the published PROOF_PUBLIC_KEY
//   2. confirm `settlement_txid` actually settled on X Layer
// That single property is what makes IoMarkets.ai read as a real product, not a demo.
//
// Chain-neutral: `chain` + `settlement_txid` name the settlement so the same proof
// scheme works on X Layer (or anywhere). Do not change canonicalize() order
// without versioning the scheme — verifiers hash the exact same byte order.

import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";

// @noble/ed25519 v2 needs a sync sha512 wired up to expose sync sign/verify.
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

const enc = new TextEncoder();
const toHex = (b: Uint8Array) => Buffer.from(b).toString("hex");
const fromHex = (h: string) => Uint8Array.from(Buffer.from(h, "hex"));

/** The exact fields that get signed. Order matters — see canonicalize(). */
export interface AttestationPayload {
  query_ts: string; // when IoMarkets.ai served the request (ISO 8601)
  symbol: string; // e.g. "BTC-USDC"
  source_ts: string; // the data point's own timestamp (from QuestDB)
  price: number;
  source: string; // e.g. "okx"
  chain: string; // settlement chain, e.g. "x-layer"
  settlement_txid: string; // the x402 settlement tx — anchors the proof on-chain
  server_pubkey: string; // hex; redundant-but-explicit so payload self-describes
}

export interface Attestation {
  payload: AttestationPayload;
  signature: string; // hex ed25519 signature over canonicalize(payload)
}

/**
 * Deterministic serialization. Keys are emitted in a fixed order so the bytes a
 * verifier hashes are identical to the bytes we signed, regardless of JS object
 * key ordering. Do not change this order without versioning the scheme.
 */
export function canonicalize(p: AttestationPayload): string {
  return JSON.stringify([
    p.query_ts,
    p.symbol,
    p.source_ts,
    p.price,
    p.source,
    p.chain,
    p.settlement_txid,
    p.server_pubkey,
  ]);
}

export function derivePublicKey(privHex: string): string {
  return toHex(ed.getPublicKey(fromHex(privHex)));
}

export function generateKeypair(): { privateKey: string; publicKey: string } {
  const priv = ed.utils.randomPrivateKey();
  return { privateKey: toHex(priv), publicKey: toHex(ed.getPublicKey(priv)) };
}

export function sign(
  payload: Omit<AttestationPayload, "server_pubkey">,
  privHex: string,
): Attestation {
  const full: AttestationPayload = {
    ...payload,
    server_pubkey: derivePublicKey(privHex),
  };
  const msg = enc.encode(canonicalize(full));
  const signature = toHex(ed.sign(msg, fromHex(privHex)));
  return { payload: full, signature };
}

/** Pure signature check. Does NOT confirm on-chain settlement — see verify-proof.ts. */
export function verifySignature(att: Attestation): boolean {
  try {
    const msg = enc.encode(canonicalize(att.payload));
    return ed.verify(fromHex(att.signature), msg, fromHex(att.payload.server_pubkey));
  } catch {
    return false;
  }
}

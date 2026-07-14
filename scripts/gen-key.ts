// Generate the server's ed25519 proof keypair. Copy the two lines into .env.
//   pnpm gen-key
import { generateKeypair } from "../src/proof/sign.js";

const { privateKey, publicKey } = generateKeypair();
console.log(`PROOF_PRIVATE_KEY=${privateKey}`);
console.log(`PROOF_PUBLIC_KEY=${publicKey}`);
console.error("\n# Publish PROOF_PUBLIC_KEY so anyone can verify attestations. Keep the private key secret.");

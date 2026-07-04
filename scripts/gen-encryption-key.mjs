// Generates a 256-bit key for encrypting sensitive fields (gift-card codes,
// wallet addresses). Appends to .env.local once; never prints the key.
import { readFileSync, appendFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

const path = ".env.local";
let current = "";
try {
  current = readFileSync(path, "utf8");
} catch {}

if (current.includes("ENCRYPTION_KEY=")) {
  console.log("ENCRYPTION_KEY already present — leaving as-is.");
  process.exit(0);
}

const key = randomBytes(32).toString("base64");
appendFileSync(path, `\n# --- Field encryption (AES-256-GCM) ---\nENCRYPTION_KEY=${key}\n`);
console.log("✓ ENCRYPTION_KEY written to .env.local (not shown).");

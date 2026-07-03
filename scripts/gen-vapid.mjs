// Generates Web Push VAPID keys and appends them to .env.local (once).
// The private key is written to the file but never printed.
import { readFileSync, appendFileSync } from "node:fs";
import webpush from "web-push";

const path = ".env.local";
let current = "";
try {
  current = readFileSync(path, "utf8");
} catch {}

if (current.includes("VAPID_PRIVATE_KEY=")) {
  console.log("VAPID keys already present in .env.local — leaving as-is.");
  process.exit(0);
}

const { publicKey, privateKey } = webpush.generateVAPIDKeys();
const subject =
  (current.match(/RESEND_FROM_EMAIL=.*<([^>]+)>/)?.[1] &&
    "mailto:" + current.match(/RESEND_FROM_EMAIL=.*<([^>]+)>/)[1]) ||
  "mailto:support@example.com";

const block = `
# --- Web Push (mobile/desktop notifications) ---
NEXT_PUBLIC_VAPID_PUBLIC_KEY=${publicKey}
VAPID_PRIVATE_KEY=${privateKey}
VAPID_SUBJECT=${subject}
`;

appendFileSync(path, block);
console.log("✓ VAPID keys written to .env.local");
console.log("  Public key:", publicKey);
console.log("  (private key stored, not shown)");

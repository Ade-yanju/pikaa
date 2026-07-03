// Sets the Supabase email OTP length to 6 via the Management API.
// Needs a Personal Access Token (https://supabase.com/dashboard/account/tokens)
// placed in .env.local as: SUPABASE_ACCESS_TOKEN=sbp_xxx
// Run: node scripts/set-otp-length.mjs   (or: npm run set-otp)
import { readFileSync } from "node:fs";

function loadEnv(path) {
  const env = {};
  try {
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {}
  return env;
}

const env = { ...loadEnv(".env.local"), ...process.env };
const token = env.SUPABASE_ACCESS_TOKEN;
const url = env.NEXT_PUBLIC_SUPABASE_URL || "";
const ref = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
const TARGET = 6;

if (!token) {
  console.error(
    "\n✗ SUPABASE_ACCESS_TOKEN missing. Create one at\n" +
      "  https://supabase.com/dashboard/account/tokens\n" +
      "  then add to .env.local:  SUPABASE_ACCESS_TOKEN=sbp_xxxxx\n",
  );
  process.exit(1);
}
if (!ref) {
  console.error("✗ Could not read project ref from NEXT_PUBLIC_SUPABASE_URL");
  process.exit(1);
}

const base = `https://api.supabase.com/v1/projects/${ref}/config/auth`;
const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

console.log(`\nProject: ${ref}\n`);

// 1. Show current OTP-related settings
const before = await (await fetch(base, { headers })).json();
const otpKeys = Object.keys(before).filter((k) => k.toLowerCase().includes("otp"));
console.log("Current OTP settings:");
otpKeys.forEach((k) => console.log(`  ${k} = ${before[k]}`));

// 2. Patch the length to 6
const res = await fetch(base, {
  method: "PATCH",
  headers,
  body: JSON.stringify({ mailer_otp_length: TARGET }),
});
if (!res.ok) {
  console.error(`\n✗ PATCH failed (${res.status}): ${await res.text()}`);
  process.exit(1);
}

// 3. Confirm
const after = await (await fetch(base, { headers })).json();
console.log(`\n✓ mailer_otp_length is now: ${after.mailer_otp_length}`);
console.log(
  after.mailer_otp_length === TARGET
    ? "\nDone — new codes will be 6 digits.\n"
    : "\n! Value didn't stick; the API key may differ. Paste the output above to me.\n",
);

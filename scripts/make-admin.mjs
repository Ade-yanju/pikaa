// Promote (or demote) a user by email. The user must have registered first.
// Usage:
//   npm run make-admin -- someone@email.com          → makes them admin
//   npm run make-admin -- someone@email.com user      → demotes back to user
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

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
const email = (process.argv[2] || "").trim().toLowerCase();
const role = (process.argv[3] || "admin").trim();

if (!email) {
  console.error("Usage: npm run make-admin -- <email> [admin|user]");
  process.exit(1);
}
if (!["admin", "user"].includes(role)) {
  console.error("Role must be 'admin' or 'user'");
  process.exit(1);
}

const admin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const { data, error } = await admin
  .from("profiles")
  .update({ role })
  .eq("email", email)
  .select("email, role");

if (error) {
  console.error("✗ Failed:", error.message);
  process.exit(1);
}
if (!data?.length) {
  console.error(
    `✗ No account found for ${email}. They must register first, then re-run.`,
  );
  process.exit(1);
}
console.log(`✓ ${data[0].email} is now role='${data[0].role}'.`);

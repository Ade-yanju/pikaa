// Run a .sql file against the Supabase database via the Management API.
// Needs SUPABASE_ACCESS_TOKEN in .env.local.
// Usage: node scripts/db-exec.mjs path/to/file.sql
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
const ref = (env.NEXT_PUBLIC_SUPABASE_URL || "").match(
  /https:\/\/([a-z0-9]+)\.supabase\.co/,
)?.[1];
const file = process.argv[2];

if (!token || !ref) {
  console.error("✗ SUPABASE_ACCESS_TOKEN and NEXT_PUBLIC_SUPABASE_URL required");
  process.exit(1);
}
if (!file) {
  console.error("Usage: node scripts/db-exec.mjs <file.sql>");
  process.exit(1);
}

const query = readFileSync(file, "utf8");
const res = await fetch(
  `https://api.supabase.com/v1/projects/${ref}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  },
);

const text = await res.text();
if (!res.ok) {
  console.error(`✗ Query failed (${res.status}): ${text}`);
  process.exit(1);
}
console.log("✓ Executed. Result:", text || "(no rows)");

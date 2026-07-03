// Verifies your Supabase + Resend setup without printing any secret values.
// Run: node scripts/check-setup.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// --- tiny .env.local parser (no dependency) ---------------------------------
function loadEnv(path) {
  const env = {};
  try {
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* file may not exist */
  }
  return env;
}

const env = { ...loadEnv(".env.local"), ...process.env };
const pass = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);
const fail = (m) => console.log(`  \x1b[31m✗\x1b[0m ${m}`);
let ok = true;

console.log("\nPickar setup check\n------------------");

// 1. Presence of env vars
const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
];
for (const k of required) {
  if (env[k]) pass(`${k} is set`);
  else {
    fail(`${k} is MISSING`);
    ok = false;
  }
}
if (env.RESEND_API_KEY && !env.RESEND_API_KEY.startsWith("re_"))
  fail("RESEND_API_KEY doesn't look right (should start with 're_')");

// 2. Database connectivity + schema
if (env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
  const admin = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );
  const tables = [
    "profiles",
    "conversations",
    "messages",
    "company_accounts",
    "payment_requests",
  ];
  console.log("\nDatabase tables:");
  for (const t of tables) {
    const { error } = await admin.from(t).select("*").limit(1);
    if (error) {
      fail(`${t} — ${error.message}`);
      ok = false;
    } else {
      pass(`${t}`);
    }
  }

  console.log("\nAdmins configured:");
  const { data: admins, error: aErr } = await admin
    .from("profiles")
    .select("email")
    .eq("role", "admin");
  if (aErr) {
    fail(aErr.message);
  } else if (!admins?.length) {
    console.log(
      "  \x1b[33m!\x1b[0m No admin yet. After you register, run in Supabase SQL Editor:\n" +
        "      update public.profiles set role='admin' where email='you@example.com';",
    );
  } else {
    admins.forEach((a) => pass(`admin: ${a.email}`));
  }
} else {
  fail("Skipping DB check — Supabase URL / service role key missing");
  ok = false;
}

console.log("\nImage storage (optional — for chat photos):");
const hasCloudinary =
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_UPLOAD_PRESET;
if (hasCloudinary) pass("Cloudinary configured");
if (env.IMGBB_API_KEY) pass("ImgBB configured (fallback)");
if (!hasCloudinary && !env.IMGBB_API_KEY)
  console.log(
    "  \x1b[33m!\x1b[0m No image host set — text chat works; photo attachments\n" +
      "      need CLOUDINARY_CLOUD_NAME + CLOUDINARY_UPLOAD_PRESET, or IMGBB_API_KEY.",
  );

console.log("\nPush notifications:");
if (env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY)
  pass("Web Push (VAPID) configured");
else
  console.log(
    "  \x1b[33m!\x1b[0m VAPID keys missing — run: node scripts/gen-vapid.mjs",
  );

console.log(
  ok
    ? "\n\x1b[32mAll core checks passed.\x1b[0m Run: npm run dev\n"
    : "\n\x1b[31mSome checks failed.\x1b[0m Fix the above, then re-run this script.\n",
);
process.exit(ok ? 0 : 1);

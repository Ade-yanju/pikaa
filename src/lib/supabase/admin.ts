import "server-only";

import { createClient } from "@supabase/supabase-js";

// Service-role client. BYPASSES Row Level Security — only use in trusted
// server code (auth flow: creating users / generating OTP links). Never import
// this into a Client Component.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

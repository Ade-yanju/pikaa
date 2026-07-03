import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/dal";
import { createAdminClient } from "@/lib/supabase/admin";

// Remove a Web Push subscription (e.g. when the user turns notifications off).
export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let endpoint: string | undefined;
  try {
    endpoint = (await request.json())?.endpoint;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!endpoint) {
    return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
  }

  const admin = createAdminClient();
  await admin
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint)
    .eq("user_id", user.id);

  return NextResponse.json({ ok: true });
}

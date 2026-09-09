import { requireAdmin } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import UserDirectory from "./UserDirectory";

export const metadata = { title: "Team & Admins — Pickar Support" };

export default async function TeamPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, country, role, created_at")
    .order("created_at", { ascending: false });

  return <UserDirectory existingUsers={(data as Profile[]) ?? []} />;
}

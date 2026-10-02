import { requireUser } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import type { AffiliateReward } from "@/lib/types";
import AffiliatePanel from "./AffiliatePanel";

export const metadata = { title: "Refer & Earn — Pickar" };

export default async function AffiliatesPage() {
  const profile = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("affiliate_rewards")
    .select("*")
    .eq("referrer_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <AffiliatePanel
      code={profile.affiliate_code ?? ""}
      rewards={(data as AffiliateReward[]) ?? []}
    />
  );
}

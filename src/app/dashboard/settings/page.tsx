import { requireUser } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";
import { decryptSecret } from "@/lib/crypto";
import type { WithdrawalDetail } from "@/lib/types";
import ProfileForm from "./ProfileForm";
import WithdrawalManager, { type WithdrawalView } from "./WithdrawalManager";

export const metadata = { title: "Settings — Pickar" };

function mask(value: string | null): string {
  if (!value) return "••••";
  const last = value.slice(-4);
  return `•••• ${last}`;
}

export default async function SettingsPage() {
  const profile = await requireUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("withdrawal_details")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  const items: WithdrawalView[] = ((data as WithdrawalDetail[]) ?? []).map((w) => ({
    id: w.id,
    method: w.method,
    label: w.label,
    account_name: w.account_name,
    bank_name: w.bank_name,
    masked: mask(decryptSecret(w.account_number_enc)),
    currency: w.currency,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Your profile</h1>
        <p className="text-slate-400 text-sm mt-1">
          Update your name and contact details.
        </p>
        <div className="mt-5">
          <ProfileForm profile={profile} />
        </div>
      </div>

      <WithdrawalManager items={items} />
    </div>
  );
}

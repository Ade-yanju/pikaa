"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/dal";
import { withdrawalSchema } from "@/lib/validation";
import { encryptSecret } from "@/lib/crypto";
import type { ActionState } from "@/lib/types";

/** Add a withdrawal/payout account. Sensitive fields are encrypted at rest. */
export async function addWithdrawalDetail(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const profile = await getProfile();
  if (!profile) return { error: "Please log in again." };

  const parsed = withdrawalSchema.safeParse({
    method: formData.get("method"),
    label: formData.get("label"),
    account_name: formData.get("account_name"),
    bank_name: formData.get("bank_name"),
    account_number: formData.get("account_number"),
    routing: formData.get("routing"),
    currency: formData.get("currency"),
    extra: formData.get("extra"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }
  const d = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("withdrawal_details").insert({
    user_id: profile.id,
    method: d.method,
    label: d.label || null,
    account_name: d.account_name || null,
    bank_name: d.bank_name || null,
    account_number_enc: encryptSecret(d.account_number),
    routing_enc: d.routing ? encryptSecret(d.routing) : null,
    currency: d.currency ? d.currency.toUpperCase() : null,
    extra: d.extra || null,
  });

  if (error) {
    console.error("addWithdrawalDetail failed:", error.message);
    return { error: "Could not save your withdrawal details." };
  }
  revalidatePath("/dashboard/settings");
  return { ok: true };
}

export async function deleteWithdrawalDetail(id: string): Promise<ActionState> {
  const profile = await getProfile();
  if (!profile) return { error: "Please log in again." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("withdrawal_details")
    .delete()
    .eq("id", id)
    .eq("user_id", profile.id);

  if (error) return { error: "Could not remove." };
  revalidatePath("/dashboard/settings");
  return { ok: true };
}

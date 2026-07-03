"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/dal";
import { companyAccountSchema } from "@/lib/validation";
import type {
  ActionState,
  CompanyAccount,
  PaymentRequestStatus,
} from "@/lib/types";

const VALID_STATUSES: PaymentRequestStatus[] = [
  "pending",
  "in_review",
  "details_shared",
  "completed",
  "cancelled",
];

/** Admin updates a payment request: status, assigned account, and/or note. */
export async function updatePaymentRequest(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as PaymentRequestStatus;
  const accountId = String(formData.get("account_id") || "");
  const note = String(formData.get("admin_note") || "").trim();

  if (!id || !VALID_STATUSES.includes(status)) {
    return { error: "Invalid update." };
  }

  const { data: updated, error } = await supabase
    .from("payment_requests")
    .update({
      status,
      account_id: accountId || null,
      admin_note: note || null,
    })
    .eq("id", id)
    .select("id, conversation_id, user_id")
    .single();

  if (error) {
    console.error("updatePaymentRequest failed:", error.message);
    return { error: "Could not update the request." };
  }

  // If an account was shared, post the details into the freelancer's chat.
  if (accountId && updated?.conversation_id) {
    const { data: acct } = await supabase
      .from("company_accounts")
      .select("*")
      .eq("id", accountId)
      .single<CompanyAccount>();

    if (acct) {
      const lines = [
        "✅ Here are the payment details to receive your payout:",
        acct.account_name && `Account name: ${acct.account_name}`,
        acct.bank_name && `Bank: ${acct.bank_name}`,
        acct.account_number && `Account number: ${acct.account_number}`,
        acct.routing_number && `Routing/IBAN/SWIFT: ${acct.routing_number}`,
        `Currency: ${acct.currency}`,
        note && `\nNote: ${note}`,
      ].filter(Boolean);

      const { data: me } = await supabase.auth.getUser();
      if (me?.user) {
        await supabase.from("messages").insert({
          conversation_id: updated.conversation_id,
          sender_id: me.user.id,
          sender_role: "admin",
          body: lines.join("\n"),
        });
      }
    }
  }

  revalidatePath("/admin/requests");
  return { ok: true };
}

/** Create a company receiving account that support can share. */
export async function createCompanyAccount(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = companyAccountSchema.safeParse({
    label: formData.get("label"),
    currency: formData.get("currency"),
    region: formData.get("region"),
    bank_name: formData.get("bank_name"),
    account_name: formData.get("account_name"),
    account_number: formData.get("account_number"),
    routing_number: formData.get("routing_number"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("company_accounts").insert({
    label: parsed.data.label,
    currency: parsed.data.currency.toUpperCase(),
    region: parsed.data.region || null,
    bank_name: parsed.data.bank_name || null,
    account_name: parsed.data.account_name || null,
    account_number: parsed.data.account_number || null,
    routing_number: parsed.data.routing_number || null,
  });

  if (error) {
    console.error("createCompanyAccount failed:", error.message);
    return { error: "Could not save the account." };
  }
  revalidatePath("/admin/accounts");
  return { ok: true };
}

/** Promote or demote another user. Admin-only; can't change your own role. */
export async function setUserRole(
  userId: string,
  role: "admin" | "user",
): Promise<ActionState> {
  const me = await requireAdmin();
  if (userId === me.id) {
    return { error: "You can't change your own role." };
  }
  if (role !== "admin" && role !== "user") {
    return { error: "Invalid role." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) {
    console.error("setUserRole failed:", error.message);
    return { error: "Could not update the role." };
  }
  revalidatePath("/admin/team");
  return { ok: true };
}

export async function toggleCompanyAccount(id: string, isActive: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("company_accounts")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) return { error: "Could not update." };
  revalidatePath("/admin/accounts");
  return {};
}

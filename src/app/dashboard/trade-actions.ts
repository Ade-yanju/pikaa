"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProfile } from "@/lib/dal";
import { giftCardSchema, cryptoSchema } from "@/lib/validation";
import { encryptSecret } from "@/lib/crypto";
import { sendPushToUsers } from "@/lib/push";
import type { ActionState } from "@/lib/types";

async function conversationIdFor(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data?.id ?? null;
}

async function postSummaryAndNotify(opts: {
  userId: string;
  role: "user" | "admin";
  conversationId: string | null;
  summary: string;
  who: string;
}) {
  const supabase = await createClient();
  if (opts.conversationId) {
    await supabase.from("messages").insert({
      conversation_id: opts.conversationId,
      sender_id: opts.userId,
      sender_role: opts.role,
      body: opts.summary,
    });
  }
  after(async () => {
    const admin = createAdminClient();
    const { data: admins } = await admin
      .from("profiles")
      .select("id")
      .eq("role", "admin");
    const ids = (admins ?? []).map((a) => a.id).filter((id) => id !== opts.userId);
    await sendPushToUsers(ids, {
      title: "New trade request",
      body: `${opts.who}: ${opts.summary}`,
      url: "/admin/trades",
    });
  });
}

export async function createGiftCardTrade(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const profile = await getProfile();
  if (!profile) return { error: "Please log in again." };

  const parsed = giftCardSchema.safeParse({
    asset: formData.get("asset"),
    network: formData.get("network"),
    currency: formData.get("currency"),
    amount: formData.get("amount"),
    secret: formData.get("secret"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }
  const d = parsed.data;
  const image = String(formData.get("image_url") || "").trim() || null;
  const conversationId = await conversationIdFor(profile.id);

  const supabase = await createClient();
  const { error } = await supabase.from("trades").insert({
    user_id: profile.id,
    conversation_id: conversationId,
    type: "gift_card",
    side: "sell",
    asset: d.asset,
    network: d.network || null,
    amount: d.amount,
    currency: d.currency.toUpperCase(),
    secret_encrypted: d.secret ? encryptSecret(d.secret) : null,
    image_url: image && /^https:\/\//.test(image) ? image : null,
  });
  if (error) {
    console.error("createGiftCardTrade failed:", error.message);
    return { error: "Could not submit your gift card." };
  }

  const summary = `🎁 Gift card sale — ${d.asset} ${d.currency.toUpperCase()} ${d.amount}${d.network ? ` (${d.network})` : ""}`;
  await postSummaryAndNotify({
    userId: profile.id,
    role: profile.role,
    conversationId,
    summary,
    who: profile.full_name || "A freelancer",
  });

  revalidatePath("/dashboard/gift-cards");
  return { ok: true };
}

export async function createCryptoTrade(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const profile = await getProfile();
  if (!profile) return { error: "Please log in again." };

  const parsed = cryptoSchema.safeParse({
    side: formData.get("side"),
    asset: formData.get("asset"),
    network: formData.get("network"),
    currency: formData.get("currency"),
    amount: formData.get("amount"),
    secret: formData.get("secret"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }
  const d = parsed.data;
  const conversationId = await conversationIdFor(profile.id);

  const supabase = await createClient();
  const { error } = await supabase.from("trades").insert({
    user_id: profile.id,
    conversation_id: conversationId,
    type: "crypto",
    side: d.side,
    asset: d.asset.toUpperCase(),
    network: d.network || null,
    amount: d.amount,
    currency: (d.currency || "USD").toUpperCase(),
    secret_encrypted: d.secret ? encryptSecret(d.secret) : null,
  });
  if (error) {
    console.error("createCryptoTrade failed:", error.message);
    return { error: "Could not submit your trade." };
  }

  const summary = `₿ Crypto ${d.side} — ${d.amount} ${d.asset.toUpperCase()}${d.network ? ` (${d.network})` : ""}`;
  await postSummaryAndNotify({
    userId: profile.id,
    role: profile.role,
    conversationId,
    summary,
    who: profile.full_name || "A freelancer",
  });

  revalidatePath("/dashboard/crypto");
  return { ok: true };
}

export async function cancelTrade(id: string): Promise<ActionState> {
  const profile = await getProfile();
  if (!profile) return { error: "Please log in again." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("trades")
    .update({ status: "cancelled" })
    .eq("id", id)
    .eq("user_id", profile.id);
  if (error) return { error: "Could not cancel." };
  revalidatePath("/dashboard/gift-cards");
  revalidatePath("/dashboard/crypto");
  return { ok: true };
}

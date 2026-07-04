"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProfile } from "@/lib/dal";
import { paymentRequestSchema } from "@/lib/validation";
import { sendNewRequestAlert } from "@/lib/resend";
import { sendPushToUsers } from "@/lib/push";
import type { ActionState } from "@/lib/types";

/**
 * Post a message into a conversation. sender_role is derived server-side.
 * A message may carry text, an image (already uploaded via /api/upload), or both.
 */
export async function sendMessage(
  conversationId: string,
  body: string,
  imageUrl?: string | null,
  replyTo?: string | null,
): Promise<ActionState> {
  const profile = await getProfile();
  if (!profile) return { error: "Please log in again." };

  const text = (body ?? "").trim();
  const image = imageUrl?.trim() || null;

  if (!conversationId) return { error: "Invalid conversation." };
  if (!text && !image) return { error: "Type a message or attach an image." };
  if (text.length > 4000) return { error: "Message is too long." };
  if (image && !/^https:\/\//.test(image)) return { error: "Invalid image." };

  const supabase = await createClient();
  const payload: Record<string, unknown> = {
    conversation_id: conversationId,
    sender_id: profile.id,
    sender_role: profile.role, // 'user' or 'admin', trusted from the DAL
    body: text || null,
    image_url: image,
  };
  // Only set when replying, so normal chat works even before the migration.
  if (replyTo) payload.reply_to = replyTo;

  const { error } = await supabase.from("messages").insert(payload);

  if (error) {
    console.error("sendMessage failed:", error.message);
    return { error: "Message failed to send." };
  }

  // Push the notification to the recipient(s) after the response is sent.
  const preview = image ? "📷 Photo" : text.slice(0, 90);
  after(async () => {
    const adminDb = createAdminClient();
    if (profile.role === "user") {
      // Notify all admins.
      const { data: admins } = await adminDb
        .from("profiles")
        .select("id")
        .eq("role", "admin");
      const ids = (admins ?? []).map((a) => a.id).filter((id) => id !== profile.id);
      await sendPushToUsers(ids, {
        title: `New message from ${profile.full_name || "a freelancer"}`,
        body: preview || "New message",
        url: `/admin/chat/${conversationId}`,
      });
    } else {
      // Admin replied — notify the conversation's owner.
      const { data: conv } = await adminDb
        .from("conversations")
        .select("user_id")
        .eq("id", conversationId)
        .maybeSingle();
      if (conv?.user_id) {
        await sendPushToUsers([conv.user_id], {
          title: "Pickar Support replied",
          body: preview || "New message",
          url: "/dashboard/chat",
        });
      }
    }
  });

  return {};
}

/** Mark all incoming (not-mine) messages in a conversation as read. */
export async function markMessagesRead(conversationId: string) {
  const profile = await getProfile();
  if (!profile) return { error: "Not authenticated" };

  // Confirm the caller may see this conversation (owner or admin).
  const supabase = await createClient();
  const { data: conv } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .maybeSingle();
  if (!conv) return { error: "Not found" };

  // Use the service role to set only read_at (no broad UPDATE policy needed).
  const admin = createAdminClient();
  const { error } = await admin
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .neq("sender_id", profile.id)
    .is("read_at", null);

  if (error) {
    console.error("markMessagesRead failed:", error.message);
    return { error: "Could not update" };
  }
  return {};
}

/** A freelancer files a request for company payment details. */
export async function createPaymentRequest(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const profile = await getProfile();
  if (!profile) return { error: "Please log in again." };

  const parsed = paymentRequestSchema.safeParse({
    currency: formData.get("currency"),
    amount: formData.get("amount") || undefined,
    client_name: formData.get("client_name"),
    purpose: formData.get("purpose"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }
  const input = parsed.data;

  const supabase = await createClient();

  // Attach to the freelancer's support conversation (for the in-chat summary).
  const { data: conv } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("payment_requests").insert({
    user_id: profile.id,
    conversation_id: conv?.id ?? null,
    currency: input.currency.toUpperCase(),
    amount: input.amount ?? null,
    client_name: input.client_name || null,
    purpose: input.purpose || null,
  });

  if (error) {
    console.error("createPaymentRequest failed:", error.message);
    return { error: "Could not submit your request." };
  }

  // Drop a summary into the support thread so the conversation has context.
  if (conv?.id) {
    const amount = input.amount ? `${input.currency.toUpperCase()} ${input.amount}` : input.currency.toUpperCase();
    await supabase.from("messages").insert({
      conversation_id: conv.id,
      sender_id: profile.id,
      sender_role: profile.role,
      body:
        `📩 Requested payment details — Amount: ${amount}` +
        (input.client_name ? `, Client: ${input.client_name}` : "") +
        (input.purpose ? `\nPurpose: ${input.purpose}` : ""),
    });
  }

  // Best-effort email alert to every admin.
  try {
    const admin = createAdminClient();
    const { data: admins } = await admin
      .from("profiles")
      .select("email")
      .eq("role", "admin");
    await Promise.all(
      (admins ?? [])
        .map((a) => a.email)
        .filter((e): e is string => !!e)
        .map((email) =>
          sendNewRequestAlert({
            to: email,
            freelancer: profile.full_name || profile.email || "A freelancer",
            currency: input.currency.toUpperCase(),
            amount: input.amount ?? null,
          }),
        ),
    );
  } catch (e) {
    console.error("admin alert failed:", e);
  }

  revalidatePath("/dashboard/requests");
  revalidatePath("/dashboard");
  return { ok: true };
}

/** A freelancer cancels their own pending request. */
export async function cancelPaymentRequest(id: string) {
  const profile = await getProfile();
  if (!profile) return { error: "Please log in again." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("payment_requests")
    .update({ status: "cancelled" })
    .eq("id", id)
    .eq("user_id", profile.id);

  if (error) return { error: "Could not cancel." };
  revalidatePath("/dashboard/requests");
  return {};
}

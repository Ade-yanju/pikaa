"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { registerSchema, otpSchema, emailSchema } from "@/lib/validation";
import { sendOtpEmail } from "@/lib/resend";
import { WHATSAPP_CHANNEL_URL } from "@/lib/constants";

const WELCOME_MESSAGE = `👋 Welcome to Pickar! I'm here to help you get paid, fast.

What would you like to do today?
• 💳 Request company payment details
• 🎁 Sell a gift card
• ₿ Trade cryptocurrency

Just reply here and our team will take it from there.

📢 Join our WhatsApp channel for live rates & updates:
${WHATSAPP_CHANNEL_URL}`;

/**
 * Drop an automated welcome into a new user's support conversation. Best-effort:
 * failures never block registration. Sent as an admin so it reads as support.
 */
async function postWelcomeMessage(userId: string) {
  try {
    const admin = createAdminClient();
    const { data: conv } = await admin
      .from("conversations")
      .select("id")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (!conv?.id) return;

    // Preferred: a neutral system message that reads as "Pickar Support".
    const { error } = await admin.from("messages").insert({
      conversation_id: conv.id,
      sender_id: null,
      sender_role: "system",
      body: WELCOME_MESSAGE,
    });
    if (!error) return;

    // Fallback (before migration 006): send from the first admin instead.
    const { data: firstAdmin } = await admin
      .from("profiles")
      .select("id")
      .eq("role", "admin")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (firstAdmin?.id) {
      await admin.from("messages").insert({
        conversation_id: conv.id,
        sender_id: firstAdmin.id,
        sender_role: "admin",
        body: WELCOME_MESSAGE,
      });
    }
  } catch (e) {
    console.error("postWelcomeMessage failed:", e);
  }
}

export type AuthState = {
  error?: string;
  sent?: boolean;
  email?: string;
};

async function profileExists(email: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  return !!data;
}

async function generateAndEmailOtp(email: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (error || !data?.properties?.email_otp) {
    console.error("generateLink failed:", error?.message);
    return "We couldn't send a code right now. Please try again.";
  }
  const { error: mailError } = await sendOtpEmail(
    email,
    data.properties.email_otp,
  );
  if (mailError) {
    console.error("Resend failed:", mailError);
    return "We couldn't email your code. Please try again shortly.";
  }
  return null;
}

/** Register: create the account (if new) and email a verification code. */
export async function requestRegister(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    country: formData.get("country"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  }
  const { full_name, email, country, phone } = parsed.data;

  // One account per email — send existing users to log in instead.
  if (await profileExists(email)) {
    return {
      error: "An account with this email already exists. Please log in instead.",
    };
  }

  const admin = createAdminClient();
  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name, country, phone: phone || null },
  });
  if (error) {
    console.error("createUser failed:", error.message);
    return { error: "Could not create your account. Please try again." };
  }

  // Greet the new user in their support chat (best-effort).
  if (created?.user?.id) await postWelcomeMessage(created.user.id);

  const err = await generateAndEmailOtp(email);
  if (err) return { error: err, email };
  return { sent: true, email };
}

/** Login: email a code to an existing account. */
export async function requestLogin(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { error: "Enter a valid email." };
  const email = parsed.data;

  if (!(await profileExists(email))) {
    return { error: "No account found for that email. Please register first." };
  }

  const err = await generateAndEmailOtp(email);
  if (err) return { error: err, email };
  return { sent: true, email };
}

/** Resend a code to the same address (used by the "Resend" link). */
export async function resendOtp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { error: "Enter a valid email." };
  const err = await generateAndEmailOtp(parsed.data);
  if (err) return { error: err, email: parsed.data };
  return { sent: true, email: parsed.data };
}

/** Verify the 6-digit code and establish the session. */
export async function verifyOtp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = otpSchema.safeParse({
    email: formData.get("email"),
    token: formData.get("token"),
  });
  if (!parsed.success) {
    return {
      sent: true,
      email: (formData.get("email") as string) ?? "",
      error: parsed.error.issues[0]?.message ?? "Invalid code.",
    };
  }

  const supabase = await createClient();
  // NOTE: if your Supabase settings reject `email`, switch to `magiclink`.
  const { error } = await supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.token,
    type: "email",
  });

  if (error) {
    return {
      sent: true,
      email: parsed.data.email,
      error: "That code is incorrect or expired. Request a new one.",
    };
  }

  const next = (formData.get("next") as string) || "/dashboard";
  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

import "server-only";

import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL || "Pickar <onboarding@resend.dev>";

// Construct lazily so a missing key doesn't crash at import/build time — only
// when an email is actually sent.
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

const NO_KEY = { data: null, error: { message: "RESEND_API_KEY is not set" } };

function shell(inner: string) {
  return `
  <div style="background:#050505;padding:40px 0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
    <div style="max-width:480px;margin:0 auto;background:#0b0f0e;border:1px solid rgba(255,255,255,.06);border-radius:16px;overflow:hidden">
      <div style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,.06)">
        <span style="color:#fff;font-size:22px;font-weight:800;letter-spacing:-.02em">Pickar.</span>
      </div>
      <div style="padding:32px;color:#cbd5e1;font-size:15px;line-height:1.6">${inner}</div>
      <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,.06);color:#64748b;font-size:12px">
        You're receiving this because someone used this email at Pickar. If that
        wasn't you, you can safely ignore it.
      </div>
    </div>
  </div>`;
}

/** Send the 6-digit login/registration code. */
export async function sendOtpEmail(to: string, code: string) {
  const inner = `
    <p style="margin:0 0 8px;color:#fff;font-size:18px;font-weight:600">Your verification code</p>
    <p style="margin:0 0 24px">Enter this code to continue. It expires in a few minutes.</p>
    <div style="text-align:center;margin:8px 0 24px">
      <span style="display:inline-block;background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.3);border-radius:12px;padding:16px 28px;color:#34d399;font-size:34px;font-weight:800;letter-spacing:10px">${code}</span>
    </div>
    <p style="margin:0;color:#64748b;font-size:13px">Never share this code with anyone — Pickar staff will never ask for it.</p>`;

  const resend = getResend();
  if (!resend) return NO_KEY;
  return resend.emails.send({
    from: FROM,
    to,
    subject: `${code} is your Pickar code`,
    html: shell(inner),
  });
}

/** Notify support that a freelancer filed a new payment-details request. */
export async function sendNewRequestAlert(opts: {
  to: string;
  freelancer: string;
  currency: string;
  amount: number | null;
}) {
  const amount = opts.amount ? `${opts.currency} ${opts.amount}` : opts.currency;
  const inner = `
    <p style="margin:0 0 8px;color:#fff;font-size:18px;font-weight:600">New payment-details request</p>
    <p style="margin:0 0 4px"><strong style="color:#fff">${opts.freelancer}</strong> requested payment details.</p>
    <p style="margin:0 0 24px;color:#94a3b8">Amount: ${amount}</p>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL || ""}/admin/requests" style="display:inline-block;background:#10b981;color:#000;font-weight:700;text-decoration:none;padding:12px 20px;border-radius:10px">Open the inbox</a>`;

  const resend = getResend();
  if (!resend) return NO_KEY;
  return resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `New payment request from ${opts.freelancer}`,
    html: shell(inner),
  });
}

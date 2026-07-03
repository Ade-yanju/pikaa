# Pickar — Accounts, Chat & Payment Requests: Setup

This adds freelancer **registration (email OTP)**, a **live support chat**, and
**payment-details requests** on top of the existing landing page. Backend =
Supabase (Postgres + Auth + Realtime). OTP emails are delivered via **Resend**.

Do these four things once, then `npm run dev`.

## 1. Create a Supabase project
1. Go to https://supabase.com → New project (free tier is fine).
2. Open **SQL Editor → New query**, paste the entire contents of
   [`supabase/schema.sql`](supabase/schema.sql), and **Run**. This creates the
   tables, security policies, triggers, and realtime.
3. Open **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` / `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret)

## 2. Create a Resend key
1. Go to https://resend.com → **API Keys** → create one → `RESEND_API_KEY`.
2. **Sending domain:** to email real users, verify your domain under
   **Domains** and set `RESEND_FROM_EMAIL` to e.g. `Pickar <noreply@yourdomain>`.
   For quick local testing you can leave the default `onboarding@resend.dev`,
   which only delivers to the email you signed up to Resend with.

## 3. Fill in `.env.local`
Paste the five values above into [`.env.local`](.env.local).

### Optional: image attachments in chat
Chat photos upload to **Cloudinary** (primary) with **ImgBB** as fallback. Text
chat, read receipts and notifications work without these — only photo
attachments need them.
- **Cloudinary**: dashboard.cloudinary.com → note your **Cloud name** →
  Settings → Upload → *Add upload preset* → set **Signing Mode: Unsigned** →
  save its name. Put both in `CLOUDINARY_CLOUD_NAME` and
  `CLOUDINARY_UPLOAD_PRESET`.
- **ImgBB**: https://api.imgbb.com/ → *Get API key* → `IMGBB_API_KEY`.

Run `npm run check-setup` to confirm what's wired.

## 4. Make yourself an admin
1. Run the app, go to `/register`, sign up with your email, verify the OTP.
2. Back in Supabase **SQL Editor**, run:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```
3. Reload `/admin` — you now have the support inbox.

---

### How auth works
`/register` and `/login` call a server action that (a) creates the Supabase user
if new, (b) asks Supabase to generate a one-time code, and (c) emails that code
through Resend. The user enters the code; we verify it with Supabase, which sets
the session cookies. No passwords are stored.

> If OTP verification ever returns "Token has expired or is invalid" despite a
> correct code, switch the `verifyOtp` type from `'email'` to `'magiclink'` in
> [`src/app/(auth)/actions.ts`](src/app/(auth)/actions.ts) — this depends on your
> Supabase Auth settings. (Alternatively, configure Supabase custom SMTP to
> Resend and the built-in flow will work unchanged.)

### Roles
- **user** (default): dashboard, chat, payment requests.
- **admin**: `/admin` inbox — read every conversation, reply live, fulfil
  requests, and manage the company receiving accounts shared with freelancers.

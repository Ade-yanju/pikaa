-- A user's own withdrawal / payout accounts (encrypted, visible to admins).
-- Idempotent.
create table if not exists public.withdrawal_details (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles (id) on delete cascade,
  method              text not null,          -- bank | paypal | wise | cashapp | crypto | other
  label               text,
  account_name        text,
  bank_name           text,
  account_number_enc  text,                   -- AES-256-GCM
  routing_enc         text,                   -- AES-256-GCM (routing / IBAN / SWIFT / tag / wallet)
  currency            text,
  extra               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists withdrawal_details_user_idx
  on public.withdrawal_details (user_id, created_at desc);

drop trigger if exists withdrawal_details_touch on public.withdrawal_details;
create trigger withdrawal_details_touch
  before update on public.withdrawal_details
  for each row execute function public.touch_updated_at();

alter table public.withdrawal_details enable row level security;

drop policy if exists withdrawal_select on public.withdrawal_details;
create policy withdrawal_select on public.withdrawal_details
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists withdrawal_insert on public.withdrawal_details;
create policy withdrawal_insert on public.withdrawal_details
  for insert with check (user_id = auth.uid());

drop policy if exists withdrawal_update on public.withdrawal_details;
create policy withdrawal_update on public.withdrawal_details
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists withdrawal_delete on public.withdrawal_details;
create policy withdrawal_delete on public.withdrawal_details
  for delete using (user_id = auth.uid());

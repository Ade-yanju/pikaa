-- =============================================================================
-- Pickar — Registration + Support Chat + Payment Details Requests
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.
-- =============================================================================

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------

-- One profile row per auth user. Mirrors auth.users and holds our app fields.
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  country     text,
  phone       text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz not null default now()
);

-- A support thread. Each user gets one auto-created on signup; more are allowed.
create table if not exists public.conversations (
  id               uuid primary key default gen_random_uuid(),
  -- references profiles (not auth.users) so PostgREST can embed the freelancer;
  -- profiles.id mirrors auth.users.id and is created first by handle_new_user().
  user_id          uuid not null references public.profiles (id) on delete cascade,
  subject          text not null default 'Support',
  status           text not null default 'open' check (status in ('open', 'closed')),
  last_message_at  timestamptz not null default now(),
  created_at       timestamptz not null default now()
);
create index if not exists conversations_user_id_idx on public.conversations (user_id);
create index if not exists conversations_last_message_idx on public.conversations (last_message_at desc);

-- Individual chat messages within a conversation.
create table if not exists public.messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references public.conversations (id) on delete cascade,
  sender_id        uuid references public.profiles (id) on delete cascade,
  sender_role      text not null check (sender_role in ('user', 'admin', 'system')),
  body             text,
  image_url        text,
  read_at          timestamptz,
  reply_to         uuid references public.messages (id) on delete set null,
  created_at       timestamptz not null default now(),
  -- a message carries text, an image, or both
  constraint messages_content_check check (
    (body is not null and char_length(body) between 1 and 4000)
    or image_url is not null
  )
);
create index if not exists messages_conversation_idx on public.messages (conversation_id, created_at);
create index if not exists messages_unread_idx on public.messages (conversation_id, read_at);
alter table public.messages replica identity full;

-- Company receiving accounts that support shares with freelancers. Admin-only.
create table if not exists public.company_accounts (
  id              uuid primary key default gen_random_uuid(),
  label           text not null,
  currency        text not null,
  region          text,
  bank_name       text,
  account_name    text,
  account_number  text,
  routing_number  text,           -- routing / sort code / IBAN / SWIFT, etc.
  extra           jsonb not null default '{}'::jsonb,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- A freelancer's request for company payment details to receive a payout.
create table if not exists public.payment_requests (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles (id) on delete cascade,
  conversation_id  uuid references public.conversations (id) on delete set null,
  amount           numeric(14, 2),
  currency         text not null,
  client_name      text,          -- the freelancer's payer/client
  purpose          text,
  status           text not null default 'pending'
                     check (status in ('pending', 'in_review', 'details_shared', 'completed', 'cancelled')),
  account_id       uuid references public.company_accounts (id) on delete set null,
  admin_note       text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists payment_requests_user_idx on public.payment_requests (user_id, created_at desc);

-- ----------------------------------------------------------------------------
-- Helpers
-- ----------------------------------------------------------------------------

-- SECURITY DEFINER so it reads profiles.role without tripping RLS recursion.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Owns a conversation? (used by message policies)
create or replace function public.owns_conversation(conv uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.conversations
    where id = conv and user_id = auth.uid()
  );
$$;

-- ----------------------------------------------------------------------------
-- Triggers
-- ----------------------------------------------------------------------------

-- Create a profile + default support conversation when an auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, country, phone)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'country',
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;

  insert into public.conversations (user_id, subject)
  values (new.id, 'Support');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep role changes admin-only (users may edit their own profile otherwise).
create or replace function public.enforce_role_immutable()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Only guard against a logged-in end-user changing their own role. Service
  -- role / SQL / admin scripts have no auth.uid() and are allowed through.
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_role_guard on public.profiles;
create trigger profiles_role_guard
  before update on public.profiles
  for each row execute function public.enforce_role_immutable();

-- Bump conversation.last_message_at whenever a message lands.
create or replace function public.bump_conversation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations
    set last_message_at = new.created_at
    where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists messages_bump_conversation on public.messages;
create trigger messages_bump_conversation
  after insert on public.messages
  for each row execute function public.bump_conversation();

-- Touch payment_requests.updated_at on any update.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists payment_requests_touch on public.payment_requests;
create trigger payment_requests_touch
  before update on public.payment_requests
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------

alter table public.profiles          enable row level security;
alter table public.conversations     enable row level security;
alter table public.messages          enable row level security;
alter table public.company_accounts  enable row level security;
alter table public.payment_requests  enable row level security;

-- profiles ------------------------------------------------------------------
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- conversations -------------------------------------------------------------
drop policy if exists conversations_select on public.conversations;
create policy conversations_select on public.conversations
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists conversations_insert on public.conversations;
create policy conversations_insert on public.conversations
  for insert with check (user_id = auth.uid() or public.is_admin());

drop policy if exists conversations_update on public.conversations;
create policy conversations_update on public.conversations
  for update using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- messages ------------------------------------------------------------------
drop policy if exists messages_select on public.messages;
create policy messages_select on public.messages
  for select using (public.is_admin() or public.owns_conversation(conversation_id));

drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages
  for insert with check (
    sender_id = auth.uid()
    and (public.is_admin() or public.owns_conversation(conversation_id))
  );

-- company_accounts (admin-only; users receive details via chat) --------------
drop policy if exists company_accounts_admin on public.company_accounts;
create policy company_accounts_admin on public.company_accounts
  for all using (public.is_admin()) with check (public.is_admin());

-- payment_requests ----------------------------------------------------------
drop policy if exists payment_requests_select on public.payment_requests;
create policy payment_requests_select on public.payment_requests
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists payment_requests_insert on public.payment_requests;
create policy payment_requests_insert on public.payment_requests
  for insert with check (user_id = auth.uid());

drop policy if exists payment_requests_update on public.payment_requests;
create policy payment_requests_update on public.payment_requests
  for update using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- ----------------------------------------------------------------------------
-- Trades: gift cards + crypto (see migrations/004_trades.sql)
-- ----------------------------------------------------------------------------
create table if not exists public.trades (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles (id) on delete cascade,
  conversation_id  uuid references public.conversations (id) on delete set null,
  type             text not null check (type in ('gift_card', 'crypto')),
  side             text,
  asset            text not null,
  network          text,
  amount           numeric(18, 2),
  currency         text,
  rate             numeric(18, 4),
  payout_amount    numeric(18, 2),
  secret_encrypted text,
  image_url        text,
  status           text not null default 'pending'
                     check (status in ('pending','in_review','accepted','completed','rejected','cancelled')),
  admin_note       text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists trades_user_idx on public.trades (user_id, created_at desc);

drop trigger if exists trades_touch on public.trades;
create trigger trades_touch
  before update on public.trades
  for each row execute function public.touch_updated_at();

alter table public.trades enable row level security;
drop policy if exists trades_select on public.trades;
create policy trades_select on public.trades
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists trades_insert on public.trades;
create policy trades_insert on public.trades
  for insert with check (user_id = auth.uid());
drop policy if exists trades_update on public.trades;
create policy trades_update on public.trades
  for update using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- ----------------------------------------------------------------------------
-- Withdrawal / payout details (see migrations/007_withdrawal_details.sql)
-- ----------------------------------------------------------------------------
create table if not exists public.withdrawal_details (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles (id) on delete cascade,
  method              text not null,
  label               text,
  account_name        text,
  bank_name           text,
  account_number_enc  text,
  routing_enc         text,
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

-- ----------------------------------------------------------------------------
-- Web Push subscriptions (see migrations/003_push_subscriptions.sql)
-- ----------------------------------------------------------------------------
create table if not exists public.push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  endpoint    text not null unique,
  p256dh      text not null,
  auth        text not null,
  user_agent  text,
  created_at  timestamptz not null default now()
);
create index if not exists push_subscriptions_user_idx
  on public.push_subscriptions (user_id);
alter table public.push_subscriptions enable row level security;
drop policy if exists push_sub_select on public.push_subscriptions;
create policy push_sub_select on public.push_subscriptions
  for select using (user_id = auth.uid() or public.is_admin());

-- ----------------------------------------------------------------------------
-- Realtime (live chat + inbox updates)
-- ----------------------------------------------------------------------------
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.payment_requests;
alter publication supabase_realtime add table public.trades;

-- ----------------------------------------------------------------------------
-- After your first login, promote yourself to admin:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
-- ----------------------------------------------------------------------------

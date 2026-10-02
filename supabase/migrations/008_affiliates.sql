-- Pickar affiliates: referral attribution and an idempotent reward ledger.
-- Run after migrations 001-007. Safe to re-run.

alter table public.profiles
  add column if not exists affiliate_code text,
  add column if not exists referred_by uuid references public.profiles (id) on delete set null;

create unique index if not exists profiles_affiliate_code_unique
  on public.profiles (affiliate_code)
  where affiliate_code is not null;

-- Give existing accounts a stable code before the dashboard starts displaying it.
update public.profiles
set affiliate_code = 'PKR-' || upper(substr(replace(id::text, '-', ''), 1, 8))
where affiliate_code is null;

create index if not exists profiles_referred_by_idx
  on public.profiles (referred_by);

create table if not exists public.affiliate_rewards (
  id                 uuid primary key default gen_random_uuid(),
  referrer_id        uuid not null references public.profiles (id) on delete cascade,
  referred_user_id   uuid not null references public.profiles (id) on delete cascade,
  trade_id           uuid references public.trades (id) on delete set null,
  reward_type        text not null check (reward_type in ('signup', 'trade')),
  amount             numeric(18, 2) not null check (amount >= 0),
  currency           text not null default 'NGN',
  description        text not null,
  created_at         timestamptz not null default now()
);

create index if not exists affiliate_rewards_referrer_idx
  on public.affiliate_rewards (referrer_id, created_at desc);

create unique index if not exists affiliate_signup_reward_unique
  on public.affiliate_rewards (referrer_id, referred_user_id)
  where reward_type = 'signup';

create unique index if not exists affiliate_trade_reward_unique
  on public.affiliate_rewards (referrer_id, trade_id)
  where reward_type = 'trade' and trade_id is not null;

alter table public.affiliate_rewards enable row level security;

drop policy if exists affiliate_rewards_select on public.affiliate_rewards;
create policy affiliate_rewards_select on public.affiliate_rewards
  for select using (referrer_id = auth.uid() or public.is_admin());

-- Keep referral codes and the referral relationship server-controlled.
create or replace function public.enforce_affiliate_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.affiliate_code := old.affiliate_code;
    new.referred_by := old.referred_by;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_affiliate_guard on public.profiles;
create trigger profiles_affiliate_guard
  before update on public.profiles
  for each row execute function public.enforce_affiliate_fields();

-- Capture the referral code submitted during registration and issue the signup reward.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  referrer uuid;
  code text;
begin
  select id into referrer
  from public.profiles
  where upper(affiliate_code) = upper(nullif(new.raw_user_meta_data ->> 'referral_code', ''))
    and id <> new.id
  limit 1;

  code := 'PKR-' || upper(substr(replace(new.id::text, '-', ''), 1, 8));

  insert into public.profiles (id, email, full_name, country, phone, affiliate_code, referred_by)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'country',
    new.raw_user_meta_data ->> 'phone',
    code,
    referrer
  )
  on conflict (id) do nothing;

  insert into public.conversations (user_id, subject)
  values (new.id, 'Support');

  if referrer is not null then
    insert into public.affiliate_rewards (
      referrer_id, referred_user_id, reward_type, amount, currency, description
    ) values (
      referrer, new.id, 'signup', 1000, 'NGN', 'Referral signup reward'
    ) on conflict do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Default trade commission: 1% of the completed trade payout (or amount when
-- payout_amount has not yet been set). Change 0.01 here when the business rate changes.
create or replace function public.award_affiliate_trade_reward()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  referrer uuid;
  trade_value numeric;
  reward numeric;
begin
  if new.status <> 'completed'
     or (tg_op = 'UPDATE' and old.status = 'completed') then
    return new;
  end if;

  select referred_by into referrer
  from public.profiles
  where id = new.user_id;

  trade_value := coalesce(new.payout_amount, new.amount, 0);
  reward := round(trade_value * 0.01, 2);

  if referrer is not null and reward > 0 then
    insert into public.affiliate_rewards (
      referrer_id, referred_user_id, trade_id, reward_type, amount, currency, description
    ) values (
      referrer,
      new.user_id,
      new.id,
      'trade',
      reward,
      coalesce(nullif(new.currency, ''), 'NGN'),
      'Completed referred trade commission'
    ) on conflict do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists trades_affiliate_reward on public.trades;
create trigger trades_affiliate_reward
  after insert or update of status on public.trades
  for each row execute function public.award_affiliate_trade_reward();

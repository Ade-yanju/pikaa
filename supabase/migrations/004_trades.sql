-- Gift-card and cryptocurrency trades. Idempotent; safe to re-run.
create table if not exists public.trades (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles (id) on delete cascade,
  conversation_id  uuid references public.conversations (id) on delete set null,
  type             text not null check (type in ('gift_card', 'crypto')),
  side             text,                 -- 'buy' | 'sell'
  asset            text not null,        -- gift-card brand or crypto symbol
  network          text,                 -- card type (e-code/physical) or chain
  amount           numeric(18, 2),
  currency         text,
  rate             numeric(18, 4),       -- admin-set rate
  payout_amount    numeric(18, 2),       -- admin-set payout
  secret_encrypted text,                 -- AES-256-GCM (card code / wallet addr)
  image_url        text,
  status           text not null default 'pending'
                     check (status in ('pending','in_review','accepted','completed','rejected','cancelled')),
  admin_note       text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists trades_user_idx on public.trades (user_id, created_at desc);
create index if not exists trades_type_idx on public.trades (type, status);

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

do $$
begin
  alter publication supabase_realtime add table public.trades;
exception when duplicate_object then null;
end $$;

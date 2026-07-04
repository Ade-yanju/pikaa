-- Swipe-to-reply: link a message to the one it replies to. Idempotent.
alter table public.messages
  add column if not exists reply_to uuid references public.messages (id) on delete set null;

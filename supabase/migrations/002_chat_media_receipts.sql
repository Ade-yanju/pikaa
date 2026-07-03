-- Chat images + read receipts. Idempotent; safe to re-run.

-- Image attachment + read timestamp on messages.
alter table public.messages add column if not exists image_url text;
alter table public.messages add column if not exists read_at timestamptz;

-- A message may now be image-only, so body is optional...
alter table public.messages alter column body drop not null;

-- ...but a message must carry either text or an image.
alter table public.messages drop constraint if exists messages_body_check;
alter table public.messages drop constraint if exists messages_content_check;
alter table public.messages add constraint messages_content_check
  check (
    (body is not null and char_length(body) between 1 and 4000)
    or image_url is not null
  );

-- Fast unread lookups.
create index if not exists messages_unread_idx
  on public.messages (conversation_id, read_at);

-- Emit full rows on UPDATE so read-receipt changes stream over realtime.
alter table public.messages replica identity full;

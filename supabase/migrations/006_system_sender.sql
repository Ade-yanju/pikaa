-- Allow neutral "system" messages (automated welcome from Pickar Support).
-- Idempotent.
alter table public.messages alter column sender_id drop not null;

alter table public.messages drop constraint if exists messages_sender_role_check;
alter table public.messages add constraint messages_sender_role_check
  check (sender_role in ('user', 'admin', 'system'));

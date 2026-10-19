-- "Dejame una foto": mensajes y fotos que deja la gente en el portfolio.
-- Ya está aplicado en el proyecto "mi portfolio" de Supabase (migración visitor_notes_with_photos).
-- Lo dejo acá como registro. No guarda IP ni nada que identifique a quien escribe,
-- salvo lo que ponga a mano (nombre/mail opcionales).

create table if not exists public.visitor_notes (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  message     text,
  name        text check (name is null or char_length(name) <= 80),
  email       text check (email is null or char_length(email) <= 120),
  lang        text not null default 'es' check (lang in ('es', 'en')),
  photo_path  text,
  read        boolean not null default false,
  constraint visitor_notes_message_len check (message is null or char_length(message) between 3 and 2000),
  constraint visitor_notes_has_content check (message is not null or photo_path is not null),
  constraint visitor_notes_photo_path check (photo_path is null or photo_path ~ '^[0-9]{4}-[0-9]{2}/[0-9a-f-]{36}\.(jpg|png|webp)$')
);

create index if not exists visitor_notes_created_at_idx on public.visitor_notes (created_at desc);

-- Con RLS y una sola regla: la clave pública (rol anon) solo puede AGREGAR filas.
-- Leer, cambiar o borrar: solo vos, desde el panel de Supabase.
alter table public.visitor_notes enable row level security;

create policy "visitors can leave a note" on public.visitor_notes
  for insert to anon
  with check (read = false);

-- Fotos: bucket PRIVADO, 5 MB, solo imágenes.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('visitor-notes', 'visitor-notes', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- La clave pública solo puede SUBIR una foto nueva, con el nombre que arma el sitio (año-mes/uuid.jpg).
create policy "visitors can upload a photo" on storage.objects
  for insert to anon
  with check (
    bucket_id = 'visitor-notes'
    and name ~ '^[0-9]{4}-[0-9]{2}/[0-9a-f-]{36}\.(jpg|png|webp)$'
  );

-- Aviso por mail: cada fila nueva llama a la Edge Function notify-note (supabase/functions/notify-note),
-- que te manda un mail con la foto adjunta usando Resend. La clave de Resend está en el Vault
-- (vault.create_secret(..., 'resend_api_key')), nunca en el código.
alter table public.visitor_notes add column if not exists notified_at timestamptz;
create extension if not exists pg_net with schema extensions;
create schema if not exists private;
-- private.visitor_notes_notify(): hace net.http_post a /functions/v1/notify-note con { id }.
-- create or replace trigger visitor_notes_email after insert on public.visitor_notes
--   for each row execute function private.visitor_notes_notify();

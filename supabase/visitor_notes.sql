-- "Dejame algo": mensajes y fotos estilo BeReal que deja la gente en el portfolio.
-- Correlo una vez en Supabase → SQL Editor (se puede volver a correr sin romper nada).
-- No guarda IP ni nada que identifique a quien escribe, salvo lo que ponga a mano (nombre/mail opcionales).

create table if not exists public.visitor_notes (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  message     text,
  name        text check (name is null or char_length(name) <= 80),
  email       text check (email is null or char_length(email) <= 120),
  lang        text not null default 'es' check (lang in ('es', 'en')),
  photo_path  text,
  read        boolean not null default false
);

-- Si ya tenías la tabla de antes (solo texto), esto la actualiza:
alter table public.visitor_notes add column if not exists photo_path text;
alter table public.visitor_notes alter column message drop not null;
alter table public.visitor_notes drop constraint if exists visitor_notes_message_check;
alter table public.visitor_notes drop constraint if exists visitor_notes_message_len;
alter table public.visitor_notes drop constraint if exists visitor_notes_has_content;
alter table public.visitor_notes add constraint visitor_notes_message_len check (message is null or char_length(message) between 3 and 2000);
alter table public.visitor_notes add constraint visitor_notes_has_content check (message is not null or photo_path is not null);

-- Privado: RLS activado y SIN políticas → nadie puede leer ni escribir con la clave pública.
-- El sitio escribe desde el servidor con la service role key (que nunca llega al navegador).
alter table public.visitor_notes enable row level security;

create index if not exists visitor_notes_created_at_idx on public.visitor_notes (created_at desc);

-- Las fotos: bucket PRIVADO (public = false). Solo vos las ves desde el panel de Supabase → Storage.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('visitor-notes', 'visitor-notes', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false;

-- "Dejame algo": mensajes que deja la gente en el portfolio.
-- Correlo una vez en Supabase → SQL Editor.
-- No guarda IP ni nada que identifique a quien escribe, salvo lo que ponga a mano (nombre/mail opcionales).

create table if not exists public.visitor_notes (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  message     text not null check (char_length(message) between 3 and 2000),
  name        text check (name is null or char_length(name) <= 80),
  email       text check (email is null or char_length(email) <= 120),
  lang        text not null default 'es' check (lang in ('es', 'en')),
  read        boolean not null default false
);

-- Privado: RLS activado y SIN políticas → nadie puede leer ni escribir con la clave pública.
-- El sitio escribe desde el servidor con la service role key (que nunca llega al navegador).
alter table public.visitor_notes enable row level security;

create index if not exists visitor_notes_created_at_idx on public.visitor_notes (created_at desc);

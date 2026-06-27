-- ============================================================================
-- Contenido unificado (proyectos + journal/blog) + storage + seguridad (RLS)
-- Pegá esto en el SQL Editor de Supabase y ejecutá.
-- Cada fila es una "carpeta": kind = 'project' o 'post' (historia del journal).
-- ============================================================================

create table if not exists public.entries (
  id              uuid primary key default gen_random_uuid(),
  kind            text not null default 'post' check (kind in ('project', 'post')),
  slug            text unique not null,
  date            timestamptz not null default now(),
  published       boolean not null default false,
  title_es        text not null,
  title_en        text,
  summary_es      text,            -- bajada corta (se ve en la carpeta)
  summary_en      text,
  body_es         text,            -- cuerpo completo
  body_en         text,
  transcript      text,
  audio_url       text,            -- posts: audio para escuchar
  cover_url       text,            -- foto principal
  gallery         text[] default '{}',  -- fotos extra que "asoman" de la carpeta
  tags            text[] default '{}',
  -- solo proyectos:
  link            text,
  github          text,
  tech            text[] default '{}',
  folder_color    text,            -- color de la carpeta (opcional)
  created_at      timestamptz not null default now()
);

create index if not exists entries_kind_date_idx
  on public.entries (kind, published, date desc);

-- Row Level Security ---------------------------------------------------------
alter table public.entries enable row level security;

drop policy if exists "public read published" on public.entries;
create policy "public read published"
  on public.entries for select using (published = true);

drop policy if exists "auth read all" on public.entries;
create policy "auth read all"
  on public.entries for select to authenticated using (true);

drop policy if exists "auth insert" on public.entries;
create policy "auth insert"
  on public.entries for insert to authenticated with check (true);

drop policy if exists "auth update" on public.entries;
create policy "auth update"
  on public.entries for update to authenticated using (true) with check (true);

drop policy if exists "auth delete" on public.entries;
create policy "auth delete"
  on public.entries for delete to authenticated using (true);

-- Storage: buckets públicos para audio y fotos --------------------------------
insert into storage.buckets (id, name, public)
  values ('journal-audio', 'journal-audio', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public)
  values ('journal-covers', 'journal-covers', true) on conflict (id) do nothing;

drop policy if exists "public read journal files" on storage.objects;
create policy "public read journal files"
  on storage.objects for select
  using (bucket_id in ('journal-audio', 'journal-covers'));

drop policy if exists "auth write journal files" on storage.objects;
create policy "auth write journal files"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('journal-audio', 'journal-covers'));

drop policy if exists "auth delete journal files" on storage.objects;
create policy "auth delete journal files"
  on storage.objects for delete to authenticated
  using (bucket_id in ('journal-audio', 'journal-covers'));

-- Después de crear las tablas, corré seed.sql para cargar tus proyectos.

-- ============================================================================
-- Brigitte portfolio — tabla `entries` (proyectos + journal) + storage + RLS
-- Pegá TODO esto en: Supabase → SQL Editor → New query → Run.
-- ============================================================================

create table if not exists public.entries (
  id              uuid primary key default gen_random_uuid(),
  kind            text not null default 'post' check (kind in ('project', 'post')),
  slug            text unique not null,
  date            timestamptz not null default now(),
  published       boolean not null default false,
  title_es        text not null,
  title_en        text,
  summary_es      text,
  summary_en      text,
  body_es         text,
  body_en         text,
  transcript      text,
  audio_url       text,
  cover_url       text,
  gallery         text[] default '{}',
  tags            text[] default '{}',
  link            text,
  github          text,
  tech            text[] default '{}',
  folder_color    text,
  created_at      timestamptz not null default now()
);

create index if not exists entries_kind_date_idx
  on public.entries (kind, published, date desc);

-- Row Level Security: lectura pública de publicados; escritura solo logueada.
alter table public.entries enable row level security;

drop policy if exists "public read published" on public.entries;
create policy "public read published"
  on public.entries for select using (published = true);

drop policy if exists "auth read all" on public.entries;
create policy "auth read all"
  on public.entries for select to authenticated using (true);

drop policy if exists "auth write" on public.entries;
create policy "auth write"
  on public.entries for all to authenticated using (true) with check (true);

-- Storage para audios y portadas del journal (subir desde el panel de Supabase).
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
  on storage.objects for all to authenticated
  using (bucket_id in ('journal-audio', 'journal-covers'))
  with check (bucket_id in ('journal-audio', 'journal-covers'));

-- Después corré seed.sql para cargar tus proyectos.

import { supabase, STORAGE } from './supabase';
import { projects as localProjects } from '../data/projects';
import { posts as localPosts } from '../data/journal';

// Folder colors cycled when an entry has no folder_color set — muted autumnal.
export const FOLDER_COLORS = [
  '#caa46a', // golden sand
  '#b08968', // camel
  '#8f9c7c', // sage olive
  '#c08a63', // terracotta
  '#a98a8a', // dusty mauve
  '#9c9a6e', // olive ochre
];

export function folderColor(entry, index = 0) {
  return entry?.folder_color || FOLDER_COLORS[index % FOLDER_COLORS.length];
}

// --- helpers ----------------------------------------------------------------
export function slugify(text) {
  return (text || '')
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || `entry-${Date.now()}`;
}

export function localized(entry, base, lang) {
  if (!entry) return '';
  return entry[`${base}_${lang}`] || entry[`${base}_es`] || entry[`${base}_en`] || '';
}

export function formatDate(value, lang) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return value;
  }
}

// Local fallback so the Projects folder isn't empty before Supabase is set up.
function localProjectFallback() {
  return localProjects.es.map((p, i) => {
    const en = localProjects.en[i] || {};
    return {
      id: `local-${i}`,
      kind: 'project',
      icon: p.icon,
      slug: slugify(p.title),
      title_es: p.title,
      title_en: en.title || p.title,
      summary_es: p.description,
      summary_en: en.description || p.description,
      cover_url: p.cover || null,
      tech: p.tech || [],
      link: p.link && p.link !== 'null' ? p.link : null,
      github: p.github && p.github !== 'null' ? p.github : null,
      tags: p.status ? [p.status] : [],
      date: null,
      _local: true,
    };
  });
}

// --- public reads -----------------------------------------------------------
export async function listProjects() {
  if (!supabase) return localProjectFallback();
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('kind', 'project')
    .eq('published', true)
    .order('date', { ascending: false });
  if (error) throw error;
  return data && data.length ? data : localProjectFallback();
}

export async function listPosts() {
  if (!supabase) return localPosts;
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('kind', 'post')
    .eq('published', true)
    .order('date', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getBySlug(slug) {
  if (!supabase) {
    return (
      localPosts.find((p) => p.slug === slug) ||
      localProjectFallback().find((p) => p.slug === slug) ||
      null
    );
  }
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// --- admin ------------------------------------------------------------------
export async function listAll() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function uploadFile(bucket, file) {
  if (!file) return null;
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function createEntry({ fields, audioFile, coverFile }) {
  if (!supabase) throw new Error('Supabase no está configurado.');
  const [audio_url, cover_url] = await Promise.all([
    audioFile ? uploadFile(STORAGE.audio, audioFile) : Promise.resolve(null),
    coverFile ? uploadFile(STORAGE.covers, coverFile) : Promise.resolve(null),
  ]);
  const payload = {
    ...fields,
    slug: fields.slug || slugify(fields.title_es || fields.title_en),
    ...(audio_url ? { audio_url } : {}),
    ...(cover_url ? { cover_url } : {}),
  };
  const { data, error } = await supabase.from('entries').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function setPublished(id, published) {
  if (!supabase) throw new Error('Supabase no está configurado.');
  const { error } = await supabase.from('entries').update({ published }).eq('id', id);
  if (error) throw error;
}

export async function deleteEntry(id) {
  if (!supabase) throw new Error('Supabase no está configurado.');
  const { error } = await supabase.from('entries').delete().eq('id', id);
  if (error) throw error;
}

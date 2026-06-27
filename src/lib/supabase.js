import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Admin email allowed to log in to /admin (optional gate, also enforced by RLS).
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || '';

// `supabase` is null until the env vars are set, so the UI can show a friendly
// "configurá Supabase" message instead of crashing.
export const supabase =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseReady = Boolean(supabase);

export const STORAGE = {
  audio: 'journal-audio',
  covers: 'journal-covers',
};

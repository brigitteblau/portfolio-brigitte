import { supabase } from './supabase';

export async function getProjects() {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('published', true)
    .eq('kind', 'project')
    .order('date', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

export async function getPosts() {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('published', true)
    .eq('kind', 'post')
    .order('date', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}
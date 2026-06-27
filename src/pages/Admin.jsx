import React, { useEffect, useState } from 'react';
import { Trash2, Eye, EyeOff, LogOut } from 'lucide-react';
import { supabase, isSupabaseReady, ADMIN_EMAIL } from '../lib/supabase';
import { listAll, setPublished, deleteEntry, localized, formatDate } from '../lib/content';
import { useLanguage } from '../context/LanguageContext';
import JournalForm from '../components/journal/JournalForm';

export default function Admin() {
  const { lang } = useLanguage();
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState(ADMIN_EMAIL || '');
  const [sent, setSent] = useState(false);
  const [authError, setAuthError] = useState('');
  const [entries, setEntries] = useState([]);

  // Track auth session.
  useEffect(() => {
    if (!isSupabaseReady) {
      setReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const refresh = () => {
    if (!isSupabaseReady) return;
    listAll().then(setEntries).catch(() => setEntries([]));
  };

  useEffect(() => {
    if (session) refresh();
  }, [session]);

  const sendLink = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (ADMIN_EMAIL && email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setAuthError('Ese email no está habilitado para administrar.');
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    if (error) setAuthError(error.message);
    else setSent(true);
  };

  const togglePublish = async (entry) => {
    await setPublished(entry.id, !entry.published);
    refresh();
  };

  const remove = async (entry) => {
    if (!window.confirm('¿Borrar esta historia?')) return;
    await deleteEntry(entry.id);
    refresh();
  };

  if (!ready) {
    return <div className="px-4 pt-32 pb-16 max-w-3xl mx-auto text-[color:var(--muted)]">Cargando...</div>;
  }

  if (!isSupabaseReady) {
    return (
      <div className="px-4 pt-32 pb-16 max-w-3xl mx-auto">
        <div className="panel p-6 text-[color:var(--muted)]">
          <p className="font-semibold text-[color:var(--ink)]">Supabase no está configurado.</p>
          <p className="mt-1 text-sm">
            Completá <code>.env.local</code> con <code>VITE_SUPABASE_URL</code> y{' '}
            <code>VITE_SUPABASE_ANON_KEY</code>, y corré <code>supabase/schema.sql</code>.
          </p>
        </div>
      </div>
    );
  }

  // --- Login ---
  if (!session) {
    return (
      <div className="px-4 pt-32 pb-16 max-w-md mx-auto">
        <h1 className="font-display text-4xl tracking-tight">Admin</h1>
        <p className="mt-2 text-[color:var(--muted)]">Entrá con tu email para subir historias.</p>
        {sent ? (
          <div className="panel p-6 mt-6">
            <p className="font-semibold">Te mandé un link mágico ✨</p>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Revisá tu casilla ({email}) y hacé click para entrar.
            </p>
          </div>
        ) : (
          <form onSubmit={sendLink} className="panel p-6 mt-6 grid gap-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--cream)]/70 px-4 py-3 outline-none focus:border-[color:var(--wine)]"
            />
            {authError && <p className="text-[color:var(--wine)] text-sm font-semibold">{authError}</p>}
            <button type="submit" className="btn btn-primary justify-center">Enviar link mágico</button>
          </form>
        )}
      </div>
    );
  }

  // --- Authenticated dashboard ---
  return (
    <div className="px-4 sm:px-6 pt-28 sm:pt-32 pb-16 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl tracking-tight">Admin · Journal</h1>
          <p className="text-sm text-[color:var(--muted)]">{session.user?.email}</p>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="btn btn-ghost text-sm">
          <LogOut className="w-4 h-4" /> Salir
        </button>
      </div>

      <div className="mt-8">
        <JournalForm onCreated={refresh} />
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl tracking-tight mb-4">Historias ({entries.length})</h2>
        <div className="grid gap-3">
          {entries.map((entry) => (
            <div key={entry.id} className="panel p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold truncate">{localized(entry, 'title', lang)}</p>
                <p className="text-xs text-[color:var(--muted)]">
                  {formatDate(entry.date, lang)} · {entry.published ? 'publicada' : 'borrador'}
                  {entry.audio_url ? ' · 🎧' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => togglePublish(entry)}
                  className="btn btn-ghost px-3 py-2 text-xs"
                  title={entry.published ? 'Despublicar' : 'Publicar'}
                >
                  {entry.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => remove(entry)}
                  className="btn btn-ghost px-3 py-2 text-xs text-[color:var(--wine)]"
                  title="Borrar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {entries.length === 0 && (
            <p className="text-[color:var(--muted)]">Todavía no cargaste historias.</p>
          )}
        </div>
      </div>
    </div>
  );
}

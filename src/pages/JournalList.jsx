import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { isSupabaseReady } from '../lib/supabase';
import { listPosts } from '../lib/content';
import JournalCard from '../components/journal/JournalCard';

export default function JournalList() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ok | error | unconfigured

  useEffect(() => {
    if (!isSupabaseReady) {
      setStatus('unconfigured');
      return;
    }
    let cancelled = false;
    listPosts()
      .then((data) => {
        if (cancelled) return;
        setEntries(data);
        setStatus('ok');
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="px-4 sm:px-6 pt-28 sm:pt-32 pb-16 max-w-screen-xl mx-auto">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="font-handwriting text-[color:var(--muted)] text-2xl sm:text-3xl -rotate-1 font-bold">
            {t.journalKicker}
          </p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl md:text-6xl tracking-tight">
            {t.journalTitle}
          </h1>
          <p className="mt-3 max-w-xl text-[color:var(--muted)] text-base sm:text-lg leading-relaxed">
            {t.journalLead}
          </p>
        </div>
        <Link to="/admin" className="btn btn-ghost text-sm" aria-label="Admin">
          <Settings className="w-4 h-4" /> Admin
        </Link>
      </div>

      <div className="mt-10">
        {status === 'loading' && (
          <p className="text-[color:var(--muted)]">{t.journalLoading}</p>
        )}
        {status === 'error' && (
          <p className="text-[color:var(--wine)] font-semibold">{t.journalError}</p>
        )}
        {status === 'unconfigured' && (
          <div className="panel p-6 text-[color:var(--muted)]">
            <p className="font-semibold text-[color:var(--ink)]">Supabase no está configurado.</p>
            <p className="mt-1 text-sm">
              Creá un proyecto en supabase.com, corré <code>supabase/schema.sql</code> y completá{' '}
              <code>.env.local</code> con tus credenciales.
            </p>
          </div>
        )}
        {status === 'ok' && entries.length === 0 && (
          <p className="text-[color:var(--muted)]">{t.journalEmpty}</p>
        )}
        {status === 'ok' && entries.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry) => (
              <JournalCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

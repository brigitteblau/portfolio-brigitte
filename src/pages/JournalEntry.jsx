import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { isSupabaseReady } from '../lib/supabase';
import { getBySlug, localized, formatDate } from '../lib/content';
import AudioPlayer from '../components/journal/AudioPlayer';

export default function JournalEntry() {
  const { slug } = useParams();
  const { t, lang } = useLanguage();
  const [entry, setEntry] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ok | notfound | error

  useEffect(() => {
    if (!isSupabaseReady) {
      setStatus('notfound');
      return;
    }
    let cancelled = false;
    setStatus('loading');
    getBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        if (!data || !data.published) {
          setStatus('notfound');
          return;
        }
        setEntry(data);
        setStatus('ok');
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const title = localized(entry, 'title', lang);
  const text = localized(entry, 'text', lang);

  return (
    <article className="px-4 sm:px-6 pt-28 sm:pt-32 pb-16 max-w-3xl mx-auto">
      <Link to="/journal" className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--muted)] hover:text-[color:var(--ink)]">
        <ArrowLeft className="w-4 h-4" /> {t.journalBack}
      </Link>

      {status === 'loading' && <p className="mt-8 text-[color:var(--muted)]">{t.journalLoading}</p>}
      {status === 'error' && <p className="mt-8 text-[color:var(--wine)] font-semibold">{t.journalError}</p>}
      {status === 'notfound' && <p className="mt-8 text-[color:var(--muted)]">{t.journalNotFound}</p>}

      {status === 'ok' && entry && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
            {formatDate(entry.date, lang)}
          </p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl tracking-tight leading-tight">{title}</h1>

          {Array.isArray(entry.tags) && entry.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span key={tag} className="chip text-xs">#{tag}</span>
              ))}
            </div>
          )}

          {entry.cover_url && (
            <img
              src={entry.cover_url}
              alt={title}
              className="mt-6 w-full rounded-[var(--radius)] border border-[color:var(--line)] object-cover"
            />
          )}

          {entry.audio_url && (
            <div className="mt-6">
              <AudioPlayer src={entry.audio_url} />
            </div>
          )}

          {text && (
            <div className="mt-8 text-lg leading-relaxed text-[color:var(--ink)] whitespace-pre-line">
              {text}
            </div>
          )}

          {entry.transcript && (
            <details className="mt-8 rounded-[var(--radius)] border border-[color:var(--line)] bg-[color:var(--cream)]/50 p-5">
              <summary className="cursor-pointer font-semibold">{t.journalTranscript}</summary>
              <p className="mt-3 text-[color:var(--muted)] leading-relaxed whitespace-pre-line">
                {entry.transcript}
              </p>
            </details>
          )}
        </div>
      )}
    </article>
  );
}

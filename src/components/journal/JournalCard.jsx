import React from 'react';
import { Link } from 'react-router-dom';
import { Headphones, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { localized, formatDate } from '../../lib/content';

export default function JournalCard({ entry }) {
  const { t, lang } = useLanguage();
  const title = localized(entry, 'title', lang);
  const text = localized(entry, 'text', lang);

  return (
    <Link
      to={`/journal/${entry.slug}`}
      className="panel group overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-200"
    >
      {entry.cover_url && (
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={entry.cover_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
          <span>{formatDate(entry.date, lang)}</span>
          {entry.audio_url && (
            <span className="inline-flex items-center gap-1 text-[color:var(--wine)]">
              <Headphones className="w-3.5 h-3.5" /> audio
            </span>
          )}
        </div>
        <h3 className="font-display text-2xl leading-tight tracking-tight">{title}</h3>
        {text && (
          <p className="text-sm text-[color:var(--muted)] leading-relaxed line-clamp-3">{text}</p>
        )}
        <div className="mt-auto pt-3 flex flex-wrap items-center gap-2">
          {Array.isArray(entry.tags) &&
            entry.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="chip text-xs">
                #{tag}
              </span>
            ))}
          <span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--ink)]">
            {entry.audio_url ? t.journalListen : t.journalRead}
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

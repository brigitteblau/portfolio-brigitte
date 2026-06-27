import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="px-4 sm:px-6 pb-10 pt-4 relative z-10">
      <div className="max-w-screen-xl mx-auto border-t border-[color:var(--line)] pt-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="font-imposing text-5xl sm:text-7xl leading-none text-[color:var(--ink)]">
              Brigitte Blau
            </p>
            <p className="mt-3 font-mono-label text-[11px] text-[color:var(--muted)]">
              {t.journalKicker} · © {year}
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-[color:var(--muted)]">
            <a href="/#estudios" className="hover:text-[color:var(--ink)]">{t.studies}</a>
            <a href="/#archivo" className="hover:text-[color:var(--ink)]">{t.work}</a>
            <a href="/#archivo" className="hover:text-[color:var(--ink)]">{t.journal}</a>
            <a href="/#chat" className="hover:text-[color:var(--ink)]">{t.chat}</a>
            <Link to="/admin" className="opacity-50 hover:opacity-100 hover:text-[color:var(--ink)]">·</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

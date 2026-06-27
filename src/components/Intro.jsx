import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Intro() {
  const { t } = useLanguage();
  return (
    <section className="px-5 sm:px-8 py-20 sm:py-28 max-w-5xl mx-auto">
      <p className="editorial-label">{t.ideaLabel}</p>
      <h2 className="editorial-statement mt-5 max-w-3xl">{t.ideaStatement}</h2>
      <p className="mt-7 max-w-2xl text-[color:var(--muted)] text-lg leading-relaxed">
        {t.ideaText}
      </p>
    </section>
  );
}

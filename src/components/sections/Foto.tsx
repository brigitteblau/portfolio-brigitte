"use client";

import type { Locale } from "@/lib/i18n";
import { extra as X } from "@/content/site";
import FilmCamera from "../FilmCamera";

/** "Dejame una foto": un espejo que ocupa toda la pantalla. */
export default function Foto({ lang }: { lang: Locale }) {
  return (
    <section id="dejame" className="relative scroll-mt-14 px-3 py-6 sm:px-6" aria-label={X.photoTitle[lang]}>
      <div className="mx-auto max-w-[1500px]">
        <FilmCamera lang={lang} />
      </div>
    </section>
  );
}

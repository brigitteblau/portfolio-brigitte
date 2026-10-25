"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { nav } from "@/content/onda";

/** Barra de arriba, como en la referencia: secciones a la izquierda, escribime a la derecha. */
export default function OndaNav({ lang }: { lang: Locale }) {
  const pathname = usePathname() ?? "";
  const other: Locale = lang === "es" ? "en" : "es";
  const switchHref = pathname.replace(/^\/(es|en)(?=\/|$)/, `/${other}`);
  const base = `/${lang}/onda`;
  return (
    <header className="sticky top-0 z-50 border-b border-[#2A1F24]/10 bg-[#FBF8F1]/90 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-[1300px] items-center justify-between gap-3 px-4 text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[#2A1F24] sm:px-6">
        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none]" aria-label={lang === "es" ? "Secciones" : "Sections"}>
          {nav.map((n, i) => (
            <a
              key={n.id}
              href={`${base}#${n.id}`}
              className={`shrink-0 rounded-[4px] px-2 py-1 hover:bg-[#F6E3A1] ${i === 0 ? "bg-[#F6E3A1]" : ""}`}
            >
              {i === 0 ? "● " : ""}
              {n.label[lang]}
            </a>
          ))}
          <Link href={`/${lang}/journal`} className="shrink-0 rounded-[4px] px-2 py-1 hover:bg-[#F6E3A1]">
            journal
          </Link>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden items-center gap-1.5 md:flex" aria-hidden>
            <span className="h-3 w-3 rounded-full bg-[#E8A9BC]" />
            <span className="h-3 w-3 rounded-full bg-[#F6E3A1]" />
            <span className="h-3 w-3 rounded-full bg-[#CFE3F2]" />
          </span>
          <Link href={switchHref} hrefLang={other} className="rounded-[4px] px-1.5 py-1 hover:bg-[#F6E3A1]">
            {other}
          </Link>
          <a href={`${base}#contacto`} className="hidden rounded-[6px] border-[1.5px] border-[#2A1F24] bg-white px-2.5 py-1 sm:inline-block">
            ♡ {lang === "es" ? "escribime" : "write me"}
          </a>
          <Link href={`/${lang}`} className="rounded-[6px] px-1.5 py-1 normal-case tracking-normal text-[#2A1F24]/60 hover:text-[#2A1F24]">
            {lang === "es" ? "versión sobria" : "simple version"}
          </Link>
        </div>
      </div>
    </header>
  );
}

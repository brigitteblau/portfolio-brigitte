import Link from "next/link";
import type { Locale } from "@/lib/i18n";

/** Piezas compartidas de la versión sobria (portada y journal). */

export const ink = "#1d1d1f";
export const linkCls =
  "text-[#9C4F68] underline decoration-[#E8A9BC] decoration-[1.5px] underline-offset-[5px] transition-colors hover:decoration-[#9C4F68]";

export const prose =
  "[&_p]:mt-5 [&_h2]:mt-12 [&_h2]:mb-1 [&_h2]:font-medium [&_h3]:mt-8 [&_h3]:font-medium [&_strong]:font-medium [&_em]:italic " +
  "[&_a]:text-[#9C4F68] [&_a]:underline [&_a]:decoration-[#E8A9BC] [&_a]:decoration-[1.5px] [&_a]:underline-offset-[5px] hover:[&_a]:decoration-[#9C4F68] " +
  "[&_blockquote]:mt-5 [&_blockquote]:border-l-2 [&_blockquote]:border-[#E8A9BC] [&_blockquote]:pl-4 [&_blockquote]:text-[#55555a] " +
  "[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1.5 [&_img]:mt-6 [&_img]:rounded-[14px] " +
  "[&_hr]:my-10 [&_hr]:border-[#ececec]";

export function OndaButton({ lang }: { lang: Locale }) {
  return (
    <Link
      href={`/${lang}/onda`}
      className="group inline-flex items-center gap-1.5 rounded-full border border-[#E8A9BC] px-3.5 py-1.5 text-[0.85rem] text-[#B5677E] transition-colors hover:bg-[#FDF2F5]"
    >
      {lang === "es" ? "Ver mi versión con onda" : "See the fun version"}
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}

/** Fondo blanco, columna angosta, arriba: volver / idioma y el botón con onda. */
export function Shell({ lang, other, back, children }: { lang: Locale; other: string; back?: { href: string; label: string }; children: React.ReactNode }) {
  const otherLang: Locale = lang === "es" ? "en" : "es";
  return (
    <div className="min-h-screen bg-white text-[15.5px] leading-[1.65] text-[#1d1d1f] antialiased">
      <style>{"body{background:#fff}"}</style>
      <header className="mx-auto flex max-w-[38rem] items-center justify-between gap-4 px-6 pt-7 text-[0.85rem] text-[#86868b]">
        <nav className="flex items-center gap-3" aria-label={lang === "es" ? "Navegación" : "Navigation"}>
          {back && (
            <Link href={back.href} className="hover:text-[#1d1d1f]">
              ← {back.label}
            </Link>
          )}
          {back && <span aria-hidden>·</span>}
          <span>
            <span className="text-[#1d1d1f]">{lang.toUpperCase()}</span>
            <span aria-hidden> · </span>
            <Link href={other} hrefLang={otherLang} className="hover:text-[#1d1d1f]">
              {otherLang.toUpperCase()}
            </Link>
          </span>
        </nav>
        <OndaButton lang={lang} />
      </header>
      {children}
    </div>
  );
}

export function fmtDate(date: string, lang: Locale, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) {
  return date ? new Intl.DateTimeFormat(lang === "es" ? "es-AR" : "en-US", { ...opts, timeZone: "UTC" }).format(new Date(date)) : "";
}

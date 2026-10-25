import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { sobrio as S } from "@/content/sobrio";

/**
 * La portada: sobria, todo texto, mucho aire (inspirada en emilkowal.ski).
 * Lo divertido vive en /onda, detrás del botón.
 */

const link = "underline decoration-[#E8A9BC] decoration-1 underline-offset-[5px] transition-colors hover:decoration-[#B5677E] hover:text-[#B5677E]";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="mb-4 text-[#86868b]">{title}</h2>
      {children}
    </section>
  );
}

function OndaButton({ lang }: { lang: Locale }) {
  return (
    <Link
      href={`/${lang}/onda`}
      className="group inline-flex items-center gap-1.5 rounded-full border border-[#E8A9BC] px-3.5 py-1.5 text-[0.85rem] text-[#B5677E] transition-colors hover:bg-[#FDF2F5]"
    >
      {S.onda[lang]}
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const lang = (await params).lang as Locale;
  const other: Locale = lang === "es" ? "en" : "es";

  return (
    <div className="min-h-screen bg-white text-[15.5px] leading-[1.65] text-[#1d1d1f] antialiased">
      {/* Fondo blanco liso también en los bordes (la versión con onda usa otro fondo). */}
      <style>{"body{background:#fff}"}</style>

      <header className="mx-auto flex max-w-[38rem] items-center justify-between px-6 pt-7">
        <nav className="text-[0.85rem] text-[#86868b]" aria-label={lang === "es" ? "Idioma" : "Language"}>
          <span className="text-[#1d1d1f]">{lang.toUpperCase()}</span>
          <span aria-hidden> · </span>
          <Link href={`/${other}`} hrefLang={other} className="hover:text-[#1d1d1f]">
            {other.toUpperCase()}
          </Link>
        </nav>
        <OndaButton lang={lang} />
      </header>

      <main className="mx-auto max-w-[38rem] px-6 pb-20 pt-20 sm:pt-28">
        <h1 className="font-medium">{S.name}</h1>
        <p className="text-[#86868b]">{S.role[lang]}</p>

        <Section title={S.todayTitle[lang]}>
          {S.today.map((p, i) => (
            <p key={i} className={i ? "mt-4" : undefined}>
              {p[lang].map((part, j) =>
                typeof part === "string" ? (
                  part
                ) : (
                  <a key={j} href={part[1]} target="_blank" rel="noreferrer" className={link}>
                    {part[0]}
                  </a>
                ),
              )}
            </p>
          ))}
        </Section>

        <Section title={S.projectsTitle[lang]}>
          <ul className="space-y-6">
            {S.projects.map((p) => (
              <li key={p.name}>
                <p className="font-medium">
                  {p.href ? (
                    <a href={p.href} target="_blank" rel="noreferrer" className={link}>
                      {p.name}
                    </a>
                  ) : (
                    p.name
                  )}
                </p>
                <p className="text-[#55555a]">
                  {p.desc[lang]}
                  {p.note && <span className="text-[#a1a1a6]"> {p.note[lang]}</span>}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={S.writingTitle[lang]}>
          <p className="text-[#55555a]">{S.writingEmpty[lang]}</p>
        </Section>

        <Section title={S.studiesTitle[lang]}>
          <ul className="space-y-3">
            {S.studies.map((s) => (
              <li key={s.where} className="flex items-baseline justify-between gap-6">
                <span>
                  {s.what[lang]}
                  <span className="block text-[#86868b] sm:inline">
                    <span className="hidden sm:inline"> · </span>
                    {s.where}
                  </span>
                </span>
                <span className="shrink-0 tabular-nums text-[#86868b]">{s.when}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={S.moreTitle[lang]}>
          <p>
            {S.links.map((l, i) => (
              <span key={l.label}>
                {i > 0 && <span className="text-[#c7c7cc]"> · </span>}
                <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer me" className={link}>
                  {l.label}
                </a>
              </span>
            ))}
          </p>
        </Section>

        <div className="mt-20 border-t border-[#ececec] pt-8">
          <OndaButton lang={lang} />
        </div>
      </main>
    </div>
  );
}

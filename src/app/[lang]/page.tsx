import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { sobrio as S, previews } from "@/content/sobrio";
import { listEscritos } from "@/lib/escritos";

/**
 * La portada: sobria, todo texto, mucho aire (inspirada en emilkowal.ski).
 * Lo divertido vive en /onda, detrás del botón.
 */

const link = "text-[#9C4F68] underline decoration-[#E8A9BC] decoration-[1.5px] underline-offset-[5px] transition-colors hover:decoration-[#9C4F68]";

/** Un link con vista previa: en compu, al pasar el mouse aparece una tarjetita con la página. */
function A({ href, children, lang }: { href: string; children: React.ReactNode; lang: Locale }) {
  const p = previews[href];
  const external = href.startsWith("http");
  return (
    <span className="group/pv relative inline-block">
      <a href={href} target={external ? "_blank" : undefined} rel="noreferrer me" className={link}>
        {children}
      </a>
      {p && (
        <span
          aria-hidden
          className="pointer-events-none invisible absolute bottom-full left-1/2 z-20 mb-3 w-[17rem] -translate-x-1/2 translate-y-1 overflow-hidden rounded-[14px] border border-[#ececec] bg-white opacity-0 shadow-[0_18px_40px_-18px_rgba(0,0,0,.35)] transition-all duration-200 [@media(hover:hover)]:group-hover/pv:visible [@media(hover:hover)]:group-hover/pv:translate-y-0 [@media(hover:hover)]:group-hover/pv:opacity-100"
        >
          <span className={`block aspect-[1.91/1] w-full ${p.fit === "contain" ? "bg-[#f5f5f7] p-8" : "bg-[#f5f5f7]"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.img} alt="" loading="lazy" className={`h-full w-full ${p.fit === "contain" ? "object-contain" : "object-cover"}`} />
          </span>
          <span className="block px-3.5 py-3 text-[0.82rem] leading-snug">
            <span className="block font-medium text-[#1d1d1f]">{p.title}</span>
            <span className="block text-[#6e6e73]">{p.desc[lang]}</span>
            <span className="mt-1 block text-[#a1a1a6]">{new URL(href).hostname.replace(/^www\./, "")}</span>
          </span>
        </span>
      )}
    </span>
  );
}

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
  const escritos = listEscritos(lang);

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

      <main className="mx-auto max-w-[38rem] px-6 pb-20 pt-14 sm:pt-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={S.photo} alt={S.name} width={800} height={1000} className="mb-7 aspect-[4/5] w-44 rounded-[20px] object-cover sm:w-52" />
        <h1 className="font-medium">{S.name}</h1>
        <p className="text-[#86868b]">{S.role[lang]}</p>

        <Section title={S.todayTitle[lang]}>
          {S.today.map((p, i) => (
            <p key={i} className={i ? "mt-4" : undefined}>
              {p[lang].map((part, j) =>
                typeof part === "string" ? (
                  part
                ) : (
                  <A key={j} href={part[1]} lang={lang}>
                    {part[0]}
                  </A>
                ),
              )}
            </p>
          ))}
          {/* En el celu no hay "pasar el mouse": las vistas previas van abajo, deslizables */}
          <div className="-mx-6 mt-6 flex snap-x gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:hidden">
            {Object.entries(previews)
              .map(([href, p]) => (
                <a key={href} href={href} target="_blank" rel="noreferrer" className="w-[13.5rem] shrink-0 snap-start overflow-hidden rounded-[14px] border border-[#ececec] bg-white">
                  <span className={`block aspect-[1.91/1] w-full bg-[#f5f5f7] ${p.fit === "contain" ? "p-6" : ""}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt="" loading="lazy" className={`h-full w-full ${p.fit === "contain" ? "object-contain" : "object-cover"}`} />
                  </span>
                  <span className="block px-3 py-2.5 text-[0.8rem] leading-snug">
                    <span className="block font-medium">{p.title}</span>
                    <span className="block text-[#6e6e73]">{p.desc[lang]}</span>
                  </span>
                </a>
              ))}
          </div>
        </Section>

        <Section title={S.projectsTitle[lang]}>
          <ul className="space-y-6">
            {S.projects.map((p) => (
              <li key={p.name}>
                <p className="font-medium">
                  {p.href ? (
                    <A href={p.href} lang={lang}>
                      {p.name}
                    </A>
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
          {escritos.length === 0 ? (
            <p className="text-[#55555a]">{S.writingEmpty[lang]}</p>
          ) : (
            <ul className="space-y-5">
              {escritos.map((e) => (
                <li key={e.slug}>
                  <Link href={`/${lang}/escritos/${e.slug}`} className="group block">
                    <span className="flex items-baseline justify-between gap-6">
                      <span className="font-medium text-[#9C4F68] underline decoration-[#E8A9BC] decoration-[1.5px] underline-offset-[5px] group-hover:decoration-[#9C4F68]">{e.title}</span>
                      <time dateTime={e.date} className="shrink-0 tabular-nums text-[#86868b]">
                        {e.date ? new Intl.DateTimeFormat(lang === "es" ? "es-AR" : "en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(e.date)) : ""}
                      </time>
                    </span>
                    {e.excerpt && <span className="mt-1 block text-[#55555a]">{e.excerpt}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
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
                <A href={l.href} lang={lang}>
                  {l.label}
                </A>
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

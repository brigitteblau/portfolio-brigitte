import Link from "next/link";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { listEntries } from "@/lib/journal";
import { Shell, fmtDate } from "@/components/Sobrio";

export async function generateMetadata({ params }: PageProps<"/[lang]/journal">): Promise<Metadata> {
  const { lang } = await params;
  const es = lang === "es";
  const title = es ? "Journal de Brigitte Blau" : "Brigitte Blau's journal";
  const description = es
    ? "Lo que escribe Brigitte Blau: ensayos y textos sobre preguntas, decisiones, emprender y lo que va pensando."
    : "Writing by Brigitte Blau: essays on questions, decisions, building things and what she's thinking about.";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/${lang}/journal`, languages: { es: "/es/journal", en: "/en/journal", "x-default": "/es/journal" } },
    openGraph: { title, description, url: `/${lang}/journal`, type: "website" },
  };
}

export default async function JournalIndex({ params }: PageProps<"/[lang]/journal">) {
  const lang = (await params).lang as Locale;
  const es = lang === "es";
  const entries = listEntries(lang);

  return (
    <Shell lang={lang} other={`/${es ? "en" : "es"}/journal`} back={{ href: `/${lang}`, label: "Brigitte Blau" }}>
      <main className="mx-auto max-w-[38rem] px-6 pb-24 pt-16 sm:pt-20">
        <h1 className="font-medium">Journal</h1>
        <p className="text-[#86868b]">{es ? "Lo que escribo y lo que voy pensando." : "What I write and what I'm thinking about."}</p>
        {entries.length === 0 ? (
          <p className="mt-12 text-[#55555a]">{es ? "Pronto." : "Soon."}</p>
        ) : (
          <ul className="mt-12 space-y-7">
            {entries.map((e) => (
              <li key={e.slug}>
                <Link href={`/${lang}/journal/${e.slug}`} className="group block">
                  <span className="flex items-baseline justify-between gap-6">
                    <span className="font-medium text-[#9C4F68] underline decoration-[#E8A9BC] decoration-[1.5px] underline-offset-[5px] group-hover:decoration-[#9C4F68]">{e.title}</span>
                    <time dateTime={e.date} className="shrink-0 tabular-nums text-[#86868b]">
                      {fmtDate(e.date, lang, { month: "short", year: "numeric" })}
                    </time>
                  </span>
                  {e.excerpt && <span className="mt-1 block text-[#55555a]">{e.excerpt}</span>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </Shell>
  );
}

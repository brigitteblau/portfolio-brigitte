import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import clsx from "clsx";
import { locales, type Locale } from "@/lib/i18n";
import { projects, projectsCopy as P } from "@/content/onda";
import { siteUrl } from "@/lib/site-url";
import { Pix, Tag } from "@/components/onda/Kit";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => projects.map((p) => ({ lang, id: p.id })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/proyectos/[id]">): Promise<Metadata> {
  const { lang, id } = await params;
  const p = projects.find((x) => x.id === id);
  if (!p) return {};
  const l = lang as Locale;
  return {
    title: p.name,
    description: p.short[l],
    alternates: { canonical: `/${lang}/proyectos/${id}`, languages: { es: `/es/proyectos/${id}`, en: `/en/proyectos/${id}` } },
    openGraph: { title: `${p.name} · Brigitte Blau`, description: p.short[l], images: p.photo ? [{ url: p.photo }] : undefined },
  };
}

const band = { ink: "bg-[#4A2C2A] text-white", butter: "bg-[#E9D6C4]", sky: "bg-[#F2C9D3]", blush: "bg-[#F7DCE4]" };

/** La página de cada proyecto, como "Wayline" en la referencia: título pixelado, fichas y la historia. */
export default async function ProjectPage({ params }: PageProps<"/[lang]/proyectos/[id]">) {
  const { lang: l, id } = await params;
  const lang = l as Locale;
  const p = projects.find((x) => x.id === id);
  if (!p) notFound();
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];
  const facts = [
    { k: P.role[lang], v: p.role[lang], c: "blush" as const },
    p.team && { k: P.team[lang], v: p.team[lang], c: "sky" as const },
    p.status && { k: P.status[lang], v: p.status[lang], c: "butter" as const },
  ].filter(Boolean) as { k: string; v: string; c: "blush" | "sky" | "butter" }[];

  const ld = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.name,
    description: p.short[lang],
    url: `${siteUrl()}/${lang}/proyectos/${id}`,
    creator: { "@type": "Person", "@id": `${siteUrl()}/#brigitte`, name: "Brigitte Blau" },
  };

  return (
    <main id="main" className="px-5 pb-20 pt-12 sm:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="mx-auto max-w-[1100px]">
        <Link href={`/${lang}/onda#proyectos`} className="text-[0.8rem] font-bold uppercase tracking-[0.06em] text-[#4A2C2A]/60 hover:text-[#4A2C2A]">
          {P.back[lang]}
        </Link>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[#9C4F68]">● {p.kicker[lang]}</p>
            <Pix as="h1" className="mt-3 text-[clamp(2.8rem,8vw,5.5rem)]">
              {p.name}
            </Pix>
            <p className="mt-5 max-w-[40ch] text-[1.15rem] leading-snug text-[#4A2C2A]/75">{p.short[lang]}</p>
            {p.stack && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <li key={s} className="rounded-[4px] border-[1.5px] border-[#4A2C2A] bg-white px-2 py-0.5 text-[0.75rem] font-bold uppercase tracking-[0.04em]">
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <ul className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {facts.map((f, j) => (
              <li key={f.k}>
                <Tag c={f.c} className={clsx("block whitespace-normal !p-4 text-left", ["-rotate-1", "rotate-1", "-rotate-[0.5deg]"][j])}>
                  <span className="block text-[0.7rem] uppercase tracking-[0.08em] opacity-60">{f.k}</span>
                  <span className="mt-1 block text-[1rem]">{f.v}</span>
                </Tag>
              </li>
            ))}
            {p.stat && (
              <li>
                <Tag c="mint" className="block !p-4 text-left rotate-1">
                  <span className="block font-[Shrikhand] text-[2.6rem] leading-none">{p.stat.n}</span>
                  <span className="text-[0.85rem]">{p.stat.label[lang]}</span>
                </Tag>
              </li>
            )}
          </ul>
        </div>

        {p.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.photo} alt={p.name} className="mt-12 max-h-[70svh] w-full rounded-[8px] object-cover shadow-[0_24px_50px_-28px_rgba(0,0,0,.5)]" />
        ) : (
          <div className={clsx("mt-12 grid h-[220px] place-items-center rounded-[8px]", band[p.color])}>
            <Pix as="p" className={clsx("text-[clamp(2rem,6vw,4rem)]", p.color === "ink" && "!text-white")}>
              {p.name}
            </Pix>
          </div>
        )}

        <div className="mx-auto mt-14 max-w-[42rem] space-y-5 text-[1.1rem] leading-relaxed">
          {p.body.map((b, j) => (
            <p key={j}>{b[lang]}</p>
          ))}
          {p.links && (
            <div className="pt-4">
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[#4A2C2A]/60">{P.links[lang]}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {p.links.map((x) => (
                  <li key={x.href}>
                    <a href={x.href} target="_blank" rel="noreferrer" className="inline-block rounded-[6px] border-[1.5px] border-[#4A2C2A] bg-white px-3 py-1.5 text-[0.9rem] font-bold hover:bg-[#F7DCE4]">
                      {x.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-[#4A2C2A]/20 pt-8">
          <Link href={`/${lang}/onda#proyectos`} className="text-[0.85rem] font-bold uppercase tracking-[0.06em] text-[#4A2C2A]/60 hover:text-[#4A2C2A]">
            {P.back[lang]}
          </Link>
          <Link href={`/${lang}/proyectos/${next.id}`} className="rounded-[6px] bg-[#4A2C2A] px-4 py-2.5 text-[0.85rem] font-bold uppercase tracking-[0.04em] text-white">
            {next.name} →
          </Link>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import { deck as D, projects, projectsCopy as P } from "@/content/onda";
import Video from "../Video";
import { Polaroid } from "./Kit";
import Typed from "./Typed";
import BookCover from "./BookCover";
import Fin from "./Fin";
import DejameCam from "./DejameCam";
import type { EntryMeta } from "@/lib/journal";

/** Cada diapositiva de la presentación. Todo cabe en una pantalla (en compu) y se apila en el celu. */

const inner = "mx-auto flex w-full max-w-[1240px] flex-1 flex-col justify-center px-6 pb-16 pt-24 sm:px-12 lg:pb-14";
const kicker = "font-hand text-[clamp(1.4rem,2.2vw,2rem)] opacity-70";
const big = "font-[Shrikhand] leading-[1] tracking-[-0.01em]";
const chip = "inline-block rounded-[6px] px-3 py-1.5 text-[0.85rem] font-bold shadow-[0_3px_0_rgba(0,0,0,.08)]";
const chipTone = { choco: "bg-[#4A2C2A] text-[#FBF4EE]", white: "bg-white text-[#4A2C2A]", latte: "bg-[#E9D6C4] text-[#4A2C2A]", rosa: "bg-[#F2C9D3] text-[#4A2C2A]" };

export function Hola({ lang }: { lang: Locale }) {
  const H = D.hola;
  return (
    <div className={clsx(inner, "lg:flex-row lg:items-center lg:justify-between lg:gap-10")}>
      <div className="min-w-0">
        <p className={kicker}>{H.hello[lang]}</p>
        <h1 className={clsx(big, "mt-1 text-[clamp(4.5rem,13vw,11.5rem)]")}>
          B<span className="opacity-[0.14]">rigitte</span>
        </h1>
        <p className="mt-6 max-w-[30ch] text-[clamp(1.2rem,1.8vw,1.6rem)] font-semibold leading-snug">{H.line[lang]}</p>
        <p className="mt-1 max-w-[34ch] text-[clamp(1rem,1.4vw,1.25rem)] opacity-60">{H.sub[lang]}</p>
      </div>
      <div className="relative mx-auto mt-10 w-[min(64vw,280px)] shrink-0 lg:mx-0 lg:mt-0 lg:w-[270px]">
        <Polaroid src="/fotos/portada.webp" note={lang === "es" ? "esta soy yo ♡" : "that's me ♡"} rotate={5} alt="Brigitte Blau" />
        {H.tags.map((t, i) => (
          <span key={i} className={clsx(chip, chipTone[t.c as keyof typeof chipTone], "absolute z-10", ["-left-10 bottom-16 -rotate-6", "-right-6 -bottom-4 rotate-3", "-right-8 top-6 rotate-6"][i])}>
            {t.t[lang]}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Nacer({ lang, video }: { lang: Locale; video?: string }) {
  return (
    <div className={clsx(inner, "items-center")}>
      <h2 className={clsx(big, "text-center text-[clamp(2.4rem,5vw,4.5rem)] text-[#F2C9D3]")}>{D.nacer.title[lang]}</h2>
      {video && (
        <div className="mt-8 w-full max-w-[min(100%,calc((100svh-16rem)*16/9))] overflow-hidden rounded-[12px] bg-black shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)]">
          <Video src={video} poster={video.replace(/\.\w+$/, ".jpg")} lang={lang} loop={false} soundFirst={D.nacer.play[lang]} label={D.nacer.title[lang]} className="relative aspect-video w-full" />
        </div>
      )}
    </div>
  );
}

export function Deportes({ lang, golf }: { lang: Locale; golf?: string }) {
  return (
    <div className={clsx(inner, "lg:flex-row lg:items-center lg:gap-14")}>
      <div className="lg:w-[38%]">
        <p className={kicker}>{D.deportes.kicker[lang]} ⛳</p>
        <h2 className={clsx(big, "mt-1 text-[clamp(4rem,10vw,9rem)]")}>{D.deportes.title[lang]}</h2>
      </div>
      <div className="mt-8 grid flex-1 grid-cols-2 items-center gap-6 lg:mt-0 lg:grid-cols-3">
        {golf && (
          <div className="overflow-hidden rounded-[10px] bg-black shadow-[0_20px_40px_-20px_rgba(0,0,0,.6)] lg:col-span-1">
            <Video src={golf} poster={golf.replace(/\.\w+$/, ".jpg")} lang={lang} label="Golf" className="relative aspect-[9/16] max-h-[60svh] w-full" />
          </div>
        )}
        <Polaroid src="/fotos/deportes/1.webp" rotate={4} />
        <Polaroid src="/fotos/deportes/4.webp" rotate={-4} className="hidden lg:block" />
      </div>
    </div>
  );
}

export function Perfeccion({ lang }: { lang: Locale }) {
  const X = D.perfeccion;
  return (
    <div className={clsx(inner, "relative")}>
      <Typed wrong={X.wrong[lang]} right={X.right[lang]} now={X.now[lang]} before={X.before[lang]} />
      <div className="mt-8 flex flex-wrap gap-3 lg:absolute lg:right-16 lg:top-[30%] lg:mt-0 lg:flex-col lg:items-end">
        <span className={clsx(chip, chipTone.rosa, "rotate-[5deg] text-[1.05rem]")}>{X.from[lang]}</span>
        <span className={clsx(chip, chipTone.white, "-rotate-3 text-[1.05rem]")}>{X.to[lang]}</span>
      </div>
    </div>
  );
}

export function Libros({ lang, covers }: { lang: Locale; covers: Record<string, string | undefined> }) {
  const L = D.libros;
  const rot = [-3, 2, -1, 3];
  return (
    <div className={inner}>
      <p className={kicker}>{L.kicker[lang]}</p>
      <h2 className={clsx(big, "mt-1 text-[clamp(3.2rem,7vw,6rem)]")}>{L.title[lang]}</h2>
      <ul className="mt-10 grid max-w-[1000px] grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
        {L.books.map((b, i) => {
          const title = typeof b.title === "string" ? b.title : b.title[lang];
          const src = covers[b.id] ?? (b.isbn ? `https://covers.openlibrary.org/b/isbn/${b.isbn}-L.jpg?default=false` : undefined);
          return (
            <li key={b.id} className="max-w-[220px]">
              <BookCover src={src} title={title} author={b.author} bg={b.bg} fg={b.fg} rotate={rot[i]} />
              <p className="mt-3 text-[0.95rem] font-bold leading-tight">{title}</p>
              <p className="text-[0.85rem] opacity-60">{b.author}</p>
            </li>
          );
        })}
      </ul>
      <Link href={`/${lang}/journal`} className="mt-8 w-fit font-hand text-[1.5rem] underline decoration-[#E8A9BC] decoration-2 underline-offset-4">
        {L.soon[lang]} →
      </Link>
    </div>
  );
}

export function Programar({ lang }: { lang: Locale }) {
  const X = D.programar;
  return (
    <div className={clsx(inner, "lg:flex-row lg:items-center lg:gap-16")}>
      <div className="min-w-0 flex-1">
        <p className={kicker}>{X.kicker[lang]}</p>
        <h2 className={clsx(big, "mt-1 max-w-[16ch] text-[clamp(2.6rem,5.5vw,5rem)]")}>{X.title[lang]}</h2>
        <p className="mt-6 max-w-[40ch] font-hand text-[clamp(1.45rem,2.1vw,1.9rem)] leading-[1.2]">{X.hand[lang]}</p>
        <p className="mt-5 text-[clamp(1.1rem,1.6vw,1.35rem)] font-bold">{X.result[lang]}</p>
      </div>
      <div className="relative mx-auto mt-10 w-[min(62vw,280px)] shrink-0 lg:mx-0 lg:mt-0">
        <Polaroid src="/fotos/avatar/2.webp" note={lang === "es" ? "modo laburo" : "work mode"} rotate={-4} />
        <span className="absolute -right-6 -top-6 z-10 rotate-[8deg] rounded-[8px] bg-white px-4 py-3 text-center text-[#4A2C2A] shadow-[0_6px_0_rgba(0,0,0,.08)]">
          <span className="block font-[Shrikhand] text-[2.4rem] leading-none">200</span>
          <span className="text-[0.85rem] font-bold">{lang === "es" ? "usuarios" : "users"}</span>
        </span>
      </div>
    </div>
  );
}

const cardBg = { ink: "bg-[#4A2C2A] text-[#FBF4EE]", butter: "bg-[#E9D6C4]", sky: "bg-[#F2C9D3]", blush: "bg-white" };

export function Proyectos({ lang }: { lang: Locale }) {
  return (
    <div className={inner}>
      <p className={kicker}>{D.proyectos.kicker[lang]}</p>
      <h2 className={clsx(big, "mt-1 text-[clamp(3.2rem,7vw,6rem)]")}>{P.title[lang]}</h2>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((p, i) => (
          <li key={p.id} style={{ rotate: `${[-1.5, 1, -0.5, 1.5][i]}deg` }}>
            <Link href={`/${lang}/proyectos/${p.id}`} className={clsx("group flex h-full min-h-[230px] flex-col rounded-[10px] p-6 shadow-[0_14px_30px_-20px_rgba(0,0,0,.5)] transition-transform hover:-translate-y-1.5", cardBg[p.color])}>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.08em] opacity-70">● {p.kicker[lang]}</p>
              <h3 className="mt-3 font-[Shrikhand] text-[1.8rem] leading-[1.05]">{p.name}</h3>
              <p className="mt-2 text-[0.95rem] leading-snug opacity-75">{p.short[lang]}</p>
              {p.stat && (
                <p className="mt-3 w-fit rotate-2 rounded-[6px] bg-white px-2.5 py-1 text-[0.85rem] font-bold text-[#4A2C2A]">
                  {p.stat.n} {p.stat.label[lang]}
                </p>
              )}
              <p className="mt-auto pt-5 text-[0.72rem] font-bold uppercase tracking-[0.08em]">{P.see[lang]}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Hoy({ lang }: { lang: Locale }) {
  const X = D.hoy;
  const links = projects[0].links ?? [];
  return (
    <div className={clsx(inner, "lg:flex-row lg:items-center lg:gap-16")}>
      <div className="min-w-0 flex-1">
        <h2 className={clsx(big, "text-[clamp(4rem,10vw,9rem)] text-[#F2C9D3]")}>{X.title[lang]}</h2>
        <p className="mt-6 max-w-[44ch] text-[clamp(1.1rem,1.6vw,1.35rem)] leading-relaxed opacity-90">{X.body[lang]}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noreferrer" className="inline-block rounded-[6px] border border-[#FBF4EE]/40 px-3 py-1.5 text-[0.9rem] font-semibold hover:bg-[#FBF4EE] hover:text-[#4A2C2A]">
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-hand text-[1.6rem] text-[#F2C9D3]">{X.workaholic[lang]} ✶</p>
      </div>
      <div className="mx-auto mt-10 w-[min(62vw,290px)] shrink-0 lg:mx-0 lg:mt-0">
        <Polaroid src="/fotos/ahora/1.webp" note="Mirrow ♡" rotate={4} />
      </div>
    </div>
  );
}

export function Dejame({ lang }: { lang: Locale }) {
  return <DejameCam lang={lang} title={D.dejame.title[lang]} />;
}

export function Journal({ lang, entries }: { lang: Locale; entries: EntryMeta[] }) {
  const es = lang === "es";
  const fmt = new Intl.DateTimeFormat(es ? "es-AR" : "en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  return (
    <div className={clsx(inner, "lg:flex-row lg:items-center lg:gap-16")}>
      <div className="lg:w-[40%]">
        <p className={kicker}>{es ? "lo que voy pensando" : "what I'm thinking about"}</p>
        <h2 className={clsx(big, "mt-1 text-[clamp(3.4rem,8vw,7rem)] text-[#F2C9D3]")}>Journal</h2>
        <p className="mt-4 max-w-[34ch] text-[1.1rem] leading-snug opacity-80">
          {es ? "Escribo para entender lo que pienso. Algún día, un libro." : "I write to understand what I think. Someday, a book."}
        </p>
      </div>
      <div className="mt-10 min-w-0 flex-1 lg:mt-0">
        <ul className="space-y-4">
          {entries.slice(0, 3).map((e, i) => (
            <li key={e.slug} style={{ rotate: `${[-1, 0.8, -0.5][i]}deg` }}>
              <Link href={`/${lang}/journal/${e.slug}`} className="group block rounded-[10px] bg-[#FBF4EE] p-6 text-[#4A2C2A] shadow-[0_16px_30px_-20px_rgba(0,0,0,.6)] transition-transform hover:-translate-y-1">
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.08em] opacity-60">{e.date ? fmt.format(new Date(e.date)) : ""}</p>
                <h3 className="mt-1 font-[Shrikhand] text-[1.8rem] leading-[1.05]">{e.title}</h3>
                {e.excerpt && <p className="mt-2 leading-snug opacity-75">{e.excerpt}</p>}
                <p className="mt-3 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[#9C4F68]">{es ? "Leer →" : "Read →"}</p>
              </Link>
            </li>
          ))}
        </ul>
        <Link href={`/${lang}/journal`} className="mt-6 inline-block font-hand text-[1.5rem] text-[#F2C9D3] underline decoration-2 underline-offset-4">
          {es ? "todo el journal →" : "the whole journal →"}
        </Link>
      </div>
    </div>
  );
}

export function Final({ lang }: { lang: Locale }) {
  return (
    <div className={clsx(inner, "items-center text-center")}>
      <Fin lang={lang} />
    </div>
  );
}

import Link from "next/link";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import { projects, projectsCopy as P, type Project } from "@/content/onda";
import { Hand, Pix, Sheet } from "./Kit";
import Reveal from "./Reveal";

const bg = { ink: "bg-[#2A1F24] text-white", butter: "bg-[#F6E3A1]", sky: "bg-[#CFE3F2]", blush: "bg-[#F7DCE4]" };

function Card({ p, lang, big }: { p: Project; lang: Locale; big?: boolean }) {
  const dark = p.color === "ink";
  return (
    <Link
      href={`/${lang}/proyectos/${p.id}`}
      className={clsx("group relative flex h-full flex-col overflow-hidden rounded-[6px] p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7", bg[p.color], big && "min-h-[460px] lg:min-h-[560px]")}
    >
      {big && p.photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.photo} alt="" className="absolute inset-y-0 right-0 hidden h-full w-[48%] object-cover transition-transform duration-700 group-hover:scale-[1.03] sm:block" />
      )}
      <div className={clsx("relative flex flex-1 flex-col", big && "sm:max-w-[48%]")}>
        <p className={clsx("w-fit text-[0.72rem] font-bold uppercase tracking-[0.08em]", big && "-ml-7 -mt-7 bg-[#E8A9BC] px-3.5 py-2 text-[#2A1F24]")}>● {p.kicker[lang]}</p>
        <h3 className={clsx("mt-4 font-extrabold leading-none", p.stat && "pr-24 sm:pr-0", " tracking-[-0.03em]", big ? "text-[clamp(2.3rem,4vw,3rem)]" : "text-[1.9rem]")}>{p.name}</h3>
        <p className={clsx("mt-3 max-w-[34ch] text-[0.98rem] leading-snug", p.stat && "pr-20 sm:pr-24", dark ? "text-white/75" : "text-[#2A1F24]/75")}>{p.short[lang]}</p>
        {big && p.links && (
          <ul className="mt-6 flex flex-col gap-2 text-[0.88rem]">
            {p.links.slice(0, 3).map((l) => (
              <li key={l.href} className="w-fit rounded-[4px] bg-white/15 px-2.5 py-1">
                {l.label} ↗
              </li>
            ))}
          </ul>
        )}
        <p className="mt-auto pt-6 text-[0.75rem] font-bold uppercase tracking-[0.08em]">{P.see[lang]}</p>
      </div>
      {p.stat && (
        <span className="absolute right-5 top-5 rotate-[4deg] rounded-[5px] bg-white px-3.5 py-2 text-center text-[#2A1F24] shadow-[0_3px_0_rgba(0,0,0,.08)] sm:top-14">
          <span className="block font-[Shrikhand] text-[1.9rem] font-bold leading-none">{p.stat.n}</span>
          <span className="text-[0.72rem] font-bold">{p.stat.label[lang]}</span>
        </span>
      )}
    </Link>
  );
}

/** Proyectos: Mirrow grande y oscuro; los demás en colores. Cada uno abre su página. */
export default function Projects({ lang }: { lang: Locale }) {
  const [first, second, ...rest] = projects;
  return (
    <Sheet id="proyectos" label={P.title[lang]}>
      <Hand className="text-[1.7rem]">{P.kicker[lang]}</Hand>
      <Pix className="mt-1 text-[clamp(3rem,8vw,6rem)]">{P.title[lang]}</Pix>
      <div className="mt-10 grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        <Reveal className="h-full">
          <Card p={first} lang={lang} big />
        </Reveal>
        <div className="grid gap-5">
          <Reveal delay={100}>
            <Card p={second} lang={lang} />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {rest.map((p, i) => (
              <Reveal key={p.id} delay={180 + i * 80} className="h-full">
                <Card p={p} lang={lang} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Sheet>
  );
}

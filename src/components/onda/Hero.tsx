import type { Locale } from "@/lib/i18n";
import { hero as H } from "@/content/onda";
import { Hand, Tag, type Tone } from "./Kit";

/** Portada: BRIGITTE en un marco, etiquetitas alrededor, dos fotitos y una línea clara. */
const spots = [
  "lg:left-[14%] lg:top-[6%] -rotate-[4deg]",
  "lg:right-[12%] lg:top-[2%] rotate-[3deg]",
  "lg:left-[12%] lg:bottom-[2%] rotate-[3deg]",
  "lg:right-[12%] lg:bottom-[0%] -rotate-[3deg]",
  "lg:left-[2%] lg:top-[44%] -rotate-[6deg]",
  "lg:right-[1%] lg:top-[40%] rotate-[5deg]",
];

export default function Hero({ lang }: { lang: Locale }) {
  return (
    <section id="inicio" className="relative flex min-h-[calc(100svh-3rem)] scroll-mt-16 flex-col items-center justify-center px-5 py-16 text-center">
      <div className="relative mx-auto w-full max-w-[1100px]">
        <Hand className="text-[clamp(1.5rem,2.4vw,2rem)]">{H.hello[lang]}</Hand>

        <div className="relative mx-auto mt-2 w-fit lg:px-40 lg:py-14">
          <div className="relative inline-block border-2 border-[#9C4F68] bg-white/60 px-[clamp(1rem,3vw,2.2rem)] pb-[clamp(.4rem,1vw,.8rem)] pt-[clamp(.6rem,1.4vw,1rem)]">
            <h1 className="font-[Shrikhand] text-[clamp(3.4rem,12vw,9rem)] leading-[1.05] tracking-[-0.01em] text-[#4A2C2A]">Brigitte</h1>
            {["-left-1.5 -top-1.5", "-right-1.5 -top-1.5", "-bottom-1.5 -left-1.5", "-bottom-1.5 -right-1.5"].map((p) => (
              <span key={p} aria-hidden className={`absolute h-2.5 w-2.5 border-2 border-[#9C4F68] bg-white ${p}`} />
            ))}
          </div>

          {/* En compu las etiquetas flotan alrededor; en el celu van abajo, en fila */}
          <ul className="mt-6 flex flex-wrap justify-center gap-2 lg:mt-0">
            {H.tags.map((t, i) => (
              <li
                key={i}
                className={`no-motion-safe animate-[pop_.6s_cubic-bezier(.2,.9,.3,1.3)_both] lg:absolute ${spots[i]}`}
                style={{ animationDelay: `${300 + i * 110}ms` }}
              >
                <Tag c={t.c as Tone} className={t.c === "rosa" ? "text-white" : undefined}>
                  {t.t[lang]}
                </Tag>
              </li>
            ))}
          </ul>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fotos/portada.webp" alt="Brigitte Blau" className="absolute -left-2 bottom-[18%] hidden h-[74px] w-[74px] animate-[floaty2_5s_ease-in-out_infinite] rounded-full border-[3px] border-white object-cover shadow-[0_6px_14px_-6px_rgba(0,0,0,.4)] lg:block" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fotos/avatar/2.webp" alt="" className="absolute -right-4 top-[10%] hidden h-[68px] w-[68px] animate-[floaty2_6s_ease-in-out_infinite_1s] rounded-full border-[3px] border-white object-cover shadow-[0_6px_14px_-6px_rgba(0,0,0,.4)] lg:block" />
        </div>

        <p className="mx-auto mt-10 max-w-[22ch] text-[clamp(1.7rem,3.2vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[#4A2C2A] sm:max-w-none">
          {H.line[lang][0]}
          <span className="text-[#9C4F68]">{H.line[lang][1]}</span> ✿
        </p>
        <p className="mt-3 text-[1.05rem] text-[#4A2C2A]/60">{H.sub[lang]}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-[0.85rem] font-bold uppercase tracking-[0.04em]">
          <a href="#proyectos" className="rounded-[6px] bg-[#4A2C2A] px-5 py-3 text-white transition-transform hover:-translate-y-0.5">
            {H.ctaWork[lang]}
          </a>
          <a href="#dejame" className="rounded-[6px] border-[1.5px] border-[#4A2C2A] bg-white px-5 py-3 text-[#4A2C2A] transition-transform hover:-translate-y-0.5">
            {H.ctaPhoto[lang]}
          </a>
        </div>
      </div>
    </section>
  );
}

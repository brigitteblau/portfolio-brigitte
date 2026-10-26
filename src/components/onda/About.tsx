import type { Locale } from "@/lib/i18n";
import { about as A } from "@/content/onda";
import { Hand, Pix, Polaroid, Sheet, Tag, type Tone } from "./Kit";
import Reveal from "./Reveal";

/** Sobre mí: la historia corta en letra a mano, una polaroid y lo que sé hacer. */
export default function About({ lang }: { lang: Locale }) {
  return (
    <Sheet id="sobre-mi" label={A.title[lang]}>
      <Hand className="text-[1.7rem]">{A.kicker[lang]}</Hand>
      <Pix className="mt-1 text-[clamp(3rem,8vw,6rem)]">{A.title[lang]}</Pix>
      <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1fr_300px]">
        <Reveal>
          <div className="relative rounded-[6px] border-[1.5px] border-[#E8A9BC] bg-white/70 p-6 sm:p-9">
            <span className="absolute -top-3 left-6 rounded-[4px] bg-[#E9D6C4] px-2 py-0.5 text-[0.72rem] font-bold uppercase tracking-[0.06em]">
              {lang === "es" ? "mi historia corta" : "the short version"}
            </span>
            <p className="font-hand text-[clamp(1.55rem,2.4vw,1.95rem)] leading-[1.25] text-[#4A2C2A]">{A.hand[lang]}</p>
            <p className="mt-6 text-[1.02rem] leading-relaxed text-[#4A2C2A]/75">{A.body[lang]}</p>
            <ul className="mt-7 flex flex-wrap gap-2">
              {A.skills.map((s, i) => (
                <li key={s.t}>
                  <Tag c={s.c as Tone} className={[" -rotate-1", "rotate-1", "-rotate-2", "rotate-2", "rotate-0"][i]}>
                    {s.t}
                  </Tag>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={150} className="mx-auto w-[min(70vw,280px)] lg:mt-8">
          <Polaroid src={A.photo} note={lang === "es" ? "esta soy yo ♡" : "that's me ♡"} rotate={4} alt="Brigitte Blau" />
        </Reveal>
      </div>
    </Sheet>
  );
}

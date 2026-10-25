import type { Locale } from "@/lib/i18n";
import { fun as F } from "@/content/onda";
import { Hand, Pix, Polaroid, Sheet, Tag, type Tone } from "./Kit";
import Reveal from "./Reveal";

const rot = [-5, 3, -2, 5, -4, 4, -3];
const shift = ["lg:mt-6", "lg:-mt-4", "lg:mt-10", "lg:-mt-6", "lg:mt-8", "lg:-mt-2", "lg:mt-4"];

/** Just for fun: polaroids con cinta, como un corcho. */
export default function Fun({ lang }: { lang: Locale }) {
  return (
    <Sheet id="fun" label={F.title}>
      <div className="text-center">
        <Hand className="text-[1.7rem]">{F.kicker[lang]}</Hand>
        <Pix className="mt-1 text-[clamp(2.6rem,6vw,4.5rem)]">{F.title}</Pix>
      </div>
      <ul className="mx-auto mt-12 flex max-w-[1100px] flex-wrap justify-center gap-x-4 gap-y-8 sm:gap-x-6">
        {F.photos.map((p, i) => (
          <li key={p.src} className={`w-[44%] sm:w-[30%] lg:w-[23%] ${shift[i]}`}>
            <Reveal delay={i * 70}>
              <Polaroid src={p.src} note={p.note[lang]} rotate={rot[i % rot.length]} />
            </Reveal>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {F.tags.map((t, i) => (
          <Tag key={i} c={t.c as Tone} className={i % 2 ? "rotate-[3deg]" : "-rotate-[4deg]"}>
            {t.t[lang]}
          </Tag>
        ))}
      </div>
    </Sheet>
  );
}

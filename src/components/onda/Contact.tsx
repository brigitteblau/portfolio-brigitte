import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { contact as C } from "@/content/onda";
import { Hand, Pix, Polaroid } from "./Kit";

/** Contacto: tarjeta amarilla en el medio y dos polaroids a los costados, como en la referencia. */
export default function Contact({ lang }: { lang: Locale }) {
  return (
    <section id="contacto" aria-label={C.title[lang]} className="relative scroll-mt-16 overflow-hidden px-5 pb-16 pt-20 sm:px-10 sm:pt-28">
      <div className="relative mx-auto max-w-[1100px]">
        <div className="pointer-events-none absolute left-0 top-10 hidden w-[200px] lg:block">
          <Polaroid src={C.photos[0]} rotate={-7} />
        </div>
        <div className="pointer-events-none absolute right-0 top-24 hidden w-[190px] lg:block">
          <Polaroid src={C.photos[1]} rotate={6} />
        </div>

        <div className="mx-auto max-w-[520px] text-center">
          <Hand className="text-[1.7rem]">{C.kicker[lang]}</Hand>
          <div className="relative mx-auto mt-2 w-fit border-2 border-[#9C4F68] bg-white/60 px-6 pb-2 pt-3">
            <Pix className="text-[clamp(2.6rem,7vw,4.5rem)]">{C.title[lang]}</Pix>
          </div>
          <div className="mt-8 rotate-[-1deg] rounded-[6px] bg-[#F6E3A1] p-6 text-left shadow-[0_10px_24px_-14px_rgba(0,0,0,.4)]">
            <p className="text-[1.05rem] leading-snug text-[#2A1F24]/80">{C.body[lang]}</p>
            <a href={`mailto:${C.email}`} className="mt-4 inline-block break-all rounded-[6px] bg-[#2A1F24] px-4 py-2.5 text-[0.9rem] font-bold text-white">
              {C.email}
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-2 text-[0.8rem] font-bold uppercase tracking-[0.05em]">
            {C.links.map((l) => (
              <li key={l.label}>
                {l.href.startsWith("/") ? (
                  <Link href={`/${lang}${l.href}`} className="inline-block rounded-[6px] border-[1.5px] border-[#2A1F24] bg-white px-3 py-2 hover:bg-[#F7DCE4]">
                    {l.label}
                  </Link>
                ) : (
                  <a href={l.href} target="_blank" rel="noreferrer me" className="inline-block rounded-[6px] border-[1.5px] border-[#2A1F24] bg-white px-3 py-2 hover:bg-[#F7DCE4]">
                    {l.label} ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-14 text-[0.9rem] text-[#2A1F24]/50">
            Brigitte Blau · {new Date().getFullYear()} ·{" "}
            <Link href={`/${lang}`} className="underline underline-offset-4 hover:text-[#2A1F24]">
              {C.sober[lang]}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Locale } from "@/lib/i18n";
import { contacto as K, NAME } from "@/content/site";
import { Burst, Polaroid, Sticky, Tag } from "../Stickers";
import { NameStep } from "../NameTag";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Contacto({ lang, photos }: { lang: Locale; photos: string[] }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(K.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${K.email}`;
    }
  };

  return (
    <div id="contacto" className="slide relative grid scroll-mt-16 items-center gap-10 overflow-hidden px-5 py-12 sm:px-12 md:grid-cols-[0.8fr_1.2fr]">
      <div className="relative mx-auto w-[min(70vw,22rem)]">
        {photos[0] && (
          <Polaroid rotate={-5} holder="clip" caption={lang === "es" ? "muak!" : "mwah!"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[0]} alt={lang === "es" ? "Yo, tirando un beso" : "Me, blowing a kiss"} loading="lazy" className="aspect-[4/5] w-full object-cover" />
          </Polaroid>
        )}
        <div className="absolute -right-6 -top-6 w-20">
          <Burst>
            <span className="text-[1.8rem]" aria-hidden>
              ♥
            </span>
          </Burst>
        </div>
      </div>
      <div>
        <NameStep n={NAME.length} />
        <p className="font-hand text-[1.5rem] leading-none text-ink/60">{lang === "es" ? "ahora sí, me llamo" : "now you know, I'm"}</p>
        <p className="mb-2 text-[clamp(2.6rem,7vw,5.5rem)] font-black italic leading-[0.9] tracking-[-0.05em] text-pink">{NAME}</p>
        <h2 className="hello-grad pb-[0.06em] pr-[0.08em] text-[clamp(3.4rem,8vw,7rem)] font-black italic leading-[0.88] tracking-[-0.05em]">{K.title[lang]}</h2>
        <p className="mt-4 max-w-[34ch] text-[1.25rem] font-medium leading-snug">{K.body[lang]}</p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a href={`mailto:${K.email}`} className="break-all text-[clamp(1.1rem,2.2vw,1.6rem)] font-bold underline decoration-pink decoration-[3px] underline-offset-4 hover:text-blue">
            {K.email}
          </a>
          <button onClick={copy} className="rounded-full bg-ink px-4 py-2 text-[0.95rem] font-semibold text-cream hover:bg-blue">
            {copied ? K.copied[lang] : K.copy[lang]}
          </button>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {K.links.map((l, i) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="inline-block">
              <Tag color={["var(--green)", "var(--blue)", "var(--pink)"][i % 3]} rotate={[-4, 3, -2][i % 3]}>
                {l.label} ↗
              </Tag>
            </a>
          ))}
          <Link href={`/${lang}/journal`} className="inline-block transition-transform hover:-rotate-2 hover:scale-105">
            <Sticky color="#f8d66a" rotate={3} className="!text-[1.35rem]">
              {K.journalCta[lang]}
            </Sticky>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Final({ lang, photos }: { lang: Locale; photos: string[] }) {
  return (
    <section className="relative px-3 pb-10 pt-6 sm:px-6" aria-label={K.title[lang]}>
      <div className="mx-auto max-w-[1500px] space-y-6">
        <Contacto lang={lang} photos={photos} />
      </div>
    </section>
  );
}

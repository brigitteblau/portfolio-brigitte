"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Locale } from "@/lib/i18n";
import { intro, perfil as P, NAME } from "@/content/site";
import { Burst, Doodle, PersonIcon, Polaroid, Sparkle, Tag } from "../Stickers";
import { NameStep } from "../NameTag";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div data-field className="border-b-2 border-ink/80 pb-2 pt-4">
      <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-ink/70">{label}:</p>
      <div className="mt-1 text-[clamp(1.15rem,1.9vw,1.6rem)] font-semibold leading-tight">{children}</div>
    </div>
  );
}

export default function Perfil({ lang, photos }: { lang: Locale; photos: string[] }) {
  const root = useRef<HTMLElement>(null);
  const labels = intro.labels.slice(0, 3);
  const extra = intro.labels[3];

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set("[data-strike]", { scaleX: 1 });
        return;
      }
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 65%" } });
      tl.from("[data-field]", { y: 24, opacity: 0, stagger: 0.12, duration: 0.6, ease: "power3.out" })
        .to("[data-strike]", { scaleX: 1, stagger: 0.25, duration: 0.35, ease: "power2.inOut" }, "-=0.1")
        .from("[data-after]", { opacity: 0, y: 10, duration: 0.5 }, "+=0.1")
        .from("[data-pol]", { y: 80, rotate: (i) => (i % 2 ? 20 : -20), opacity: 0, stagger: 0.12, duration: 0.8, ease: "back.out(1.6)" }, 0.2);
    },
    { scope: root },
  );

  const pics = photos.slice(0, 3);

  return (
    <section ref={root} id="perfil" className="relative px-3 py-6 sm:px-6" aria-labelledby="perfil-title">
      <NameStep n={1} />
      <div className="slide relative mx-auto grid max-w-[1500px] gap-8 overflow-hidden px-5 py-10 sm:px-10 md:grid-cols-[1.15fr_0.85fr] md:py-14">
        <div className="relative">
          <h2 id="perfil-title" className="hello-grad pb-[0.06em] text-[clamp(4.5rem,13vw,11rem)] font-black italic leading-[0.85] tracking-[-0.06em]">
            {P.title[lang]}
          </h2>
          <Sparkle className="absolute right-[8%] top-2 h-10 w-10" />

          <div className="mt-4 max-w-[38rem]">
            <Field label={P.fields.name[lang]}>
              <span className="inline-flex gap-[3px] py-1" aria-label={lang === "es" ? "todavía no te lo digo" : "not telling you yet"}>
                {NAME.split("").map((_, i) => (
                  <span key={i} className="inline-block h-[1.1em] w-[0.62em] rounded-[2px] bg-ink" />
                ))}
              </span>
              <span className="ml-3 font-hand text-[1.35rem] font-normal text-pink">{lang === "es" ? "(ya llega)" : "(coming soon)"}</span>
            </Field>
            <Field label={P.fields.notOnly[lang]}>
              <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {labels.map((l, i) => (
                  <span key={i} className="relative inline-block">
                    {l[lang]}
                    <span data-strike className="absolute left-[-4%] top-[55%] h-[3px] w-[108%] origin-left scale-x-0 rounded bg-red" aria-hidden />
                  </span>
                ))}
                <span>{extra[lang]}</span>
              </span>
              <p data-after className="mt-2 font-serif text-[1.15em] font-normal italic text-red">{intro.withTime[lang]}</p>
            </Field>
            <Field label={P.fields.now[lang]}>{P.nowValue[lang]}</Field>
            <Field label={P.fields.goal[lang]}>
              {P.goalValue[lang]} <span className="text-yellow">:)</span>
            </Field>
          </div>
          <Doodle kind="curl" className="absolute -bottom-6 right-0 hidden w-28 md:block" />
        </div>

        <div className="relative min-h-[380px] md:min-h-0">
          {pics.map((src, i) => (
            <div
              key={src}
              data-pol
              className="absolute w-[min(56%,250px)]"
              style={{ left: `${[30, 2, 46][i]}%`, top: `${[2, 30, 52][i]}%`, zIndex: [3, 2, 1][i] }}
            >
              <Polaroid rotate={[4, -7, 9][i]} holder={i === 0 ? "clip" : "pin"}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={lang === "es" ? `Yo, foto ${i + 1}` : `Me, photo ${i + 1}`} loading="lazy" className="aspect-[4/5] w-full object-cover" />
              </Polaroid>
            </div>
          ))}
          <div data-pol className="absolute left-[18%] top-[2%] z-10 w-20 sm:w-24">
            <Burst>
              <PersonIcon className="h-1/2 w-1/2" />
            </Burst>
          </div>
          <div data-pol className="absolute bottom-[4%] right-[4%] z-10">
            <Tag color="var(--blue)" rotate={5}>
              {lang === "es" ? "esta soy yo" : "this is me"}
            </Tag>
          </div>
        </div>
      </div>
    </section>
  );
}

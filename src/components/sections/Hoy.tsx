"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { filledL, type Locale } from "@/lib/i18n";
import { intro, perfil as P, ahora as A, extra as X, NAME_STEPS } from "@/content/site";
import { experience } from "@/content/projects";
import { Burst, PersonIcon, Polaroid, Sparkle } from "../Stickers";
import { NameStep } from "../NameTag";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div data-field className="border-b-2 border-ink/80 pb-2 pt-3">
      <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-ink/60">{label}:</p>
      <div className="mt-0.5 text-[clamp(1.1rem,1.8vw,1.5rem)] font-semibold leading-tight">{children}</div>
    </div>
  );
}

/** "Hoy": quién soy ahora, en una sola tarjeta. Lo demás, en "ver más". */
export default function Hoy({ lang, photos }: { lang: Locale; photos: string[] }) {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const last = experience.length - 1;

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set("[data-strike]", { scaleX: 1 });
        return;
      }
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%" } });
      tl.from("[data-field]", { y: 20, opacity: 0, stagger: 0.1, duration: 0.5, ease: "power3.out" })
        .to("[data-strike]", { scaleX: 1, stagger: 0.2, duration: 0.3, ease: "power2.inOut" }, "-=0.1")
        .from("[data-pol]", { y: 60, opacity: 0, rotate: (i) => (i % 2 ? 14 : -14), stagger: 0.1, duration: 0.7, ease: "back.out(1.6)" }, 0.1);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="hoy" className="relative px-3 py-6 sm:px-6" aria-labelledby="hoy-title">
      <NameStep n={NAME_STEPS.ahora} />
      <div className="slide relative mx-auto grid max-w-[1500px] gap-6 overflow-hidden px-5 py-8 sm:px-10 sm:py-12 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 id="hoy-title" className="hello-grad pb-[0.06em] pr-[0.08em] text-[clamp(4rem,11vw,9rem)] font-black italic leading-[0.85] tracking-[-0.06em]">
            {X.today[lang]}
          </h2>
          <div className="mt-2 max-w-[38rem]">
            <Field label={P.fields.now[lang]}>{P.nowValue[lang]}</Field>
            <Field label={P.fields.notOnly[lang]}>
              <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {intro.labels.slice(0, 3).map((l, i) => (
                  <span key={i} className="relative inline-block">
                    {l[lang]}
                    <span data-strike className="absolute left-[-4%] top-[55%] h-[3px] w-[108%] origin-left scale-x-0 rounded bg-red" aria-hidden />
                  </span>
                ))}
                <span>{intro.labels[3][lang]}</span>
              </span>
              <p className="mt-1 font-serif text-[1.05em] font-normal italic text-red">{intro.withTime[lang]}</p>
            </Field>
            <Field label={P.fields.goal[lang]}>
              {P.goalValue[lang]} <span className="text-yellow">:)</span>
            </Field>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="hoy-mas"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-semibold text-cream hover:bg-blue"
          >
            {open ? X.less[lang] : `${X.more[lang]}: ${X.experience[lang]}`}
            <span className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
              ↓
            </span>
          </button>

          {open && (
            <ol id="hoy-mas" className="mt-5 max-w-[42rem] animate-[sub_.4s_ease-out] overflow-hidden rounded-[14px] border-2 border-ink/80 bg-white">
              <li className="flex items-center gap-2 border-b border-[#d4d8e0] bg-[#1e6b43] px-3 py-1.5 text-[0.8rem] font-semibold text-white">
                {A.sheetName[lang]}.xlsx
                <span className="ml-auto font-mono text-[0.75rem] opacity-80">{lang === "es" ? "=AHORA()" : "=NOW()"}</span>
              </li>
              {experience.map((e, i) => {
                const did = filledL(e.did, lang);
                return (
                  <li key={i} className="grid grid-cols-[2rem_1fr] border-b border-[#d4d8e0] last:border-b-0" style={{ background: i === last ? "#fff6c9" : undefined }}>
                    <span className="bg-[#f0f2f6] pt-3 text-center font-mono text-[0.72rem] text-ink/50">{i + 1}</span>
                    <div className="px-3 py-2.5">
                      <p className="font-semibold leading-tight">{e.what[lang]}</p>
                      <p className="mt-0.5 font-mono text-[0.78rem] text-ink/70">
                        {e.href ? (
                          <a href={e.href} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                            {e.where}
                          </a>
                        ) : (
                          e.where
                        )}{" "}
                        · {e.role[lang]}
                      </p>
                      {did && <p className="mt-1 text-[0.92rem] leading-snug">{did}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <div className="relative hidden min-h-[320px] md:block">
          {photos.slice(0, 2).map((src, i) => (
            <div key={src} data-pol className="absolute w-[min(62%,250px)]" style={{ left: `${[34, 4][i]}%`, top: `${[2, 34][i]}%`, zIndex: 2 - i }}>
              <Polaroid rotate={[5, -6][i]} holder={i === 0 ? "clip" : "pin"}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={lang === "es" ? `Yo, foto ${i + 1}` : `Me, photo ${i + 1}`} loading="lazy" className="aspect-[4/5] w-full object-cover" />
              </Polaroid>
            </div>
          ))}
          <div data-pol className="absolute left-[22%] top-0 z-10 w-20">
            <Burst>
              <PersonIcon className="h-1/2 w-1/2" />
            </Burst>
          </div>
          <Sparkle className="absolute bottom-6 right-6 h-9 w-9" />
        </div>
      </div>
    </section>
  );
}

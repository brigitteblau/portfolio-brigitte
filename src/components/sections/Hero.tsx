"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Locale } from "@/lib/i18n";
import { hero as H } from "@/content/site";
import { RetroComputer, Sparkle } from "../Stickers";
import { NameStep } from "../NameTag";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const go = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  window.dispatchEvent(new CustomEvent("goto", { detail: id }));
};

const TONE = { blue: "var(--ink)", pink: "var(--ink)", yellow: "var(--yellow)", "": undefined } as const;

/** Suma offsetLeft/Top desde `el` hasta `stop` (sin que las transformaciones afecten la medida). */
function offsetWithin(el: HTMLElement, stop: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== stop) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/**
 * Portada: "Holaaa!" y la tele con mi foto. Al bajar, la tele se agranda hasta ocupar
 * toda la pantalla y adentro aparece lo que hago. Ahí arranca el portfolio.
 */
export default function Hero({ lang, photos }: { lang: Locale; photos: string[] }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tv = useRef<HTMLDivElement>(null);
  const final = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Entrada
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "back.out(1.6)" } })
          .from("[data-hello] span", { yPercent: 110, rotate: () => gsap.utils.random(-10, 10), stagger: 0.05, duration: 0.8 })
          .from(tv.current, { y: 120, opacity: 0, duration: 0.9, ease: "expo.out" }, "-=0.5")
;

        // El zoom con el scroll: la pantalla de la tele termina tapando toda la vista
        const st = stage.current!;
        const box = tv.current!;
        const screen = box.querySelector<HTMLElement>("[data-screen]")!;
        const geo = () => {
          const s = offsetWithin(screen, box);
          const b = offsetWithin(box, st);
          const cx = s.x + screen.offsetWidth / 2;
          const cy = s.y + screen.offsetHeight / 2;
          const scale = Math.max(st.clientWidth / screen.offsetWidth, st.clientHeight / screen.offsetHeight) * 1.04;
          return { cx, cy, dx: st.clientWidth / 2 - (b.x + cx), dy: st.clientHeight / 2 - (b.y + cy), scale };
        };
        let g = geo();
        gsap.set(box, { transformOrigin: `${g.cx}px ${g.cy}px` });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            invalidateOnRefresh: true,
            onRefreshInit: () => {
              g = geo();
              gsap.set(box, { transformOrigin: `${g.cx}px ${g.cy}px` });
            },
            onUpdate: (self) => {
              if (final.current) final.current.style.pointerEvents = self.progress > 0.8 ? "auto" : "none";
            },
          },
        });
        tl.to("[data-hello]", { yPercent: -60, opacity: 0, duration: 0.35 }, 0)
          .to(box, { x: () => g.dx, y: () => g.dy, scale: () => g.scale, duration: 0.7, ease: "power2.in" }, 0.02)
          .to("[data-glare]", { opacity: 0, duration: 0.2 }, 0.5);
        // la pantalla va cambiando: cada foto aparece encima de la anterior, y al final rosa
        const n = photos.length;
        for (let i = 1; i <= n; i++) tl.to(`[data-scr="${i}"]`, { opacity: 1, duration: 0.06 }, 0.12 + (i - 1) * (0.56 / n));
        tl
          .fromTo(final.current, { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.72)
          .from("[data-final] > *", { y: 30, opacity: 0, stagger: 0.03, duration: 0.12 }, 0.76)
          .to({}, { duration: 0.1 });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(final.current, { opacity: 1, pointerEvents: "auto" });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const es = lang === "es";
  const words = H.statement[lang];

  return (
    <section ref={root} className="relative h-[260svh] motion-reduce:h-auto" aria-labelledby="hero-title">
      <NameStep n={0} />
      <div ref={stage} className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-4 motion-reduce:static">
        {/* Holaaa! */}
        <p
          data-hello
          aria-hidden
          className="hello-grad relative z-0 flex overflow-hidden px-[0.06em] pb-[0.08em] text-center text-[clamp(4.2rem,19vw,17rem)] font-black italic leading-[0.85] tracking-[-0.06em]"
        >
          {H.hello[lang].split("").map((c, i) => (
            <span key={i} className="hello-grad inline-block pr-[0.03em]">
              {c}
            </span>
          ))}
        </p>

        {/* La tele, con mi foto en la pantalla */}
        <div ref={tv} className="relative z-10 -mt-[min(5vw,4rem)] w-[min(70vw,380px)] will-change-transform">
          <RetroComputer>
            {/* Lo que pasa en la pantalla mientras entrás: fotos mías y al final rosa */}
            {photos.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                data-scr={i}
                src={src}
                alt={i === 0 ? (es ? "Brigitte en su escritorio" : "Brigitte at her desk") : ""}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ opacity: i === 0 ? 1 : 0 }}
              />
            ))}
            <div data-scr={photos.length} className="absolute inset-0 bg-pink" style={{ opacity: 0 }} aria-hidden />
            <div data-glare className="absolute inset-x-0 top-0 flex items-center justify-between bg-ink/85 px-2 py-1 font-mono text-[0.6rem] text-cream">
              <span>{H.screenTitle}</span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red" /> {H.screenLabel[lang]}
              </span>
            </div>
            <div data-glare className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,.08)_0,rgba(0,0,0,.08)_1px,transparent_1px,transparent_3px)]" aria-hidden />
          </RetroComputer>
          <Sparkle className="absolute -right-4 -top-4 h-9 w-9" />
        </div>


        {/* Lo que aparece cuando la tele ya ocupa toda la pantalla */}
        <div
          ref={final}
          className="absolute inset-0 z-20 flex items-center opacity-0 motion-reduce:static motion-reduce:mt-8 motion-reduce:bg-none motion-reduce:opacity-100"
          style={{ pointerEvents: "none" }}
        >
          <div data-final className="mx-auto w-full max-w-[1200px] px-6 text-cream sm:px-12 motion-reduce:text-ink">
            <p className="font-hand text-[clamp(1.6rem,3vw,2.4rem)] leading-none text-cream/80">{es ? "esta soy yo, hoy:" : "this is me, today:"}</p>
            <h1 id="hero-title" className="mt-3 max-w-[18ch] text-[clamp(2.4rem,6vw,6rem)] font-black leading-[0.95] tracking-[-0.045em] ">
              {words.map(([t, c], i) => (
                <span key={i} style={{ color: TONE[c] }}>
                  {t}
                </span>
              ))}
            </h1>
            <p className="mt-4 max-w-[52ch] text-[clamp(1rem,1.5vw,1.25rem)] font-semibold leading-snug text-cream/90 motion-reduce:text-ink/80">{H.side[lang]}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#proyectos"
                onClick={go("proyectos")}
                className="rounded-full bg-cream px-6 py-3 text-[1rem] font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                {es ? "Ver lo que hago ↓" : "See what I do ↓"}
              </a>
              <a
                href="#dejame"
                onClick={(e) => {
                  go("dejame")(e);
                  setTimeout(() => window.dispatchEvent(new Event("camera:on")), 900);
                }}
                className="rounded-full bg-ink px-6 py-3 text-[1rem] font-bold text-cream transition-transform hover:-translate-y-0.5"
              >
                {H.cta.photo[lang]}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

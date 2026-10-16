"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import { track } from "@/lib/track";
import { hud } from "@/content/site";
import { setNameStep } from "./NameTag";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Stop = { x: number; name: number };

/**
 * Un tramo horizontal dentro de la página: mientras estás acá, el scroll
 * mueve las tarjetas para el costado. Antes y después, la página baja normal.
 * En celular (y con "reducir movimiento") las tarjetas van una abajo de la otra.
 */
export default function Track({ lang, id, children }: { lang: Locale; id?: string; children: React.ReactNode }) {
  const pin = useRef<HTMLDivElement>(null);
  const reel = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const stops = useRef<Stop[]>([]);
  const [flat, setFlat] = useState(false);
  const [idx, setIdx] = useState(0);
  const [total, setTotal] = useState(1);

  const measure = () => {
    const r = reel.current;
    if (!r) return;
    const out: Stop[] = [];
    let lastName = 0;
    r.querySelectorAll<HTMLElement>("[data-panel]").forEach((p) => {
      if (p.dataset.name) lastName = Number(p.dataset.name);
      out.push({ x: p.offsetLeft, name: lastName });
    });
    stops.current = out;
    setTotal(out.length || 1);
    window.dispatchEvent(new Event("reel:measure"));
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          horizontal: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          vertical: "(max-width: 767px), (prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          if (ctx.conditions?.vertical) {
            setFlat(true);
            track.setFlat(true);
            return;
          }
          setFlat(false);
          track.setFlat(false);
          const r = reel.current!;
          const dist = () => r.scrollWidth - window.innerWidth;
          const tween = gsap.to(r, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: {
              trigger: pin.current,
              start: "top top",
              end: () => `+=${dist()}`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              onRefresh: measure,
            },
            onUpdate: () => {
              const x = -(gsap.getProperty(r, "x") as number);
              track.set(x, window.innerWidth);
              const list = stops.current;
              let i = 0;
              for (let k = 0; k < list.length; k++) if (list[k].x <= x + window.innerWidth * 0.5) i = k;
              setIdx(i);
              if (list[i]) setNameStep(list[i].name);
              if (bar.current) bar.current.style.transform = `scaleX(${x / Math.max(1, dist())})`;
            },
          });
          st.current = tween.scrollTrigger ?? null;
          measure();
          track.set(0, window.innerWidth);
          return () => {
            st.current = null;
          };
        },
      );
      // Recalcular solo cuando termina de cargar todo (no en cada imagen)
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);
      document.fonts?.ready.then(onLoad);
      return () => {
        window.removeEventListener("load", onLoad);
        mm.revert();
      };
    },
    { scope: pin },
  );

  const goTo = (x: number) => {
    const s = st.current;
    if (!s) return;
    const y = s.start + x;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 0.9 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const step = (dir: 1 | -1) => {
    const list = stops.current;
    const x = track.x;
    const s = st.current;
    if (dir === 1) {
      const next = list.find((p) => p.x > x + 4);
      if (next) goTo(next.x);
      else if (s) window.__lenis?.scrollTo(s.end + 2, { duration: 0.9 });
    } else {
      const prev = [...list].reverse().find((p) => p.x < x - 4);
      if (prev) goTo(prev.x);
      else if (s) window.__lenis?.scrollTo(Math.max(0, s.start - window.innerHeight * 0.8), { duration: 0.9 });
    }
  };

  // Flechas del teclado: solo mientras este tramo está en pantalla
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (flat || !st.current?.isActive) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <section id={id} ref={pin} className={clsx("relative", flat ? "" : "h-[100svh] overflow-hidden")}>
      <div ref={reel} className={clsx("reel relative", flat ? "flex flex-col gap-6 py-6" : "flex h-full w-max will-change-transform")} data-flat={flat || undefined}>
        {children}
      </div>
      {!flat && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30">
          <div className="pointer-events-auto absolute bottom-4 right-5 flex items-center gap-1 rounded-full bg-cream/95 px-1 font-mono text-[0.75rem] text-ink shadow-[0_6px_16px_-10px_rgba(0,0,0,.5)]">
            <button onClick={() => step(-1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-ink/10" aria-label={hud.prev[lang]}>
              ←
            </button>
            <span className="tabular-nums" aria-live="polite">
              {String(idx + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
            </span>
            <button onClick={() => step(1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-ink/10" aria-label={hud.next[lang]}>
              →
            </button>
          </div>
          <div className="h-[3px] w-full bg-white/40">
            <div ref={bar} className="h-full w-full origin-left bg-blue" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      )}
    </section>
  );
}

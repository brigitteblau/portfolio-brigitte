"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import { track } from "@/lib/track";
import { hud } from "@/content/site";
import NameTag, { setNameStep } from "./NameTag";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Stop = { x: number; era: string; name: number };

const scrollFactor = () => (typeof window !== "undefined" && window.innerWidth < 768 ? 1.8 : 1);

/**
 * El carrete: scrolleás para abajo y todo se mueve para el costado,
 * como una presentación. También anda con flechas, espacio y los botones.
 */
export default function Track({ lang, children }: { lang: Locale; children: React.ReactNode }) {
  const pin = useRef<HTMLDivElement>(null);
  const reel = useRef<HTMLDivElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const stops = useRef<Stop[]>([]);
  const [flat, setFlat] = useState(false);
  const [idx, setIdx] = useState(0);
  const [era, setEra] = useState("hola");
  const bar = useRef<HTMLDivElement>(null);
  const [total, setTotal] = useState(1);

  const measure = () => {
    const r = reel.current;
    if (!r) return;
    const V = window.innerWidth;
    const out: Stop[] = [];
    let lastEra = "hola";
    let lastName = 0;
    r.querySelectorAll<HTMLElement>("[data-panel]").forEach((p) => {
      const L = p.offsetLeft;
      const W = p.offsetWidth;
      lastEra = p.dataset.era || lastEra;
      if (p.dataset.name) lastName = Number(p.dataset.name);
      out.push({ x: L, era: lastEra, name: lastName });
      // paneles largos: paradas cada ~80% de pantalla hasta el final
      if (W > V * 1.05) {
        const end = L + W - V;
        for (let s = L + V * 0.8; s < end - V * 0.3; s += V * 0.8) out.push({ x: s, era: lastEra, name: lastName });
        out.push({ x: end, era: lastEra, name: lastName });
      }
    });
    stops.current = out;
    setTotal(out.length || 1);
    window.dispatchEvent(new Event("reel:measure"));
  };

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        setFlat(true);
        track.setFlat(true);
        setNameStep(8);
        return;
      }
      const r = reel.current!;
      const dist = () => r.scrollWidth - window.innerWidth;
      // en celular hace falta más recorrido de dedo por pantalla
      const k = () => scrollFactor();

      const tween = gsap.to(r, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: pin.current,
          start: "top top",
          end: () => `+=${dist() * k()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: measure,
        },
        onUpdate: () => {
          const x = -(gsap.getProperty(r, "x") as number);
          const V = window.innerWidth;
          track.set(x, V);
          const list = stops.current;
          let i = 0;
          for (let k = 0; k < list.length; k++) if (list[k].x <= x + V * 0.5) i = k;
          setIdx(i);
          if (list[i]) {
            setEra(list[i].era);
            setNameStep(list[i].name);
          }
          if (bar.current) bar.current.style.transform = `scaleX(${x / Math.max(1, dist())})`;
        },
      });
      st.current = tween.scrollTrigger ?? null;
      measure();
      track.set(0, window.innerWidth);
      // Llegar con #proyectos, #journal, #dejame, etc. desde otra página
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (hash) {
        setTimeout(() => {
          const node = document.getElementById(hash);
          const s = st.current;
          if (node && s) window.scrollTo({ top: s.start + node.offsetLeft * scrollFactor() });
        }, 120);
      }

      const ro = new ResizeObserver(() => ScrollTrigger.refresh());
      ro.observe(r);
      return () => ro.disconnect();
    },
    { scope: pin },
  );

  const goTo = (x: number) => {
    const s = st.current;
    if (!s) return;
    const y = s.start + x * scrollFactor();
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.1, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const step = (dir: 1 | -1) => {
    const list = stops.current;
    const x = track.x;
    if (dir === 1) {
      const next = list.find((s) => s.x > x + 4);
      if (next) goTo(next.x);
    } else {
      const prev = [...list].reverse().find((s) => s.x < x - 4);
      goTo(prev ? prev.x : 0);
    }
  };

  // Teclado + "ir a" desde otros componentes (ej. el botón "Sí")
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (flat) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON" || tag === "A") {
        if (e.key === " ") return;
      }
      if (["ArrowRight", "PageDown"].includes(e.key) || (e.key === " " && !e.shiftKey)) {
        e.preventDefault();
        step(1);
      } else if (["ArrowLeft", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey)) {
        e.preventDefault();
        step(-1);
      }
    };
    const onGoto = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const node = document.getElementById(id);
      if (!node) return;
      if (flat) node.scrollIntoView({ behavior: "smooth" });
      else goTo(node.offsetLeft);
    };
    // Si navegás con Tab, el carrete acompaña al foco
    const onFocus = (e: FocusEvent) => {
      if (flat) return;
      const panel = (e.target as HTMLElement)?.closest<HTMLElement>("[data-panel]");
      if (!panel) return;
      const x = track.x;
      const V = window.innerWidth;
      const L = panel.offsetLeft;
      if (L + panel.offsetWidth <= x || L >= x + V) goTo(L);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("goto", onGoto);
    window.addEventListener("focusin", onFocus);
    return () => {
      window.removeEventListener("focusin", onFocus);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("goto", onGoto);
    };
  });

  const eraLabel = hud.eras[era as keyof typeof hud.eras]?.[lang] ?? "";

  return (
    <>
      <NameTag lang={lang} />
      <div ref={pin} className={clsx("relative", flat ? "" : "h-[100svh] overflow-hidden")}>
        <div ref={reel} className={clsx("reel relative", flat ? "flex flex-col" : "flex h-full w-max will-change-transform")} data-flat={flat || undefined}>
          {children}
        </div>
      </div>

      {/* HUD mínimo: una línea de progreso y un contador */}
      {!flat && (
        <nav aria-label={lang === "es" ? "Diapositivas" : "Slides"} className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
          <div className="pointer-events-auto absolute bottom-3 right-3 flex items-center gap-1 font-mono text-[0.75rem] text-white mix-blend-difference sm:bottom-4 sm:right-5">
            <button onClick={() => step(-1)} className="grid h-9 w-9 place-items-center rounded-full opacity-60 hover:opacity-100" aria-label={hud.prev[lang]}>
              ←
            </button>
            <span className="tabular-nums opacity-60" aria-live="polite">
              <span className="sr-only">{eraLabel} · </span>
              {String(idx + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
            </span>
            <button onClick={() => step(1)} className="grid h-9 w-9 place-items-center rounded-full opacity-60 hover:opacity-100" aria-label={hud.next[lang]}>
              →
            </button>
          </div>
          <div className="h-[2px] w-full bg-navy/10">
            <div ref={bar} className="h-full w-full origin-left bg-cobalt" style={{ transform: "scaleX(0)" }} />
          </div>
        </nav>
      )}
    </>
  );
}

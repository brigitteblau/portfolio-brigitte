"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import { NAME, deck as D } from "@/content/onda";

export type SlideMeta = { id: string; label: string; bg: string; dark?: boolean };

/**
 * La presentación: en compu, las diapositivas pasan de costado mientras bajás (o con las flechas);
 * en el celu (o con "menos movimiento"), van una abajo de la otra.
 * Arriba a la derecha, el nombre se va completando con cada diapositiva.
 */
export default function Deck({ lang, slides, children }: { lang: Locale; slides: SlideMeta[]; children: React.ReactNode }) {
  const kids = Children.toArray(children);
  const n = slides.length;
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [horizontal, setHorizontal] = useState(false);
  const [active, setActive] = useState(0);

  // ¿Horizontal? Solo en pantallas grandes y sin "reducir movimiento"
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const on = () => setHorizontal(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Horizontal: el scroll vertical mueve la cinta de costado
  useEffect(() => {
    if (!horizontal) {
      if (track.current) track.current.style.transform = "";
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = wrap.current;
      const t = track.current;
      if (!el || !t) return;
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / Math.max(1, total)));
      t.style.transform = `translate3d(${-p * (n - 1) * 100}vw,0,0)`;
      setActive(Math.round(p * (n - 1)));
    };
    // Cuando dejás de scrollear, la diapositiva se acomoda sola (no queda a mitad de camino)
    let idle: ReturnType<typeof setTimeout> | undefined;
    const snap = () => {
      const el = wrap.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const p = (window.scrollY - top) / Math.max(1, total);
      if (p <= 0 || p >= 1) return;
      const k = Math.round(p * (n - 1));
      const y = top + (k / (n - 1)) * total;
      if (Math.abs(window.scrollY - y) > 4) window.scrollTo({ top: y, behavior: "smooth" });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
      if (idle) clearTimeout(idle);
      idle = setTimeout(snap, 180);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (idle) clearTimeout(idle);
    };
  }, [horizontal, n]);

  // Vertical: la activa es la que más se ve
  useEffect(() => {
    if (horizontal || !track.current) return;
    const els = Array.from(track.current.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(els.indexOf(e.target as HTMLElement));
      },
      { threshold: 0.55 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [horizontal]);

  const goTo = useCallback(
    (i: number) => {
      const k = Math.max(0, Math.min(n - 1, i));
      const el = wrap.current;
      if (!el) return;
      if (horizontal) {
        const total = el.offsetHeight - window.innerHeight;
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + (k / (n - 1)) * total, behavior: "smooth" });
      } else {
        (track.current?.children[k] as HTMLElement | undefined)?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [horizontal, n],
  );

  // Flechas del teclado (si no estás escribiendo en un campo)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || document.querySelector("[role=dialog]")) return;
      if (e.key === "ArrowRight") goTo(active + 1);
      if (e.key === "ArrowLeft") goTo(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo]);

  // Ir a una diapositiva desde otro lado (ej. #dejame, o el botón "escribime")
  useEffect(() => {
    const go = (id: string) => {
      const i = slides.findIndex((s) => s.id === id);
      if (i >= 0) goTo(i);
    };
    const onEvt = (e: Event) => go(String((e as CustomEvent).detail));
    window.addEventListener("deck:go", onEvt);
    const hash = decodeURIComponent(location.hash.slice(1));
    const t = hash ? setTimeout(() => go(hash), 500) : undefined;
    return () => {
      window.removeEventListener("deck:go", onEvt);
      if (t) clearTimeout(t);
    };
  }, [slides, goTo]);

  const cur = slides[active] ?? slides[0];
  const shown = Math.max(1, Math.round((active / Math.max(1, n - 1)) * (NAME.length - 1)) + 1);

  return (
    <div ref={wrap} className="relative" style={horizontal ? { height: `${n * 100}svh` } : undefined}>
      <div className={clsx(horizontal && "sticky top-0 h-svh overflow-hidden")}>
        <div ref={track} className={clsx(horizontal ? "flex h-svh w-max will-change-transform" : "block")}>
          {kids.map((k, i) => (
            <section
              key={slides[i].id}
              id={slides[i].id}
              aria-label={slides[i].label}
              className={clsx("relative flex min-h-svh w-screen shrink-0 flex-col overflow-hidden", horizontal && "h-svh", slides[i].dark ? "text-[#FBF4EE]" : "text-[#4A2C2A]")}
              style={{ background: slides[i].bg }}
            >
              {/* etiqueta arriba a la izquierda: número y nombre de la diapositiva */}
              <p className="absolute left-5 top-16 text-[0.72rem] font-bold uppercase tracking-[0.08em] opacity-60 sm:left-8">
                {i + 1} / {n} · {slides[i].label}
              </p>
              {k}
            </section>
          ))}
        </div>

        {/* El nombre que se va completando */}
        <p
          aria-hidden
          className={clsx("pointer-events-none fixed right-5 top-[3.6rem] z-40 font-[Shrikhand] text-[1.35rem] transition-colors duration-500 sm:right-8", cur.dark ? "text-[#FBF4EE]" : "text-[#4A2C2A]")}
        >
          {NAME.slice(0, shown)}
          <span className="opacity-20">{NAME.slice(shown)}</span>
        </p>

        {/* Abajo: pista y puntitos (solo en compu) */}
        {horizontal && (
          <div className={clsx("pointer-events-none absolute inset-x-8 bottom-6 z-40 flex items-center justify-between text-[0.72rem] font-bold uppercase tracking-[0.08em]", cur.dark ? "text-[#FBF4EE]" : "text-[#4A2C2A]")}>
            <span className={clsx("opacity-60 transition-opacity", active > 0 && "opacity-0")}>{D.hint[lang]}</span>
            <div className="pointer-events-auto flex items-center gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`${i + 1}. ${s.label}`}
                  aria-current={i === active}
                  className={clsx("h-2 rounded-full bg-current transition-all duration-300", i === active ? "w-6 opacity-100" : "w-2 opacity-30 hover:opacity-60")}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

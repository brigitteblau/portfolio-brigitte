"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { track, clamp01 } from "@/lib/track";

/**
 * Una "diapositiva" del carrete horizontal.
 *  - hold: cuántas pantallas extra se queda quieta (para animaciones internas)
 *  - wide: cuántas pantallas extra mide de ancho (contenido que se recorre)
 */
export type PanelProgress = {
  /** 0 → entra por la derecha · 1 → ocupa toda la pantalla */
  enter: number;
  /** 0 → 1 durante el tiempo que la diapositiva queda quieta (hold) */
  hold: number;
  /** 0 → 1 recorriendo un panel ancho (wide) */
  through: number;
  /** 0 → 1 mientras sale por la izquierda */
  exit: number;
};

type Ctx = { subscribe: (cb: (p: PanelProgress) => void) => () => void };
const PanelCtx = createContext<Ctx | null>(null);

export function usePanel(cb: (p: PanelProgress) => void) {
  const ctx = useContext(PanelCtx);
  const ref = useRef(cb);
  useEffect(() => {
    ref.current = cb;
  });
  useEffect(() => ctx?.subscribe((p) => ref.current(p)), [ctx]);
}

/** Igual que usePanel pero devuelve estado (cuantizado para no re-renderizar de más). */
export function usePanelValue<T>(fn: (p: PanelProgress) => T, initial: T) {
  const [v, setV] = useState<T>(initial);
  const last = useRef<T>(initial);
  usePanel((p) => {
    const n = fn(p);
    if (n !== last.current) {
      last.current = n;
      setV(n);
    }
  });
  return v;
}

export default function Panel({
  id,
  era,
  nameStep,
  hold = 0,
  wide = 0,
  className,
  stageClassName,
  style,
  label,
  children,
}: {
  id?: string;
  era?: string;
  nameStep?: number;
  hold?: number;
  wide?: number | "auto";
  className?: string;
  stageClassName?: string;
  style?: React.CSSProperties;
  /** nombre accesible de la diapositiva */
  label?: string;
  children: React.ReactNode;
}) {
  const el = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const subs = useRef(new Set<(p: PanelProgress) => void>());
  const last = useRef<PanelProgress>({ enter: 0, hold: 0, through: 0, exit: 0 });

  // Geometría cacheada: leer offsetLeft en cada frame obliga al navegador a recalcular el layout.
  const geo = useRef({ L: 0, W: 0 });
  const measure = useCallback(() => {
    const node = el.current;
    if (node) geo.current = { L: node.offsetLeft, W: node.offsetWidth };
  }, []);

  const compute = useCallback(
    (x: number, V: number) => {
      if (!el.current) return;
      if (track.flat) {
        const done = { enter: 1, hold: 1, through: 1, exit: 0 };
        last.current = done;
        subs.current.forEach((s) => s(done));
        if (stage.current) stage.current.style.transform = "";
        return;
      }
      const { L, W } = geo.current;
      const holdPx = hold * V;
      const p: PanelProgress = {
        enter: clamp01((x - (L - V)) / V),
        hold: holdPx > 0 ? clamp01((x - L) / holdPx) : x >= L ? 1 : 0,
        through: W > V ? clamp01((x - L) / (W - V)) : x >= L ? 1 : 0,
        exit: clamp01((x - (L + W - V)) / V),
      };
      const prev = last.current;
      // Si nada cambió (panel lejos de la pantalla), no hacemos trabajo
      if (prev.enter === p.enter && prev.hold === p.hold && prev.through === p.through && prev.exit === p.exit) return;
      if (stage.current && hold > 0) {
        const t = Math.min(Math.max(x - L, 0), holdPx);
        stage.current.style.transform = `translate3d(${t}px,0,0)`;
      }
      last.current = p;
      subs.current.forEach((s) => s(p));
    },
    [hold],
  );

  useEffect(() => {
    measure();
    const onResize = () => {
      measure();
      compute(track.x, track.vw);
    };
    const ro = new ResizeObserver(onResize);
    if (el.current) ro.observe(el.current);
    window.addEventListener("reel:measure", onResize);
    const unsub = track.subscribe(compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("reel:measure", onResize);
      unsub();
    };
  }, [compute, measure]);

  const [ctx] = useState<Ctx>(() => ({
    subscribe: (cb) => {
      subs.current.add(cb);
      cb(last.current);
      return () => {
        subs.current.delete(cb);
      };
    },
  }));

  const width = wide === "auto" ? "max-content" : `${(1 + hold + wide) * 100}vw`;

  return (
    <PanelCtx.Provider value={ctx}>
      <section
        ref={el}
        id={id}
        data-panel
        data-era={era}
        data-name={nameStep}
        aria-label={label}
        className={clsx("panel relative h-[100svh] shrink-0 overflow-hidden", className)}
        style={{ ["--w" as string]: width, minWidth: "100vw", ...style }}
      >
        <div
          ref={stage}
          className={clsx("relative h-full", hold > 0 ? "w-screen will-change-transform" : "w-full", stageClassName)}
        >
          {children}
        </div>
      </section>
    </PanelCtx.Provider>
  );
}

/** Reproduce un video solo mientras su diapositiva está en pantalla (ahorra CPU y batería). */
export function usePanelVideo(ref: React.RefObject<HTMLVideoElement | null>) {
  usePanel(({ enter, exit }) => {
    const v = ref.current;
    if (!v) return;
    const visible = enter > 0.02 && exit < 0.98;
    if (visible && v.paused) void v.play().catch(() => {});
    else if (!visible && !v.paused) v.pause();
  });
}

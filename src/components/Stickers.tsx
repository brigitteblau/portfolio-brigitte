"use client";

/**
 * Los stickers con carita: personajes propios del sitio.
 * Los ojos siguen al cursor (si pasás `look`).
 */
import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  color?: string;
  look?: boolean;
  title?: string;
};

function useEyes(enabled: boolean) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!enabled || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const svg = ref.current;
    const pupils = svg.querySelectorAll<SVGElement>("[data-pupil]");
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = svg.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const a = Math.atan2(e.clientY - cy, e.clientX - cx);
        const d = Math.min(1, Math.hypot(e.clientX - cx, e.clientY - cy) / 300);
        const x = Math.cos(a) * 4 * d;
        const y = Math.sin(a) * 4 * d;
        pupils.forEach((p) => p.setAttribute("transform", `translate(${x} ${y})`));
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);
  return ref;
}

function Face({ x = 50, y = 52, gap = 14, smile = true }: { x?: number; y?: number; gap?: number; smile?: boolean }) {
  return (
    <g>
      {[-1, 1].map((s) => (
        <g key={s}>
          <ellipse cx={x + s * gap} cy={y} rx="8" ry="9" fill="#fff" />
          <g data-pupil="">
            <circle cx={x + s * gap - 1} cy={y - 1} r="4.6" fill="#16204a" />
          </g>
        </g>
      ))}
      {smile && <path d={`M${x - 4} ${y + 9} q4 4 8 0`} stroke="#16204a" strokeWidth="2.4" fill="none" strokeLinecap="round" />}
    </g>
  );
}

export function Flower({ className, color = "var(--orange)", look, title }: Props) {
  const ref = useEyes(!!look);
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg ref={ref} viewBox="0 0 100 100" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      {petals.map((deg) => (
        <ellipse key={deg} cx="50" cy="24" rx="15" ry="22" fill={color} transform={`rotate(${deg} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="26" fill={color} />
      <Face />
    </svg>
  );
}

export function Heart({ className, color = "var(--red)", look, title }: Props) {
  const ref = useEyes(!!look);
  return (
    <svg ref={ref} viewBox="0 0 100 100" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <path d="M50 88 C18 66 6 48 10 31 C14 14 36 10 50 28 C64 10 86 14 90 31 C94 48 82 66 50 88Z" fill={color} />
      <Face y={44} />
    </svg>
  );
}

export function Burst({ className, color = "var(--yellow)", look, title }: Props) {
  const ref = useEyes(!!look);
  const pts = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? 48 : 30;
    return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`;
  }).join(" ");
  return (
    <svg ref={ref} viewBox="0 0 100 100" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <polygon points={pts} fill={color} strokeLinejoin="round" stroke={color} strokeWidth="6" />
      <Face />
    </svg>
  );
}

export function Star({ className, color = "var(--pink)", look, title }: Props) {
  const ref = useEyes(!!look);
  return (
    <svg ref={ref} viewBox="0 0 100 100" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <path d="M52 4 L62 38 L97 34 L68 56 L84 94 L50 70 L14 92 L32 56 L3 30 L40 36 Z" fill={color} />
      <Face y={50} gap={11} smile={false} />
    </svg>
  );
}

/** Clip de oficina, para "colgar" fotos */
export function Clip({ className, color = "var(--pink)" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <path d="M8 18 h44 a4 4 0 0 1 4 4 v8 a4 4 0 0 1 -4 4 h-44 a4 4 0 0 1 -4 -4 v-8 a4 4 0 0 1 4 -4z" fill={color} />
      <path d="M18 18 v-8 a12 8 0 0 1 24 0 v8" fill="none" stroke={color} strokeWidth="5" />
      <circle cx="30" cy="11" r="3.4" fill="#fff" opacity=".7" />
      <rect x="8" y="22" width="44" height="3" fill="#fff" opacity=".35" />
    </svg>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "QUIERO SER PERFECTA" se escribe, se tacha, y abajo se escribe la de hoy.
 * Arranca cuando la diapositiva se ve; con "menos movimiento" aparece todo de una.
 */
export default function Typed({ wrong, right, now, before }: { wrong: string; right: string; now: string; before: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [a, setA] = useState(0);
  const [struck, setStruck] = useState(false);
  const [b, setB] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      if (started.current) return;
      started.current = true;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setA(wrong.length);
        setStruck(true);
        setB(right.length);
        return;
      }
      let t = 300;
      for (let i = 1; i <= wrong.length; i++) timers.push(setTimeout(() => setA(i), (t += 70)));
      timers.push(setTimeout(() => setStruck(true), (t += 600)));
      t += 700;
      for (let i = 1; i <= right.length; i++) timers.push(setTimeout(() => setB(i), (t += 55)));
    };
    const io = new IntersectionObserver(([e]) => e.isIntersecting && run(), { threshold: 0.6 });
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [wrong, right]);

  return (
    <div ref={ref} aria-label={`${wrong} → ${right}`}>
      <p className="font-hand text-[clamp(1.5rem,2.4vw,2.1rem)] opacity-70">{before}</p>
      <p aria-hidden className="relative mt-2 min-h-[1.2em] w-fit text-[clamp(2rem,5vw,4.2rem)] font-bold tracking-[-0.02em] opacity-60">
        {wrong.slice(0, a)}
        {a < wrong.length && <span className="ml-1 inline-block h-[0.8em] w-[3px] animate-pulse bg-current align-[-0.05em]" />}
        <span
          className="absolute left-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-[#E8A9BC] transition-[width] duration-500 ease-out"
          style={{ width: struck ? "100%" : "0%" }}
        />
      </p>
      <p className="mt-10 font-hand text-[clamp(1.5rem,2.4vw,2.1rem)] opacity-70">{now}</p>
      <p aria-hidden className="mt-1 min-h-[2.1em] max-w-[14ch] font-[Shrikhand] text-[clamp(2.8rem,7vw,6.2rem)] leading-[1.02] text-[#F2C9D3]">
        {right.slice(0, b)}
        {struck && <span className="ml-1 inline-block h-[0.85em] w-[5px] animate-pulse bg-[#F2C9D3] align-[-0.08em]" />}
      </p>
    </div>
  );
}

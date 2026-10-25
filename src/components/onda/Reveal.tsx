"use client";

import { useEffect, useRef } from "react";

/** Aparece suave cuando entra en pantalla (y nada si la persona prefiere menos movimiento). */
export default function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.in = "1";
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.in = "1";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`translate-y-6 opacity-0 transition-[opacity,translate] duration-700 ease-out data-[in]:translate-y-0 data-[in]:opacity-100 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

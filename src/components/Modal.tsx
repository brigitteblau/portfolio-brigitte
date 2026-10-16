"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import clsx from "clsx";

/**
 * Pop-up: en celular sube desde abajo (como una hoja), en compu aparece al centro.
 * Frena el scroll de atrás, se cierra con Esc o tocando afuera.
 */
export default function Modal({
  open,
  onClose,
  label,
  children,
  className,
  closeLabel = "Cerrar",
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
  closeLabel?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    window.__lenis?.stop();
    const html = document.documentElement;
    const oldOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    box.current?.focus();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const mobile = window.matchMedia("(max-width: 639px)").matches;
      gsap.fromTo(shade.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(
        box.current,
        mobile ? { yPercent: 100 } : { scale: 0.85, opacity: 0, y: 30 },
        mobile ? { yPercent: 0, duration: 0.45, ease: "expo.out" } : { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.6)" },
      );
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = oldOverflow;
      window.__lenis?.start();
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <div ref={shade} className="absolute inset-0 bg-ink/55" onClick={onClose} aria-hidden />
      <div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        data-lenis-prevent
        className={clsx(
          "relative max-h-[92svh] w-full overflow-y-auto overscroll-contain rounded-t-[26px] bg-cream p-5 pt-4 shadow-[0_-20px_60px_-20px_rgba(0,0,0,.5)] focus:outline-none sm:max-w-2xl sm:rounded-[26px] sm:p-8",
          className,
        )}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-ink/20 sm:hidden" aria-hidden />
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-ink text-[1.2rem] leading-none text-cream hover:bg-pink"
          aria-label={closeLabel}
        >
          ×
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}

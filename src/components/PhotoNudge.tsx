"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import { Polaroid, Sparkle } from "./Stickers";

const KEY = "nudge-photo";

/**
 * Un pop-up chiquito que aparece una sola vez por visita (a los ~35 s o cuando
 * terminás de ver mi historia) para invitarte a dejarme una foto.
 * No aparece si ya estás en la cámara o si ya la abriste.
 */
export default function PhotoNudge({ lang, photo }: { lang: Locale; photo?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    if (seen) return;
    let done = false;
    const camera = document.getElementById("dejame");
    const atCamera = () => {
      if (!camera) return false;
      const r = camera.getBoundingClientRect();
      return r.top < window.innerHeight * 0.8 && r.bottom > window.innerHeight * 0.2;
    };
    const open = () => {
      if (done || atCamera()) return;
      done = true;
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      setShow(true);
    };
    const cancel = () => {
      done = true;
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      setShow(false);
    };
    const t = setTimeout(open, 35000);
    const story = document.getElementById("historia");
    // cuando la historia ya pasó para arriba
    const onScroll = () => {
      if (story && story.getBoundingClientRect().bottom < 0) open();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("camera:on", cancel);
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("camera:on", cancel);
    };
  }, []);

  const go = () => {
    setShow(false);
    window.dispatchEvent(new CustomEvent("goto", { detail: "dejame" }));
    setTimeout(() => window.dispatchEvent(new Event("camera:on")), 900);
  };

  const es = lang === "es";
  return (
    <div
      role="dialog"
      aria-label={es ? "Dejame una foto" : "Leave me a photo"}
      aria-hidden={!show}
      className={clsx(
        "fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-[24rem] transition-[transform,opacity] duration-500 sm:inset-x-auto sm:bottom-6 sm:right-6",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[120%] opacity-0",
      )}
    >
      <div className="relative flex items-center gap-4 rounded-[22px] bg-cream p-4 pr-5 shadow-[0_20px_50px_-15px_rgba(31,33,40,.6),inset_0_0_0_2px_rgba(31,33,40,.85)]">
        <div className="w-24 shrink-0 animate-[sub_.6s_ease-out]">
          <Polaroid rotate={-6}>
            <div className="aspect-square bg-ink">
              {photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" className="h-full w-full object-cover" />
              )}
            </div>
          </Polaroid>
        </div>
        <div className="min-w-0">
          <p className="text-[1.25rem] font-black leading-tight tracking-[-0.02em]">{es ? "¿Me dejás una foto? 📸" : "Leave me a photo? 📸"}</p>
          <p className="mt-1 font-hand text-[1.3rem] leading-[1] text-ink/70">{es ? "quiero ver quién pasa por acá" : "I want to see who stops by"}</p>
          <div className="mt-3 flex items-center gap-3">
            <button tabIndex={show ? 0 : -1} onClick={go} className="rounded-full bg-pink px-4 py-2 text-[0.95rem] font-bold text-cream shadow-[0_4px_0_#b23f86] active:translate-y-0.5">
              {es ? "Dale" : "Sure"}
            </button>
            <button tabIndex={show ? 0 : -1} onClick={() => setShow(false)} className="text-[0.9rem] font-semibold text-ink/60 underline underline-offset-2">
              {es ? "Ahora no" : "Not now"}
            </button>
          </div>
        </div>
        <Sparkle className="absolute -right-2 -top-3 h-8 w-8" />
      </div>
    </div>
  );
}

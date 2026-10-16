"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import { extra as X } from "@/content/site";

/**
 * Botón flotante "dejame una foto": aparece después de la portada y desaparece
 * cuando ya estás en la cámara. Te lleva y la prende.
 */
export default function PhotoFab({ lang }: { lang: Locale }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById("dejame");
    let pastHero = false;
    let atCamera = false;
    const update = () => setShow(pastHero && !atCamera);
    const onScroll = () => {
      pastHero = window.scrollY > window.innerHeight * 0.8;
      update();
    };
    const io = target
      ? new IntersectionObserver(([e]) => {
          atCamera = e.isIntersecting;
          update();
        }, { rootMargin: "-30% 0px -30% 0px" })
      : undefined;
    if (target) io!.observe(target);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const go = () => {
    window.dispatchEvent(new CustomEvent("goto", { detail: "dejame" }));
    // un ratito después, cuando ya llegó, prende la cámara
    setTimeout(() => window.dispatchEvent(new Event("camera:on")), 900);
  };

  return (
    <button
      onClick={go}
      className={clsx(
        "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-pink py-2 pl-2 pr-4 text-cream shadow-[0_8px_0_#b23f86,0_18px_30px_-10px_rgba(31,33,40,.5)] transition-[transform,opacity] duration-300 active:translate-y-1 sm:bottom-6 sm:left-6 sm:right-auto",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0",
      )}
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
    >
      <span className="grid h-10 w-10 place-items-center rounded-full bg-cream text-[1.3rem]" aria-hidden>
        📸
      </span>
      <span className="font-hand text-[1.45rem] leading-none">{X.fab[lang]}</span>
    </button>
  );
}

"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Ir a una parte de la página (#proyectos, #dejame…), con o sin scroll suave. */
function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const y = el.getBoundingClientRect().top + window.scrollY - 60;
  if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 });
  else window.scrollTo({ top: y, behavior: "smooth" });
  history.replaceState(null, "", `#${id}`);
  return true;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Accesos directos: el menú y los post-its mandan un evento "goto"
  useEffect(() => {
    const onGoto = (e: Event) => goTo(String((e as CustomEvent).detail));
    window.addEventListener("goto", onGoto);
    // Si se entra con #algo en la URL, esperar a que todo mida bien y después ir
    const hash = decodeURIComponent(location.hash.slice(1));
    let t: ReturnType<typeof setTimeout> | undefined;
    if (hash) t = setTimeout(() => goTo(hash), 600);
    return () => {
      window.removeEventListener("goto", onGoto);
      if (t) clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}

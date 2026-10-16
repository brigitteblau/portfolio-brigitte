"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";

/**
 * Un video que se ve como video: arranca solo (sin sonido) cuando aparece en pantalla,
 * se pausa cuando sale, y tiene play/pausa, sonido y barra de progreso.
 */
const Video = forwardRef<HTMLVideoElement | null, {
  src: string;
  poster?: string;
  lang: Locale;
  className?: string;
  videoClassName?: string;
  label?: string;
  loop?: boolean;
  /** arrancar solo al aparecer en pantalla */
  auto?: boolean;
  children?: React.ReactNode;
}>(function Video({ src, poster, lang, className, videoClassName, label, loop = true, auto = true, children }, outer) {
  const v = useRef<HTMLVideoElement>(null);
  useImperativeHandle(outer, () => v.current as HTMLVideoElement);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const bar = useRef<HTMLDivElement>(null);
  const userPaused = useRef(false);

  useEffect(() => {
    const el = v.current;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => {
      if (bar.current && el.duration) bar.current.style.transform = `scaleX(${el.currentTime / el.duration})`;
    };
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("timeupdate", onTime);
    let io: IntersectionObserver | undefined;
    if (auto) {
      io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting && e.intersectionRatio > 0.35) {
            if (!userPaused.current && el.paused) void el.play().catch(() => {});
          } else if (!el.paused) el.pause();
        },
        { threshold: [0, 0.35, 0.7] },
      );
      io.observe(el);
    }
    return () => {
      io?.disconnect();
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("timeupdate", onTime);
    };
  }, [auto]);

  const toggle = () => {
    const el = v.current;
    if (!el) return;
    if (el.paused) {
      userPaused.current = false;
      void el.play().catch(() => {});
    } else {
      userPaused.current = true;
      el.pause();
    }
  };

  const sound = () => {
    const el = v.current;
    if (!el) return;
    el.dataset.user = "1";
    el.muted = !el.muted;
    setMuted(el.muted);
    if (!el.muted && el.paused) void el.play().catch(() => {});
  };

  const es = lang === "es";
  return (
    <div className={clsx("group isolate overflow-hidden bg-ink", className)}>
      <video
        ref={v}
        src={src}
        poster={poster}
        className={clsx("absolute inset-0 h-full w-full object-cover", videoClassName)}
        muted
        loop={loop}
        playsInline
        autoPlay={auto}
        preload="metadata"
        aria-label={label}
        onClick={toggle}
      />
      {children}
      {/* Play grande cuando está en pausa */}
      {!playing && (
        <button
          onClick={toggle}
          className="absolute left-1/2 top-1/2 z-10 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cream/90 text-ink shadow-[0_10px_30px_-10px_rgba(0,0,0,.6)] transition-transform hover:scale-110"
          aria-label={es ? "Reproducir" : "Play"}
        >
          <svg viewBox="0 0 24 24" className="ml-1 h-9 w-9" aria-hidden>
            <path d="M7 4.5v15l12.5-7.5z" fill="currentColor" />
          </svg>
        </button>
      )}
      {/* Controles */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 bg-gradient-to-t from-black/60 to-transparent px-3 pb-2.5 pt-6 text-cream">
        <button onClick={toggle} className="grid h-8 w-8 place-items-center rounded-full bg-cream/20 hover:bg-cream/35" aria-label={playing ? (es ? "Pausar" : "Pause") : es ? "Reproducir" : "Play"}>
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" aria-hidden>
              <path d="M7 4.5v15l12.5-7.5z" fill="currentColor" />
            </svg>
          )}
        </button>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-cream/30" aria-hidden>
          <div ref={bar} className="h-full w-full origin-left bg-cream" style={{ transform: "scaleX(0)" }} />
        </div>
        <button onClick={sound} className="rounded-full bg-cream/20 px-2.5 py-1 text-[0.78rem] font-semibold hover:bg-cream/35" aria-pressed={!muted}>
          {muted ? (es ? "🔈 con sonido" : "🔈 sound on") : es ? "🔇 silenciar" : "🔇 mute"}
        </button>
      </div>
    </div>
  );
});

export default Video;

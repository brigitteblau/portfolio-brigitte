import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const rootRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const section = document.getElementById('hero');
    if (!section) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setVisible(true);
          if (hasAnimatedRef.current) continue;
          hasAnimatedRef.current = true;

          const root = rootRef.current;
          if (!root) return;

          const items = root.querySelectorAll('[data-hero]');
          const scribble = root.querySelectorAll('[data-hero-scribble] path');

          gsap.killTweensOf(items);
          gsap.killTweensOf(scribble);
          gsap.set(items, { opacity: 0, y: 14 });

          gsap.fromTo(
            scribble,
            { strokeDashoffset: 420 },
            { strokeDashoffset: 0, duration: 1.15, ease: 'power2.out', delay: 0.35 },
          );

          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.08,
            delay: 0.05,
          });
        }
      },
      { threshold: 0.25 },
    );
    io.observe(section);
    // Prime it on load.
    setTimeout(() => setVisible(true), 120);

    return () => io.disconnect();
  }, []);

  const titleParts = (t.heroTitle || '').split(' ').filter(Boolean);
  const first = titleParts[0] || '';
  const rest = titleParts.slice(1).join(' ');

  return (
    <header
      id="hero"
      className="min-h-[100svh] pt-28 pb-20 px-4 sm:px-6 relative"
    >
      <div ref={rootRef} className="max-w-screen-xl mx-auto relative">
        <div className="absolute -top-24 -left-10 h-64 w-64 rounded-full bg-[color:var(--accent)]/12 blur-3xl pointer-events-none" />
        <div className="absolute top-10 -right-10 h-72 w-72 rounded-full bg-[color:var(--accent-3)]/10 blur-3xl pointer-events-none" />

        <div
          className={`grid lg:grid-cols-12 gap-6 lg:gap-8 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="lg:col-span-7 panel px-6 py-7 sm:px-10 sm:py-10 md:px-12 md:py-12 relative overflow-hidden">
            <div data-hero className="flex flex-wrap items-center gap-2">
              <span className="chip border-transparent bg-[color:var(--accent)]/14">
                {t.heroKicker || 'creative developer'}
              </span>
              <span className="chip border-transparent bg-[color:var(--accent-3)]/10">
                {t.heroKicker2 || 'student / builder'}
              </span>
            </div>

            <p data-hero className="mt-4 font-handwriting text-[color:var(--muted)] text-xl sm:text-2xl -rotate-1">
              {t.heroIntro || 'Welcome to'}
            </p>

            <h1 data-hero className="mt-3 font-display font-black tracking-tight leading-[0.9] text-5xl sm:text-6xl md:text-7xl">
              <span className="block">{first}</span>
              <span className="block">
                <span className="bg-gradient-to-r from-[color:var(--accent)] via-[color:var(--accent-3)] to-[color:var(--accent-2)] text-transparent bg-clip-text">
                  {rest || first}
                </span>
              </span>
            </h1>

            <div className="mt-3 max-w-2xl">
              <svg
                data-hero-scribble
                className="w-full max-w-[440px]"
                viewBox="0 0 440 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M8 40C62 20 126 50 176 34C226 18 258 10 308 22C358 34 390 44 432 26"
                  stroke="rgba(236, 72, 153, 0.9)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="420"
                  strokeDashoffset="420"
                />
              </svg>
            </div>

            <p data-hero className="mt-5 max-w-2xl text-[color:var(--muted)] text-base sm:text-lg leading-relaxed">
              {t.heroText}
            </p>

            <div data-hero className="mt-7 flex flex-wrap items-center gap-3">
              <a href="#work" className="btn btn-primary">
                {t.work || 'Work'}
                <span aria-hidden>-&gt;</span>
              </a>
              <a href="#about" className="btn btn-ghost">
                {t.about || 'About'}
              </a>
              <a href="#chat" className="btn btn-ghost">
                {t.chat || 'Chat'}
              </a>
            </div>

            <div data-hero className="mt-10 flex items-center justify-between gap-4">
              <div className="h-px w-full bg-[color:var(--line)]" />
              <div className="font-handwriting text-[color:var(--muted)] text-lg whitespace-nowrap">
                scroll
              </div>
              <div className="h-px w-full bg-[color:var(--line)]" />
            </div>
          </div>

          <aside className="lg:col-span-5 rounded-[var(--radius)] border border-[color:var(--line)] bg-[color:var(--ink)] text-[color:var(--paper)] px-6 py-7 sm:px-8 sm:py-9 relative overflow-hidden">
            <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-[color:var(--accent)]/25 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-[color:var(--accent-3)]/18 blur-3xl pointer-events-none" />

            <p data-hero className="text-xs uppercase tracking-[0.24em] text-white/70 font-semibold">
              {t.heroSideKicker || 'Currently'}
            </p>
            <h2 data-hero className="mt-2 font-display font-black tracking-tight text-3xl">
              {t.heroSideTitle || 'Building things with taste.'}
            </h2>
            <p data-hero className="mt-3 text-sm leading-relaxed text-white/75">
              {t.heroSideText || 'I like clean UI, bold concepts, and projects that actually ship.'}
            </p>

            <div data-hero className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4">
                <p className="text-xs text-white/60 font-semibold">Focus</p>
                <p className="mt-1 font-semibold">Frontend + Product</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4">
                <p className="text-xs text-white/60 font-semibold">Vibe</p>
                <p className="mt-1 font-semibold">Pink, playful, precise</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4 col-span-2">
                <p className="text-xs text-white/60 font-semibold">Stack</p>
                <p className="mt-1 font-semibold">React, Tailwind, Supabase, Node</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </header>
  );
}

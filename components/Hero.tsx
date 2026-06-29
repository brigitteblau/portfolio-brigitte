'use client';

import { useEffect, useRef, useState } from 'react';

const photos = ['/1.jpeg', '/2.jpeg', '/5.jpeg', '/8.jpeg', '/9.jpeg', '/10.jpeg'];

const layout = [
  { x: -35, y: -16, r: -12, s: 0.78 },
  { x: 34,  y: -14, r: 8,   s: 0.68 },
  { x: -14, y: 20,  r: 7,   s: 0.72 },
  { x: 38,  y: 25,  r: -7,  s: 0.62 },
  { x: -48, y: 24,  r: 10,  s: 0.58 },
  { x: 5,   y: -28, r: -4,  s: 0.55 },
];

// Velocidades distintas → sensación de profundidad (parallax real)
const speeds = [0.9, 1.2, 0.7, 1.4, 0.85, 1.1];

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = Math.max(1, window.innerHeight * 1.55);
        setProgress(easeInOutCubic(Math.min(1, window.scrollY / max)));
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return progress;
}

function FloatingPhoto({
  src,
  index,
  progress,
}: {
  src: string;
  index: number;
  progress: number;
}) {
  const item = layout[index];

  const fallY   = item.y + speeds[index] * progress * 165;
  const rotate  = item.r + progress * 16;
  const scale   = item.s + progress * 0.1;
  // Fade más gradual: las fotos siguen visibles mientras caen, sin corte brusco.
  const opacity = Math.max(0, 1 - Math.pow(progress, 1.5) * 1.05);

  return (
    <img
      className="floating-photo"
      src={src}
      alt=""
      style={
        {
          '--x': `${item.x}vw`,
          '--y': `${fallY}vh`,
          '--r': `${rotate}deg`,
          '--s': scale,
          opacity,
        } as React.CSSProperties
      }
    />
  );
}

export default function Hero({ dict }: { dict: any }) {
  const progress = useScrollProgress();

  return (
    <section id="top" className="hero-wrap">
      <div className="hero-sticky">
        <div className="grain" />

        <div className="photo-field">
          {photos.map((src, i) => (
            <FloatingPhoto key={src} src={src} index={i} progress={progress} />
          ))}
        </div>

        <div
          className="hero-copy"
          style={{ transform: `translateY(${-progress * 24}px)` }}
        >
          <p className="kicker">{dict.hero.eyebrow}</p>

          <h1 className="hero-title">{dict.hero.title}</h1>

          <p className="hero-line">{dict.hero.text}</p>
        </div>

        <div className="hero-scroll" aria-hidden>
          <span className="hero-scroll-dot" />
        </div>
      </div>
    </section>
  );
}
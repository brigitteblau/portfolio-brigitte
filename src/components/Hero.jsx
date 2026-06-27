import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles, ArrowDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PHOTOS = [
  '/img/1.JPG',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg',
];

const LAYOUT = [
  { x: -38, y: -18, r: -13, s: 0.78 },
  { x: 34, y: -16, r: 9, s: 0.68 },
  { x: -14, y: 19, r: 8, s: 0.72 },
  { x: 43, y: 23, r: -7, s: 0.62 },
  { x: -48, y: 24, r: 12, s: 0.58 },
  { x: 9, y: -28, r: -4, s: 0.56 },
  { x: 0, y: 31, r: 3, s: 0.66 },
  { x: -58, y: -2, r: 5, s: 0.53 },
  { x: 56, y: 1, r: -10, s: 0.52 },
];

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, window.innerHeight * 1.6);
      setProgress(Math.min(1, window.scrollY / max));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return progress;
}

function FloatingPhoto({ src, index, progress }) {
  const layout = useMemo(() => LAYOUT[index] || LAYOUT[0], [index]);
  const fall = 130 + index * 16;
  const opacity = Math.max(0.16, 1 - progress * 0.7);
  const scale = layout.s + progress * 0.18;

  return (
    <img
      className="floating-photo"
      src={src}
      alt="Brigitte — nota visual"
      loading="lazy"
      style={{
        '--x': `${layout.x}vw`,
        '--y': `${layout.y + progress * fall}vh`,
        '--r': `${layout.r + progress * 25}deg`,
        '--s': scale,
        opacity,
      }}
    />
  );
}

export default function Hero() {
  const { t } = useLanguage();
  const progress = useScrollProgress();

  return (
    <section className="hero-wrap" id="hero">
      <div className="hero-sticky">
        <div className="grain" />

        <div className="photo-field">
          {PHOTOS.map((src, i) => (
            <FloatingPhoto src={src} index={i} progress={progress} key={src} />
          ))}
        </div>

        <div
          className="hero-copy"
          style={{ transform: `translateY(${-progress * 26}px)` }}
        >
          <p className="hero-eyebrow">
            <Sparkles size={15} /> {t.heroEyebrow}
          </p>
          <h1 className="hero-name">
            {t.heroFirst}
            <br />
            {t.heroLast}
          </h1>
          <p className="hero-line">{t.heroLine}</p>
        </div>

        <div className="scroll-note">
          <ArrowDown size={15} /> {t.heroScroll}
        </div>
      </div>
    </section>
  );
}

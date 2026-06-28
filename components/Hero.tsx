'use client';

import { useEffect, useState } from 'react';

const photos = [
  { src: '/1.jpeg', className: 'hero-pic hero-pic-1' },
  { src: '/4.jpeg', className: 'hero-pic hero-pic-2' },
  { src: '/8.jpeg', className: 'hero-pic hero-pic-3' },
  { src: '6.jpeg', className: 'hero-pic hero-pic-4' },
];

export default function Hero({ dict }: any) {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScroll(Math.min(window.scrollY, 900));
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update);
    };
  }, []);

  return (
    <section id="top" className="hero-section">
      <div className="hero-sticky">
        <div className="hero-photo-layer">
          {photos.map((photo, index) => (
            <img
              key={photo.src}
              src={photo.src}
              alt=""
              className={photo.className}
              style={{
                transform: `translate3d(0, ${scroll * (0.12 + index * 0.035)}px, 0) rotate(${[-8, 6, 5, -6][index]}deg)`,
              }}
            />
          ))}
        </div>

        <div className="hero-content">
          <p className="kicker">{dict.hero.eyebrow}</p>

          <h1 className="hero-title">
            {dict.hero.title}
          </h1>

          <p className="hero-text">
            {dict.hero.text}
          </p>
        </div>
      </div>
    </section>
  );
}
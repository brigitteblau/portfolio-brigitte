import React, { useEffect, useRef, useState } from 'react';

// Subtle photos that keep drifting down the page as you scroll —
// the hero's falling photos "continue" into the rest of the site.
const DRIFTERS = [
  { src: '/img/2.jpg', x: 4, base: 8, speed: 0.12, rot: -8 },
  { src: '/img/8.jpg', x: 86, base: 22, speed: 0.18, rot: 6 },
  { src: '/img/5.jpg', x: 90, base: 58, speed: 0.1, rot: -5 },
  { src: '/img/9.jpg', x: 2, base: 64, speed: 0.16, rot: 9 },
  { src: '/img/10.jpg', x: 80, base: 86, speed: 0.13, rot: -7 },
  { src: '/img/3.jpg', x: 6, base: 40, speed: 0.2, rot: 5 },
];

export default function PhotoRain() {
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="photo-rain" ref={ref} aria-hidden>
      {DRIFTERS.map((d, i) => (
        <img
          key={i}
          src={d.src}
          alt=""
          loading="lazy"
          style={{
            left: `${d.x}%`,
            top: `${d.base}%`,
            transform: `translateY(${scrollY * d.speed}px) rotate(${d.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}

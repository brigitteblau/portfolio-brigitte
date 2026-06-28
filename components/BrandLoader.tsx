'use client';

import { useEffect, useState } from 'react';

export default function BrandLoader() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setGone(true), 2600);
    return () => clearTimeout(timer);
  }, []);

  if (gone) return null;

  const name = 'Brigitte Blau';

  return (
    <div className="brand-loader" aria-hidden>
      <div>
        <div className="brand-loader-name">
          {name.split('').map((char, index) => (
            <span
              key={index}
              style={{ animationDelay: `${0.15 + index * 0.045}s` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
        <div className="brand-loader-line" />
      </div>
    </div>
  );
}
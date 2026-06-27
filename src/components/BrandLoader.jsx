import React, { useEffect, useState } from 'react';

// Initial loader: reveals "Brigitte Blau" then fades out.
export default function BrandLoader() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setGone(true), 2800);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  const name = 'Brigitte Blau';
  return (
    <div className="brand-loader" aria-hidden>
      <div>
        <div className="brand-loader__name">
          {name.split('').map((ch, i) => (
            <span
              key={i}
              style={{ animationDelay: `${0.2 + i * 0.045}s` }}
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </div>
        <div className="brand-loader__bar" />
      </div>
    </div>
  );
}

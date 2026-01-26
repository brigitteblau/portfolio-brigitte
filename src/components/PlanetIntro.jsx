// components/PlanetIntro.jsx
import React, { useEffect, useState } from 'react';

export default function PlanetIntro() {
  const [show, setShow] = useState(true);
  const [opacity, setOpacity] = useState(1);
  
  useEffect(() => {
    // Start fade out after 2 seconds
    const fadeTimer = setTimeout(() => setOpacity(0), 1000);
    // Hide component after fade completes
    const hideTimer = setTimeout(() => setShow(false), 2000);
    
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);
  
  if (!show) return null;
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-1000"
      style={{ opacity }}
    >
      <div className="absolute inset-0 bg-[color:var(--paper)]" />
      <div className="relative text-center panel px-8 py-7">
        <div className="mx-auto h-12 w-12 rounded-full border-4 border-[color:var(--line)] border-t-[color:var(--accent)] animate-spin" />
        <p className="mt-4 text-sm font-semibold tracking-wide text-[color:var(--muted)]">
          Loading the good stuff...
        </p>
      </div>
    </div>
  );
}

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
      className="fixed inset-0 bg-pink-50 flex items-center justify-center z-50 transition-opacity duration-1000"
      style={{ opacity }}
    >
      <div className="text-center">
        <div className="w-32 h-32 mx-auto animate-spin-slow rounded-full border-4 border-pink-400 border-t-transparent"></div>
        <p className="mt-4 text-pink-500 font-medium">Entering space...</p>
      </div>
    </div>
  );
}
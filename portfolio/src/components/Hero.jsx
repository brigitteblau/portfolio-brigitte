// components/Hero.jsx
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const section = document.getElementById('hero');
      const rect = section.getBoundingClientRect();
      setVisible(rect.top < window.innerHeight && rect.bottom > 0);
    };

    window.addEventListener('scroll', onScroll);
    onScroll(); // trigger once
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      id="hero"
      className={`h-screen pt-32 pb-20 px-4 text-center relative transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <p className="text-lg text-neutral-600 max-w-xl mx-auto mb-8">
        {t.heroText}
      </p>

      <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] font-black tracking-tight">
        <span className="block">{t.heroTitle.split(' ')[0]}</span>
        <span className="block bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
          {t.heroTitle.split(' ')[1]}
        </span>
      </h1>
    </header>
  );
}

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['work', 'story', 'chat'];
      const scrollPos = window.scrollY + window.innerHeight / 2;

      let found = false;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            found = true;
            break;
          }
        }
      }

      if (!found && window.scrollY < 200) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-20 transition-all duration-300 flex justify-center items-center h-20 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : ''
      }`}
    >
      <ul className="flex gap-6 px-8 py-2 bg-black/90 rounded-full text-white text-sm font-medium">
        <li>
          <a
            href="#"
            className={`px-4 py-1 rounded-full transition-colors ${
              activeSection === '' ? 'bg-pink-400 text-black' : 'hover:text-pink-300'
            }`}
          >
            {t.hey}
          </a>
        </li>
        <li>
          <a
            href="#work"
            className={`px-4 py-1 rounded-full transition-colors ${
              activeSection === 'work' ? 'bg-pink-400 text-black' : 'hover:text-pink-300'
            }`}
          >
            {t.work}
          </a>
        </li>
        <li>
          <a
            href="#story"
            className={`px-4 py-1 rounded-full transition-colors ${
              activeSection === 'story' ? 'bg-pink-400 text-black' : 'hover:text-pink-300'
            }`}
          >
            {t.story}
          </a>
        </li>
        <li>
          <a
            href="#chat"
            className={`px-4 py-1 rounded-full transition-colors ${
              activeSection === 'chat' ? 'bg-pink-400 text-black' : 'hover:text-pink-300'
            }`}
          >
            {t.chat}
          </a>
        </li>
      </ul>

      {/* Selector de idioma */}
      <div className="fixed bottom-4 right-4 flex gap-2 text-xl">
        <button
          onClick={() => setLang('es')}
          className={`hover:scale-110 transition-transform ${
            lang === 'es' ? 'opacity-100' : 'opacity-60'
          }`}
        >
          🇪🇸
        </button>
        <button
          onClick={() => setLang('en')}
          className={`hover:scale-110 transition-transform ${
            lang === 'en' ? 'opacity-100' : 'opacity-60'
          }`}
        >
          🇬🇧
        </button>
      </div>
    </nav>
  );
}

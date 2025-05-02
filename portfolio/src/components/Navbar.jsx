import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
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

  const navLinks = [
    { id: '', label: t.hey, href: '#' },
    { id: 'work', label: t.work, href: '#work' },
    { id: 'story', label: t.story, href: '#story' },
    { id: 'chat', label: t.chat, href: '#chat' },
  ];

  return (
    <>
      {/* NAV DESKTOP */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 justify-center items-center h-20 pointer-events-none">
        <ul className="pointer-events-auto flex gap-6 px-8 py-2 bg-black/90 rounded-full text-white text-sm font-medium">
          {navLinks.map(({ id, label, href }) => (
            <li key={id}>
              <a
                href={href}
                className={`px-4 py-1 rounded-full transition-colors ${
                  activeSection === id
                    ? 'bg-pink-400 text-black'
                    : 'hover:text-pink-300'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        
        {/* DESKTOP LANGUAGE FLAGS */}
        <div className="pointer-events-auto absolute right-4 flex gap-2 text-xl">
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

      {/* NAV MOBILE */}
      <nav className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl h-14 bg-black/90 rounded-full flex items-center justify-end px-5 text-gray-400 shadow-lg transition-all duration-300">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 text-gray-400 transition-all hover:text-pink-400"
        >
          <span className="text-base">Menu</span>
          {mobileOpen ? (
            <X className="w-6 h-6 transition-all duration-300 text-pink-400" />
          ) : (
            <div className="w-6 h-6 relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
                <path 
                  d="M3 6C3 6 5 5.5 8 6C11 6.5 13 7 16 6.5C19 6 21 5 21 5" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
                <path 
                  d="M3 12C3 12 5 11.5 8 12C11 12.5 13 13 16 12.5C19 12 21 11 21 11" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
                <path 
                  d="M3 18C3 18 5 17.5 8 18C11 18.5 13 19 16 18.5C19 18 21 17 21 17" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </button>
      </nav>

      {/* MOBILE DROPDOWN MENU */}
      {mobileOpen && (
        <div className="md:hidden fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-black/90 text-white py-4 flex flex-col items-center gap-3 z-40 rounded-xl shadow-xl transition-all duration-300">
          {navLinks.map(({ id, label, href }) => (
            <a
              key={id}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`text-base px-4 py-2 rounded-full transition-all duration-200 ${
                activeSection === id
                  ? 'bg-pink-400 text-black'
                  : 'hover:text-pink-300'
              }`}
            >
              {label}
            </a>
          ))}
          
          {/* MOBILE LANGUAGE FLAGS */}
          <div className="flex gap-4 mt-2 pt-3 border-t border-gray-700 w-4/5">
            <button
              onClick={() => setLang('es')}
              className={`hover:scale-110 transition-transform text-xl ${
                lang === 'es' ? 'opacity-100' : 'opacity-60'
              }`}
            >
              🇪🇸
            </button>
            <button
              onClick={() => setLang('en')}
              className={`hover:scale-110 transition-transform text-xl ${
                lang === 'en' ? 'opacity-100' : 'opacity-60'
              }`}
            >
              🇬🇧
            </button>
          </div>
        </div>
      )}
    </>
  );
}
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { X } from 'lucide-react';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';

  // Scroll-spy only runs on the home page (sections only exist there).
  useEffect(() => {
    if (!onHome) {
      setActiveSection('');
      return undefined;
    }
    const handleScroll = () => {
      const sections = ['estudios', 'archivo', 'chat'];
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
      if (!found && window.scrollY < 200) setActiveSection('');
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onHome]);

  // Smooth-scroll to a section, navigating to home first if needed.
  const goToSection = (id) => (e) => {
    e.preventDefault();
    setMobileOpen(false);
    const scroll = () => {
      if (!id) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    if (onHome) {
      scroll();
    } else {
      navigate('/');
      setTimeout(scroll, 80);
    }
  };

  const sectionLinks = [
    { key: 'home', id: '', label: t.hey },
    { key: 'estudios', id: 'estudios', label: t.studies },
    { key: 'proyectos', id: 'archivo', label: t.work },
    { key: 'journal', id: 'archivo', label: t.journal },
  ];
  const tailLinks = [{ key: 'chat', id: 'chat', label: t.chat }];

  const linkClass = (active) =>
    `px-4 py-2 rounded-full transition-colors ${
      active
        ? 'bg-[color:var(--ink)] text-[color:var(--paper)]'
        : 'text-[color:var(--ink)] hover:bg-[color:var(--cream)]/70'
    }`;

  return (
    <>
      {/* NAV DESKTOP */}
      <nav className="hidden md:flex fixed top-5 left-0 right-0 z-50 justify-center items-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3 panel px-3 py-2">
          <ul className="flex gap-1 text-sm font-semibold items-center">
            {[...sectionLinks, ...tailLinks].map(({ key, id, label }) => (
              <li key={key}>
                <a href={`/#${id}`} onClick={goToSection(id)} className={linkClass(onHome && activeSection === id)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* DESKTOP LANGUAGE */}
          <div className="ml-2 flex items-center gap-1 rounded-full border border-[color:var(--line)] bg-[color:var(--cream)]/50 p-1">
            {['es', 'en'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  lang === code
                    ? 'bg-[color:var(--accent)] text-white'
                    : 'text-[color:var(--muted)] hover:bg-[color:var(--cream)]/70'
                }`}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* NAV MOBILE */}
      <nav className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl h-14 panel flex items-center justify-between px-4 transition-all duration-300">
        <Link to="/" className="font-display font-semibold tracking-tight text-lg">
          Brigitte
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 transition-all text-[color:var(--ink)]"
        >
          <span className="text-sm font-semibold">Menu</span>
          {mobileOpen ? (
            <X className="w-6 h-6 transition-all duration-300 text-[color:var(--accent)]" />
          ) : (
            <div className="w-6 h-6 relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[color:var(--ink)]">
                <path d="M3 6C3 6 5 5.5 8 6C11 6.5 13 7 16 6.5C19 6 21 5 21 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 12C3 12 5 11.5 8 12C11 12.5 13 13 16 12.5C19 12 21 11 21 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 18C3 18 5 17.5 8 18C11 18.5 13 19 16 18.5C19 18 21 17 21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </button>
      </nav>

      {/* MOBILE DROPDOWN MENU */}
      {mobileOpen && (
        <div className="md:hidden fixed top-20 left-1/2 -translate-x-1/2 w-[92%] max-w-2xl panel py-3 flex flex-col items-stretch gap-1 z-40 transition-all duration-300">
          {[...sectionLinks, ...tailLinks].map(({ key, id, label }) => (
            <a
              key={key}
              href={`/#${id}`}
              onClick={goToSection(id)}
              className={`text-sm px-4 py-3 rounded-2xl transition-all duration-200 font-semibold ${
                onHome && activeSection === id
                  ? 'bg-[color:var(--ink)] text-[color:var(--paper)]'
                  : 'text-[color:var(--ink)] hover:bg-[color:var(--cream)]/70'
              }`}
            >
              {label}
            </a>
          ))}

          {/* MOBILE LANGUAGE */}
          <div className="flex gap-2 mt-2 pt-3 border-t border-[color:var(--line)]">
            {['es', 'en'].map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`btn flex-1 px-3 py-2 text-xs border border-[color:var(--line)] ${
                  lang === code
                    ? 'bg-[color:var(--accent)] text-white'
                    : 'bg-[color:var(--cream)]/50 text-[color:var(--muted)]'
                }`}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

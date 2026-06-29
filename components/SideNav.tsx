'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SideNav({ dict, lang }: any) {
  const [active, setActive] = useState('top');
  const nextLang = lang === 'es' ? 'en' : 'es';

  const links: [string, string][] = [
    ['work', dict.nav.work],
    ['about', dict.nav.about],
    ['studies', 'studies'],
    ['journal', dict.nav.journal],
    ['contact', dict.nav.contact],
  ];

  useEffect(() => {
    const ids = ['top', ...links.map(([id]) => id)];
    const onScroll = () => {
      const current = ids.findLast((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        return el.getBoundingClientRect().top <= window.innerHeight * 0.35;
      });
      if (current) setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const NavItem = ({ id, label }: { id: string; label: string }) =>
    id === 'journal' ? (
      <Link href={`/${lang}/journal`} className="nav-link">
        {label}
        <span />
      </Link>
    ) : (
      <a href={`#${id}`} className={`nav-link ${active === id ? 'is-active' : ''}`}>
        {label}
        <span />
      </a>
    );

  return (
    <>
      {/* DESKTOP — vertical side nav */}
      <nav className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex">
        <a href="#top" className={`nav-link ${active === 'top' ? 'is-active' : ''}`}>
          Brigitte
        </a>
        {links.map(([id, label]) => (
          <NavItem key={id} id={id} label={label} />
        ))}
        <Link
          href={`/${nextLang}`}
          className="mt-5 text-[11px] font-bold uppercase tracking-[0.24em] text-neutral-400 hover:text-neutral-900"
        >
          {dict.nav.switch}
        </Link>
      </nav>

      {/* MOBILE — top bar, mismo formato minimalista que la compu */}
      <nav className="mobile-nav md:hidden">
        <a href="#top" className="mobile-nav-brand">
          Brigitte
        </a>
        <div className="mobile-nav-links">
          {links.map(([id, label]) =>
            id === 'journal' ? (
              <Link key={id} href={`/${lang}/journal`} className="nav-link">
                {label}
              </Link>
            ) : (
              <a key={id} href={`#${id}`} className={`nav-link ${active === id ? 'is-active' : ''}`}>
                {label}
              </a>
            ),
          )}
          <Link href={`/${nextLang}`} className="nav-link mobile-nav-lang">
            {dict.nav.switch}
          </Link>
        </div>
      </nav>
    </>
  );
}

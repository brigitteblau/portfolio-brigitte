'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SideNav({ dict, lang }: any) {
  const [active, setActive] = useState('top');
  const nextLang = lang === 'es' ? 'en' : 'es';

  const links = [
    ['work', dict.nav.work],
    ['about', dict.nav.about],
    ['studies', lang === 'es' ? 'studies' : 'studies'],
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

  return (
    <nav className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex">
      <a
        href="#top"
        className={`nav-link ${active === 'top' ? 'is-active' : ''}`}
      >
        Brigitte
      </a>

      {links.map(([id, label]) => (
        <a
          key={id}
          href={`#${id}`}
          className={`nav-link ${active === id ? 'is-active' : ''}`}
        >
          {label}
          <span />
        </a>
      ))}

      <Link href={`/${nextLang}`} className="mt-5 text-[11px] font-bold uppercase tracking-[0.24em] text-neutral-400 hover:text-neutral-900">
        {dict.nav.switch}
      </Link>
    </nav>
  );
}
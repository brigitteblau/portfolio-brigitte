'use client';

import { useLayoutEffect, useRef, useState } from 'react';

type Props = {
  children: React.ReactNode;
  i?: number;
  className?: string;
  as?: 'div' | 'li' | 'article' | 'section' | 'span';
};

// Framer-like reveal on scroll. Content is visible by default; only items that
// start below the fold get "armed" (hidden) and then fade up as you scroll to
// them. If JS never runs, nothing is hidden — content is always shown.
export default function Reveal({ children, i = 0, className = '', as = 'div' }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    const top = el.getBoundingClientRect().top;

    // If viewport is unknown (0) or the element is already in view → stay
    // visible (never hide content we can't prove is below the fold).
    if (!vh || top < vh * 0.92) {
      return;
    }

    // Below the fold → hide it now (before paint) and reveal on scroll.
    setArmed(true);
    let raf = 0;
    let done = false;
    const check = () => {
      if (done) return;
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0) {
        done = true;
        setShown(true);
        cleanup();
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };
    const cleanup = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return cleanup;
  }, []);

  const Tag = as as any;
  return (
    <Tag
      ref={ref}
      data-armed={armed ? 'true' : undefined}
      className={`reveal ${shown ? 'is-in' : ''} ${className}`}
      style={{ ['--i' as any]: i }}
    >
      {children}
    </Tag>
  );
}

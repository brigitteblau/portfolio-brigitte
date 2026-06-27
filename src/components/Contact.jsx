import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { Github, Instagram, Linkedin, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TO_EMAIL = 'brigitteyaelblau@gmail.com';

const SOCIALS = [
  { Icon: Github, href: 'https://github.com/brigitteblau', label: 'GitHub' },
  { Icon: Instagram, href: 'https://instagram.com/brigitteblau', label: 'Instagram' },
  { Icon: Linkedin, href: 'https://ar.linkedin.com/in/brigitte-blau-17567835b', label: 'LinkedIn' },
];

export default function Contact() {
  const { t } = useLanguage();
  const rootRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || hasAnimatedRef.current) continue;
          hasAnimatedRef.current = true;
          const items = root.querySelectorAll('[data-contact]');
          gsap.set(items, { opacity: 0, y: 16 });
          gsap.to(items, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.07 });
        }
      },
      { threshold: 0.2 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  const mailtoHref = useMemo(() => {
    const subject = form.name ? `Portfolio · ${form.name}` : 'Portfolio · contacto';
    const body = [`Nombre: ${form.name || '-'}`, `Email: ${form.email || '-'}`, '', form.message || ''].join('\n');
    return `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [form]);

  const onSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    window.location.href = mailtoHref;
    window.setTimeout(() => setStatus('idle'), 600);
  };

  const inputClass =
    'w-full bg-transparent border-b border-white/25 focus:border-[color:var(--ochre)] outline-none py-2.5 text-white placeholder:text-white/40 font-medium transition-colors';

  return (
    <section id="chat" className="px-4 sm:px-6 py-16 sm:py-24 relative z-10">
      <div ref={rootRef} className="max-w-screen-xl mx-auto">
        <div
          className="rounded-[28px] overflow-hidden border border-black/20 shadow-[0_40px_120px_rgba(34,26,18,0.4)] px-6 py-10 sm:px-12 sm:py-14 relative"
          style={{
            background:
              'radial-gradient(120% 120% at 0% 0%, rgba(154,90,42,0.5), transparent 55%), radial-gradient(120% 120% at 100% 100%, rgba(124,43,37,0.55), transparent 55%), linear-gradient(160deg, #2b2519, #211a12 60%, #3a3d2c)',
          }}
        >
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <span data-contact className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 font-mono-label text-[11px] text-[color:var(--ochre)]">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {t.openToWork}
              </span>
              <h2 data-contact className="font-imposing text-white text-5xl sm:text-6xl mt-5 leading-[0.95]">
                {t.contactTitle}
              </h2>
              <p data-contact className="mt-5 text-white/70 text-lg leading-relaxed max-w-md">
                {t.contactLead}
              </p>

              <div data-contact className="mt-8 flex items-center gap-3">
                {SOCIALS.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="h-12 w-12 grid place-items-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <form onSubmit={onSubmit} className="grid gap-6">
              <div data-contact>
                <label className="block font-mono-label text-[11px] text-white/50 mb-1">{t.contactNameLabel}</label>
                <input className={inputClass} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder={t.contactNamePlaceholder} autoComplete="name" />
              </div>
              <div data-contact>
                <label className="block font-mono-label text-[11px] text-white/50 mb-1">{t.contactEmailLabel}</label>
                <input className={inputClass} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder={t.contactEmailPlaceholder} autoComplete="email" inputMode="email" />
              </div>
              <div data-contact>
                <label className="block font-mono-label text-[11px] text-white/50 mb-1">{t.contactMessageLabel || 'Mensaje'}</label>
                <textarea className={`${inputClass} resize-none h-28`} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} placeholder={t.contactMessagePlaceholder} />
              </div>
              <button
                data-contact
                type="submit"
                disabled={status === 'sending'}
                className="justify-self-start inline-flex items-center gap-2 rounded-full bg-[color:var(--ochre)] text-[color:var(--ink)] font-bold px-7 py-3.5 hover:brightness-110 transition"
              >
                {t.contactSend}
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

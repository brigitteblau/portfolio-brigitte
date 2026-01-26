import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { Github, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TO_EMAIL = 'brigitteblau20@gmail.com';

export default function Contact() {
  const { t } = useLanguage();
  const rootRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (hasAnimatedRef.current) continue;
          hasAnimatedRef.current = true;

          const items = root.querySelectorAll('[data-contact]');
          gsap.set(items, { opacity: 0, y: 14 });
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            stagger: 0.08,
          });
        }
      },
      { threshold: 0.2 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  const mailtoHref = useMemo(() => {
    const subject = form.name
      ? `Portfolio contact - ${form.name}`
      : 'Portfolio contact';
    const body = [
      `Name: ${form.name || '-'}`,
      `Email: ${form.email || '-'}`,
      '',
      form.message || '',
    ].join('\n');

    return `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [form.email, form.message, form.name]);

  const onSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    // mailto: is the simplest zero-backend option.
    window.location.href = mailtoHref;
    window.setTimeout(() => setStatus('idle'), 600);
  };

  return (
    <section id="chat" className="px-4 sm:px-6 py-16 sm:py-24">
      <div ref={rootRef} className="max-w-screen-xl mx-auto">
        <div className="rounded-[var(--radius)] overflow-hidden border border-[color:var(--line)] shadow-[0_28px_90px_rgba(12,15,20,0.16)]">
          <div className="bg-[#3b4454] text-white px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p data-contact className="font-handwriting text-white/80 text-2xl sm:text-3xl -rotate-1 font-bold">
                  {t.contactPrompt || 'Let’s talk'}
                </p>
                <h2 data-contact className="mt-2 font-display text-3xl sm:text-4xl font-black tracking-tight">
                  {t.contactTitle || 'Send me your idea.'}
                </h2>
              </div>

              <div data-contact className="flex items-center gap-3">
                <a
                  href="https://github.com/brigitteblau"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost px-4 py-3 border-white/20 text-white bg-white/5 hover:bg-white/10"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com/brigitteblau"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost px-4 py-3 border-white/20 text-white bg-white/5 hover:bg-white/10"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://ar.linkedin.com/in/brigitte-blau-17567835b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost px-4 py-3 border-white/20 text-white bg-white/5 hover:bg-white/10"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-8 grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              <div className="lg:col-span-5">
                <label data-contact className="block text-white/55 text-sm font-semibold">
                  {t.contactNameLabel || 'Name'}
                </label>
                <input
                  data-contact
                  className="field"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder={t.contactNamePlaceholder || 'Your name'}
                  autoComplete="name"
                />

                <div className="mt-8">
                  <label data-contact className="block text-white/55 text-sm font-semibold">
                    {t.contactEmailLabel || 'Email'}
                  </label>
                  <input
                    data-contact
                    className="field"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder={t.contactEmailPlaceholder || 'you@email.com'}
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>

                <p data-contact className="mt-8 text-xs text-white/55 leading-relaxed">
                  {t.contactHint || 'This opens your email app (no backend yet).'}
                </p>
              </div>

              <div className="lg:col-span-7">
                <div data-contact className="notebook notebook-lines p-4 sm:p-6">
                  <textarea
                    className="w-full h-56 sm:h-64 bg-transparent outline-none resize-none text-[color:var(--ink)] font-semibold leading-[35px] text-lg px-3 py-2"
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder={t.contactMessagePlaceholder || 'Write an interesting project.'}
                  />
                </div>

                <div className="mt-6 flex items-center justify-end">
                  <button
                    data-contact
                    type="submit"
                    className="btn send-btn px-10 py-5"
                    disabled={status === 'sending'}
                  >
                    {t.contactSend || 'Send'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

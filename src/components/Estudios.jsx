import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Estudios() {
  const { t } = useLanguage();
  const education = t.aboutEducation || [];
  const courses = t.aboutCourses || [];
  const traits = t.aboutTraits || [];

  return (
    <section id="estudios" className="px-4 sm:px-6 py-16 sm:py-24 max-w-screen-xl mx-auto relative z-10">
      <p className="font-mono-label text-[12px] text-[color:var(--wine)]">{t.aboutKicker}</p>
      <h2 className="font-imposing text-5xl sm:text-7xl mt-2 uppercase text-[color:var(--ink)]">
        {t.studies || 'Sobre mí'}
      </h2>

      <div className="mt-10 grid lg:grid-cols-12 gap-8 items-start">
        {/* Handwritten note + polaroid */}
        <div className="lg:col-span-6 relative">
          <span className="paperclip" style={{ right: 'auto', left: 28 }} />
          <div className="rounded-sm bg-[#fffdf6] border border-[color:var(--line)] shadow-[0_22px_50px_rgba(16,16,15,0.14)] p-7 sm:p-9 rotate-[-1deg]">
            <p className="font-handwriting text-2xl sm:text-3xl leading-snug text-[color:var(--ink)]">
              {t.aboutText}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {traits.map((x, i) => (
                <span key={i} className="font-mono-label text-[10px] text-[color:var(--wine)]">
                  #{x}
                </span>
              ))}
            </div>
          </div>

          <img
            src="/header/me.png"
            alt="Brigitte"
            className="absolute -bottom-10 right-2 sm:right-8 w-32 sm:w-40 aspect-[4/5] object-cover border-[6px] border-white shadow-[0_18px_40px_rgba(16,16,15,0.22)] rotate-[5deg]"
          />
        </div>

        {/* Studies */}
        <div className="lg:col-span-6">
          <p className="font-mono-label text-[12px] text-[color:var(--muted)]">{t.aboutEduTitle}</p>
          <div className="mt-4 divide-y divide-[color:var(--line)] border-y border-[color:var(--line)]">
            {education.map((item, i) => (
              <div key={i} className="py-4 flex items-baseline gap-4">
                <span className="font-mono-label text-[11px] text-[color:var(--wine)] w-24 flex-shrink-0">
                  {item.when}
                </span>
                <div>
                  <h4 className="font-imposing text-xl text-[color:var(--ink)]">{item.title}</h4>
                  {item.place && (
                    <p className="text-sm text-[color:var(--muted)]">{item.place}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="font-mono-label text-[12px] text-[color:var(--muted)] mt-8">
            {t.aboutCoursesTitle}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {courses.map((c, i) => (
              <span
                key={i}
                className="text-sm font-semibold rounded-full border border-[color:var(--line)] bg-[color:var(--cream)]/70 px-3 py-1.5 text-[color:var(--ink)]"
              >
                {c}
              </span>
            ))}
          </div>

          <a href="#chat" className="btn btn-primary mt-8">
            {t.aboutCta}
          </a>
        </div>
      </div>
    </section>
  );
}

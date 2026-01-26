import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  const traits = t.aboutTraits || [];
  const education = t.aboutEducation || [];
  const courses = t.aboutCourses || [];

  return (
    <section id="about" className="px-4 sm:px-6 py-14 sm:py-20 max-w-screen-xl mx-auto">
      <div className="panel p-6 sm:p-10 md:p-12">
        <p className="font-handwriting text-[color:var(--muted)] text-2xl sm:text-3xl -rotate-1 font-bold">
          {t.aboutKicker || 'A bit about me'}
        </p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
          {t.aboutTitle || 'Reflective, curious, and a little obsessive about details.'}
        </h2>
        <p className="mt-5 max-w-3xl text-[color:var(--muted)] text-base sm:text-lg leading-relaxed">
          {t.aboutText || 'Add your story here.'}
        </p>

        {traits.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {traits.map((x, i) => (
              <span key={i} className="chip border-transparent bg-[color:var(--accent)]/10">
                {x}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10 grid lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7">
            <h3 className="font-display text-2xl font-black tracking-tight">
              {t.aboutEduTitle || 'Education'}
            </h3>
            <div className="mt-4 grid gap-4">
              {education.map((item, i) => (
                <article
                  key={i}
                  className="rounded-[22px] border border-[color:var(--line)] bg-white/55 backdrop-blur px-5 py-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)] font-semibold">
                        {item.when}
                      </p>
                      <h4 className="mt-1 font-display text-xl font-extrabold tracking-tight">
                        {item.title}
                      </h4>
                      {item.place && (
                        <p className="mt-1 text-sm text-[color:var(--muted)] font-semibold">
                          {item.place}
                        </p>
                      )}
                    </div>
                  </div>
                  {Array.isArray(item.bullets) && item.bullets.length > 0 && (
                    <ul className="mt-3 text-sm text-[color:var(--muted)] leading-relaxed list-disc pl-5">
                      {item.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[var(--radius)] border border-[color:var(--line)] bg-[color:var(--ink)] text-[color:var(--paper)] px-6 py-6 sm:px-7 sm:py-7">
              <h3 className="font-display text-2xl font-black tracking-tight">
                {t.aboutCoursesTitle || 'Extra'}
              </h3>
              <p className="mt-2 text-sm text-white/75 leading-relaxed">
                {t.aboutCoursesText || 'Courses, workshops, and the stuff I learn after hours.'}
              </p>

              <div className="mt-4 grid gap-2">
                {courses.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3"
                  >
                    <p className="text-sm font-semibold">{c}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <a href="#chat" className="btn btn-primary w-full justify-center">
                  {t.aboutCta || 'Let’s build something'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


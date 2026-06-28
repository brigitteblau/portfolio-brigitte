'use client';

import { useState } from 'react';

export default function Journal({ dict, posts, lang }: any) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <section id="journal" className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="kicker">{dict.journal.kicker}</p>
        <h2 className="title">{dict.journal.title}</h2>

        <div className="mt-12 border-t border-neutral-200">
          {posts.length === 0 && (
            <p className="py-7 text-neutral-500">{dict.journal.empty}</p>
          )}

          {posts.slice(0, 8).map((post: any) => {
            const title = lang === 'en' ? post.title_en || post.title_es : post.title_es;
            const summary = lang === 'en' ? post.summary_en || post.summary_es : post.summary_es;
            const body = lang === 'en' ? post.body_en || post.body_es : post.body_es;
            const isOpen = openSlug === post.slug;

            return (
              <article key={post.id} className="journal-item">
                <button
                  type="button"
                  onClick={() => setOpenSlug(isOpen ? null : post.slug)}
                  className="journal-trigger"
                >
                  <div>
                    <p className="journal-date">
                      {new Date(post.date).toLocaleDateString(
                        lang === 'en' ? 'en-US' : 'es-AR'
                      )}
                    </p>

                    <h3 className="journal-title">
                      {title}
                    </h3>

                    {summary && (
                      <p className="journal-summary">{summary}</p>
                    )}
                  </div>

                  <span className="journal-plus">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="journal-body">
                    {post.cover_url && (
                      <img
                        src={post.cover_url}
                        alt=""
                        className="journal-cover"
                      />
                    )}

                    {body ? (
                      <div className="journal-prose">
                        {body.split('\n').map((paragraph: string, index: number) => (
                          paragraph.trim() ? (
                            <p key={index}>{paragraph}</p>
                          ) : null
                        ))}
                      </div>
                    ) : (
                      <p className="text-neutral-500">
                        Esta entrada todavía no tiene cuerpo publicado.
                      </p>
                    )}

                    {post.audio_url && (
                      <audio
                        className="mt-8 w-full"
                        src={post.audio_url}
                        controls
                      />
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
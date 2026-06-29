import Link from 'next/link';
import Reveal from './Reveal';

export default function Journal({ dict, posts, lang }: any) {
  const latest = posts.slice(0, 3);

  return (
    <section id="journal" className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="kicker">{dict.journal.kicker}</p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="title">{dict.journal.title}</h2>
            <Link href={`/${lang}/journal`} className="journal-cta">
              {lang === 'en' ? 'see all the journal' : 'ver todo el journal'} ↗
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 border-t border-neutral-200">
          {latest.length === 0 && (
            <p className="py-7 text-neutral-500">{dict.journal.empty}</p>
          )}

          {latest.map((post: any, i: number) => {
            const title = lang === 'en' ? post.title_en || post.title_es : post.title_es;
            const summary = lang === 'en' ? post.summary_en || post.summary_es : post.summary_es;
            return (
              <Reveal key={post.id} i={i}>
                <Link href={`/${lang}/journal/${post.slug}`} className="journal-item journal-trigger group">
                  <div>
                    <p className="journal-date">
                      {new Date(post.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-AR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                      {post.audio_url ? ' · 🎧' : ''}
                    </p>
                    <h3 className="journal-title">{title}</h3>
                    {summary && <p className="journal-summary">{summary}</p>}
                  </div>
                  <span className="journal-plus">↗</span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

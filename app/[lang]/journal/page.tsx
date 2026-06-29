import Link from 'next/link';
import { getPosts } from '@/lib/entries';
import { getDictionary } from '@/lib/dictionaries';
import Reveal from '@/components/Reveal';

export default async function JournalPage({
  params,
}: {
  params: Promise<{ lang: 'es' | 'en' }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const posts = await getPosts();

  return (
    <main className="px-6 py-16 md:px-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/${lang}`}
          className="text-[11px] font-bold uppercase tracking-[0.24em] text-neutral-500 hover:text-neutral-900"
        >
          ← {lang === 'en' ? 'home' : 'inicio'}
        </Link>

        <Reveal>
          <p className="kicker mt-10">{dict.journal.kicker}</p>
          <h1 className="title">{dict.journal.title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600">
            {lang === 'en'
              ? 'Real notes as they happen. You can read them — and listen to them.'
              : 'Notas reales, a medida que pasan. Podés leerlas y escucharlas.'}
          </p>
        </Reveal>

        <div className="mt-12">
          {posts.length === 0 && (
            <p className="py-10 text-neutral-500">{dict.journal.empty}</p>
          )}

          <div className="grid gap-5">
            {posts.map((post: any, i: number) => {
              const title = lang === 'en' ? post.title_en || post.title_es : post.title_es;
              const summary = lang === 'en' ? post.summary_en || post.summary_es : post.summary_es;
              return (
                <Reveal key={post.id} i={i % 3}>
                  <Link href={`/${lang}/journal/${post.slug}`} className="jcard group">
                    {post.cover_url && (
                      <div className="jcard-cover">
                        <img src={post.cover_url} alt="" />
                      </div>
                    )}
                    <div className="jcard-body">
                      <p className="journal-date">
                        {new Date(post.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-AR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                        {post.audio_url ? ' · 🎧' : ''}
                      </p>
                      <h2 className="jcard-title">{title}</h2>
                      {summary && <p className="jcard-summary">{summary}</p>}
                      <span className="jcard-link">
                        {lang === 'en' ? 'open' : 'abrir'} ↗
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

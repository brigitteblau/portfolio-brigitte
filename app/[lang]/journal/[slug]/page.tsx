import Link from 'next/link';
import { getPostBySlug } from '@/lib/entries';
import ListenButton from '@/components/ListenButton';

export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ lang: 'es' | 'en'; slug: string }>;
}) {
  const { lang, slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <main className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-3xl">
          <Link href={`/${lang}/journal`} className="text-[11px] font-bold uppercase tracking-[0.24em] text-neutral-500 hover:text-neutral-900">
            ← {lang === 'en' ? 'journal' : 'journal'}
          </Link>
          <p className="mt-10 text-neutral-500">
            {lang === 'en' ? "I couldn't find this note." : 'No encontré esta nota.'}
          </p>
        </div>
      </main>
    );
  }

  const title = lang === 'en' ? post.title_en || post.title_es : post.title_es;
  const body = lang === 'en' ? post.body_en || post.body_es : post.body_es;
  const ttsText = [title, body].filter(Boolean).join('. ');

  return (
    <main className="px-6 py-16 md:px-12">
      <article className="mx-auto max-w-3xl">
        <Link
          href={`/${lang}/journal`}
          className="text-[11px] font-bold uppercase tracking-[0.24em] text-neutral-500 hover:text-neutral-900"
        >
          ← {lang === 'en' ? 'back to journal' : 'volver al journal'}
        </Link>

        <p className="journal-date mt-10">
          {new Date(post.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-AR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>

        <h1 className="journal-title mt-3" style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)' }}>
          {title}
        </h1>

        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((t: string) => (
              <span key={t} className="tag">#{t}</span>
            ))}
          </div>
        )}

        {post.cover_url && (
          <img src={post.cover_url} alt="" className="journal-cover mt-8" />
        )}

        <div className="mt-8">
          <ListenButton audioUrl={post.audio_url} text={ttsText} lang={lang} />
        </div>

        {body ? (
          <div className="journal-prose mt-8">
            {body.split('\n').map((p: string, i: number) =>
              p.trim() ? <p key={i}>{p}</p> : null,
            )}
          </div>
        ) : (
          <p className="mt-8 text-neutral-500">
            {lang === 'en' ? 'No text published yet.' : 'Todavía no hay texto publicado.'}
          </p>
        )}

        {post.transcript && (
          <details className="mt-10 rounded-2xl border border-[rgba(33,29,24,0.14)] bg-[rgba(255,252,244,0.6)] p-5">
            <summary className="cursor-pointer text-sm font-bold uppercase tracking-[0.18em]">
              {lang === 'en' ? 'Transcript' : 'Transcripción'}
            </summary>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-neutral-600">
              {post.transcript}
            </p>
          </details>
        )}
      </article>
    </main>
  );
}

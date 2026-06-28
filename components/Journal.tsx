export default function Journal({ dict, posts, lang }: any) {
  return (
    <section id="journal" className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="kicker">{dict.journal.kicker}</p>
        <h2 className="title">{dict.journal.title}</h2>

        <div className="mt-12">
          {posts.length === 0 && (
            <p className="text-neutral-500">{dict.journal.empty}</p>
          )}

          {posts.slice(0, 5).map((post: any) => {
            const title = lang === 'en' ? post.title_en || post.title_es : post.title_es;
            const summary = lang === 'en' ? post.summary_en || post.summary_es : post.summary_es;

            return (
              <article key={post.id} className="border-t border-neutral-200 py-7">
                <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                  {new Date(post.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-AR')}
                </p>

                <h3 className="mt-2 text-3xl font-black tracking-[-0.05em]">
                  {title}
                </h3>

                {summary && (
                  <p className="mt-3 max-w-2xl text-neutral-600">{summary}</p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
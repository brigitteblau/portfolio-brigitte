export default function Work({ dict, projects, lang }: any) {
  return (
    <section id="work" className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="kicker">{dict.work.kicker}</p>
        <h2 className="section-title">{dict.work.title}</h2>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {projects.map((project: any, index: number) => {
            const title = lang === 'en' ? project.title_en || project.title_es : project.title_es;
            const summary = lang === 'en' ? project.summary_en || project.summary_es : project.summary_es;
            const url = project.link || project.github;

            return (
              <article key={project.id} className="project-card">
                <div className="project-image">
                  {project.cover_url ? (
                    <img src={project.cover_url} alt={title} />
                  ) : (
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  )}
                </div>

                <div className="project-content">
                  <div className="flex items-start justify-between gap-5">
                    <span className="project-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="flex flex-wrap justify-end gap-2">
                      {(project.tech ?? []).slice(0, 4).map((tech: string) => (
                        <span key={tech} className="tag">{tech}</span>
                      ))}
                    </div>
                  </div>

                  <h3 className="project-title">
                    {title}
                  </h3>

                  <p className="project-summary">
                    {summary}
                  </p>

                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      className="project-link"
                    >
                      {dict.work.open} ↗
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
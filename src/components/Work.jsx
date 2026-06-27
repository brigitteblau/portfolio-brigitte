import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const GITHUB_USER = "brigitteblau";

export default function Work() {
  const { t } = useLanguage();
  const projects = t.projects || [];
  const [filter, setFilter] = useState("featured");
  const [githubRepos, setGithubRepos] = useState([]);
  const [githubStatus, setGithubStatus] = useState("idle"); // idle | loading | ok | error

  useEffect(() => {
    let cancelled = false;
    setGithubStatus("loading");

    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const cleaned = (Array.isArray(data) ? data : [])
          .filter((r) => r && !r.fork)
          .slice(0, 12);
        setGithubRepos(cleaned);
        setGithubStatus("ok");
      })
      .catch(() => {
        if (cancelled) return;
        setGithubRepos([]);
        setGithubStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const featuredProjects = useMemo(() => {
    if (filter === "live") {
      return projects.filter((p) => p.link && p.link !== "null");
    }
    if (filter === "wip") {
      return projects.filter((p) => p.status);
    }
    return projects;
  }, [filter, projects]);

  const githubProjects = useMemo(() => {
    return githubRepos.map((repo) => ({
      title: repo.name,
      description: repo.description || "No description yet.",
      github: repo.html_url,
      link: repo.homepage && repo.homepage.trim() ? repo.homepage : "null",
      tech: [repo.language].filter(Boolean),
      stars: repo.stargazers_count || 0,
      updatedAt: repo.updated_at,
    }));
  }, [githubRepos]);

  return (
    <section
      className="px-4 sm:px-6 py-14 sm:py-20 max-w-screen-xl mx-auto"
      id="work"
    >
      <p className="text-right text-lg sm:text-2xl font-handwriting italic text-[color:var(--muted)] -mb-2 sm:-mb-3">
        {t.workFrom}
      </p>
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black mb-3 text-center tracking-tight">
        {t.workTitle}
      </h2>
      <p className="text-center text-sm sm:text-base text-[color:var(--muted)] mb-8 sm:mb-10 max-w-2xl mx-auto">
        {t.workSubtitle}
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {[
          { id: "featured", label: t.filterFeatured },
          { id: "github", label: "GitHub" },
          { id: "live", label: t.filterLive },
          { id: "wip", label: t.filterWip },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`btn px-4 py-2 text-xs sm:text-sm border ${
              filter === item.id
                ? "bg-[color:var(--ink)] text-[color:var(--paper)] border-[color:var(--ink)]"
                : "bg-white/50 text-[color:var(--ink)] border-[color:var(--line)] hover:bg-white/70"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {filter !== "github" && (
        <>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-display text-2xl font-black tracking-tight">
              Destacados
            </h3>
            <span className="text-xs font-semibold text-[color:var(--muted)]">
              {featuredProjects.length} proyectos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {featuredProjects.map((project, idx) => {
              const hasLink = project.link && project.link !== "null";
              const hasGithub = project.github && project.github !== "null";
              const url = hasLink ? project.link : hasGithub ? project.github : "";
              const isClickable = Boolean(url);

              return (
                <article key={idx} className="panel p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-2xl border border-[color:var(--line)] bg-white/60 grid place-items-center shadow-sm">
                          <span className="text-lg" aria-hidden>
                            {project.icon}
                          </span>
                        </div>
                        <h4 className="font-display text-xl font-extrabold tracking-tight truncate">
                          {project.title}
                        </h4>
                      </div>
                      {project.status && (
                        <div className="mt-2">
                          <span className="chip border-transparent bg-[color:var(--accent)]/18">
                            {project.status}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {hasLink && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary px-4 py-2 text-xs"
                        >
                          Ver demo
                        </a>
                      )}
                      {hasGithub && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-ghost px-4 py-2 text-xs"
                        >
                          GitHub
                        </a>
                      )}
                      {!isClickable && (
                        <span className="text-xs font-semibold text-[color:var(--muted)]">
                          En progreso
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">
                    {project.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech?.map((tech, i) => (
                      <span key={i} className="chip text-xs bg-white/55">
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {filter !== "featured" && (
        <div className={filter === "github" ? "" : "mt-14"}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-2xl font-black tracking-tight">
                Desde GitHub
              </h3>
              <p className="text-sm text-[color:var(--muted)]">
                Usuario: {GITHUB_USER}{" "}
                {githubStatus === "loading" ? "(cargando...)" : ""}
                {githubStatus === "error" ? "(no se pudo cargar)" : ""}
              </p>
            </div>
            <a
              className="btn btn-ghost px-4 py-2 text-xs"
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver perfil
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {githubProjects.map((repo, idx) => {
              const hasLink = repo.link && repo.link !== "null";
              return (
                <article key={idx} className="panel p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-display text-xl font-extrabold tracking-tight truncate">
                        {repo.title}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
                        {repo.description}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {repo.tech?.map((tech, i) => (
                          <span key={i} className="chip text-xs bg-white/55">
                            {tech}
                          </span>
                        ))}
                        <span className="chip text-xs bg-white/55">★ {repo.stars}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {hasLink && (
                        <a
                          href={repo.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary px-4 py-2 text-xs"
                        >
                          Demo
                        </a>
                      )}
                      <a
                        href={repo.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost px-4 py-2 text-xs"
                      >
                        Code
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

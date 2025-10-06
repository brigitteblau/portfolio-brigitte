import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Work() {
  const { t } = useLanguage();
  const projects = t.projects || [];

  return (
    <section
      className="px-4 sm:px-6 py-12 sm:py-16 md:py-20 max-w-screen-xl mx-auto"
      id="work"
    >
      <style jsx global>{`
        :root {
          --color-pink-primary: #ec4899;
          --color-pink-light: #fbcfe8;
          --color-pink-dark: #be185d;
          --transition-speed: 0.3s;
        }

        .handwritten {
          font-family: 'Caveat', cursive;
        }

        .arrow-link {
          position: relative;
          transition: transform var(--transition-speed) ease;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .arrow-link:hover {
          transform: translateY(-2px);
        }

        @keyframes drawArrow {
          0% { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: 0; }
        }

        .arrow-drawn path {
          stroke-dasharray: 100;
          stroke-dashoffset: 0;
          transition: stroke-dashoffset 0.5s, stroke-width 0.3s;
        }

        .arrow-link:hover .arrow-drawn path {
          animation: drawArrow 0.7s ease forwards;
          stroke-width: 10;
          stroke: var(--color-pink-dark);
        }

        .project-card {
          transition: transform var(--transition-speed), box-shadow var(--transition-speed);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(236, 72, 153, 0.15);
        }

        .preview {
          position: relative;
          width: 100%;
          padding-top: 62.5%;
          border-radius: 0.75rem;
          overflow: hidden;
          background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
        }

        .preview > iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: white;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .github-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #24292e;
          color: white;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .github-badge:hover {
          background: #1a1e22;
          transform: scale(1.05);
        }

        @media (max-width: 640px) {
          .arrow-link { width: 30px; height: 30px; }
        }
      `}</style>

      <link
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap"
        rel="stylesheet"
      />

      <p className="text-right text-lg sm:text-2xl text-pink-400 handwritten italic -mb-2 sm:-mb-3">
        {t.workFrom}
      </p>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 text-center bg-gradient-to-r from-pink-500 to-pink-400 text-transparent bg-clip-text">
        {t.workTitle}
      </h2>
      <p className="text-center text-sm sm:text-base text-gray-600 mb-8 sm:mb-12">
        {t.fastLine}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {projects.map((project, idx) => {
          const hasLink = project.link && project.link !== "null";
          const hasGithub = project.github && project.github !== "null";
          const url = hasLink ? project.link : (hasGithub ? project.github : "");
          const isClickable = hasLink || hasGithub;
          
          return (
            <article
              key={idx}
              className={`${project.bgColor || "bg-pink-50"} rounded-2xl p-4 sm:p-5 relative overflow-hidden group project-card border border-pink-200`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3 relative z-20 gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="bg-pink-500 text-white rounded-lg px-2 py-1 shadow-md flex-shrink-0">
                    <span className="text-sm font-semibold">{project.icon}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-pink-700 leading-tight">
                    {project.title}
                  </h3>
                </div>

                {isClickable ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="arrow-link"
                    aria-label={`Visitar ${project.title}`}
                  >
                    <svg
                      className="arrow-drawn w-6 h-6"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 50C20 50 40 48 60 48C73.9 48 80 50 80 50"
                        stroke="#ec4899"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M55 30C55 30 70 40 80 50C90 60 75 70 75 70"
                        stroke="#ec4899"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                ) : (
                  <div className="opacity-40 cursor-not-allowed arrow-link">
                    <svg
                      className="arrow-drawn w-6 h-6"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 50C20 50 40 48 60 48C73.9 48 80 50 80 50"
                        stroke="#ec4899"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M55 30C55 30 70 40 80 50C90 60 75 70 75 70"
                        stroke="#ec4899"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Status badge */}
              {project.status && (
                <div className="mb-3 flex justify-center">
                  <span className="status-badge">
                    <span>⏳</span>
                    <span>{project.status}</span>
                  </span>
                </div>
              )}

              {/* Preview iframe */}
              <div className="preview mb-3 flex-shrink-0">
                {hasLink ? (
                  <iframe 
                    src={url} 
                    title={project.title} 
                    loading="lazy"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="text-4xl mb-2">🚧</div>
                      <p className="text-pink-400 text-sm italic font-medium">
                        {project.status || "En desarrollo"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="flex-1 flex flex-col">
                <p className="text-gray-700 text-sm leading-relaxed mb-3 flex-1">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {project.tech?.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-white border border-pink-200 px-2 py-0.5 rounded-full text-pink-600 text-[11px] shadow-sm hover:bg-pink-50 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* GitHub badge */}
                {hasGithub && !hasLink && (
                  <div className="mt-3">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="github-badge inline-flex"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                      </svg>
                      <span>View on GitHub</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Hover tooltip */}
              {isClickable && (
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-40 rotate-3">
                  <span className="handwritten text-pink-500 bg-white px-2 py-0.5 rounded-full shadow-md border border-pink-200 text-xs">
                    {t.visitSite}
                  </span>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
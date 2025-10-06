// components/Work.jsx
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
        }

        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(236, 72, 153, 0.12);
        }

        .preview {
          position: relative;
          width: 100%;
          padding-top: 62.5%; /* 16:10 */
          border-radius: 1rem;
          overflow: hidden;
        }

        .preview > iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
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
          const hasLink = project.link || project.github;
          const url = project.link || project.github || "";
          return (
            <article
              key={idx}
              className={`${project.bgColor || "bg-pink-50"} rounded-2xl p-4 sm:p-5 relative overflow-hidden group project-card border border-pink-200`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3 relative z-20">
                <div className="flex items-center gap-2">
                  <div className="bg-pink-500 text-white rounded-lg px-2 py-1 shadow-md">
                    <span className="text-sm font-semibold">{project.icon}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-pink-700 leading-tight">
                    {project.title}
                  </h3>
                </div>

                {hasLink ? (
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

              {/* Preview iframe */}
              <div className="preview mb-3">
                {hasLink ? (
                  <iframe src={url} title={project.title} loading="lazy"></iframe>
                ) : (
                  <div className="w-full h-full bg-pink-100 flex items-center justify-center text-pink-400 text-sm italic">
                    Sin vista previa
                  </div>
                )}
              </div>

              {/* Texto */}
              <p className="text-gray-700 text-sm leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.tech?.map((tech, i) => (
                  <span
                    key={i}
                    className="bg-white border border-pink-200 px-2 py-0.5 rounded-full text-pink-600 text-[11px] shadow-sm hover:bg-pink-50 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {hasLink && (
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

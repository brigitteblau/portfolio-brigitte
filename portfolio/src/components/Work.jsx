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
          --color-pink-secondary: #f9a8d4;
          --color-pink-bg: #fdf2f8;
          --color-text: #1f2937;
          --color-text-light: #6b7280;
          --border-radius: 1rem;
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
        .arrow-link:hover { transform: translateY(-2px); }
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
        .iframe-container { transition: transform var(--transition-speed); }
        .project-card:hover .iframe-container { transform: scale(1.015); }

        /* Mini preview: relación 16:10 sin plugin aspect-ratio */
        .preview {
          position: relative;
          width: 100%;
          padding-top: 62.5%; /* 10/16 = 0.625 */
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

        /* Ribbon “Hecho rápido” */
        .ribbon {
          position: absolute;
          top: 10px;
          right: -40px;
          background: #fff;
          color: #be185d;
          border: 1px solid #f9a8d4;
          padding: 6px 48px;
          transform: rotate(12deg);
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.3px;
          box-shadow: 0 6px 12px rgba(236, 72, 153, 0.12);
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
        ⚡ {t.fastLine || "Prototipos en días, no meses."}
      </p>

      {/* GRILLA DE CARDS MÁS CHICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {projects.map((project, idx) => (
          <article
            key={idx}
            className={`${project.bgColor || "bg-pink-50"} rounded-2xl p-4 sm:p-5 relative overflow-hidden group project-card border border-pink-200`}
          >
            {/* Glow */}
            <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-pink-200 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-200 to-transparent opacity-0 group-hover:opacity-20 transition duration-500 pointer-events-none rounded-2xl z-10" />

            {/* Ribbon Fast */}
            {(project.fast ?? true) && (
              <span className="ribbon z-30 select-none">HECHO RÁPIDO</span>
            )}

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

              <a
                href={project.link}
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
            </div>

            {/* Preview mini */}
            <div className="preview iframe-container mb-3 relative z-20">
              <iframe
                src={project.link}
                title={project.title}
                loading="lazy"
              />
              {/* “tap-through” en hover para permitir click dentro del iframe */}
              <div className="absolute inset-0 bg-transparent group-hover:bg-transparent pointer-events-auto group-hover:pointer-events-none transition-all duration-300" />
            </div>

            {/* Texto + Tech */}
            <p className="text-gray-700 text-sm line-clamp-3">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {project.tech?.slice(0, 6).map((tech, i) => (
                <span
                  key={i}
                  className="bg-white border border-pink-200 px-2 py-0.5 rounded-full text-pink-600 text-[11px] shadow-sm hover:bg-pink-50 transition-colors"
                >
                  {tech}
                </span>
              ))}
              {project.tech?.length > 6 && (
                <span className="text-[11px] text-pink-700 font-semibold">
                  +{project.tech.length - 6}
                </span>
              )}
            </div>

            {/* Badge “Visitar” */}
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-40 rotate-3">
              <span className="handwritten text-pink-500 bg-white px-2 py-0.5 rounded-full shadow-md border border-pink-200 text-xs">
                {t.visitSite}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

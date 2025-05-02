// components/Work.jsx
// components/Work.jsx
import React from "react";
import { useLanguage } from '../context/LanguageContext';

export default function Work() {
  const { t } = useLanguage();
  const projects = t.projects;

  return (
    <section className="px-4 sm:px-6 py-12 sm:py-16 md:py-20 max-w-screen-xl mx-auto" id="work">
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
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .arrow-link:hover {
          transform: translateY(-2px);
        }

        @keyframes drawArrow {
          0% {
            stroke-dashoffset: 200;
          }
          100% {
            stroke-dashoffset: 0;
          }
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
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(236, 72, 153, 0.1);
        }

        .iframe-container {
          transition: transform var(--transition-speed);
        }

        .project-card:hover .iframe-container {
          transform: scale(1.02);
        }

        @media (max-width: 640px) {
          .arrow-link {
            width: 32px;
            height: 32px;
          }
          
          .badge-visit {
            font-size: 0.75rem;
          }
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />

      <p className="text-right text-xl sm:text-2xl text-pink-400 handwritten italic -mb-2 sm:-mb-3">{t.workFrom}</p>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 sm:mb-10 md:mb-12 text-center bg-gradient-to-r from-pink-500 to-pink-400 text-transparent bg-clip-text">
        {t.workTitle}
      </h2>

      <div className="space-y-10 sm:space-y-16">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className={`${project.bgColor} rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 relative overflow-hidden group project-card border border-pink-200`}
          >
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-200 to-transparent opacity-0 group-hover:opacity-20 transition duration-500 pointer-events-none rounded-2xl sm:rounded-3xl z-20" />

            <div className="flex justify-between items-center mb-3 sm:mb-4 relative z-30">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-pink-500 text-white rounded-lg p-1 sm:p-1.5 shadow-md">
                  <span className="text-xs sm:text-sm font-semibold">{project.icon}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-pink-600">{project.title}</h2>
              </div>

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="arrow-link transition-all duration-300 relative z-30"
                aria-label={`Visit ${project.title}`}
              >
                <svg className="arrow-drawn w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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

            {/* Layout texto + iframe */}
            <div className="mt-4 sm:mt-6 md:mt-8 relative z-30 flex flex-col lg:flex-row gap-4 sm:gap-6">
              {/* Texto */}
              <div className="flex-1 lg:min-w-0">
                <p className="text-gray-700 text-xs sm:text-sm md:text-base max-w-none lg:max-w-2xl">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3 text-xs">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-white border border-pink-200 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-pink-500 shadow-sm hover:bg-pink-50 transition-colors duration-300 text-[10px] sm:text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Iframe */}
              <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-pink-200 shadow-lg iframe-container w-full lg:w-[400px] h-48 sm:h-56 md:h-64 lg:h-[400px] relative mt-4 lg:mt-0">
                <iframe
                  src={project.link}
                  title={project.title}
                  className="w-full h-full"
                  loading="lazy"
                ></iframe>
                <div className="absolute inset-0 bg-transparent group-hover:bg-transparent pointer-events-auto group-hover:pointer-events-none transition-all duration-300"></div>
              </div>
            </div>

            {/* Badge "Visit site" */}
            <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-40 transform rotate-3">
              <span className="handwritten text-pink-500 bg-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md border border-pink-200 text-xs sm:text-sm badge-visit">
                {t.visitSite}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
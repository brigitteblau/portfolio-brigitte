'use client';

import { useRef } from 'react';

const ACCENTS = ['var(--rust)', 'var(--ochre)', 'var(--olive)', 'var(--wine)', 'var(--sky)'];

export default function ProjectsCarousel({ projects, lang, dict }: any) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: 0 });

  const scrollByCards = (dir: number) => {
    const t = trackRef.current;
    if (!t) return;
    const card = t.querySelector('.pcard') as HTMLElement | null;
    const w = card ? card.offsetWidth + 22 : 360;
    t.scrollBy({ left: dir * w, behavior: 'smooth' });
  };

  // Drag-to-scroll for mouse only (touch uses native scroll).
  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const t = trackRef.current;
    if (!t) return;
    drag.current = { down: true, startX: e.clientX, startLeft: t.scrollLeft, moved: 0 };
    t.classList.add('is-dragging');
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.down) return;
    const t = trackRef.current;
    if (!t) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    t.scrollLeft = drag.current.startLeft - dx;
  };
  const onUp = () => {
    drag.current.down = false;
    trackRef.current?.classList.remove('is-dragging');
  };
  // Prevent the click->navigate when the user was actually dragging.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="pcarousel">
      <div className="pcarousel-head">
        <p className="pcarousel-hint">
          {lang === 'en' ? 'swipe / drag →' : 'deslizá / arrastrá →'}
        </p>
        <div className="pcarousel-arrows">
          <button type="button" onClick={() => scrollByCards(-1)} aria-label="anterior">←</button>
          <button type="button" onClick={() => scrollByCards(1)} aria-label="siguiente">→</button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="pcarousel-track"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onClickCapture={onClickCapture}
      >
        {projects.map((project: any, index: number) => {
          const title = lang === 'en' ? project.title_en || project.title_es : project.title_es;
          const summary = lang === 'en' ? project.summary_en || project.summary_es : project.summary_es;
          const accent = ACCENTS[index % ACCENTS.length];
          const demo = project.link && project.link !== 'null' ? project.link : null;
          const code = project.github && project.github !== 'null' ? project.github : null;

          return (
            <article className="pcard" key={project.id} style={{ ['--accent' as any]: accent }}>
              <div className="pcard-media">
                {project.cover_url ? (
                  <img src={project.cover_url} alt={title} draggable={false} />
                ) : (
                  <span className="pcard-ph">{String(index + 1).padStart(2, '0')}</span>
                )}
                <span className="pcard-index">{String(index + 1).padStart(2, '0')}</span>
              </div>

              <div className="pcard-body">
                <h3 className="pcard-title">{title}</h3>
                <p className="pcard-summary">{summary}</p>

                <div className="pcard-tags">
                  {(project.tech ?? []).slice(0, 4).map((t: string) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>

                <div className="pcard-actions">
                  {demo && (
                    <a href={demo} target="_blank" rel="noopener noreferrer" className="pcard-demo">
                      {lang === 'en' ? 'live demo' : 'ver demo'} ↗
                    </a>
                  )}
                  {code && (
                    <a href={code} target="_blank" rel="noopener noreferrer" className="pcard-code">
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

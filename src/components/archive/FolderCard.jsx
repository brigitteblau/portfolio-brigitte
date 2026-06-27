import React from 'react';
import { ArrowUpRight, Github, Headphones } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { localized, formatDate, folderColor } from '../../lib/content';

export default function FolderCard({ entry, index = 0, onOpen }) {
  const { t, lang } = useLanguage();
  const title = localized(entry, 'title', lang);
  const summary = localized(entry, 'summary', lang) || localized(entry, 'body', lang);
  const color = folderColor(entry, index);

  const isProject = entry.kind === 'project';
  const tags = isProject ? entry.tech || [] : entry.tags || [];

  // Real images only — no random fillers.
  const peeks = [];
  if (entry.cover_url) peeks.push(entry.cover_url);
  if (Array.isArray(entry.gallery)) peeks.push(...entry.gallery);
  const shown = peeks.slice(0, isProject ? 1 : 3);
  const hasPhotos = shown.length > 0;

  return (
    <article
      className="folder"
      style={{ '--folder': color }}
      onClick={() => onOpen?.(entry)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' ? onOpen?.(entry) : null)}
    >
      <span className="paperclip" />
      <div className="folder-peek">
        {hasPhotos ? (
          shown.map((src, i) =>
            isProject ? (
              <img
                key={i}
                src={src}
                alt={title}
                loading="lazy"
                className="folder-shot"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <img
                key={i}
                src={src}
                alt=""
                loading="lazy"
                style={{ left: `${8 + i * 30}%`, transform: `rotate(${(i - 1) * 7}deg)`, zIndex: i }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ),
          )
        ) : (
          <div className="folder-icon" aria-hidden>
            {entry.icon || '🗂️'}
          </div>
        )}
      </div>

      <div className="folder-body">
        <p className="font-mono-label text-[11px] text-[color:var(--wine)]">
          {isProject ? (lang === 'en' ? 'project' : 'proyecto') : formatDate(entry.date, lang)}
        </p>
        <h3 className="font-imposing text-2xl sm:text-[1.7rem] mt-1 text-[color:var(--ink)] leading-tight">
          {title}
        </h3>
        {summary && (
          <p className="mt-2 text-sm text-[color:var(--ink)]/75 leading-relaxed line-clamp-3">
            {summary}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold rounded-full bg-black/10 border border-black/5 px-2 py-0.5 text-[color:var(--ink)]/80"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm font-bold text-[color:var(--ink)]">
          {entry.audio_url && <Headphones className="w-4 h-4 text-[color:var(--wine)]" />}
          {entry.github && !entry.link && <Github className="w-4 h-4" />}
          <span className="ml-auto inline-flex items-center gap-1">
            {isProject ? (entry.link ? t.visitSite : t.journalRead) : t.journalListen || 'Abrir'}
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </article>
  );
}

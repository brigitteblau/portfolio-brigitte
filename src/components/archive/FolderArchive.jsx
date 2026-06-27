import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Headphones, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { listProjects, listPosts, localized, formatDate } from '../../lib/content';
import FolderCard from './FolderCard';

export default function FolderArchive() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [tab, setTab] = useState('project'); // project | post
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([listProjects().catch(() => []), listPosts().catch(() => [])]).then(
      ([pr, po]) => {
        if (cancelled) return;
        setProjects(pr);
        setPosts(po);
        setLoading(false);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const openProject = (entry) => {
    const url = entry.link || entry.github;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const tabs = useMemo(
    () => [
      { id: 'project', label: t.work || 'Proyectos' },
      { id: 'post', label: t.journal || 'Journal' },
    ],
    [t],
  );

  return (
    <section id="archivo" className="px-4 sm:px-6 py-16 sm:py-24 max-w-screen-xl mx-auto relative z-10">
      <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
        <div>
          <p className="font-mono-label text-[12px] text-[color:var(--wine)]">{t.archiveKicker}</p>
          <h2 className="font-imposing text-4xl sm:text-6xl mt-2 text-[color:var(--ink)] uppercase">
            {t.archiveTitle}
          </h2>
        </div>
      </div>

      {/* Folder tabs */}
      <div className="flex items-end gap-2 border-b border-[color:var(--line)]">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            className="folder-tab"
            data-active={tab === item.id}
            onClick={() => setTab(item.id)}
          >
            {item.label}
            {item.id === 'post' && <span className="ml-1 opacity-60">({posts.length})</span>}
          </button>
        ))}
      </div>

      <div className="bg-[color:var(--cream)] border border-t-0 border-[color:var(--line)] rounded-b-2xl px-4 sm:px-7 py-8 sm:py-10">
        {loading && <p className="text-[color:var(--muted)]">{t.journalLoading}</p>}

        {/* PROJECTS — folder grid */}
        {!loading && tab === 'project' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 pt-3">
            {projects.map((entry, i) => (
              <FolderCard key={entry.id} entry={entry} index={i} onOpen={openProject} />
            ))}
          </div>
        )}

        {/* JOURNAL — dated news/blog feed */}
        {!loading && tab === 'post' && (
          <div>
            {posts.length === 0 && (
              <p className="text-[color:var(--muted)]">{t.journalEmpty}</p>
            )}
            <div className="divide-y divide-[color:var(--line)]">
              {posts.map((entry) => {
                const title = localized(entry, 'title', lang);
                const summary = localized(entry, 'summary', lang) || localized(entry, 'body', lang);
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => navigate(`/journal/${entry.slug}`)}
                    className="feed-row w-full text-left grid grid-cols-[auto,1fr] sm:grid-cols-[140px,1fr,auto] gap-4 sm:gap-6 py-6 items-start"
                  >
                    <time className="font-mono-label text-[12px] text-[color:var(--wine)] pt-1 block">
                      {formatDate(entry.date, lang)}
                    </time>
                    <div className="min-w-0">
                      <h3 className="font-imposing text-2xl sm:text-3xl text-[color:var(--ink)] leading-tight flex items-center gap-2">
                        {title}
                        {entry.audio_url && (
                          <Headphones className="w-5 h-5 text-[color:var(--wine)] flex-shrink-0" />
                        )}
                      </h3>
                      {summary && (
                        <p className="mt-2 text-[color:var(--ink)]/70 leading-relaxed line-clamp-2 max-w-2xl">
                          {summary}
                        </p>
                      )}
                      <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-[color:var(--ink)]">
                        {entry.audio_url ? t.journalListen : t.journalRead}
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                    {entry.cover_url && (
                      <img
                        src={entry.cover_url}
                        alt=""
                        className="hidden sm:block w-28 h-28 object-cover rounded-lg border-4 border-white shadow-md rotate-2"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

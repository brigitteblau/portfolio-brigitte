import React, { useState } from 'react';
import { createEntry, slugify, FOLDER_COLORS } from '../../lib/content';

const empty = {
  kind: 'post',
  title_es: '',
  title_en: '',
  date: new Date().toISOString().slice(0, 10),
  summary_es: '',
  summary_en: '',
  body_es: '',
  body_en: '',
  transcript: '',
  tags: '',
  // project-only
  link: '',
  github: '',
  tech: '',
  folder_color: FOLDER_COLORS[0],
  published: true,
};

const inputClass =
  'w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--cream)]/70 px-4 py-3 text-[color:var(--ink)] outline-none focus:border-[color:var(--wine)]';
const labelClass = 'block text-sm font-semibold mb-1';

export default function JournalForm({ onCreated }) {
  const [form, setForm] = useState(empty);
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const isProject = form.kind === 'project';
  const set = (key) => (e) =>
    setForm((p) => ({
      ...p,
      [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('saving');
    setError('');
    try {
      const fields = {
        kind: form.kind,
        title_es: form.title_es || form.title_en,
        title_en: form.title_en || null,
        slug: slugify(form.title_es || form.title_en),
        date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
        summary_es: form.summary_es || null,
        summary_en: form.summary_en || null,
        body_es: form.body_es || null,
        body_en: form.body_en || null,
        transcript: isProject ? null : form.transcript || null,
        tags: form.tags ? form.tags.split(',').map((s) => s.trim()).filter(Boolean) : [],
        link: isProject && form.link ? form.link : null,
        github: isProject && form.github ? form.github : null,
        tech: isProject && form.tech ? form.tech.split(',').map((s) => s.trim()).filter(Boolean) : [],
        folder_color: form.folder_color || null,
        published: form.published,
      };
      await createEntry({ fields, audioFile: isProject ? null : audioFile, coverFile });
      setForm(empty);
      setAudioFile(null);
      setCoverFile(null);
      setStatus('done');
      onCreated?.();
      setTimeout(() => setStatus('idle'), 2500);
    } catch (err) {
      setError(err.message || 'Error al guardar.');
      setStatus('error');
    }
  };

  return (
    <form onSubmit={onSubmit} className="panel p-6 grid gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="font-imposing text-2xl">Nueva carpeta</h2>
        <div className="flex rounded-full border border-[color:var(--line)] p-1 bg-[color:var(--cream)]/60">
          {[
            { id: 'post', label: 'Historia / Journal' },
            { id: 'project', label: 'Proyecto' },
          ].map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setForm((p) => ({ ...p, kind: k.id }))}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                form.kind === k.id ? 'bg-[color:var(--wine)] text-white' : 'text-[color:var(--muted)]'
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Título (ES) *</label>
          <input className={inputClass} value={form.title_es} onChange={set('title_es')} required />
        </div>
        <div>
          <label className={labelClass}>Title (EN)</label>
          <input className={inputClass} value={form.title_en} onChange={set('title_en')} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Fecha</label>
          <input type="date" className={inputClass} value={form.date} onChange={set('date')} />
        </div>
        <div>
          <label className={labelClass}>Tags (coma)</label>
          <input className={inputClass} value={form.tags} onChange={set('tags')} placeholder="reflexión, viaje" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Bajada corta (ES)</label>
          <textarea className={`${inputClass} h-24 resize-none`} value={form.summary_es} onChange={set('summary_es')} />
        </div>
        <div>
          <label className={labelClass}>Short summary (EN)</label>
          <textarea className={`${inputClass} h-24 resize-none`} value={form.summary_en} onChange={set('summary_en')} />
        </div>
      </div>

      {!isProject && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Texto completo (ES)</label>
              <textarea className={`${inputClass} h-32 resize-none`} value={form.body_es} onChange={set('body_es')} />
            </div>
            <div>
              <label className={labelClass}>Full text (EN)</label>
              <textarea className={`${inputClass} h-32 resize-none`} value={form.body_en} onChange={set('body_en')} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Transcripción (opcional)</label>
            <textarea className={`${inputClass} h-20 resize-none`} value={form.transcript} onChange={set('transcript')} />
          </div>
          <div>
            <label className={labelClass}>Audio (mp3/m4a)</label>
            <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} className="text-sm" />
          </div>
        </>
      )}

      {isProject && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Link (demo)</label>
            <input className={inputClass} value={form.link} onChange={set('link')} placeholder="https://..." />
          </div>
          <div>
            <label className={labelClass}>GitHub</label>
            <input className={inputClass} value={form.github} onChange={set('github')} placeholder="https://github.com/..." />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Tecnologías (coma)</label>
            <input className={inputClass} value={form.tech} onChange={set('tech')} placeholder="React, Supabase, Tailwind" />
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 items-end">
        <div>
          <label className={labelClass}>Portada (imagen)</label>
          <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="text-sm" />
        </div>
        <div>
          <label className={labelClass}>Color de carpeta</label>
          <div className="flex gap-2">
            {FOLDER_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm((p) => ({ ...p, folder_color: c }))}
                className={`w-8 h-8 rounded-lg border-2 ${form.folder_color === c ? 'border-[color:var(--ink)]' : 'border-transparent'}`}
                style={{ background: c }}
                aria-label={c}
              />
            ))}
          </div>
        </div>
      </div>

      <label className="inline-flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={form.published} onChange={set('published')} />
        Publicar ahora
      </label>

      {error && <p className="text-[color:var(--wine)] text-sm font-semibold">{error}</p>}
      {status === 'done' && <p className="text-[color:var(--moss)] text-sm font-semibold">¡Guardado!</p>}

      <button type="submit" className="btn btn-primary justify-center" disabled={status === 'saving'}>
        {status === 'saving' ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}

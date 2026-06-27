import React, { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Real <audio> player styled to match the warm editorial brand.
export default function AudioPlayer({ src, compact = false }) {
  const { t } = useLanguage();
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  if (!src) return null;

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const onTime = () => {
    const el = audioRef.current;
    if (!el) return;
    setProgress(el.currentTime);
    if (el.duration && el.duration !== duration) setDuration(el.duration);
  };

  const seek = (e) => {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    el.currentTime = ratio * el.duration;
  };

  const fmt = (s) => {
    if (!s || Number.isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div
      className={`flex items-center gap-3 rounded-full border border-[color:var(--line)] bg-[color:var(--cream)]/70 backdrop-blur px-3 py-2 ${
        compact ? '' : 'w-full max-w-md'
      }`}
    >
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={onTime}
        onLoadedMetadata={onTime}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        preload="metadata"
      />
      <button
        type="button"
        onClick={toggle}
        className="h-10 w-10 flex-shrink-0 grid place-items-center rounded-full bg-[color:var(--wine)] text-[color:var(--cream)] shadow-sm"
        aria-label={playing ? t.journalPause : t.journalListen}
      >
        {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
      </button>

      {!compact && (
        <>
          <button
            type="button"
            onClick={seek}
            className="relative flex-1 h-2 rounded-full bg-[color:var(--line)] overflow-hidden cursor-pointer"
            aria-label="seek"
          >
            <span
              className="absolute inset-y-0 left-0 bg-[color:var(--wine)] rounded-full"
              style={{ width: `${pct}%` }}
            />
          </button>
          <span className="text-xs font-semibold text-[color:var(--muted)] tabular-nums w-20 text-right">
            {fmt(progress)} / {fmt(duration)}
          </span>
        </>
      )}
    </div>
  );
}

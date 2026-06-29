'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  audioUrl?: string | null;
  text?: string | null;
  lang: 'es' | 'en';
};

// "Escuchar lo que dice": plays the uploaded audio if there is one,
// otherwise reads the text out loud with the browser's voice (TTS).
export default function ListenButton({ audioUrl, text, lang }: Props) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const hasAudio = Boolean(audioUrl);
  const canSpeak = !hasAudio && Boolean(text) && typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggle = () => {
    if (hasAudio) {
      const el = audioRef.current;
      if (!el) return;
      if (el.paused) {
        el.play();
        setPlaying(true);
      } else {
        el.pause();
        setPlaying(false);
      }
      return;
    }

    if (!canSpeak) return;
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
      setPlaying(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(text || '');
    utter.lang = lang === 'en' ? 'en-US' : 'es-ES';
    utter.rate = 0.98;
    utter.onend = () => setPlaying(false);
    synth.speak(utter);
    setPlaying(true);
  };

  if (!hasAudio && !canSpeak) return null;

  const label = lang === 'en' ? (playing ? 'Pause' : 'Listen') : playing ? 'Pausar' : 'Escuchar';

  return (
    <div className="listen-wrap">
      <button type="button" onClick={toggle} className="listen-btn" aria-label={label}>
        <span className="listen-icon">{playing ? '❚❚' : '►'}</span>
        {label}
        {!hasAudio && (
          <span className="listen-hint">{lang === 'en' ? 'read aloud' : 'voz del navegador'}</span>
        )}
      </button>
      {hasAudio && (
        <audio
          ref={audioRef}
          src={audioUrl as string}
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          controls
          className="listen-audio"
        />
      )}
    </div>
  );
}

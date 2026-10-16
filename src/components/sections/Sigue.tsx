"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { EntryMeta } from "@/lib/journal";
import { bereal as B, dejame as D, sigue as S, journal as J } from "@/content/site";
import { Doodle, Polaroid, Sparkle, Sticky, Tag } from "../Stickers";

/* ───────────────────────── Journal ───────────────────────── */
function Journal({ lang, entries }: { lang: Locale; entries: EntryMeta[] }) {
  const fmt = new Intl.DateTimeFormat(lang === "es" ? "es-AR" : "en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const list = entries.slice(0, 3);
  return (
    <div className="slide relative overflow-hidden px-5 py-10 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Tag color="var(--pink)">{S.journalLead[lang]}</Tag>
          <h2 id="sigue-title" className="mt-4 max-w-[16ch] text-[clamp(2.4rem,5.5vw,5rem)] font-black leading-[0.92] tracking-[-0.045em]">
            {S.title[lang]}
          </h2>
        </div>
        <Link href={`/${lang}/journal`} className="rounded-full bg-ink px-5 py-2.5 font-semibold text-cream hover:bg-blue">
          {S.allEntries[lang]} →
        </Link>
      </div>
      {list.length === 0 ? (
        <p className="mt-8 font-hand text-[1.8rem]">{J.empty[lang]}</p>
      ) : (
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((e, i) => (
            <li key={e.slug}>
              <Link href={`/${lang}/journal/${e.slug}`} className="group block">
                <Polaroid rotate={[-3, 2, -1.5][i % 3]} holder={i % 2 ? "pin" : "clip"} className="transition-transform duration-300 group-hover:-translate-y-1" caption={e.title}>
                  {e.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={e.cover} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  ) : (
                    <div className="flex aspect-[4/3] items-end bg-blue-soft p-4 font-serif text-[2rem] italic leading-none">{e.title}</div>
                  )}
                </Polaroid>
                <p className="mt-3 text-center font-mono text-[0.75rem] text-ink/60">
                  <time dateTime={e.date}>{e.date ? fmt.format(new Date(e.date)) : ""}</time> · {e.minutes} {J.readTime[lang]}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ───────────────────────── BeReal ───────────────────────── */
const W = 1080;
const H = 1440;

function drawCover(ctx: CanvasRenderingContext2D, src: CanvasImageSource, sw: number, sh: number, x: number, y: number, w: number, h: number, mirror = false) {
  const r = Math.max(w / sw, h / sh);
  const cw = w / r;
  const ch = h / r;
  ctx.save();
  if (mirror) {
    ctx.translate(x + w, y);
    ctx.scale(-1, 1);
    x = 0;
    y = 0;
  }
  ctx.drawImage(src, (sw - cw) / 2, (sh - ch) / 2, cw, ch, x, y, w, h);
  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

type Shot = { canvas: HTMLCanvasElement; mirror: boolean };

/** Arma la foto final: la de atrás grande, la selfie chiquita arriba a la izquierda (como BeReal). */
function compose(main: Shot, inset?: Shot): Promise<Blob | null> {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  drawCover(ctx, main.canvas, main.canvas.width, main.canvas.height, 0, 0, W, H, main.mirror);
  if (inset) {
    const iw = W * 0.3;
    const ih = iw * (4 / 3);
    const x = 40;
    const y = 40;
    ctx.save();
    roundRect(ctx, x - 6, y - 6, iw + 12, ih + 12, 34);
    ctx.fillStyle = "#000";
    ctx.fill();
    roundRect(ctx, x, y, iw, ih, 28);
    ctx.clip();
    drawCover(ctx, inset.canvas, inset.canvas.width, inset.canvas.height, x, y, iw, ih, inset.mirror);
    ctx.restore();
  }
  return new Promise((res) => c.toBlob(res, "image/jpeg", 0.85));
}

function grab(video: HTMLVideoElement): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = video.videoWidth;
  c.height = video.videoHeight;
  c.getContext("2d")!.drawImage(video, 0, 0);
  return c;
}

const stop = (s?: MediaStream | null) => s?.getTracks().forEach((t) => t.stop());

type Phase = "idle" | "opening" | "live" | "second" | "preview";
type State = "idle" | "sending" | "sent" | "error";

function BeReal({ lang }: { lang: Locale }) {
  const live = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const facing = useRef<"user" | "environment">("user");
  const first = useRef<Shot | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const startedAt = useRef(0);

  const [phase, setPhase] = useState<Phase>("idle");
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [camError, setCamError] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [mirror, setMirror] = useState(true);
  const [withPhoto, setWithPhoto] = useState(false);

  useEffect(() => () => stop(stream.current), []);
  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const mark = () => {
    if (!startedAt.current) startedAt.current = Date.now();
  };

  const openCam = useCallback(async (mode: "user" | "environment") => {
    stop(stream.current);
    const s = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: mode === "environment" ? { exact: "environment" } : "user", width: { ideal: 1440 }, height: { ideal: 1920 } },
      audio: false,
    });
    stream.current = s;
    facing.current = mode;
    setMirror(mode === "user");
    const v = live.current;
    if (v) {
      v.srcObject = s;
      v.muted = true;
      v.playsInline = true;
      await v.play().catch(() => {});
    }
  }, []);

  const start = async () => {
    mark();
    setCamError("");
    first.current = null;
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamError(B.noCamera[lang]);
      return;
    }
    setPhase("opening");
    try {
      await openCam("user");
      setPhase("live");
    } catch {
      setPhase("idle");
      setCamError(B.noCamera[lang]);
    }
  };

  const finish = async (main: Shot, inset?: Shot) => {
    stop(stream.current);
    stream.current = null;
    const blob = await compose(main, inset);
    if (!blob) return;
    setPhoto(blob);
    setPreview(URL.createObjectURL(blob));
    setPhase("preview");
  };

  const shoot = async () => {
    const v = live.current;
    if (!v || !v.videoWidth) return;
    const shot: Shot = { canvas: grab(v), mirror: facing.current === "user" };
    if (phase === "live") {
      // ¿Hay otra cámara? (celular) → sacamos también la de atrás
      const cams = (await navigator.mediaDevices.enumerateDevices().catch(() => [])).filter((d) => d.kind === "videoinput");
      if (cams.length > 1) {
        first.current = shot;
        setPhase("second");
        try {
          await openCam("environment");
          // un segundito para que enfoque, y sale sola
          setTimeout(() => {
            const vv = live.current;
            if (vv?.videoWidth && first.current) void finish({ canvas: grab(vv), mirror: false }, first.current);
          }, 1300);
          return;
        } catch {
          // no hay cámara trasera usable: queda solo la selfie
        }
      }
      void finish(shot);
    }
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    mark();
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setCamError("");
    try {
      const bmp = await createImageBitmap(f);
      const c = document.createElement("canvas");
      c.width = bmp.width;
      c.height = bmp.height;
      c.getContext("2d")!.drawImage(bmp, 0, 0);
      await finish({ canvas: c, mirror: false });
    } catch {
      setCamError(D.errors.photo[lang]);
    }
  };

  const reset = () => {
    stop(stream.current);
    stream.current = null;
    setPhoto(null);
    setPreview(null);
    setPhase("idle");
  };

  const fail = (code: string) => {
    const key = (code in D.errors ? code : "generic") as keyof typeof D.errors;
    setError(D.errors[key][lang]);
    setState("error");
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const message = String(form.get("message") ?? "").trim();
    if (!photo && message.length < 3) return fail("short");
    if (photo && message.length > 0 && message.length < 3) return fail("short");
    if (message.length > 2000) return fail("long");
    if (photo && photo.size > 5 * 1024 * 1024) return fail("big");
    form.set("startedAt", String(startedAt.current));
    form.set("lang", lang);
    if (photo) form.set("photo", photo, "bereal.jpg");
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/notes", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setState("sent");
        setMsg("");
        return;
      }
      fail((data.error as string) ?? "generic");
    } catch {
      fail("generic");
    }
  };

  if (state === "sent") {
    return (
      <div className="flex flex-col items-start justify-center gap-5 py-10" role="status">
        <p className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight tracking-[-0.03em]">{withPhoto ? B.sentWithPhoto[lang] : D.sent[lang]}</p>
        <button
          onClick={() => {
            reset();
            setState("idle");
          }}
          className="font-semibold underline decoration-2 underline-offset-4 hover:text-pink"
        >
          {D.another[lang]}
        </button>
      </div>
    );
  }

  const camOn = phase === "live" || phase === "second" || phase === "opening";

  return (
    <form
      onSubmit={(e) => {
        setWithPhoto(!!photo);
        void submit(e);
      }}
      className="grid gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:items-start"
      noValidate
    >
      {/* El "teléfono" */}
      <div className="mx-auto w-full max-w-[22rem]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] bg-ink p-0 shadow-[0_24px_50px_-24px_rgba(31,33,40,.8)]">
          <div className="absolute inset-x-0 top-3 z-10 text-center text-[1rem] font-extrabold tracking-[-0.02em] text-cream">
            {lang === "es" ? "para Brigitte." : "for Brigitte."}
          </div>
          {/* video en vivo */}
          <video ref={live} className={`absolute inset-0 h-full w-full object-cover ${mirror ? "-scale-x-100" : ""} ${camOn ? "" : "hidden"}`} muted playsInline aria-label={lang === "es" ? "Cámara" : "Camera"} />
          {phase === "preview" && preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt={lang === "es" ? "Tu foto" : "Your photo"} className="absolute inset-0 h-full w-full object-cover" />
          )}
          {phase === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-cream">
              <Sparkle className="h-10 w-10" />
              <button type="button" onClick={start} className="rounded-full bg-cream px-6 py-3 text-[1.05rem] font-bold text-ink transition-transform hover:scale-105">
                📸 {B.open[lang]}
              </button>
              <button type="button" onClick={() => fileInput.current?.click()} className="text-[0.95rem] underline decoration-1 underline-offset-4 opacity-80 hover:opacity-100">
                {B.upload[lang]}
              </button>
              {camError && (
                <p className="text-[0.9rem] text-yellow" role="alert">
                  {camError}
                </p>
              )}
            </div>
          )}
          {(phase === "opening" || phase === "second") && (
            <p className="absolute inset-x-0 bottom-24 z-10 text-center font-hand text-[1.6rem] text-cream [text-shadow:0_2px_10px_rgba(0,0,0,.6)]">
              {phase === "opening" ? B.waiting[lang] : B.second[lang]}
            </p>
          )}
          {/* obturador */}
          {phase === "live" && (
            <button type="button" onClick={shoot} className="absolute bottom-5 left-1/2 z-10 grid h-[72px] w-[72px] -translate-x-1/2 place-items-center rounded-full border-[5px] border-cream" aria-label={B.shoot[lang]}>
              <span className="h-[52px] w-[52px] rounded-full bg-cream/90 transition-transform active:scale-90" />
            </button>
          )}
          {phase === "preview" && (
            <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2">
              <button type="button" onClick={start} className="rounded-full bg-cream px-4 py-2 text-[0.9rem] font-semibold text-ink">
                ↺ {B.retake[lang]}
              </button>
              <button type="button" onClick={reset} className="rounded-full bg-ink/70 px-4 py-2 text-[0.9rem] font-semibold text-cream">
                {B.remove[lang]}
              </button>
            </div>
          )}
          {(phase === "live" || phase === "opening") && (
            <button type="button" onClick={reset} className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-ink/60 text-cream" aria-label={lang === "es" ? "Cerrar cámara" : "Close camera"}>
              ×
            </button>
          )}
        </div>
        <input ref={fileInput} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={onFile} aria-label={B.upload[lang]} />
      </div>

      {/* Mensaje */}
      <div className="flex flex-col gap-3">
        <label htmlFor="note-message" className="sr-only">
          {photo ? D.placeholderOptional[lang] : D.placeholder[lang]}
        </label>
        <div className="relative">
          <textarea
            id="note-message"
            name="message"
            maxLength={2000}
            rows={6}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onFocus={mark}
            placeholder={photo ? D.placeholderOptional[lang] : D.placeholder[lang]}
            className="w-full resize-none rounded-[16px] border-2 border-ink/80 bg-white p-4 font-hand text-[1.6rem] leading-snug text-ink placeholder:text-ink/40 focus:border-blue focus:outline-none"
          />
          <span className="pointer-events-none absolute bottom-3 right-4 font-mono text-[0.7rem] text-ink/50" aria-hidden>
            {msg.length}/2000
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-ink/70">
            {D.name[lang]}
            <input name="name" maxLength={80} autoComplete="name" className="rounded-[12px] border-2 border-ink/80 bg-white px-3 py-2.5 text-[1rem] font-normal normal-case tracking-normal text-ink focus:border-blue focus:outline-none" />
          </label>
          <label className="flex flex-col gap-1 text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-ink/70">
            {D.email[lang]}
            <input name="email" type="email" maxLength={120} autoComplete="email" className="rounded-[12px] border-2 border-ink/80 bg-white px-3 py-2.5 text-[1rem] font-normal normal-case tracking-normal text-ink focus:border-blue focus:outline-none" />
          </label>
        </div>
        {/* Trampa para bots: invisible para personas */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-4">
          <button type="submit" disabled={state === "sending"} className="rounded-full bg-pink px-8 py-3.5 text-[1.05rem] font-bold text-cream shadow-[0_8px_0_#b23f86] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_3px_0_#b23f86] disabled:opacity-60">
            {state === "sending" ? D.sending[lang] : D.send[lang]}
          </button>
          <p role="alert" className="text-[0.95rem] font-semibold text-red">
            {state === "error" && error}
          </p>
        </div>
        <p className="font-mono text-[0.75rem] text-ink/60">{B.privacy[lang]}</p>
      </div>
    </form>
  );
}

export default function Sigue({ lang, entries }: { lang: Locale; entries: EntryMeta[] }) {
  return (
    <section id="sigue" className="relative px-3 py-6 sm:px-6" aria-labelledby="sigue-title">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <Journal lang={lang} entries={entries} />
        <div id="dejame" className="slide relative scroll-mt-16 overflow-hidden px-5 py-10 sm:px-10">
          <div className="mb-8 flex flex-wrap items-end gap-x-6 gap-y-3">
            <h2 className="hello-grad pb-[0.06em] pr-[0.08em] text-[clamp(3.4rem,9vw,8rem)] font-black italic leading-[0.85] tracking-[-0.06em]">{D.title[lang]}</h2>
            <Sticky color="#f4a3d0" rotate={4} className="mb-3 max-w-[16rem] !text-[1.35rem]">
              {B.title[lang]} ✨
            </Sticky>
          </div>
          <p className="mb-8 max-w-[52ch] text-[1.1rem] leading-snug">{B.intro[lang]}</p>
          <BeReal lang={lang} />
          <Doodle kind="curl" className="absolute right-8 top-10 hidden w-24 lg:block" />
        </div>
      </div>
    </section>
  );
}

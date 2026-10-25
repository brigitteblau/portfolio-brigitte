"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import { bereal as B, dejame as D, extra as X } from "@/content/site";
import { FILMS, develop, type Film } from "@/lib/film";
import Modal from "./Modal";

/**
 * "Dejame una foto" como un espejo: la cámara ocupa toda la pantalla (como la del celu o BeReal),
 * con flash (la pantalla se pone blanca para iluminarte), cuenta regresiva y las dos cámaras.
 * Los filtros se eligen después, en el pop-up con la foto.
 */

/** Lado largo de la foto final */
const LONG = 1440;

type Shot = { canvas: HTMLCanvasElement; mirror: boolean };
type Phase = "off" | "opening" | "live" | "second" | "print";
type Send = "idle" | "sending" | "sent" | "error";

const stop = (s?: MediaStream | null) =>
  s?.getTracks().forEach((t) => t.stop());

function grab(v: HTMLVideoElement): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = v.videoWidth;
  c.height = v.videoHeight;
  c.getContext("2d")!.drawImage(v, 0, 0);
  return c;
}

function cover(
  ctx: CanvasRenderingContext2D,
  src: HTMLCanvasElement,
  x: number,
  y: number,
  w: number,
  h: number,
  mirror: boolean,
) {
  const r = Math.max(w / src.width, h / src.height);
  const cw = w / r;
  const ch = h / r;
  ctx.save();
  if (mirror) {
    ctx.translate(x + w, y);
    ctx.scale(-1, 1);
    ctx.drawImage(
      src,
      (src.width - cw) / 2,
      (src.height - ch) / 2,
      cw,
      ch,
      0,
      0,
      w,
      h,
    );
  } else
    ctx.drawImage(
      src,
      (src.width - cw) / 2,
      (src.height - ch) / 2,
      cw,
      ch,
      x,
      y,
      w,
      h,
    );
  ctx.restore();
}

function rr(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** La foto "cruda", con la forma del espejo: la grande ocupa todo y la selfie va chiquita arriba (BeReal). */
function compose(main: Shot, inset?: Shot, ratio = 3 / 4) {
  const r = Math.min(16 / 9, Math.max(9 / 16, ratio));
  const W = Math.round(r >= 1 ? LONG : LONG * r);
  const H = Math.round(r >= 1 ? LONG / r : LONG);
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  cover(ctx, main.canvas, 0, 0, W, H, main.mirror);
  if (inset) {
    const iw = Math.min(W, H) * 0.31;
    const ih = iw * (4 / 3);
    ctx.save();
    rr(ctx, 34, 34, iw + 12, ih + 12, 36);
    ctx.fillStyle = "#111";
    ctx.fill();
    rr(ctx, 40, 40, iw, ih, 30);
    ctx.clip();
    cover(ctx, inset.canvas, 40, 40, iw, ih, inset.mirror);
    ctx.restore();
  }
  return c;
}

/** Revela la foto cruda con el rollo elegido → JPEG */
function print(raw: HTMLCanvasElement, film: Film): Promise<Blob | null> {
  const c = document.createElement("canvas");
  c.width = raw.width;
  c.height = raw.height;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(raw, 0, 0);
  develop(ctx, c.width, c.height, film);
  return new Promise((res) => c.toBlob(res, "image/jpeg", 0.86));
}

/** Clic de obturador hecho con sonido sintético (sin archivos). */
function shutterSound() {
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ac = new AC();
    const len = ac.sampleRate * 0.09;
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++)
      d[i] =
        (Math.random() * 2 - 1) *
        Math.pow(1 - i / len, 3) *
        (i < len * 0.15 || i > len * 0.45 ? 1 : 0.25);
    const src = ac.createBufferSource();
    src.buffer = buf;
    const g = ac.createGain();
    g.gain.value = 0.35;
    src.connect(g).connect(ac.destination);
    src.start();
    src.onended = () => void ac.close();
  } catch {
    /* sin sonido, no pasa nada */
  }
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function FilmCamera({ lang, compact = false, me }: { lang: Locale; compact?: boolean; me?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const live = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const raw = useRef<HTMLCanvasElement | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const startedAt = useRef(0);
  const busy = useRef(false);

  const [phase, setPhase] = useState<Phase>("off");
  const [ar, setAr] = useState<number | null>(null);
  const [mirror, setMirror] = useState(true);
  const [film, setFilm] = useState<Film>(
    FILMS.find((f) => f.id === "normal") ?? FILMS[0],
  );
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [flashOn, setFlashOn] = useState(true);
  const [timerOn, setTimerOn] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [flash, setFlash] = useState<"screen" | "finder" | null>(null);
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [printKey, setPrintKey] = useState(0);
  const [camError, setCamError] = useState("");
  const [msg, setMsg] = useState("");
  const [send, setSend] = useState<Send>("idle");
  const [error, setError] = useState("");
  const [withPhoto, setWithPhoto] = useState(false);
  const [sheet, setSheet] = useState(false);
  const closeSheet = useCallback(() => setSheet(false), [setSheet]);

  useEffect(() => () => stop(stream.current), []);
  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const mark = useCallback(() => {
    if (!startedAt.current) startedAt.current = Date.now();
  }, []);

  const openCam = useCallback(async (mode: "user" | "environment") => {
    stop(stream.current);
    const s = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: mode === "environment" ? { exact: "environment" } : "user",
        width: { ideal: 1280 },
      },
      audio: false,
    });
    stream.current = s;
    setMirror(mode === "user");
    const v = live.current;
    if (v) {
      v.srcObject = s;
      v.muted = true;
      v.playsInline = true;
      await v.play().catch(() => {});
      // El espejo toma la forma real de la cámara: así no se recorta (ni parece zoom)
      if (v.videoWidth && v.videoHeight) setAr(v.videoWidth / v.videoHeight);
    }
  }, []);

  const powerOn = async () => {
    mark();
    setCamError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamError(B.noCamera[lang]);
      return;
    }
    setPhase("opening");
    try {
      await openCam("user");
      setPhase("live");
    } catch {
      setPhase("off");
      setCamError(B.noCamera[lang]);
    }
  };

  // El botón flotante "dejame una foto" manda este evento
  useEffect(() => {
    const on = () => {
      if (phase === "off") void powerOn();
    };
    window.addEventListener("camera:on", on);
    return () => window.removeEventListener("camera:on", on);
  });

  const powerOff = () => {
    stop(stream.current);
    stream.current = null;
    setPhase(photo ? "print" : "off");
  };

  /** La forma del espejo (lo que ves es lo que sale en la foto). */
  const ratio = () => {
    const r = frame.current?.getBoundingClientRect();
    return r && r.height ? r.width / r.height : 3 / 4;
  };

  /** Miniaturas de la foto con cada filtro (para elegir después de sacarla). */
  const makeThumbs = (canvas: HTMLCanvasElement) => {
    const out: Record<string, string> = {};
    for (const f of FILMS) {
      const c = document.createElement("canvas");
      c.width = 180;
      c.height = Math.round((180 * canvas.height) / canvas.width);
      const ctx = c.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(canvas, 0, 0, c.width, c.height);
      develop(ctx, c.width, c.height, { ...f, date: false });
      out[f.id] = c.toDataURL("image/jpeg", 0.8);
    }
    setThumbs(out);
  };

  /** Cambia el filtro de la foto ya sacada (sin volver a "imprimirla"). */
  const applyFilm = async (f: Film) => {
    setFilm(f);
    if (!raw.current) return;
    const blob = await print(raw.current, f);
    if (!blob) return;
    setPhoto(blob);
    setPreview(URL.createObjectURL(blob));
  };

  /** Desarrolla la foto cruda con el rollo y la "imprime". */
  const toPrint = async (canvas: HTMLCanvasElement, f: Film) => {
    raw.current = canvas;
    makeThumbs(canvas);
    const blob = await print(canvas, f);
    if (!blob) return;
    setPhoto(blob);
    setPreview(URL.createObjectURL(blob));
    setPrintKey((k) => k + 1);
    setPhase("print");
    // Para el muro de polaroids: la foto "se pega" (solo en esta pantalla, no se publica)
    window.dispatchEvent(new CustomEvent("photo:taken", { detail: URL.createObjectURL(blob) }));
    setSheet(true); // ¡pum! la foto aparece en un pop-up
  };

  /** Cuenta regresiva + flash + clic, y devuelve el cuadro. */
  const snap = async (secs: number, front: boolean): Promise<Shot | null> => {
    for (let n = secs; n > 0; n--) {
      setCount(n);
      await wait(800);
    }
    setCount(null);
    if (flashOn) {
      // con la cámara de adelante, la pantalla entera se pone blanca y te ilumina
      setFlash(front ? "screen" : "finder");
      await wait(front ? 260 : 60);
    }
    const v = live.current;
    if (!v?.videoWidth) {
      setFlash(null);
      return null;
    }
    const shot: Shot = { canvas: grab(v), mirror: front };
    shutterSound();
    navigator.vibrate?.(30);
    setTimeout(() => setFlash(null), 140);
    return shot;
  };

  const shoot = async () => {
    if (busy.current || phase !== "live") return;
    busy.current = true;
    try {
      const front = await snap(timerOn ? 3 : 0, true);
      if (!front) return;
      // ¿Hay otra cámara? (celular) → también la de atrás, como BeReal
      const cams = (
        await navigator.mediaDevices.enumerateDevices().catch(() => [])
      ).filter((d) => d.kind === "videoinput");
      let back: Shot | null = null;
      if (cams.length > 1) {
        setPhase("second");
        try {
          await openCam("environment");
          await wait(500);
          back = await snap(2, false);
        } catch {
          back = null;
        }
      }
      stop(stream.current);
      stream.current = null;
      await toPrint(back ? compose(back, front, ratio()) : compose(front, undefined, ratio()), film);
    } finally {
      busy.current = false;
    }
  };

  const pickFilm = (f: Film) => void applyFilm(f);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    mark();
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setCamError("");
    try {
      const bmp = await createImageBitmap(file);
      const c = document.createElement("canvas");
      c.width = bmp.width;
      c.height = bmp.height;
      c.getContext("2d")!.drawImage(bmp, 0, 0);
      stop(stream.current);
      stream.current = null;
      await toPrint(compose({ canvas: c, mirror: false }, undefined, c.width / c.height), film);
    } catch {
      setCamError(D.errors.photo[lang]);
    }
  };

  const discard = () => {
    raw.current = null;
    setPhoto(null);
    setPreview(null);
    setPhase("off");
    setSheet(false);
  };

  const fail = (code: string) => {
    const key = (code in D.errors ? code : "generic") as keyof typeof D.errors;
    setError(D.errors[key][lang]);
    setSend("error");
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const message = String(form.get("message") ?? "").trim();
    if (!photo && message.length < 3)
      return fail(message.length ? "short" : "empty");
    if (photo && message.length > 0 && message.length < 3) return fail("short");
    if (message.length > 2000) return fail("long");
    if (photo && photo.size > 5 * 1024 * 1024) return fail("big");
    form.set("startedAt", String(startedAt.current));
    form.set("lang", lang);
    if (photo) form.set("photo", photo, "foto.jpg");
    setWithPhoto(!!photo);
    setSend("sending");
    setError("");
    try {
      const res = await fetch("/api/notes", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setSend("sent");
        return;
      }
      fail((data.error as string) ?? "generic");
    } catch {
      fail("generic");
    }
  };

  const camOn = phase === "live" || phase === "second" || phase === "opening";
  const es = lang === "es";
  const locked = phase === "opening" || phase === "second" || count !== null;
  const chip = (on: boolean) =>
    clsx(
      "rounded-full border-[1.5px] px-3.5 py-1.5 text-[0.85rem] font-bold backdrop-blur-sm transition-colors",
      on ? "border-white bg-white text-ink" : "border-white/60 bg-black/10 text-white",
    );

  return (
    <>
      {/* ───────── El espejo: la cámara ocupa toda la pantalla ───────── */}
      <div
        ref={frame}
        className={clsx(
          "relative mx-auto w-full overflow-hidden rounded-[32px] sm:rounded-[40px]",
          ar && phase !== "off" ? "" : "h-[min(calc(100svh-8rem),720px)] min-h-[520px]",
        )}
        style={{
          background: "linear-gradient(165deg,#FDF4F6 0%,#F9E3E9 55%,#F2CFD9 100%)",
          ...(ar && phase !== "off" ? { aspectRatio: String(ar), width: `min(100%, calc(min(100svh - 8rem, 720px) * ${ar.toFixed(4)}))` } : {}),
        }}
      >
        <video
          ref={live}
          className={clsx("absolute inset-0 h-full w-full object-cover", mirror && "-scale-x-100", !camOn && "hidden")}
          muted
          playsInline
          aria-label={es ? "Espejo (cámara)" : "Mirror (camera)"}
        />

        {phase === "print" && preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="absolute inset-0 h-full w-full scale-105 object-cover opacity-60 blur-md" />
        )}

        {/* el marquito rosa del espejo */}
        <div className="pointer-events-none absolute inset-3 z-[1] rounded-[24px] border-[3px] border-[#E8A9BC] sm:inset-4 sm:rounded-[30px]" aria-hidden />

        {/* ── apagada: título, un solo botón ── */}
        {phase === "off" && (
          <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-8 text-center">
            {!compact && (
              <>
                <h2 className="text-[clamp(2.8rem,7vw,5.5rem)] font-black leading-[0.9] tracking-[-0.05em]">{X.photoTitle[lang]}</h2>
                <p className="mt-4 max-w-[30ch] text-[clamp(1.05rem,1.6vw,1.25rem)] leading-snug text-ink/65">{X.photoSub[lang]}</p>
              </>
            )}
            {/* La invitación: mi polaroid y una vacía al lado, "¿y vos?" */}
            <button type="button" onClick={powerOn} className="group relative mt-2 flex items-end justify-center" aria-label={B.power[lang]}>
              {me && (
                <span className="relative z-[1] -mr-6 block w-[min(34vw,180px)] -rotate-6 bg-white p-2 pb-8 shadow-[0_14px_26px_-14px_rgba(0,0,0,.45)] transition-transform duration-300 group-hover:-rotate-[9deg]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={me} alt="" className="block aspect-[4/5] w-full object-cover" />
                  <span className="absolute bottom-1.5 left-2.5 font-hand text-[1.2rem] text-ink">{es ? "yo ♡" : "me ♡"}</span>
                </span>
              )}
              <span className="relative z-[2] block w-[min(38vw,200px)] rotate-[5deg] bg-white p-2 pb-9 shadow-[0_18px_30px_-14px_rgba(0,0,0,.5)] transition-transform duration-300 group-hover:rotate-[2deg] group-hover:-translate-y-1">
                <span className="grid aspect-[4/5] w-full place-items-center border-2 border-dashed border-[#E8A9BC] bg-[#FDF4F6]">
                  <span className="grid place-items-center gap-1 text-[#9C4F68]">
                    <span className="text-[2.6rem] leading-none transition-transform duration-300 group-hover:scale-110">📸</span>
                    <span className="font-hand text-[1.5rem] leading-none">{es ? "¿y vos?" : "and you?"}</span>
                  </span>
                </span>
                <span className="absolute bottom-2 left-2.5 font-hand text-[1.2rem] text-ink/50">{es ? "tu foto va acá" : "your photo goes here"}</span>
              </span>
            </button>
            <button
              type="button"
              onClick={powerOn}
              className="mt-8 rounded-full bg-[#9C4F68] px-7 py-3.5 text-[1.05rem] font-bold text-white shadow-[0_6px_0_#7a3a50] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_2px_0_#7a3a50]"
            >
              {es ? "Sacate una foto conmigo ✨" : "Take a photo with me ✨"}
            </button>
            <p className="mt-3 max-w-[34ch] text-[0.88rem] leading-snug text-ink/55">
              {es ? "Con flash, cuenta regresiva y filtros. Me llega solo a mí." : "With flash, a countdown and filters. Only I get to see it."}
            </p>
            <div className="mt-5 flex flex-col items-center justify-center gap-x-5 gap-y-2 text-[0.92rem] sm:flex-row text-ink/55">
              <button type="button" onClick={() => fileInput.current?.click()} className="underline decoration-1 underline-offset-4 hover:text-[#9C4F68]">
                {B.upload[lang]}
              </button>
              <span aria-hidden className="hidden sm:inline">·</span>
              <button type="button" onClick={() => setSheet(true)} className="underline decoration-1 underline-offset-4 hover:text-[#9C4F68]">
                {es ? "o mandame solo un mensaje" : "or just send me a message"}
              </button>
            </div>
            {camError && (
              <p className="mt-5 max-w-[32ch] text-[0.9rem] font-semibold text-red" role="alert">
                {camError}
              </p>
            )}
          </div>
        )}

        {/* ── ya sacada: ver y mandar, u otra ── */}
        {phase === "print" && (
          <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-4 px-8 text-center">
            <button
              type="button"
              onClick={() => setSheet(true)}
              className="rounded-full bg-[#9C4F68] px-8 py-4 text-[1.05rem] font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              {es ? "Ver mi foto y mandarla" : "See my photo and send it"}
            </button>
            <button type="button" onClick={powerOn} className="rounded-full bg-white/85 px-6 py-3 font-bold text-ink backdrop-blur-sm hover:bg-white">
              ↺ {B.retake[lang]}
            </button>
          </div>
        )}

        {/* ── prendida: arriba el título chiquito, abajo flash · disparador · 3 seg ── */}
        {camOn && (
          <>
            <div className="absolute inset-x-0 top-0 z-[2] flex items-start justify-between bg-gradient-to-b from-black/45 to-transparent px-7 pb-12 pt-7 text-white sm:px-9">
              <div>
                <p className="text-[1.5rem] font-black leading-none tracking-[-0.03em]">{X.photoTitle[lang]}</p>
                <p className="mt-1 text-[0.95rem] opacity-80">{phase === "live" ? B.powerHint[lang] : phase === "opening" ? B.waiting[lang] : B.second[lang]}</p>
              </div>
              {phase !== "opening" && (
                <button type="button" onClick={powerOff} className="grid h-9 w-9 place-items-center rounded-full bg-black/30 text-[1.3rem] leading-none" aria-label={B.off[lang]}>
                  ×
                </button>
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 z-[2] flex items-center justify-center gap-6 bg-gradient-to-t from-black/50 to-transparent pb-9 pt-16 sm:gap-10">
              <button type="button" role="switch" aria-checked={flashOn} onClick={() => setFlashOn((v) => !v)} className={chip(flashOn)}>
                ⚡ {B.flash[lang]}
              </button>
              <button
                type="button"
                onClick={shoot}
                disabled={locked}
                className="group grid h-[78px] w-[78px] shrink-0 place-items-center rounded-full border-[5px] border-white disabled:opacity-60"
                aria-label={B.shoot[lang]}
              >
                <span className="block h-[58px] w-[58px] rounded-full bg-white transition-transform duration-75 group-active:scale-90" />
              </button>
              <button type="button" role="switch" aria-checked={timerOn} onClick={() => setTimerOn((v) => !v)} className={chip(timerOn)}>
                ⏱ {B.timer[lang]}
              </button>
            </div>
          </>
        )}

        {count !== null && (
          <p
            key={count}
            className="pointer-events-none absolute inset-0 z-[3] grid animate-[sub_.5s_ease-out] place-items-center text-[9rem] font-black leading-none text-white [text-shadow:0_6px_30px_rgba(0,0,0,.4)]"
            aria-live="assertive"
          >
            {count}
          </p>
        )}
        {flash === "finder" && <div className="absolute inset-0 z-[4] bg-white" />}

        <input ref={fileInput} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={onFile} aria-label={B.upload[lang]} />
      </div>

      {/* ───────── Después de la foto: pop-up con la foto, los filtros y el mensaje ───────── */}
      <Modal open={sheet} onClose={closeSheet} label={B.title[lang]} closeLabel={X.close[lang]} className="sm:max-w-[28rem]">
        {send === "sent" ? (
          <div className="flex flex-col items-center gap-6 py-6 text-center" role="status">
            {preview && withPhoto && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="w-[min(70vw,15rem)] rounded-[18px] object-cover" />
            )}
            <p className="text-[clamp(1.8rem,4vw,2.6rem)] font-black leading-tight tracking-[-0.03em]">{withPhoto ? B.sentWithPhoto[lang] : D.sent[lang]}</p>
            <button
              onClick={() => {
                discard();
                setMsg("");
                setSend("idle");
              }}
              className="font-semibold underline decoration-2 underline-offset-4 hover:text-[#9C4F68]"
            >
              {D.another[lang]}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="relative mx-auto w-full pt-2">
            {preview ? (
              <div key={printKey} className="relative mx-auto w-fit max-w-full animate-[eject_.7s_cubic-bezier(.2,.9,.3,1.1)_both] overflow-hidden rounded-[20px] bg-[#f3e6ec]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt={es ? "Tu foto" : "Your photo"} className="block max-h-[46svh] w-auto max-w-full object-contain" />
              </div>
            ) : (
              <p className="pr-8 text-[1.6rem] font-black leading-tight tracking-[-0.03em]">{es ? "Dejame un mensaje" : "Leave me a message"}</p>
            )}

            {preview && (
              <fieldset className="mt-4 min-w-0">
                <legend className="mb-2 text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-ink/50">{es ? "¿le ponemos un filtro?" : "add a filter?"}</legend>
                <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1 pt-0.5 [scrollbar-width:none]" data-lenis-prevent>
                  {[...FILMS]
                    .sort((a, b) => (a.id === "normal" ? -1 : b.id === "normal" ? 1 : 0))
                    .map((f) => {
                      const on = f.id === film.id;
                      return (
                        <button key={f.id} type="button" onClick={() => pickFilm(f)} aria-pressed={on} className="flex w-[4rem] shrink-0 flex-col items-center gap-1">
                          <span className={clsx("block aspect-square w-full overflow-hidden rounded-full border-[3px] transition-colors", on ? "border-[#9C4F68]" : "border-transparent")}>
                            {thumbs[f.id] && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={thumbs[f.id]} alt="" className="h-full w-full object-cover" />
                            )}
                          </span>
                          <span className={clsx("text-center text-[0.7rem] font-bold leading-tight", on ? "text-[#9C4F68]" : "text-ink/60")}>{f.name[lang]}</span>
                        </button>
                      );
                    })}
                </div>
              </fieldset>
            )}

            <label htmlFor="note-message" className="sr-only">
              {B.caption[lang]}
            </label>
            <textarea
              id="note-message"
              name="message"
              maxLength={2000}
              rows={preview ? 2 : 4}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onFocus={mark}
              placeholder={preview ? B.caption[lang] : B.captionOnly[lang].replace("…o d", "D").replace("…or j", "J")}
              className="mt-4 w-full resize-none rounded-[14px] border border-ink/15 bg-white px-3.5 py-3 text-[1rem] leading-snug text-ink placeholder:text-ink/35 focus:border-[#9C4F68] focus:outline-none"
            />

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                name="name"
                maxLength={80}
                autoComplete="name"
                placeholder={D.name[lang]}
                aria-label={D.name[lang]}
                className="rounded-[14px] border border-ink/15 bg-white px-3.5 py-3 text-[1rem] text-ink placeholder:text-ink/35 focus:border-[#9C4F68] focus:outline-none"
              />
              <input
                name="email"
                type="email"
                maxLength={120}
                autoComplete="email"
                placeholder={D.email[lang]}
                aria-label={D.email[lang]}
                className="rounded-[14px] border border-ink/15 bg-white px-3.5 py-3 text-[1rem] text-ink placeholder:text-ink/35 focus:border-[#9C4F68] focus:outline-none"
              />
            </div>
            {/* Trampa para bots: invisible para personas */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <div className="sticky bottom-0 z-10 -mx-1 mt-4 flex flex-wrap items-center gap-4 bg-cream px-1 pb-1 pt-3">
              <button
                type="submit"
                disabled={send === "sending"}
                className="rounded-full bg-[#9C4F68] px-8 py-3.5 text-[1.05rem] font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {send === "sending" ? D.sending[lang] : D.send[lang]}
              </button>
              {preview && (
                <button type="button" onClick={discard} className="text-[0.85rem] font-semibold text-ink/50 hover:text-red">
                  {B.remove[lang]}
                </button>
              )}
              <p role="alert" className="w-full text-[0.95rem] font-semibold text-red empty:hidden">
                {send === "error" ? error : ""}
              </p>
            </div>
            <p className="mt-3 text-[0.78rem] text-ink/45">{B.privacy[lang]}</p>
          </form>
        )}
      </Modal>

      {/* flash de pantalla: te ilumina la cara con la cámara de adelante */}
      {flash === "screen" && <div className="fixed inset-0 z-[90] bg-white" aria-hidden />}
    </>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import { bereal as B, dejame as D, extra as X } from "@/content/site";
import { FILMS, cssFilter, develop, type Film } from "@/lib/film";
import { Pin, Sparkle } from "./Stickers";
import Modal from "./Modal";

/**
 * "Dejame algo" con una cámara de rollo: visor en vivo con filtros,
 * flash (la pantalla se pone blanca para iluminarte), cuenta regresiva,
 * las dos cámaras como BeReal, y la foto que sale y se revela.
 */

const W = 1080;
const H = 1440;
const ROLL = 24;

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

/** La foto "cruda": la grande ocupa todo y la selfie va chiquita arriba (BeReal). */
function compose(main: Shot, inset?: Shot) {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  cover(ctx, main.canvas, 0, 0, W, H, main.mirror);
  if (inset) {
    const iw = W * 0.31;
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

/** Llavecita de metal (como las de las cámaras viejas) */
function Switch({
  on,
  onClick,
  label,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className="flex flex-col items-center gap-1"
      aria-label={label}
    >
      <span className="relative block h-6 w-12 rounded-full bg-[#5a4a52] shadow-[inset_0_2px_4px_rgba(0,0,0,.55),0_1px_0_rgba(255,255,255,.5)]">
        <span
          className="absolute top-[3px] block h-[18px] w-[22px] rounded-full transition-[left] duration-200"
          style={{
            left: on ? 23 : 3,
            background: "linear-gradient(180deg,#fbfbf8,#b9b9b2)",
            boxShadow: "0 2px 3px rgba(0,0,0,.45)",
          }}
        />
      </span>
      <span className="flex items-center gap-1 font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[#7a3a62] [text-shadow:0_1px_0_rgba(255,255,255,.45)]">
        <span
          className={clsx(
            "inline-block h-1.5 w-1.5 rounded-full transition-colors",
            on
              ? "bg-[#ffe066] shadow-[0_0_6px_2px_rgba(255,224,102,.9)]"
              : "bg-[#7a3a62]/40",
          )}
        />
        {label}
      </span>
    </button>
  );
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function FilmCamera({
  lang,
  aside,
}: {
  lang: Locale;
  aside?: React.ReactNode;
}) {
  const live = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const raw = useRef<HTMLCanvasElement | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const startedAt = useRef(0);
  const busy = useRef(false);

  const [phase, setPhase] = useState<Phase>("off");
  const [mirror, setMirror] = useState(true);
  const [film, setFilm] = useState<Film>(
    FILMS.find((f) => f.id === "normal") ?? FILMS[0],
  );
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [flashOn, setFlashOn] = useState(true);
  const [timerOn, setTimerOn] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [flash, setFlash] = useState<"screen" | "finder" | null>(null);
  const [left, setLeft] = useState(ROLL);
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
        width: { ideal: 1440 },
        height: { ideal: 1920 },
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

  /** Miniaturas de la foto con cada filtro (para elegir después de sacarla). */
  const makeThumbs = (canvas: HTMLCanvasElement) => {
    const out: Record<string, string> = {};
    for (const f of FILMS) {
      const c = document.createElement("canvas");
      c.width = 180;
      c.height = 240;
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
      setLeft((n) => Math.max(1, n - 1));
      await toPrint(back ? compose(back, front) : compose(front), film);
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
      await toPrint(compose({ canvas: c, mirror: false }), film);
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

  return (
    <>
      {/* Todo en una pantalla: a la izquierda el título y los rollos, a la derecha la cámara bien grande */}
      <div className="grid items-center gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,1fr)_min(32rem,calc((100svh-9rem)/1.8))] lg:grid-rows-[auto_auto]">
        {aside && (
          <div className="min-w-0 lg:col-start-1 lg:row-start-1 lg:self-end">
            {aside}
          </div>
        )}
        {/* ───────── La cámara ───────── */}
        <div className="relative mx-auto w-[min(100%,30rem,calc((100svh-9rem)/1.8))] pt-5 lg:w-full lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {/* botón disparador arriba */}
          <button
            type="button"
            onClick={camOn ? shoot : powerOn}
            disabled={
              phase === "opening" || phase === "second" || count !== null
            }
            className="absolute right-[12%] top-0 z-10 h-7 w-20 rounded-t-[12px] bg-pink shadow-[inset_0_-5px_0_#b23f86] transition-transform active:translate-y-1.5"
            aria-label={camOn ? B.shoot[lang] : B.power[lang]}
          />
          <div className="relative rounded-[28px] bg-[#d9d4c7] p-3 shadow-[inset_0_4px_0_rgba(255,255,255,.7),inset_0_-6px_0_rgba(0,0,0,.12),0_30px_50px_-24px_rgba(31,33,40,.7)] sm:p-4">
            {/* placa de arriba */}
            <div className="flex items-center justify-between px-2 pb-3">
              <div
                className={clsx(
                  "h-8 w-14 rounded-[6px] border-2 border-[#b9b2a2] transition-colors duration-100",
                  flash
                    ? "bg-white shadow-[0_0_30px_10px_rgba(255,255,255,.9)]"
                    : "bg-[linear-gradient(135deg,#f4f1ea,#cfc8b6)]",
                )}
                style={{ backgroundSize: "6px 6px" }}
                aria-hidden
              />
              <p className="font-serif text-[1.35rem] italic leading-none tracking-[-0.01em] text-ink/80">
                {B.brand}
              </p>
              <p
                className="rounded-[4px] bg-ink px-1.5 font-vhs text-[1.2rem] leading-tight text-[#ffa23a]"
                aria-label={`${left} ${B.shots[lang]}`}
              >
                {String(left).padStart(2, "0")}
              </p>
            </div>

            {/* cuerpo con cuerina rosa */}
            <div
              className="rounded-[20px] p-3 sm:p-4"
              style={{
                background:
                  "radial-gradient(circle at 1px 1px, rgba(0,0,0,.12) 1px, transparent 1.5px) 0 0/6px 6px, #ee9fcf",
              }}
            >
              {/* visor */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-[16px] bg-ink shadow-[inset_0_0_0_6px_#1f2128,0_0_0_4px_#c9c2b1]">
                <video
                  ref={live}
                  className={clsx(
                    "absolute inset-0 h-full w-full object-cover",
                    mirror && "-scale-x-100",
                    !camOn && "hidden",
                  )}
                  style={{ filter: cssFilter(film) }}
                  muted
                  playsInline
                  aria-label={es ? "Visor de la cámara" : "Camera viewfinder"}
                />
                {camOn && (
                  <>
                    {/* viñeta y grano en vivo */}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background: `radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,${film.vignette * 0.9}) 100%)`,
                      }}
                    />
                    <div
                      className="grain pointer-events-none absolute inset-0"
                      style={{ opacity: film.grain ? 1 : 0 }}
                    />
                    <div className="pointer-events-none absolute inset-3 rounded-[10px] border border-white/30" />
                    <span className="pointer-events-none absolute left-4 top-3 font-vhs text-[1.3rem] text-white [text-shadow:0_1px_4px_rgba(0,0,0,.6)]">
                      ● REC
                    </span>
                    {film.date && (
                      <span className="pointer-events-none absolute bottom-3 right-4 font-vhs text-[1.5rem] text-[#ffa23a] [text-shadow:0_0_6px_rgba(255,120,30,.9)]">
                        {`'${String(new Date().getFullYear()).slice(2)} ${new Date().getMonth() + 1} ${new Date().getDate()}`}
                      </span>
                    )}
                  </>
                )}

                {phase === "print" && preview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-40 blur-[2px]"
                  />
                )}

                {(phase === "off" || phase === "print") && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-cream">
                    {phase === "off" && <Sparkle className="h-10 w-10" />}
                    {phase === "print" && (
                      <button
                        type="button"
                        onClick={() => setSheet(true)}
                        className="rounded-full bg-pink px-6 py-3 text-[1.05rem] font-bold text-cream shadow-[0_6px_0_#b23f86] transition-transform hover:scale-105 active:translate-y-1"
                      >
                        {es
                          ? "✉️ ver mi foto y mandarla"
                          : "✉️ see my photo and send it"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={powerOn}
                      className="rounded-full bg-cream px-6 py-3 text-[1.05rem] font-bold text-ink shadow-[0_6px_0_#b9b2a2] transition-transform hover:scale-105 active:translate-y-1"
                    >
                      {phase === "print"
                        ? `↺ ${B.retake[lang]}`
                        : `📸 ${B.power[lang]}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInput.current?.click()}
                      className="text-[0.95rem] underline decoration-1 underline-offset-4 opacity-80 hover:opacity-100"
                    >
                      {B.upload[lang]}
                    </button>
                    {camError && (
                      <p
                        className="max-w-[26ch] text-[0.9rem] text-yellow"
                        role="alert"
                      >
                        {camError}
                      </p>
                    )}
                  </div>
                )}

                {(phase === "opening" || phase === "second") &&
                  count === null && (
                    <p className="absolute inset-x-0 bottom-16 text-center font-hand text-[1.8rem] text-cream [text-shadow:0_2px_10px_rgba(0,0,0,.7)]">
                      {phase === "opening" ? B.waiting[lang] : B.second[lang]}
                    </p>
                  )}
                {phase === "live" && count === null && (
                  <p className="pointer-events-none absolute inset-x-0 top-12 text-center font-hand text-[1.6rem] text-cream [text-shadow:0_2px_10px_rgba(0,0,0,.7)]">
                    {B.powerHint[lang]}
                  </p>
                )}
                {count !== null && (
                  <p
                    key={count}
                    className="pointer-events-none absolute inset-0 grid animate-[sub_.5s_ease-out] place-items-center font-black italic text-[9rem] leading-none text-cream [text-shadow:0_6px_30px_rgba(0,0,0,.5)]"
                    aria-live="assertive"
                  >
                    {count}
                  </p>
                )}
                {flash === "finder" && (
                  <div className="absolute inset-0 bg-white" />
                )}
                {camOn && phase !== "opening" && (
                  <button
                    type="button"
                    onClick={powerOff}
                    className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-cream"
                    aria-label={B.off[lang]}
                  >
                    ×
                  </button>
                )}
              </div>

              {/* controles: dos llavecitas y el disparador */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex gap-4">
                  <Switch
                    on={flashOn}
                    onClick={() => setFlashOn((v) => !v)}
                    label={B.flash[lang]}
                  />
                  <Switch
                    on={timerOn}
                    onClick={() => setTimerOn((v) => !v)}
                    label={B.timer[lang]}
                  />
                </div>
                <button
                  type="button"
                  onClick={camOn ? shoot : powerOn}
                  disabled={
                    phase === "opening" || phase === "second" || count !== null
                  }
                  className="group relative grid h-[74px] w-[74px] shrink-0 place-items-center rounded-full disabled:opacity-70"
                  style={{
                    background:
                      "conic-gradient(from 200deg, #f7f7f4, #9c9c96, #ececea, #7d7d78, #f7f7f4)",
                    boxShadow:
                      "0 6px 10px -4px rgba(0,0,0,.45), inset 0 0 0 1px rgba(0,0,0,.15)",
                  }}
                  aria-label={camOn ? B.shoot[lang] : B.power[lang]}
                >
                  <span
                    className="block h-[50px] w-[50px] rounded-full transition-transform duration-75 group-active:scale-90"
                    style={{
                      background:
                        "radial-gradient(circle at 35% 30%, #ffd3ec 0 12%, #e15cae 45%, #a8337c 100%)",
                      boxShadow:
                        "0 3px 0 #7d2259, inset 0 -3px 6px rgba(0,0,0,.25)",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            onChange={onFile}
            aria-label={B.upload[lang]}
          />
        </div>

        {/* mandar solo un mensaje */}
        <div className="min-w-0 lg:col-start-1 lg:row-start-2 lg:self-start">
          <p className="text-center lg:text-left">
            <button
              type="button"
              onClick={() => setSheet(true)}
              className="font-hand text-[1.4rem] leading-none text-ink/60 underline decoration-1 underline-offset-4 hover:text-pink"
            >
              {es
                ? "…o mandame solo un mensaje ✉️"
                : "…or just send me a message ✉️"}
            </button>
          </p>
        </div>
      </div>

      {/* ───────── La foto que sale + el mensaje: en un pop-up ───────── */}
      <Modal
        open={sheet}
        onClose={closeSheet}
        label={B.title[lang]}
        closeLabel={X.close[lang]}
        className="sm:max-w-[30rem]"
      >
        {send === "sent" ? (
          <div
            className="flex flex-col items-center gap-6 py-6 text-center"
            role="status"
          >
            {preview && withPhoto && (
              <div className="w-[min(70vw,16rem)] rotate-[-4deg] bg-white p-3 pb-10 shadow-[0_20px_40px_-20px_rgba(31,33,40,.6)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt=""
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
            )}
            <p className="text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight tracking-[-0.03em]">
              {withPhoto ? B.sentWithPhoto[lang] : D.sent[lang]}
            </p>
            <button
              onClick={() => {
                discard();
                setMsg("");
                setSend("idle");
              }}
              className="font-semibold underline decoration-2 underline-offset-4 hover:text-pink"
            >
              {D.another[lang]}
            </button>
          </div>
        ) : (
          <form
            onSubmit={submit}
            noValidate
            className="relative mx-auto w-full max-w-[26rem] pt-4"
          >
            <div
              key={printKey}
              className={clsx(
                "relative bg-white p-3 pb-4 shadow-[0_24px_44px_-22px_rgba(31,33,40,.65)]",
                preview
                  ? "animate-[eject_.9s_cubic-bezier(.2,.9,.3,1.2)_both]"
                  : "",
              )}
              style={{ rotate: "2deg" }}
            >
              <Pin className="absolute -top-2 left-1/2 z-10 h-6 w-6 -translate-x-1/2" />
              <div className="relative aspect-[3/4] overflow-hidden bg-[#ece8de]">
                {preview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt={es ? "Tu foto" : "Your photo"}
                      className="absolute inset-0 h-full w-full animate-[develop_4.5s_ease-out_both] object-cover"
                    />
                    <span className="pointer-events-none absolute inset-x-0 top-1/2 animate-[develop-label_4.5s_ease-out_both] text-center font-hand text-[1.6rem] text-ink/60">
                      {B.developing[lang]}
                    </span>
                  </>
                ) : (
                  <div className="absolute inset-3 flex items-center justify-center border-2 border-dashed border-ink/20 text-center font-hand text-[1.6rem] text-ink/40">
                    {B.printHere[lang]} ✨
                  </div>
                )}
              </div>
              {preview && (
                <fieldset className="mt-3 min-w-0">
                  <legend className="mb-1.5 font-hand text-[1.35rem] leading-none text-ink/70">
                    {es ? "¿le ponemos un filtro? ✨" : "add a filter? ✨"}
                  </legend>
                  <div
                    className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]"
                    data-lenis-prevent
                  >
                    {[...FILMS].sort((a, b) => (a.id === "normal" ? -1 : b.id === "normal" ? 1 : 0)).map((f) => {
                      const on = f.id === film.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => pickFilm(f)}
                          aria-pressed={on}
                          className="flex w-[4.4rem] shrink-0 flex-col items-center gap-1"
                        >
                          <span
                            className={clsx(
                              "block aspect-[3/4] w-full overflow-hidden rounded-[8px] border-2 transition-transform",
                              on
                                ? "-translate-y-0.5 border-pink shadow-[0_4px_0_#b23f86]"
                                : "border-transparent",
                            )}
                          >
                            {thumbs[f.id] && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={thumbs[f.id]}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            )}
                          </span>
                          <span
                            className={clsx(
                              "text-center text-[0.7rem] font-bold leading-tight",
                              on ? "text-pink" : "text-ink/70",
                            )}
                          >
                            {f.name[lang]}
                          </span>
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
                rows={3}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onFocus={mark}
                placeholder={
                  preview
                    ? B.caption[lang]
                    : `${B.caption[lang]} ${B.captionOnly[lang]}`
                }
                className="mt-2 w-full resize-none bg-transparent px-1 font-hand text-[1.7rem] leading-[1.05] text-ink placeholder:text-ink/35 focus:outline-none"
              />
              <div className="flex items-center justify-between px-1">
                {preview ? (
                  <button
                    type="button"
                    onClick={discard}
                    className="text-[0.8rem] font-semibold text-ink/60 underline underline-offset-2 hover:text-red"
                  >
                    {B.remove[lang]}
                  </button>
                ) : (
                  <span />
                )}
                <span
                  className="font-mono text-[0.68rem] text-ink/40"
                  aria-hidden
                >
                  {msg.length}/2000
                </span>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-ink/70">
                {D.name[lang]}
                <input
                  name="name"
                  maxLength={80}
                  autoComplete="name"
                  className="rounded-[12px] border-2 border-ink/80 bg-white px-3 py-2.5 text-[1rem] font-normal normal-case tracking-normal text-ink focus:border-blue focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-ink/70">
                {D.email[lang]}
                <input
                  name="email"
                  type="email"
                  maxLength={120}
                  autoComplete="email"
                  className="rounded-[12px] border-2 border-ink/80 bg-white px-3 py-2.5 text-[1rem] font-normal normal-case tracking-normal text-ink focus:border-blue focus:outline-none"
                />
              </label>
            </div>
            {/* Trampa para bots: invisible para personas */}
            <div
              aria-hidden
              className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
            >
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <div className="sticky bottom-0 z-10 -mx-1 mt-5 flex flex-wrap items-center gap-4 bg-cream px-1 pb-1 pt-3">
              <button
                type="submit"
                disabled={send === "sending"}
                className="rounded-full bg-pink px-8 py-3.5 text-[1.05rem] font-bold text-cream shadow-[0_8px_0_#b23f86] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_3px_0_#b23f86] disabled:opacity-60"
              >
                {send === "sending" ? D.sending[lang] : D.send[lang]}
              </button>
              <p role="alert" className="text-[0.95rem] font-semibold text-red">
                {send === "error" && error}
              </p>
            </div>
            <p className="mt-4 font-mono text-[0.75rem] text-ink/60">
              {B.privacy[lang]}
            </p>
          </form>
        )}
      </Modal>

      {/* flash de pantalla: te ilumina la cara con la cámara de adelante */}
      {flash === "screen" && (
        <div className="fixed inset-0 z-[90] bg-white" aria-hidden />
      )}
    </>
  );
}

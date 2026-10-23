"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import { charlemos as C } from "@/content/site";
import { Sparkle } from "../Stickers";

type State = "idle" | "sending" | "sent" | "error";

/** Los próximos 14 días (en hora de Buenos Aires) como fichas de calendario. */
function nextDays(lang: Locale) {
  const out: { iso: string; wd: string; d: string; m: string }[] = [];
  const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(lang === "es" ? "es-AR" : "en-US", { ...o, timeZone: "America/Argentina/Buenos_Aires" });
  const iso = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
  const now = new Date();
  for (let i = 1; i <= 14; i++) {
    const day = new Date(now.getTime() + i * 86400000);
    out.push({ iso: iso.format(day), wd: fmt({ weekday: "short" }).format(day), d: fmt({ day: "numeric" }).format(day), m: fmt({ month: "short" }).format(day) });
  }
  return out;
}

export default function Charlemos({ lang }: { lang: Locale }) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const topics: string[] = [];
  const [days, setDays] = useState<string[]>([]);
  const slot = "cualquiera";
  const startedAt = useRef(0);
  const mark = useCallback(() => {
    if (!startedAt.current) startedAt.current = Date.now();
  }, []);
  // Los días se calculan en el navegador (la página es estática: si no, quedarían los del día que se publicó)
  const [list, setList] = useState<ReturnType<typeof nextDays>>([]);
  useEffect(() => {
    const id = requestAnimationFrame(() => setList(nextDays(lang)));
    return () => cancelAnimationFrame(id);
  }, [lang]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string, max = 9) => {
    mark();
    set(arr.includes(v) ? arr.filter((x) => x !== v) : arr.length >= max ? [...arr.slice(1), v] : [...arr, v]);
  };

  const fail = (code: string) => {
    const k = (code in C.errors ? code : "generic") as keyof typeof C.errors;
    setError(C.errors[k][lang]);
    setState("error");
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    if (!name) return fail("name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("email");
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message: f.get("message"),
          website: f.get("website"),
          topics,
          days,
          slot,
          lang,
          startedAt: startedAt.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) return setState("sent");
      fail((data.error as string) ?? "generic");
    } catch {
      fail("generic");
    }
  };

  return (
    <section id="charlemos" className="relative scroll-mt-16 px-3 py-6 sm:px-6" aria-labelledby="charlemos-title">
      <div
        className="slide relative mx-auto max-w-[1500px] overflow-hidden px-5 py-10 sm:px-10 sm:py-12"
        style={{ background: "radial-gradient(circle at 85% 10%, #dfe7ff 0, transparent 45%), var(--cream)" }}
      >
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative">
            <h2 id="charlemos-title" className="text-[clamp(2.9rem,9vw,7rem)] font-black italic leading-[0.85] tracking-[-0.06em]">
              <span className="hello-grad pb-[0.06em] pr-[0.08em]">{C.title[lang].replace(" ☎️", "")}</span> <span aria-hidden>☎️</span>
            </h2>
            <p className="mt-4 max-w-[38ch] text-[clamp(1.05rem,1.6vw,1.25rem)] font-medium leading-snug">{C.sub[lang]}</p>
            <Sparkle className="absolute right-4 top-2 h-9 w-9" />
          </div>

          {state === "sent" ? (
            <div className="flex flex-col items-start justify-center gap-4" role="status">
              <p className="text-[clamp(1.8rem,3.4vw,2.8rem)] font-black leading-tight tracking-[-0.03em]">{C.sent[lang]}</p>
              <button
                onClick={() => {
                  setState("idle");
                  setDays([]);
                }}
                className="font-semibold underline decoration-2 underline-offset-4 hover:text-pink"
              >
                {C.another[lang]}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex min-w-0 flex-col gap-5">
              <fieldset className="min-w-0">
                <legend className="mb-2 text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-ink/70">
                  {C.daysLabel[lang]} <span className="font-normal normal-case tracking-normal">· {C.tz[lang]}</span>
                </legend>
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 pt-1 [scrollbar-width:thin]" data-lenis-prevent>
                  {list.map((d) => {
                    const on = days.includes(d.iso);
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(days, setDays, d.iso, 3)}
                        className={clsx(
                          "flex w-[4.2rem] shrink-0 flex-col items-center overflow-hidden rounded-[12px] border-2 bg-white pb-1.5 transition-transform",
                          on ? "-translate-y-1 border-ink shadow-[0_4px_0_#1f2128]" : "border-ink/20 hover:border-ink/50",
                        )}
                      >
                        <span className={clsx("w-full py-0.5 text-center text-[0.68rem] font-bold uppercase", on ? "bg-pink text-cream" : "bg-sky text-ink/70")}>{d.m}</span>
                        <span className="mt-0.5 text-[1.5rem] font-black leading-none">{d.d}</span>
                        <span className="text-[0.72rem] text-ink/60">{d.wd}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-ink/70">
                  {C.name[lang]}
                  <input name="name" required maxLength={80} autoComplete="name" onFocus={mark} className="rounded-[12px] border-2 border-ink/80 bg-white px-3 py-2.5 text-[1rem] font-normal normal-case tracking-normal text-ink focus:border-blue focus:outline-none" />
                </label>
                <label className="flex flex-col gap-1 text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-ink/70">
                  {C.email[lang]}
                  <input name="email" type="email" required maxLength={120} autoComplete="email" onFocus={mark} className="rounded-[12px] border-2 border-ink/80 bg-white px-3 py-2.5 text-[1rem] font-normal normal-case tracking-normal text-ink focus:border-blue focus:outline-none" />
                </label>
              </div>
              <label className="flex flex-col gap-1 text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-ink/70">
                {C.message[lang]}
                <textarea name="message" rows={3} maxLength={1000} onFocus={mark} className="resize-none rounded-[12px] border-2 border-ink/80 bg-white px-3 py-2.5 font-hand text-[1.4rem] font-normal normal-case leading-snug tracking-normal text-ink focus:border-blue focus:outline-none" />
              </label>
              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="rounded-full bg-ink px-8 py-3.5 text-[1.05rem] font-bold text-cream shadow-[0_6px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_2px_0_#000] disabled:opacity-60"
                >
                  {state === "sending" ? C.sending[lang] : C.send[lang]}
                </button>
                <p role="alert" className="text-[0.95rem] font-semibold text-red">
                  {state === "error" && error}
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

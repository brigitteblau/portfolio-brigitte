"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { EntryMeta } from "@/lib/journal";
import { dejame as D, sigue as S, journal as J } from "@/content/site";
import Panel from "../Panel";
import { Asterisk } from "../Stickers";

/** La segunda parte del sitio: lo que todavía se está escribiendo (journal + mensajes). */
function Journal({ lang, entries }: { lang: Locale; entries: EntryMeta[] }) {
  const fmt = new Intl.DateTimeFormat(lang === "es" ? "es-AR" : "en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const list = entries.slice(0, 3);
  return (
    <div className="relative flex h-full flex-col justify-center gap-10 px-5 pb-24 pt-16 sm:px-12">
      <div className="flex items-start justify-between gap-6">
        <h2 className="max-w-[14ch] font-serif text-[clamp(2.6rem,6.5vw,6rem)] italic leading-[0.95] tracking-[-0.03em]">{S.title[lang]}</h2>
        <Asterisk className="hidden w-20 shrink-0 animate-[spin_24s_linear_infinite] text-cobalt sm:block" />
      </div>
      <div>
        <p className="font-mono text-[0.78rem] text-navy/60">{S.journalLead[lang]}</p>
        {list.length === 0 ? (
          <p className="mt-3 font-serif text-[1.4rem] italic">{J.empty[lang]}</p>
        ) : (
          <ol className="mt-3 divide-y divide-navy/15 border-y border-navy/15">
            {list.map((e) => (
              <li key={e.slug}>
                <Link href={`/${lang}/journal/${e.slug}`} className="group flex items-baseline justify-between gap-6 py-4">
                  <span className="font-serif text-[clamp(1.4rem,2.4vw,2rem)] italic leading-tight group-hover:text-cobalt">{e.title}</span>
                  <time dateTime={e.date} className="shrink-0 font-mono text-[0.78rem] text-navy/60">
                    {e.date ? fmt.format(new Date(e.date)) : ""}
                  </time>
                </Link>
              </li>
            ))}
          </ol>
        )}
        <Link href={`/${lang}/journal`} className="mt-5 inline-block font-semibold underline decoration-1 underline-offset-4 hover:text-cobalt">
          {S.allEntries[lang]}
        </Link>
      </div>
    </div>
  );
}

type State = "idle" | "sending" | "sent" | "error";

function Dejame({ lang }: { lang: Locale }) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string>("");
  const [msg, setMsg] = useState("");
  const startedAt = useRef<number>(0);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const message = String(form.get("message") ?? "").trim();
    if (message.length < 3) return fail("short");
    if (message.length > 2000) return fail("long");
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          name: form.get("name"),
          email: form.get("email"),
          website: form.get("website"),
          startedAt: startedAt.current,
          lang,
        }),
      });
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

  const fail = (code: string) => {
    const key = (code in D.errors ? code : "generic") as keyof typeof D.errors;
    setError(D.errors[key][lang]);
    setState("error");
  };

  return (
    <div className="relative grid h-full content-center gap-8 overflow-y-auto px-5 pb-24 pt-16 text-paper sm:px-12 md:grid-cols-[0.9fr_1.1fr] md:gap-14" data-lenis-prevent>
      <div>
        <h2 className="font-serif text-[clamp(3rem,7vw,6.5rem)] italic leading-[0.92] tracking-[-0.03em]">{D.title[lang]}</h2>
        <p className="mt-5 max-w-[34ch] text-[1.15rem] leading-snug opacity-90">{D.body[lang]}</p>
        <p className="mt-6 font-mono text-[0.78rem] opacity-70">{D.privacy[lang]}</p>
      </div>

      {state === "sent" ? (
        <div className="flex flex-col items-start justify-center gap-5" role="status">
          <p className="font-serif text-[clamp(2rem,4vw,3rem)] italic leading-tight">{D.sent[lang]}</p>
          <button onClick={() => setState("idle")} className="font-semibold underline decoration-1 underline-offset-4 hover:text-yellow">
            {D.another[lang]}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-3" noValidate>
          <label htmlFor="note-message" className="sr-only">
            {D.placeholder[lang]}
          </label>
          <textarea
            id="note-message"
            name="message"
            required
            minLength={3}
            maxLength={2000}
            rows={7}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onFocus={() => {
              if (!startedAt.current) startedAt.current = Date.now();
            }}
            placeholder={D.placeholder[lang]}
            className="w-full resize-none rounded-md border border-white/30 bg-white/10 p-4 font-serif text-[1.25rem] leading-relaxed text-paper placeholder:text-white/50 focus:border-white focus:outline-none"
          />
          <p className="text-right font-mono text-[0.72rem] opacity-60" aria-hidden>
            {msg.length}/2000
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 font-mono text-[0.75rem] opacity-90">
              {D.name[lang]}
              <input name="name" maxLength={80} autoComplete="name" className="rounded-md border border-white/30 bg-white/10 px-3 py-2.5 font-sans text-[1rem] text-paper focus:border-white focus:outline-none" />
            </label>
            <label className="flex flex-col gap-1 font-mono text-[0.75rem] opacity-90">
              {D.email[lang]}
              <input name="email" type="email" maxLength={120} autoComplete="email" className="rounded-md border border-white/30 bg-white/10 px-3 py-2.5 font-sans text-[1rem] text-paper focus:border-white focus:outline-none" />
            </label>
          </div>
          {/* Trampa para bots: invisible para personas */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={state === "sending"}
              className="rounded-full bg-paper px-8 py-3.5 text-[1.05rem] font-semibold text-cobalt transition-colors hover:bg-yellow hover:text-navy disabled:opacity-60"
            >
              {state === "sending" ? D.sending[lang] : D.send[lang]}
            </button>
            <p role="alert" className="text-[0.95rem]">
              {state === "error" && error}
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

export default function Sigue({ lang, entries }: { lang: Locale; entries: EntryMeta[] }) {
  return (
    <>
      <Panel id="sigue" era="sigue" className="bg-white" label={S.title[lang]}>
        <Journal lang={lang} entries={entries} />
      </Panel>
      <Panel id="dejame" era="sigue" className="bg-cobalt" label={D.title[lang]}>
        <Dejame lang={lang} />
      </Panel>
    </>
  );
}

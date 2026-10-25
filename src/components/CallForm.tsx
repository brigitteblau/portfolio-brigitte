"use client";

import { useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

/** "Agendá una call", versión sobria: se despliega un formulario corto y me llega un mail. */
const t = {
  open: { es: "Agendá una call", en: "Book a call" },
  intro: { es: "Dejame tus datos y te escribo para coordinar.", en: "Leave your details and I'll email you to set it up." },
  name: { es: "Nombre", en: "Name" },
  email: { es: "Mail", en: "Email" },
  day: { es: "Día que te queda bien (opcional)", en: "A day that works for you (optional)" },
  message: { es: "¿De qué querés hablar? (opcional)", en: "What would you like to talk about? (optional)" },
  send: { es: "Enviar", en: "Send" },
  sending: { es: "Enviando…", en: "Sending…" },
  sent: { es: "Listo, me llegó. Te escribo pronto.", en: "Done, I got it. I'll be in touch soon." },
  errName: { es: "Falta tu nombre.", en: "Your name is missing." },
  errEmail: { es: "Ese mail no parece válido.", en: "That email doesn't look right." },
  errRate: { es: "Muchos pedidos seguidos. Probá más tarde.", en: "Too many requests. Try again later." },
  errGeneric: { es: "No se pudo enviar. Escribime por mail.", en: "Couldn't send it. Please email me." },
};

const field = "w-full rounded-[10px] border border-[#e3e3e6] bg-white px-3 py-2.5 text-[15px] text-[#1d1d1f] placeholder:text-[#a1a1a6] focus:border-[#B5677E] focus:outline-none";

export default function CallForm({ lang }: { lang: Locale }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const startedAt = useRef(0);
  const [min, setMin] = useState("");

  const toggle = () => {
    if (!startedAt.current) startedAt.current = Date.now();
    if (!min) setMin(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
    setOpen((v) => !v);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const day = String(f.get("day") ?? "");
    const fail = (m: string) => (setError(m), setState("error"));
    if (!name) return fail(t.errName[lang]);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(t.errEmail[lang]);
    setState("sending");
    try {
      const res = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: f.get("message"), website: f.get("website"), days: day ? [day] : [], slot: "cualquiera", topics: [], lang, startedAt: startedAt.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) return setState("sent");
      fail(data.error === "rate" ? t.errRate[lang] : data.error === "email" ? t.errEmail[lang] : t.errGeneric[lang]);
    } catch {
      fail(t.errGeneric[lang]);
    }
  };

  return (
    <div className="mt-4">
      <button type="button" onClick={toggle} aria-expanded={open} className="inline-flex items-center gap-1.5 rounded-full border border-[#E8A9BC] px-3.5 py-1.5 text-[0.85rem] text-[#B5677E] transition-colors hover:bg-[#FDF2F5]">
        {t.open[lang]}
        <span aria-hidden className={`transition-transform ${open ? "rotate-90" : ""}`}>
          →
        </span>
      </button>
      {open &&
        (state === "sent" ? (
          <p className="mt-5 text-[#55555a]" role="status">
            {t.sent[lang]}
          </p>
        ) : (
          <form onSubmit={submit} noValidate className="mt-5 grid gap-3">
            <p className="text-[#55555a]">{t.intro[lang]}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="name" maxLength={80} autoComplete="name" placeholder={t.name[lang]} aria-label={t.name[lang]} className={field} />
              <input name="email" type="email" maxLength={120} autoComplete="email" placeholder={t.email[lang]} aria-label={t.email[lang]} className={field} />
            </div>
            <label className="grid gap-1 text-[0.85rem] text-[#86868b]">
              {t.day[lang]}
              <input name="day" type="date" min={min} className={field} />
            </label>
            <textarea name="message" rows={3} maxLength={1000} placeholder={t.message[lang]} aria-label={t.message[lang]} className={`${field} resize-none`} />
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <input name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" disabled={state === "sending"} className="rounded-full bg-[#9C4F68] px-5 py-2 text-[0.9rem] text-white transition-opacity hover:opacity-90 disabled:opacity-60">
                {state === "sending" ? t.sending[lang] : t.send[lang]}
              </button>
              {state === "error" && (
                <p role="alert" className="text-[0.9rem] text-[#c0392b]">
                  {error}
                </p>
              )}
            </div>
          </form>
        ))}
    </div>
  );
}

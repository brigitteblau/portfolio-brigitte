"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { ui } from "@/content/site";
import { Asterisk } from "./Stickers";

function useBuenosAiresTime(lang: Locale) {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(lang === "es" ? "es-AR" : "en-US", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Argentina/Buenos_Aires",
    });
    const update = () => setNow(fmt.format(new Date()));
    update();
    const id = setInterval(update, 15_000);
    return () => clearInterval(id);
  }, [lang]);
  return now;
}

export default function MenuBar({ lang }: { lang: Locale }) {
  const pathname = usePathname() ?? `/${lang}`;
  const time = useBuenosAiresTime(lang);
  const other: Locale = lang === "es" ? "en" : "es";
  const switchHref = pathname.replace(/^\/(es|en)(?=\/|$)/, `/${other}`);

  return (
    <header className="fixed inset-x-2 top-2 z-50 flex h-10 items-center justify-between rounded-full bg-cream/95 px-2 text-[0.9rem] font-semibold shadow-[0_10px_24px_-14px_rgba(31,33,40,.6)] sm:inset-x-4 sm:px-3">
      <nav className="flex min-w-0 items-center gap-0.5 sm:gap-2" aria-label="Principal">
        <Link href={`/${lang}`} className="flex items-center gap-2 rounded-full px-1.5 py-1 sm:px-2.5 hover:bg-sky">
          <Asterisk className="h-4 w-4 shrink-0" color="var(--pink)" />
          <span className="sr-only">{ui.fullName}</span>
        </Link>
        {(
          [
            ["proyectos", ui.menu.projects],
            ["journal", ui.menu.journal],
            ["dejame", ui.menu.note],
            ["charlemos", ui.menu.contact],
          ] as const
        ).map(([id, label]) =>
          id === "journal" ? (
            <Link key={id} href={`/${lang}/journal`} className="whitespace-nowrap rounded-full px-1.5 py-1 sm:px-2.5 hover:bg-sky">
              {label[lang]}
            </Link>
          ) : (
            <Link
              key={id}
              href={`/${lang}/onda#${id}`}
              onClick={(e) => {
                if (pathname === `/${lang}/onda`) {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent("goto", { detail: id }));
                }
              }}
              className={`whitespace-nowrap rounded-full px-1.5 py-1 sm:px-2.5 hover:bg-sky ${id === "charlemos" ? "hidden md:inline" : ""}`}
            >
              {label[lang]}
            </Link>
          ),
        )}
      </nav>
      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href={switchHref}
          hrefLang={other}
          className="rounded-full px-1.5 py-1 sm:px-2.5 hover:bg-sky"
          aria-label={other === "en" ? "Switch to English" : "Cambiar a español"}
        >
          <span className={lang === "es" ? "font-semibold" : "opacity-50"}>ES</span>
          <span className="opacity-40"> / </span>
          <span className={lang === "en" ? "font-semibold" : "opacity-50"}>EN</span>
        </Link>
        <span className="hidden tabular-nums opacity-80 sm:inline" suppressHydrationWarning>
          {time}
        </span>
      </div>
    </header>
  );
}

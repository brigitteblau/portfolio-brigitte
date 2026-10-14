"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { ui } from "@/content/site";
import { Star } from "./Stickers";

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
    <header className="fixed inset-x-0 top-0 z-50 flex h-9 items-center justify-between border-b border-navy/10 bg-paper/70 px-3 text-[0.875rem] backdrop-blur-xl sm:px-4">
      <nav className="flex items-center gap-1 sm:gap-3" aria-label="Principal">
        <Link href={`/${lang}`} className="flex items-center rounded px-1.5 py-0.5 hover:bg-navy/10" aria-label={ui.menu.home[lang]}>
          <Star className="h-5 w-5" color="var(--pink)" />
        </Link>
        <Link href={`/${lang}`} className="rounded px-1.5 py-0.5 font-semibold hover:bg-navy/10">
          {ui.menu.home[lang]}
        </Link>
        <Link href={`/${lang}/journal`} className="rounded px-1.5 py-0.5 hover:bg-navy/10">
          {ui.menu.journal[lang]}
        </Link>
        <Link
          href={`/${lang}#contacto`}
          onClick={(e) => {
            if (pathname === `/${lang}`) {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent("goto", { detail: "contacto" }));
            }
          }}
          className="hidden rounded px-1.5 py-0.5 hover:bg-navy/10 sm:inline"
        >
          {ui.menu.contact[lang]}
        </Link>
      </nav>
      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href={switchHref}
          hrefLang={other}
          className="rounded px-1.5 py-0.5 hover:bg-navy/10"
          aria-label={other === "en" ? "Switch to English" : "Cambiar a español"}
        >
          <span className={lang === "es" ? "font-semibold" : "opacity-50"}>ES</span>
          <span className="opacity-40"> / </span>
          <span className={lang === "en" ? "font-semibold" : "opacity-50"}>EN</span>
        </Link>
        <span className="tabular-nums opacity-80" suppressHydrationWarning>
          {time}
        </span>
      </div>
    </header>
  );
}

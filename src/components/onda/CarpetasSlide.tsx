"use client";

import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/lib/i18n";
import type { Folder } from "@/lib/photos";
import type { EntryMeta } from "@/lib/journal";
import Link from "next/link";
import { FolderIcon, Finder } from "../sections/Carpetas";

const TINT = ["#E8A9BC", "#A47551", "#4A2C2A", "#E9D6C4"];

/** "Yep! Esta soy yo": a la izquierda mis carpetas (fotos y videos, se abren en una ventanita); a la derecha, mi journal. */
export default function CarpetasSlide({ lang, folders, entries }: { lang: Locale; folders: Folder[]; entries: EntryMeta[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const es = lang === "es";
  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col justify-center px-6 pb-16 pt-24 sm:px-12 lg:pb-14">
      <p className="font-hand text-[clamp(1.4rem,2.2vw,2rem)] opacity-70">{es ? "un poco de todo" : "a bit of everything"}</p>
      <h2 className="mt-1 font-[Shrikhand] text-[clamp(3rem,7vw,6rem)] leading-[1]">{es ? "Yep! Esta soy yo" : "Yep! This is me"}</h2>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.08em] opacity-60">{es ? "mis carpetas" : "my folders"}</p>
        <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-6">
          {folders.map((f, i) => (
            <li key={f.name}>
              <button type="button" onClick={() => setOpen(i)} className="group flex flex-col items-center gap-2 rounded-[14px] p-2 focus-visible:bg-white/40">
                <span className="relative isolate">
                  <FolderIcon color={TINT[i % TINT.length]} className="h-auto w-[clamp(5.5rem,9vw,8rem)] drop-shadow-[0_10px_14px_rgba(74,44,42,.25)] transition-transform duration-300 group-hover:-translate-y-1.5" />
                  {f.items[0]?.kind === "img" && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.items[0].src} alt="" className="absolute left-1/2 top-[-6%] -z-10 h-[58%] w-[60%] -translate-x-1/2 rotate-[-5deg] rounded-[4px] border-2 border-white object-cover shadow transition-transform duration-300 group-hover:-translate-y-5" />
                  )}
                </span>
                <span className="font-[Shrikhand] text-[1.25rem]">{f.name}</span>
                <span className="text-[0.8rem] opacity-60">
                  {f.items.length} {es ? "cosas" : "items"}
                </span>
              </button>
            </li>
          ))}
        </ul>
        </div>
        <div>
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.08em] opacity-60">{es ? "mi journal · lo que voy pensando" : "my journal · what I'm thinking about"}</p>
          <ul className="mt-5 space-y-4">
            {entries.slice(0, 2).map((e, i) => (
              <li key={e.slug} style={{ rotate: `${[-1, 0.8][i]}deg` }}>
                <Link href={`/${lang}/journal/${e.slug}`} className="group block rounded-[10px] bg-[#FBF4EE] p-5 shadow-[0_16px_30px_-20px_rgba(0,0,0,.55)] transition-transform hover:-translate-y-1">
                  <h3 className="font-[Shrikhand] text-[1.6rem] leading-[1.05]">{e.title}</h3>
                  {e.excerpt && <p className="mt-2 leading-snug opacity-75">{e.excerpt}</p>}
                  <p className="mt-3 text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[#9C4F68]">{es ? "Leer →" : "Read →"}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={`/${lang}/journal`} className="mt-5 inline-block font-hand text-[1.5rem] underline decoration-[#E8A9BC] decoration-2 underline-offset-4">
            {es ? "todo el journal →" : "the whole journal →"}
          </Link>
        </div>
      </div>
      {/* La ventanita va al body: dentro de la cinta que se mueve, "fixed" no funcionaría */}
      {open !== null && folders[open] && createPortal(<Finder folder={folders[open]} color={TINT[open % TINT.length]} lang={lang} onClose={close} />, document.body)}
    </div>
  );
}

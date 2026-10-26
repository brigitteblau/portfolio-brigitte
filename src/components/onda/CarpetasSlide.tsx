"use client";

import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/lib/i18n";
import type { Folder } from "@/lib/photos";
import { FolderIcon, Finder } from "../sections/Carpetas";

const TINT = ["#E8A9BC", "#A47551", "#4A2C2A", "#E9D6C4"];

/** "Yep! Esta soy yo": carpetas tipo Mac con fotos y videos; se abren en una ventanita. */
export default function CarpetasSlide({ lang, folders }: { lang: Locale; folders: Folder[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const es = lang === "es";
  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col justify-center px-6 pb-16 pt-24 sm:px-12 lg:pb-14">
      <p className="font-hand text-[clamp(1.4rem,2.2vw,2rem)] opacity-70">{es ? "un poco de todo" : "a bit of everything"}</p>
      <h2 className="mt-1 font-[Shrikhand] text-[clamp(3rem,7vw,6rem)] leading-[1]">{es ? "Yep! Esta soy yo" : "Yep! This is me"}</h2>
      <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-8">
        {folders.map((f, i) => (
          <li key={f.name}>
            <button type="button" onClick={() => setOpen(i)} className="group flex flex-col items-center gap-2 rounded-[14px] p-2 focus-visible:bg-white/40">
              <span className="relative isolate">
                <FolderIcon color={TINT[i % TINT.length]} className="h-auto w-[clamp(6rem,11vw,9.5rem)] drop-shadow-[0_10px_14px_rgba(74,44,42,.25)] transition-transform duration-300 group-hover:-translate-y-1.5" />
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
      {/* La ventanita va al body: dentro de la cinta que se mueve, "fixed" no funcionaría */}
      {open !== null && folders[open] && createPortal(<Finder folder={folders[open]} color={TINT[open % TINT.length]} lang={lang} onClose={close} />, document.body)}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { deck as D, talk as T, contact as C } from "@/content/onda";
import CallForm from "../CallForm";

/** La última: el nombre completo, ¿Querés conocerme? (el "No" se escapa) y, con el Sí, la call. */
export default function Fin({ lang }: { lang: Locale }) {
  const arena = useRef<HTMLDivElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ left: 58, top: 22, r: 0 });
  const [taunt, setTaunt] = useState<string | null>(null);
  const [yes, setYes] = useState(false);
  const tries = useRef(0);

  const flee = () => {
    const box = arena.current?.getBoundingClientRect();
    const btn = noRef.current?.getBoundingClientRect();
    if (!box || !btn) return;
    const maxX = 100 - (btn.width / box.width) * 100;
    const maxY = 100 - (btn.height / box.height) * 100;
    let left = Math.random() * maxX;
    let top = Math.random() * maxY;
    if (Math.abs(left - pos.left) < 20) left = (left + maxX / 2) % maxX;
    if (Math.abs(top - pos.top) < 20) top = (top + maxY / 2) % maxY;
    setPos({ left, top, r: Math.random() * 30 - 15 });
    tries.current += 1;
    setTaunt(T.taunts[tries.current % T.taunts.length][lang]);
  };

  return (
    <div className="w-full max-w-[720px]">
      <p className="font-hand text-[clamp(1.4rem,2.2vw,2rem)] opacity-70">{D.fin.end[lang]}</p>
      <p className="mt-1 font-[Shrikhand] text-[clamp(3.4rem,9vw,7.5rem)] leading-[1]">Brigitte Blau</p>

      {!yes ? (
        <>
          <h2 className="mt-8 font-[Shrikhand] text-[clamp(1.8rem,3.4vw,2.8rem)]">{T.question[lang]}</h2>
          <div ref={arena} className="relative mx-auto mt-4 h-[150px] w-full max-w-[520px]">
            <button
              type="button"
              onClick={() => setYes(true)}
              className="absolute left-[18%] top-1/2 -translate-y-1/2 rounded-[10px] bg-[#4A2C2A] px-11 py-3.5 font-[Shrikhand] text-[1.7rem] text-[#FBF4EE] shadow-[0_6px_0_#A47551] transition-transform hover:scale-105"
            >
              {T.yes[lang]}
            </button>
            <button
              ref={noRef}
              type="button"
              onPointerEnter={flee}
              onPointerDown={(e) => {
                e.preventDefault();
                flee();
              }}
              onFocus={flee}
              onClick={(e) => {
                e.preventDefault();
                flee();
              }}
              style={{ left: `${pos.left}%`, top: `${pos.top}%`, rotate: `${pos.r}deg` }}
              className="absolute rounded-[10px] border-[1.5px] border-[#4A2C2A] bg-white px-9 py-3.5 font-[Shrikhand] text-[1.7rem] transition-[left,top,rotate] duration-300"
            >
              {T.no[lang]}
            </button>
          </div>
          <p className="h-8 font-hand text-[1.5rem] text-[#9C4F68]" aria-live="polite">
            {taunt}
          </p>
        </>
      ) : (
        <div className="mx-auto mt-6 max-w-[520px] animate-[pop_.5s_cubic-bezier(.2,.9,.3,1.3)_both] text-left">
          <p className="text-center font-[Shrikhand] text-[clamp(1.8rem,3.4vw,2.6rem)]">{T.title[lang]} ☺</p>
          <CallForm lang={lang} startOpen />
        </div>
      )}

      <p className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[0.95rem] font-semibold">
        <a href={`mailto:${C.email}`} className="underline decoration-[#E8A9BC] decoration-2 underline-offset-4">
          {C.email}
        </a>
        {C.links.map((l) =>
          l.href.startsWith("/") ? (
            <Link key={l.label} href={`/${lang}${l.href}`} className="underline decoration-[#E8A9BC] decoration-2 underline-offset-4">
              {l.label}
            </Link>
          ) : (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer me" className="underline decoration-[#E8A9BC] decoration-2 underline-offset-4">
              {l.label}
            </a>
          ),
        )}
        <Link href={`/${lang}`} className="opacity-60 hover:opacity-100">
          {C.sober[lang]}
        </Link>
      </p>
    </div>
  );
}

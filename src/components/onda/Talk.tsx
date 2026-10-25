"use client";

import { useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { talk as T } from "@/content/onda";
import CallForm from "../CallForm";
import { Pix } from "./Kit";

/** ¿Querés conocerme? El "No" se escapa; el "Sí" abre la charla. */
export default function Talk({ lang }: { lang: Locale }) {
  const arena = useRef<HTMLDivElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ left: 62, top: 30, r: 0 });
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
    <section id="charlemos" aria-label={T.title[lang]} className="relative scroll-mt-16 px-5 py-20 text-center sm:px-10 sm:py-28">
      <div className="mx-auto max-w-[900px]">
        {!yes ? (
          <>
            <Pix className="text-[clamp(2.4rem,7vw,5rem)]">{T.question[lang]}</Pix>
            <div ref={arena} className="relative mx-auto mt-10 h-[220px] w-full max-w-[640px]">
              <button
                type="button"
                onClick={() => setYes(true)}
                className="absolute left-[24%] top-1/2 -translate-y-1/2 rounded-[8px] bg-[#2A1F24] px-12 py-4 font-[Pixelify_Sans] text-[1.8rem] font-bold text-white shadow-[0_6px_0_#9C4F68] transition-transform hover:scale-105 active:translate-y-[calc(-50%+4px)] active:shadow-[0_2px_0_#9C4F68]"
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
                className="absolute rounded-[8px] border-[1.5px] border-[#2A1F24] bg-white px-10 py-4 font-[Pixelify_Sans] text-[1.8rem] font-bold transition-[left,top,rotate] duration-300"
              >
                {T.no[lang]}
              </button>
            </div>
            <p className="mt-4 h-8 font-hand text-[1.6rem] text-[#9C4F68]" aria-live="polite">
              {taunt}
            </p>
          </>
        ) : (
          <div className="animate-[pop_.6s_cubic-bezier(.2,.9,.3,1.3)_both]">
            <div aria-hidden className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#F6E3A1] text-[3rem] shadow-[0_6px_0_rgba(0,0,0,.08)]">
              ☺
            </div>
            <Pix className="mt-6 text-[clamp(2.6rem,7vw,5rem)]">{T.title[lang]}</Pix>
            <p className="mx-auto mt-3 max-w-[36ch] text-[1.1rem] text-[#2A1F24]/70">{T.sub[lang]}</p>
            <div className="mx-auto mt-6 max-w-[520px] text-left [&>div>button]:mx-auto [&>div>button]:flex">
              <CallForm lang={lang} startOpen />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

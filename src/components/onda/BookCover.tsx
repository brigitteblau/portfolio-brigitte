"use client";

import { useState } from "react";

/** Tapa real (foto propia o de Open Library); si no carga, una tapa dibujada con los colores de la página. */
export default function BookCover({ src, title, author, bg, fg, rotate }: { src?: string; title: string; author: string; bg: string; fg: string; rotate: number }) {
  const [ok, setOk] = useState(!!src);
  return (
    <figure
      style={{ rotate: `${rotate}deg` }}
      className="group relative aspect-[2/3] w-full overflow-hidden rounded-[3px_10px_10px_3px] shadow-[inset_8px_0_0_rgba(0,0,0,.08),0_18px_30px_-16px_rgba(0,0,0,.55)] transition-[rotate,translate] duration-300 hover:-translate-y-2 hover:[rotate:0deg]"
    >
      {ok && src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`${title}, ${author}`} loading="lazy" onError={() => setOk(false)} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full flex-col p-[10%]" style={{ background: bg, color: fg }}>
          <p className="font-[Shrikhand] text-[clamp(1.1rem,1.9vw,1.75rem)] leading-[1.05]">{title}</p>
          <p className="mt-3 text-[0.9rem] font-semibold opacity-75">{author}</p>
        </div>
      )}
      <figcaption className="sr-only">
        {title}, {author}
      </figcaption>
    </figure>
  );
}

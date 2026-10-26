import clsx from "clsx";

/** El kit de la versión con onda: títulos pixelados, letra a mano, etiquetitas y polaroids. */

export const tone = {
  mint: "bg-[#CFEBDC]",
  blush: "bg-[#F7DCE4]",
  butter: "bg-[#F6E3A1]",
  sky: "bg-[#CFE3F2]",
  rosa: "bg-[#E8A9BC]",
  dashed: "border-[1.5px] border-dashed border-[#9C4F68] bg-white",
} as const;
export type Tone = keyof typeof tone;

export function Pix({ as: As = "h2", className, children, id }: { as?: "h1" | "h2" | "p" | "span"; className?: string; children: React.ReactNode; id?: string }) {
  return (
    <As id={id} className={clsx("font-[Shrikhand] leading-[1] tracking-[-0.01em] text-[#2A1F24]", className)}>
      {children}
    </As>
  );
}

export function Hand({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={clsx("font-hand text-[#2A1F24]/60", className)}>{children}</p>;
}

export function Tag({ c, className, children, style }: { c: Tone; className?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span
      style={style}
      className={clsx(
        "inline-block whitespace-nowrap rounded-[5px] px-3 py-1.5 text-[0.82rem] font-bold text-[#2A1F24] shadow-[0_3px_0_rgba(0,0,0,.07)] transition-transform duration-200 hover:-translate-y-0.5 hover:rotate-0",
        tone[c],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Polaroid({ src, note, rotate = 0, className, imgClass, alt = "" }: { src: string; note?: string; rotate?: number; className?: string; imgClass?: string; alt?: string }) {
  return (
    <figure
      style={{ rotate: `${rotate}deg` }}
      className={clsx("group relative bg-white p-2.5 pb-9 shadow-[0_14px_26px_-14px_rgba(0,0,0,.45)] transition-[rotate,translate] duration-300 hover:z-10 hover:-translate-y-1 hover:[rotate:0deg]", className)}
    >
      <span aria-hidden className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 -rotate-3 bg-[#F3E7B8]/85" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className={clsx("block aspect-[4/5] w-full object-cover", imgClass)} />
      {note && <figcaption className="absolute bottom-1.5 left-3 right-3 truncate font-hand text-[1.25rem] leading-none text-[#2A1F24]">{note}</figcaption>}
    </figure>
  );
}

/** Una sección de la hoja: mucho aire y el título arriba. */
export function Sheet({ id, className, children, label }: { id: string; className?: string; children: React.ReactNode; label?: string }) {
  return (
    <section id={id} aria-label={label} className={clsx("relative scroll-mt-16 px-5 py-20 sm:px-10 sm:py-28", className)}>
      <div className="mx-auto max-w-[1200px]">{children}</div>
    </section>
  );
}

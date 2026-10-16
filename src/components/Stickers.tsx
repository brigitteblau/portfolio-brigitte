/**
 * Kit de stickers del sitio: brillitos, etiquetas, polaroids con clip o chinche,
 * post-its, el sello rosa, la compu retro y garabatos.
 */
import clsx from "clsx";

/** Brillito de 4 puntas */
export function Sparkle({ className, color = "var(--yellow)", ...rest }: React.SVGProps<SVGSVGElement> & { color?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={clsx("twinkle", className)} aria-hidden {...rest}>
      <path d="M20 0 C21.5 13 27 18.5 40 20 C27 21.5 21.5 27 20 40 C18.5 27 13 21.5 0 20 C13 18.5 18.5 13 20 0Z" fill={color} />
    </svg>
  );
}

/** Se mantiene para el menú: el asterisco */
export function Asterisk({ className, color = "currentColor" }: { className?: string; color?: string; title?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      {[0, 45, 90, 135].map((d) => (
        <rect key={d} x="44" y="4" width="12" height="92" rx="6" fill={color} transform={`rotate(${d} 50 50)`} />
      ))}
    </svg>
  );
}

/** Etiqueta tipo "Fun Fact": rectángulo de color, letra a mano, apenas torcida */
export function Tag({ children, color = "var(--green)", rotate = -6, className }: { children: React.ReactNode; color?: string; rotate?: number; className?: string }) {
  return (
    <span
      className={clsx("inline-block px-3 py-1 font-hand text-[1.5rem] leading-none text-white shadow-[0_6px_14px_-8px_rgba(0,0,0,.5)]", className)}
      style={{ background: color, rotate: `${rotate}deg` }}
    >
      {children}
    </span>
  );
}

/** Sello rosa con dentado (como un badge) */
export function Burst({ className, color = "var(--pink)", children }: { className?: string; color?: string; children?: React.ReactNode }) {
  const pts = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2;
    const r = i % 2 ? 40 : 50;
    return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`;
  }).join(" ");
  return (
    <div className={clsx("relative", className)}>
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
        <polygon points={pts} fill={color} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-white">{children}</div>
    </div>
  );
}

/** Icono de persona (para el sello del perfil) */
export function PersonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="8" r="4.2" fill="currentColor" />
      <path d="M3.5 21c.8-4.6 4.3-7 8.5-7s7.7 2.4 8.5 7z" fill="currentColor" />
    </svg>
  );
}

/** Clip de papel */
export function PaperClip({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 60" className={className} aria-hidden>
      <path d="M6 10 V44 a5 5 0 0 0 10 0 V8 a7 7 0 0 0 -14 0 V48 a9 9 0 0 0 18 0 V16" fill="none" stroke="#9aa3b5" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** Chinche roja */
export function Pin({ className, color = "var(--red)" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <circle cx="10" cy="10" r="7" fill={color} />
      <circle cx="7.5" cy="7.5" r="2.2" fill="#fff" opacity=".55" />
    </svg>
  );
}

/** Polaroid con foto (o video), con clip, chinche o nada */
export function Polaroid({
  children,
  caption,
  rotate = 0,
  holder = "none",
  className,
  style,
}: {
  children: React.ReactNode;
  caption?: React.ReactNode;
  rotate?: number;
  holder?: "clip" | "pin" | "none";
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <figure
      className={clsx("relative bg-white p-2.5 pb-3 shadow-[0_14px_28px_-14px_rgba(31,33,40,.55)]", className)}
      style={{ rotate: `${rotate}deg`, ...style }}
    >
      {holder === "clip" && <PaperClip className="absolute -top-5 right-6 h-14 w-5" />}
      {holder === "pin" && <Pin className="absolute -top-2 left-1/2 h-5 w-5 -translate-x-1/2" />}
      <div className="overflow-hidden bg-[#eee]">{children}</div>
      {caption && <figcaption className="pt-2 text-center font-hand text-[1.35rem] leading-none text-ink">{caption}</figcaption>}
    </figure>
  );
}

/** Post-it */
export function Sticky({ children, color = "#5ab7e8", rotate = 4, className }: { children: React.ReactNode; color?: string; rotate?: number; className?: string }) {
  return (
    <div className={clsx("relative px-4 pb-4 pt-6 font-hand text-[1.5rem] leading-[1] text-ink shadow-[0_12px_20px_-12px_rgba(0,0,0,.45)]", className)} style={{ background: color, rotate: `${rotate}deg` }}>
      <Pin className="absolute left-1/2 top-1 h-4 w-4 -translate-x-1/2" color="#3b9a5e" />
      {children}
    </div>
  );
}

/** La compu retro de escritorio (beige, pantalla rosa) */
export function RetroComputer({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={clsx("relative", className)}>
      <div className="rounded-[18px] bg-beige p-[7%] pb-[10%] shadow-[inset_-6px_-8px_0_rgba(0,0,0,.08),0_20px_30px_-18px_rgba(0,0,0,.5)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-[#f3a6d6] shadow-[inset_0_0_0_4px_#cbbf9f,inset_0_0_24px_rgba(0,0,0,.18)]">{children}</div>
        <div className="mt-[5%] flex justify-end gap-2 pr-2" aria-hidden>
          <span className="h-2 w-6 rounded-full bg-[#cbbf9f]" />
          <span className="h-2 w-2 rounded-full bg-[#8bd17c]" />
        </div>
      </div>
      <div className="mx-auto h-[10%] w-[30%] bg-[#d9cfb3]" aria-hidden />
      <div className="mx-auto h-4 w-[70%] rounded-[50%] bg-[#a9e07a] shadow-[0_10px_20px_-10px_rgba(0,0,0,.4)]" aria-hidden />
    </div>
  );
}

/** Garabatos a mano */
export function Doodle({ kind, className }: { kind: "arrow" | "loop" | "zigzag" | "wave" | "curl"; className?: string }) {
  const d = {
    arrow: "M10 70 C20 30 50 10 90 18 M76 6 L92 18 L80 32",
    loop: "M10 60 C30 10 60 10 50 40 C40 70 80 70 90 30",
    zigzag: "M10 20 L40 50 L30 60 L70 80 L60 90 L90 100",
    wave: "M5 50 C20 20 35 20 50 50 S80 80 95 50",
    curl: "M10 50 C10 20 40 20 40 40 C40 60 20 60 25 45 C30 30 60 20 70 35 C80 50 60 70 55 55 C50 40 80 30 92 40",
  }[kind];
  return (
    <svg viewBox="0 0 100 110" className={className} aria-hidden>
      <path d={d} fill="none" stroke="var(--ink)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Mancha de color con carita dibujada (estilo "human driven") */
export function Blob({ color, className, face = "smile" }: { color: string; className?: string; face?: "smile" | "wink" | "o" }) {
  return (
    <svg viewBox="0 0 100 90" className={className} aria-hidden>
      <path d="M50 4 C78 2 98 22 94 48 C90 76 66 88 44 86 C18 84 2 66 6 42 C10 18 26 6 50 4Z" fill={color} />
      <g fill="none" stroke="var(--ink)" strokeWidth="2.6" strokeLinecap="round">
        {face === "smile" && <><path d="M36 38 v6" /><path d="M58 38 v6" /><path d="M38 56 q10 9 20 0" /></>}
        {face === "wink" && <><path d="M33 41 q4 -4 8 0" /><path d="M58 38 v6" /><path d="M40 57 q8 6 16 -2" /></>}
        {face === "o" && <><path d="M36 40 v4" /><path d="M58 40 v4" /><circle cx="47" cy="58" r="5" /></>}
      </g>
    </svg>
  );
}

/**
 * Foto con fallback: si todavía no hay archivo, muestra un placeholder
 * que dice en qué carpeta va.
 */
import clsx from "clsx";

type Props = {
  src?: string;
  alt: string;
  folder: string;
  hint: string;
  className?: string;
  tint?: string;
  style?: React.CSSProperties;
};

export default function Photo({ src, alt, folder, hint, className, tint = "var(--folder)", style }: Props) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} loading="lazy" decoding="async" className={clsx("block h-full w-full object-cover", className)} style={style} />
    );
  }
  return (
    <div
      className={clsx("flex h-full w-full flex-col items-center justify-center gap-1 p-3 text-center", className)}
      style={{ background: `repeating-linear-gradient(-45deg, ${tint}, ${tint} 10px, color-mix(in srgb, ${tint} 82%, white) 10px, color-mix(in srgb, ${tint} 82%, white) 20px)`, ...style }}
      role="img"
      aria-label={alt}
    >
      <span className="rounded bg-white/85 px-2 py-0.5 font-mono text-[0.7rem] leading-tight text-navy">
        {hint}
        <br />
        public/fotos/{folder}/
      </span>
    </div>
  );
}

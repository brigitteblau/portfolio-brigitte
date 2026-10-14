import clsx from "clsx";

/**
 * La pestaña de carpeta que abre cada era. El número es real:
 * las eras son una línea de tiempo.
 */
export default function EraTab({
  n,
  label,
  color,
  ink = "var(--navy)",
  className,
  font,
}: {
  n: number;
  label: string;
  color: string;
  ink?: string;
  className?: string;
  font?: string;
}) {
  return (
    <div className={clsx("relative inline-flex items-end", className)}>
      <svg viewBox="0 0 320 70" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
        <path d="M0 70 V18 Q0 4 14 4 H230 Q244 4 252 16 L270 46 Q276 56 290 56 H306 Q320 56 320 70 Z" fill={color} />
      </svg>
      <h2 className={clsx("relative flex items-baseline gap-3 py-3 pl-5 pr-24 text-[clamp(1.3rem,2.6vw,2rem)] leading-none", font)} style={{ color: ink }}>
        <span className="text-[0.6em] tabular-nums opacity-70">{String(n).padStart(2, "0")}</span>
        <span>{label}</span>
      </h2>
    </div>
  );
}

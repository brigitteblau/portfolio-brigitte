import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import type { Soundtrack as S } from "@/content/site";

/** La canción o reflexión que acompaña cada era. Se ve como un casete pegado. */
export default function Soundtrack({ data, lang, className, tone = "light" }: { data: S; lang: Locale; className?: string; tone?: "light" | "dark" }) {
  if (data.kind === "thought") {
    return (
      <figure className={clsx("max-w-md font-hand text-[1.7rem] leading-[1.15]", className)}>
        <blockquote>“{data.title[lang]}”</blockquote>
      </figure>
    );
  }
  return (
    <figure
      className={clsx(
        "inline-flex items-center gap-3 rounded-lg px-3 py-2 text-[0.85rem] shadow-[2px_3px_0_rgba(0,0,0,.18)]",
        tone === "light" ? "bg-white/90 text-navy" : "bg-navy/80 text-white",
        className,
      )}
    >
      <svg viewBox="0 0 48 30" className="h-7 w-11 shrink-0" aria-hidden>
        <rect x="1" y="1" width="46" height="28" rx="4" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="15" cy="14" r="5" fill="none" stroke="currentColor" strokeWidth="2" className="origin-[15px_14px] animate-spin [animation-duration:3s]" strokeDasharray="4 3" />
        <circle cx="33" cy="14" r="5" fill="none" stroke="currentColor" strokeWidth="2" className="origin-[33px_14px] animate-spin [animation-duration:3s]" strokeDasharray="4 3" />
        <path d="M10 29 l4 -6 h20 l4 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <figcaption className="leading-tight">
        <span className="block font-semibold">{data.title[lang]}</span>
        {data.by && <span className="block opacity-70">{data.by}</span>}
      </figcaption>
    </figure>
  );
}

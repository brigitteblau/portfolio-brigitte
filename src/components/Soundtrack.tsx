import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import type { Soundtrack as S } from "@/content/site";

/** La canción o reflexión que acompaña cada era. */
export default function Soundtrack({ data, lang, className, tone = "light" }: { data: S; lang: Locale; className?: string; tone?: "light" | "dark" }) {
  if (data.kind === "thought") {
    return (
      <figure className={clsx("max-w-md border-l-2 border-current pl-4 font-serif text-[1.35rem] italic leading-[1.25]", className)}>
        <blockquote>{data.title[lang]}</blockquote>
      </figure>
    );
  }
  return (
    <figure className={clsx("flex items-center gap-3 font-mono text-[0.8rem]", tone === "dark" ? "text-white/85" : "text-navy/80", className)}>
      <span className="flex h-4 items-end gap-[2px]" aria-hidden>
        {[0.5, 1, 0.7, 0.9].map((h, i) => (
          <span key={i} className="w-[3px] animate-pulse bg-current" style={{ height: `${h * 100}%`, animationDelay: `${i * 0.18}s` }} />
        ))}
      </span>
      <figcaption>
        <span className="font-semibold">{data.title[lang]}</span>
        {data.by && <span className="opacity-60"> · {data.by}</span>}
      </figcaption>
    </figure>
  );
}

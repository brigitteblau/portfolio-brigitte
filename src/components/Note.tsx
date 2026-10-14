import clsx from "clsx";

/** La "explicación" chiquita de cada diapositiva, escrita a mano. */
export default function Note({ children, className }: { children: React.ReactNode; className?: string }) {
  if (!children) return null;
  return (
    <p className={clsx("slide-note pointer-events-none absolute bottom-20 left-4 flex items-center gap-2 sm:bottom-24 sm:left-8", className)}>
      <svg viewBox="0 0 40 20" className="h-4 w-8 shrink-0" aria-hidden>
        <path d="M2 14 C10 2 18 18 26 8 S34 6 38 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {children}
    </p>
  );
}

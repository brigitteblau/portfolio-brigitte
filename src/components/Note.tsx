import clsx from "clsx";

/** La "explicación" chiquita de cada diapositiva, como nota de presentador. */
export default function Note({ children, className }: { children: React.ReactNode; className?: string }) {
  if (!children) return null;
  return (
    <p className={clsx("slide-note pointer-events-none absolute bottom-20 left-4 flex items-center gap-3 sm:bottom-24 sm:left-8", className)}>
      <span className="h-px w-8 shrink-0 bg-current" aria-hidden />
      {children}
    </p>
  );
}

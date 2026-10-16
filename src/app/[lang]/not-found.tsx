import Link from "next/link";
import { Blob, Sparkle } from "@/components/Stickers";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-[100svh] place-items-center px-3 pt-14">
      <div className="slide relative flex w-full max-w-3xl flex-col items-center overflow-hidden px-6 py-16 text-center">
        <p className="hello-grad pb-[0.06em] pr-[0.08em] text-[clamp(6rem,22vw,12rem)] font-black italic leading-[0.85] tracking-[-0.06em]">ups!</p>
        <p className="mt-4 text-[1.3rem] font-semibold">Esto no existe (todavía).</p>
        <p className="text-ink/60">This doesn&apos;t exist (yet).</p>
        <Link href="/" className="mt-8 rounded-full bg-ink px-6 py-3 font-semibold text-cream hover:bg-blue">
          ← Inicio / Home
        </Link>
        <Blob color="var(--yellow)" face="o" className="absolute -bottom-4 -left-4 w-28" />
        <Sparkle className="absolute right-10 top-10 h-10 w-10" />
      </div>
    </main>
  );
}

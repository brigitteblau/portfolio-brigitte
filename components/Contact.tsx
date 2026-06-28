export default function Contact({ dict }: any) {
  return (
    <section id="contact" className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl border-t border-neutral-200 pt-16">
        <p className="kicker">contact</p>

        <h2 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.07em] md:text-7xl">
          ¿Tenés una idea, proyecto o simplemente querés charlar?
        </h2>

        <p className="mt-7 max-w-xl text-lg leading-relaxed text-neutral-600">
          Me gusta conocer gente que esté construyendo cosas, pensando en voz alta
          o buscando darle forma a algo nuevo.
        </p>

        <a
          href="mailto:brigitteyaelblau@gmail.com"
          className="mt-10 inline-block rounded-full border border-neutral-300 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
        >
          escribime
        </a>

        <div className="mt-8 flex gap-6 text-sm font-semibold uppercase tracking-[0.22em] text-neutral-500">
          <a href="https://github.com/brigitteblau" target="_blank">GitHub</a>
          <a href="https://instagram.com/brigitteblau" target="_blank">Instagram</a>
          <a href="https://ar.linkedin.com/in/brigitte-blau-17567835b" target="_blank">LinkedIn</a>
        </div>
      </div>
    </section>
  );
}
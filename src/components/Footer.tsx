import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { contacto } from "@/content/site";

/** Pie de página: quién soy en una línea (también ayuda a que Google me encuentre por mi nombre). */
export default function Footer({ lang }: { lang: Locale }) {
  const es = lang === "es";
  return (
    <footer className="px-3 pb-24 pt-4 text-ink/70 sm:px-6">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t-2 border-ink/15 pt-5 text-[0.9rem]">
        <p>
          <strong className="text-ink">Brigitte Blau</strong> ·{" "}
          {es ? "desarrolladora y emprendedora en Buenos Aires · partner y directora en Grupo Mirrow · estudiante en ORT" : "developer and entrepreneur in Buenos Aires · partner & director at Grupo Mirrow · student at ORT"}
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 font-semibold" aria-label={es ? "Pie" : "Footer"}>
          <Link href={`/${lang}/journal`} className="hover:text-blue">Journal</Link>
          <Link href={`/${lang}/foto`} className="hover:text-blue">{es ? "Dejame una foto" : "Leave a photo"}</Link>
          <Link href={`/${lang}/charlemos`} className="hover:text-blue">{es ? "Agendá una call" : "Book a call"}</Link>
          {contacto.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer me" className="hover:text-blue">
              {l.label}
            </a>
          ))}
          <a href={`mailto:${contacto.email}`} className="hover:text-blue">Mail</a>
        </nav>
      </div>
    </footer>
  );
}

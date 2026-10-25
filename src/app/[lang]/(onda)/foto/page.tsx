import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import Dejame from "@/components/onda/Dejame";

export async function generateMetadata({ params }: PageProps<"/[lang]/foto">): Promise<Metadata> {
  const { lang } = await params;
  const es = lang === "es";
  return {
    title: es ? "Dejame una foto (tipo BeReal)" : "Leave me a photo (BeReal-style)",
    description: es
      ? "Sacate una foto con la cámara de mi portfolio (con filtros y las dos cámaras como BeReal) y dejámela con un mensaje."
      : "Take a photo with the camera on my portfolio (with filters and both cameras, like BeReal) and leave it for me with a message.",
    alternates: { canonical: `/${lang}/foto`, languages: { es: "/es/foto", en: "/en/foto" } },
  };
}

/** La cámara sola, en su propia página (para compartir el link y para Google). */
export default async function FotoPage({ params }: PageProps<"/[lang]/foto">) {
  const lang = (await params).lang as Locale;
  const es = lang === "es";
  return (
    <main id="main">
      <Dejame lang={lang} />
      <p className="px-6 pb-6 text-center text-[0.95rem] text-[#2A1F24]/70">
        {es ? "Esta cámara es parte del portfolio de " : "This camera is part of "}
        <Link href={`/${lang}`} className="font-semibold underline underline-offset-2">
          Brigitte Blau
        </Link>
        {es ? ", desarrolladora y emprendedora en Buenos Aires." : "'s portfolio, a developer and entrepreneur in Buenos Aires."}
      </p>
    </main>
  );
}

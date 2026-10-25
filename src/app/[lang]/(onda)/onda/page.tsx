import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { fileExists } from "@/lib/photos";
import Hero from "@/components/onda/Hero";
import Fun from "@/components/onda/Fun";
import About from "@/components/onda/About";
import Projects from "@/components/onda/Projects";
import Story from "@/components/onda/Story";
import Dejame from "@/components/onda/Dejame";
import Talk from "@/components/onda/Talk";
import Contact from "@/components/onda/Contact";

export async function generateMetadata({ params }: PageProps<"/[lang]/onda">): Promise<Metadata> {
  const { lang } = await params;
  const es = lang === "es";
  return {
    title: es ? "Brigitte Blau, versión con onda" : "Brigitte Blau, the fun version",
    description: es
      ? "La versión con onda del portfolio de Brigitte Blau: quién soy, mis proyectos (Grupo Mirrow, tuspruebas, Hunda, Tevila It), mi historia, dejame una foto y charlemos."
      : "The fun version of Brigitte Blau's portfolio: who I am, my projects (Grupo Mirrow, tuspruebas, Hunda, Tevila It), my story, leave me a photo and let's talk.",
    alternates: { canonical: `/${lang}/onda`, languages: { es: "/es/onda", en: "/en/onda" } },
  };
}

/** Portada → just for fun → sobre mí → proyectos → historia → dejame una foto → ¿querés conocerme? → contacto */
export default async function Onda({ params }: PageProps<"/[lang]/onda">) {
  const lang = (await params).lang as Locale;
  const firstVideo = (name: string) => ["mp4", "webm", "mov"].map((e) => `/video/${name}.${e}`).find(fileExists);
  return (
    <main id="main">
      <Hero lang={lang} />
      <Fun lang={lang} />
      <About lang={lang} />
      <Projects lang={lang} />
      <Story lang={lang} video={firstVideo("cumple")} golf={firstVideo("golf")} />
      <Dejame lang={lang} />
      <Talk lang={lang} />
      <Contact lang={lang} />
    </main>
  );
}

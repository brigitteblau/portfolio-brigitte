import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { fileExists, findPhoto, listCarpetas } from "@/lib/photos";
import { listEntries } from "@/lib/journal";
import CarpetasSlide from "@/components/onda/CarpetasSlide";
import { deck as D } from "@/content/onda";
import Deck, { type SlideMeta } from "@/components/onda/Deck";
import { Hola, Nacer, Deportes, Perfeccion, Libros, Programar, Proyectos, Hoy, Journal, Dejame, Final } from "@/components/onda/Slides";

export async function generateMetadata({ params }: PageProps<"/[lang]/onda">): Promise<Metadata> {
  const { lang } = await params;
  const es = lang === "es";
  return {
    title: es ? "Brigitte Blau, mi historia" : "Brigitte Blau, my story",
    description: es
      ? "Mi historia en diapositivas: de querer ser perfecta a querer dejar algo en el mundo. Golf, los libros que me marcaron, cómo empecé a programar, Grupo Mirrow y una foto para dejarme."
      : "My story in slides: from wanting to be perfect to wanting to leave something in the world. Golf, the books that shaped me, how I started coding, Grupo Mirrow and a photo to leave me.",
    alternates: { canonical: `/${lang}/onda`, languages: { es: "/es/onda", en: "/en/onda" } },
  };
}

const ROSA = "#F2C9D3";
const CHOCO = "#4A2C2A";
const CREMA = "#FBF4EE";
const LATTE = "#E9D6C4";
const BLUSH = "#F9E4E9";

/** La versión con onda: mi historia en 10 diapositivas, en rosa y marrón. */
export default async function Onda({ params }: PageProps<"/[lang]/onda">) {
  const lang = (await params).lang as Locale;
  const firstVideo = (name: string) => ["mp4", "webm", "mov"].map((e) => `/video/${name}.${e}`).find(fileExists);
  const covers = Object.fromEntries(D.libros.books.map((b) => [b.id, findPhoto("libros", b.id)]));
  const slides: SlideMeta[] = [
    { id: "hola", label: lang === "es" ? "hola" : "hi", bg: ROSA },
    { id: "nacer", label: D.nacer.label[lang], bg: CHOCO, dark: true },
    { id: "deportes", label: D.deportes.label[lang], bg: LATTE },
    { id: "perfeccion", label: D.perfeccion.label[lang], bg: CHOCO, dark: true },
    { id: "libros", label: D.libros.label[lang], bg: CREMA },
    { id: "programar", label: D.programar.label[lang], bg: ROSA },
    { id: "proyectos", label: D.proyectos.label[lang], bg: CREMA },
    { id: "hoy", label: D.hoy.label[lang], bg: CHOCO, dark: true },
    { id: "carpetas", label: lang === "es" ? "esta soy yo" : "this is me", bg: LATTE },
    { id: "journal", label: "journal", bg: CHOCO, dark: true },
    { id: "dejame", label: D.dejame.label[lang], bg: BLUSH },
    { id: "conocerme", label: D.fin.label[lang], bg: ROSA },
  ];
  return (
    <main id="main">
      <Deck lang={lang} slides={slides}>
        <Hola lang={lang} />
        <Nacer lang={lang} video={firstVideo("cumple")} />
        <Deportes lang={lang} golf={firstVideo("golf")} />
        <Perfeccion lang={lang} />
        <Libros lang={lang} covers={covers} />
        <Programar lang={lang} />
        <Proyectos lang={lang} />
        <Hoy lang={lang} />
        <CarpetasSlide lang={lang} folders={listCarpetas()} />
        <Journal lang={lang} entries={listEntries(lang)} />
        <Dejame lang={lang} />
        <Final lang={lang} />
      </Deck>
    </main>
  );
}

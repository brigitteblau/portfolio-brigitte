import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { allPhotos, findPhoto, fileExists, listCarpetas } from "@/lib/photos";
import { listEntries } from "@/lib/journal";
import { featured, projects } from "@/content/projects";
import { programacion } from "@/content/site";
import Hero from "@/components/sections/Hero";
import Eras from "@/components/sections/Eras";
import Hoy from "@/components/sections/Hoy";
import Proyectos from "@/components/sections/Proyectos";
import Foto from "@/components/sections/Foto";
import Carpetas from "@/components/sections/Carpetas";
import { JournalMini } from "@/components/sections/Sigue";
import Final from "@/components/sections/Final";
import Charlemos from "@/components/sections/Charlemos";
import PhotoFab from "@/components/PhotoFab";
import PhotoNudge from "@/components/PhotoNudge";

/**
 * La página: primero lo que hago HOY (portada, hoy, proyectos, dejame una foto),
 * después la historia (de costado), el journal, las carpetas, y el cierre:
 * ¿Querés conocerme? → Charlemos (agendar una call) → contacto.
 */
export async function generateMetadata({ params }: PageProps<"/[lang]/onda">): Promise<Metadata> {
  const { lang } = await params;
  const es = lang === "es";
  return {
    title: es ? "Mi versión con onda" : "The fun version",
    description: es
      ? "La versión con onda del portfolio de Brigitte Blau: mi historia, mis proyectos, dejame una foto y agendá una call."
      : "The fun version of Brigitte Blau's portfolio: my story, my projects, leave me a photo and book a call.",
    alternates: { canonical: `/${lang}/onda`, languages: { es: "/es/onda", en: "/en/onda" } },
  };
}

export default async function Home({ params }: PageProps<"/[lang]/onda">) {
  const lang = (await params).lang as Locale;
  const photos = allPhotos();
  const projectPhotos = Object.fromEntries([...featured, ...projects].map((p) => [p.id, findPhoto("proyectos", p.id)]));
  const covers = Object.fromEntries(programacion.books.map((b) => [b.id, findPhoto("libros", b.id)]));
  const firstVideo = (name: string) => ["mp4", "webm", "mov"].map((e) => `/video/${name}.${e}`).find(fileExists);
  const [, deskPic, selfie, glasses] = photos.avatar;

  return (
    <main id="main">
      <Hero lang={lang} photos={[deskPic, photos.ahora[0], selfie].filter(Boolean) as string[]} />
      <Hoy lang={lang} photos={[glasses, photos.ahora[0]].filter(Boolean) as string[]} />
      <Proyectos lang={lang} photos={projectPhotos} />
      <Foto lang={lang} />
      <Eras lang={lang} photos={photos} video={firstVideo("cumple")} golf={firstVideo("golf")} covers={covers} />
      <Carpetas lang={lang} folders={listCarpetas()} journal={<JournalMini lang={lang} entries={listEntries(lang)} />} />
      <Final lang={lang} photos={photos.contacto}>
        <Charlemos lang={lang} />
      </Final>
      <PhotoFab lang={lang} />
      <PhotoNudge lang={lang} photo={selfie} />
    </main>
  );
}

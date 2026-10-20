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
import Sigue from "@/components/sections/Sigue";
import Final from "@/components/sections/Final";
import Charlemos from "@/components/sections/Charlemos";
import PhotoFab from "@/components/PhotoFab";
import PhotoNudge from "@/components/PhotoNudge";

/**
 * La página: primero lo que hago HOY (portada, hoy, proyectos, dejame una foto),
 * después la historia (de costado), el journal, las carpetas, y el cierre:
 * ¿Querés conocerme? → Charlemos (agendar una call) → contacto.
 */
export default async function Home({ params }: PageProps<"/[lang]">) {
  const lang = (await params).lang as Locale;
  const photos = allPhotos();
  const projectPhotos = Object.fromEntries([...featured, ...projects].map((p) => [p.id, findPhoto("proyectos", p.id)]));
  const covers = Object.fromEntries(programacion.books.map((b) => [b.id, findPhoto("libros", b.id)]));
  const firstVideo = (name: string) => ["mp4", "webm", "mov"].map((e) => `/video/${name}.${e}`).find(fileExists);
  const [golfPic, deskPic, selfie, glasses] = photos.avatar;

  return (
    <main id="main">
      <Hero lang={lang} photo={deskPic ?? golfPic} />
      <Hoy lang={lang} photos={[glasses, photos.ahora[0]].filter(Boolean) as string[]} />
      <Proyectos lang={lang} photos={projectPhotos} />
      <Foto lang={lang} />
      <Eras lang={lang} photos={photos} video={firstVideo("cumple")} golf={firstVideo("golf")} covers={covers} />
      <Sigue lang={lang} entries={listEntries(lang)} />
      <Carpetas lang={lang} folders={listCarpetas()} />
      <Final lang={lang} photos={photos.contacto}>
        <Charlemos lang={lang} />
      </Final>
      <PhotoFab lang={lang} />
      <PhotoNudge lang={lang} photo={selfie} />
    </main>
  );
}

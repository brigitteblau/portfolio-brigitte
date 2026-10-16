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
import PhotoFab from "@/components/PhotoFab";

/**
 * La página, corta: portada → la historia (de costado) → hoy → proyectos (chiquitos)
 * → dejame una foto → carpetas → journal → contacto.
 */
export default async function Home({ params }: PageProps<"/[lang]">) {
  const lang = (await params).lang as Locale;
  const photos = allPhotos();
  const projectPhotos = Object.fromEntries([...featured, ...projects].map((p) => [p.id, findPhoto("proyectos", p.id)]));
  const covers = Object.fromEntries(programacion.books.map((b) => [b.id, findPhoto("libros", b.id)]));
  const firstVideo = (name: string) => ["mp4", "webm", "mov"].map((e) => `/video/${name}.${e}`).find(fileExists);

  return (
    <main id="main">
      <Hero lang={lang} photo={photos.avatar[0]} />
      <Eras lang={lang} photos={photos} video={firstVideo("cumple")} golf={firstVideo("golf")} covers={covers} />
      <Hoy lang={lang} photos={photos.avatar.slice(1)} />
      <Proyectos lang={lang} photos={projectPhotos} />
      <Foto lang={lang} />
      <Carpetas lang={lang} folders={listCarpetas()} />
      <Sigue lang={lang} entries={listEntries(lang)} />
      <Final lang={lang} photos={photos.contacto} />
      <PhotoFab lang={lang} />
    </main>
  );
}

import type { Locale } from "@/lib/i18n";
import { allPhotos, findPhoto, fileExists, listCarpetas } from "@/lib/photos";
import { listEntries } from "@/lib/journal";
import { featured, projects } from "@/content/projects";
import Hero from "@/components/sections/Hero";
import Perfil from "@/components/sections/Perfil";
import Eras from "@/components/sections/Eras";
import Proyectos from "@/components/sections/Proyectos";
import Ahora from "@/components/sections/Ahora";
import Carpetas from "@/components/sections/Carpetas";
import Sigue from "@/components/sections/Sigue";
import Final from "@/components/sections/Final";

/**
 * La página: la mayor parte baja normal; solo la historia (las eras) va de costado.
 */
export default async function Home({ params }: PageProps<"/[lang]">) {
  const lang = (await params).lang as Locale;
  const photos = allPhotos();
  const projectPhotos = Object.fromEntries([...featured, ...projects].map((p) => [p.id, findPhoto("proyectos", p.id)]));
  const firstVideo = (name: string) => ["mp4", "webm", "mov"].map((e) => `/video/${name}.${e}`).find(fileExists);

  return (
    <main id="main">
      <Hero lang={lang} photo={photos.avatar[0]} />
      <Perfil lang={lang} photos={photos.avatar.slice(1).concat(photos.avatar.slice(0, 1))} />
      <Eras lang={lang} photos={photos} video={firstVideo("cumple")} golf={firstVideo("golf")} />
      <Proyectos lang={lang} photos={projectPhotos} />
      <Ahora lang={lang} photos={photos.ahora} />
      <Carpetas lang={lang} folders={listCarpetas()} />
      <Sigue lang={lang} entries={listEntries(lang)} />
      <Final lang={lang} photos={photos.contacto} />
    </main>
  );
}

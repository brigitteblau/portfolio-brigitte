import type { Locale } from "@/lib/i18n";
import { allPhotos, findPhoto, fileExists } from "@/lib/photos";
import { featured, projects } from "@/content/projects";
import Track from "@/components/Track";
import Intro from "@/components/sections/Intro";
import Nacer from "@/components/sections/Nacer";
import Deportes from "@/components/sections/Deportes";
import Programacion from "@/components/sections/Programacion";
import Proyectos from "@/components/sections/Proyectos";
import Ahora from "@/components/sections/Ahora";
import Final from "@/components/sections/Final";
import Sigue from "@/components/sections/Sigue";
import { listEntries } from "@/lib/journal";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const lang = (await params).lang as Locale;
  const photos = allPhotos();
  const projectPhotos = Object.fromEntries([...featured, ...projects].map((p) => [p.id, findPhoto("proyectos", p.id)]));
  const golf = ["golf.mp4", "golf.mov", "golf.webm"].map((f) => `/video/${f}`).find(fileExists);
  const video = ["cumple.mp4", "cumple.mov", "cumple.webm"].map((f) => `/video/${f}`).find(fileExists);

  return (
    <main>
      <Track lang={lang}>
        <Intro lang={lang} avatars={photos.avatar} />
        <Nacer lang={lang} photos={photos.nacer} video={video} />
        <Deportes lang={lang} photos={photos.deportes} video={golf} />
        <Programacion lang={lang} photos={photos.programacion} />
        <Proyectos lang={lang} photos={projectPhotos} />
        <Ahora lang={lang} photos={photos.ahora} />
        <Final lang={lang} photos={photos.contacto} />
        <Sigue lang={lang} entries={listEntries(lang)} />
      </Track>
    </main>
  );
}

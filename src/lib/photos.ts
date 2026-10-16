import "server-only";
import fs from "node:fs";
import path from "node:path";

const IMG = /\.(jpe?g|png|webp|avif|gif)$/i;

/**
 * Lista las fotos de public/fotos/<carpeta>, ordenadas por nombre.
 * Así, para agregar fotos solo hay que soltarlas en la carpeta.
 */
export function listPhotos(folder: string): string[] {
  const dir = path.join(process.cwd(), "public", "fotos", folder);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => IMG.test(f) && !f.startsWith("."))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/fotos/${folder}/${encodeURIComponent(f)}`);
  } catch {
    return [];
  }
}

/** Busca una foto por nombre base (sin extensión) dentro de una carpeta. */
export function findPhoto(folder: string, base: string): string | undefined {
  return listPhotos(folder).find((p) =>
    decodeURIComponent(p.split("/").pop() ?? "")
      .toLowerCase()
      .startsWith(base.toLowerCase() + "."),
  );
}

export function fileExists(publicPath: string) {
  return fs.existsSync(path.join(process.cwd(), "public", publicPath));
}

export type PhotoSet = Record<
  "avatar" | "nacer" | "deportes" | "programacion" | "proyectos" | "ahora" | "contacto",
  string[]
>;

export function allPhotos(): PhotoSet {
  return {
    avatar: listPhotos("avatar"),
    nacer: listPhotos("nacer"),
    deportes: listPhotos("deportes"),
    programacion: listPhotos("programacion"),
    proyectos: listPhotos("proyectos"),
    ahora: listPhotos("ahora"),
    contacto: listPhotos("contacto"),
  };
}

const MEDIA = /\.(jpe?g|png|webp|avif|gif|mp4|webm|mov)$/i;
const VID = /\.(mp4|webm|mov)$/i;

export type Media = { src: string; kind: "img" | "video"; poster?: string };
export type Folder = { name: string; items: Media[] };

/**
 * Las carpetas del escritorio: cada subcarpeta de public/fotos/carpetas es una carpeta.
 * Fotos y videos; si un video tiene un .jpg con el mismo nombre, ese es su portada (y no se lista aparte).
 */
export function listCarpetas(): Folder[] {
  const root = path.join(process.cwd(), "public", "fotos", "carpetas");
  let dirs: string[] = [];
  try {
    dirs = fs.readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith(".")).map((d) => d.name);
  } catch {
    return [];
  }
  const order = ["life", "design", "random"];
  dirs.sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99) || a.localeCompare(b));
  return dirs
    .map((name) => {
      const files = fs.readdirSync(path.join(root, name)).filter((f) => MEDIA.test(f) && !f.startsWith("."));
      const videoBases = new Set(files.filter((f) => VID.test(f)).map((f) => f.replace(/\.\w+$/, "")));
      const url = (f: string) => `/fotos/carpetas/${encodeURIComponent(name)}/${encodeURIComponent(f)}`;
      const items: Media[] = files
        .filter((f) => VID.test(f) || !videoBases.has(f.replace(/\.\w+$/, "")))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map((f) => {
          if (!VID.test(f)) return { src: url(f), kind: "img" as const };
          const base = f.replace(/\.\w+$/, "");
          const poster = files.find((g) => !VID.test(g) && g.replace(/\.\w+$/, "") === base);
          return { src: url(f), kind: "video" as const, poster: poster ? url(poster) : undefined };
        });
      return { name, items };
    })
    .filter((f) => f.items.length > 0);
}

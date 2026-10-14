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

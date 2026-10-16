/**
 * POST /api/notes — guarda un "Dejame algo" (mensaje y/o foto estilo BeReal) en Supabase.
 *
 * Variables de entorno (en Vercel → Settings → Environment Variables):
 *   SUPABASE_URL               https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY  la service role key (secreta, solo servidor)
 *
 * Acepta multipart/form-data (con foto) o JSON (solo texto).
 * La foto va a un bucket PRIVADO de Storage ("visitor-notes"); en la tabla queda solo la ruta.
 *
 * Protección: validación del lado del servidor, campo trampa para bots,
 * tiempo mínimo, tipo y peso de la imagen verificados por sus bytes,
 * y límite de envíos por visitante (en memoria, sin guardar IPs).
 */
import { createHash, randomUUID } from "node:crypto";

const MAX = 2000;
const MAX_PHOTO = 5 * 1024 * 1024;
const BUCKET = "visitor-notes";
const WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear(); // no acumular memoria
  return false;
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max + 1) : "");

/** Mira los primeros bytes: no confiamos en el tipo que manda el navegador. */
function imageType(b: Uint8Array): { ext: string; mime: string } | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: "jpg", mime: "image/jpeg" };
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { ext: "png", mime: "image/png" };
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50)
    return { ext: "webp", mime: "image/webp" };
  return null;
}

const fail = (error: string, status = 400) => Response.json({ error }, { status });

export async function POST(request: Request) {
  const type = request.headers.get("content-type") ?? "";
  let body: Record<string, unknown> = {};
  let photo: File | null = null;

  try {
    if (type.includes("multipart/form-data")) {
      const len = Number(request.headers.get("content-length") ?? 0);
      if (len > MAX_PHOTO + 64 * 1024) return fail("big", 413);
      const form = await request.formData();
      for (const [k, v] of form.entries()) {
        if (k === "photo") photo = v instanceof File && v.size > 0 ? v : null;
        else body[k] = v;
      }
    } else {
      body = await request.json();
    }
  } catch {
    return fail("generic");
  }

  // Bots: el campo "website" está oculto para personas. Si viene lleno, fingimos éxito y no guardamos.
  if (clean(body.website, 200)) return Response.json({ ok: true });
  // Bots: nadie deja algo en menos de 2 segundos.
  const startedAt = Number(body.startedAt);
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < 2000) return Response.json({ ok: true });

  const message = clean(body.message, MAX);
  const name = clean(body.name, 80) || null;
  const email = clean(body.email, 120) || null;
  const lang = body.lang === "en" ? "en" : "es";

  // Con foto, el mensaje es opcional; sin foto, hace falta mensaje.
  if (!photo && message.length < 3) return fail("short");
  if (photo && message.length > 0 && message.length < 3) return fail("short");
  if (message.length > MAX) return fail("long");
  if (name && name.length > 80) return fail("generic");
  if (email && (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return fail("email");

  let bytes: Uint8Array | null = null;
  let kind: ReturnType<typeof imageType> = null;
  if (photo) {
    if (photo.size > MAX_PHOTO) return fail("big", 413);
    bytes = new Uint8Array(await photo.arrayBuffer());
    kind = imageType(bytes);
    if (!kind) return fail("photo");
  }

  // Límite por visitante: se usa un hash efímero (no se guarda en ningún lado).
  const fwd = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const key = createHash("sha256").update(fwd + new Date().toDateString()).digest("hex").slice(0, 16);
  if (rateLimited(key)) return fail("rate", 429);

  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) return fail("off", 503);
  const auth = { apikey: secret, Authorization: `Bearer ${secret}` };

  let photoPath: string | null = null;
  try {
    if (bytes && kind) {
      const month = new Date().toISOString().slice(0, 7);
      photoPath = `${month}/${randomUUID()}.${kind.ext}`;
      const up = await fetch(`${url}/storage/v1/object/${BUCKET}/${photoPath}`, {
        method: "POST",
        headers: { ...auth, "Content-Type": kind.mime, "x-upsert": "false" },
        body: bytes as BodyInit,
        cache: "no-store",
      });
      if (!up.ok) {
        console.error("visitor-notes upload failed", up.status, await up.text().catch(() => ""));
        return fail("generic", 502);
      }
    }

    const res = await fetch(`${url}/rest/v1/visitor_notes`, {
      method: "POST",
      headers: { ...auth, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ message: message || null, name, email, lang, photo_path: photoPath }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("visitor_notes insert failed", res.status, await res.text().catch(() => ""));
      // No dejar fotos huérfanas
      if (photoPath) await fetch(`${url}/storage/v1/object/${BUCKET}/${photoPath}`, { method: "DELETE", headers: auth }).catch(() => {});
      return fail("generic", 502);
    }
    return Response.json({ ok: true });
  } catch (e) {
    console.error("visitor_notes error", e);
    return fail("generic", 502);
  }
}

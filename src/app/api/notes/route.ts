/**
 * POST /api/notes — guarda un mensaje de "Dejame algo" en Supabase.
 *
 * Variables de entorno (en Vercel → Settings → Environment Variables):
 *   SUPABASE_URL               https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY  la service role key (secreta, solo servidor)
 *
 * Protección: validación del lado del servidor, campo trampa para bots,
 * tiempo mínimo de escritura y límite de envíos por visitante (en memoria, sin guardar IPs).
 */
import { createHash } from "node:crypto";

const MAX = 2000;
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

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "generic" }, { status: 400 });
  }

  // Bots: el campo "website" está oculto para personas. Si viene lleno, fingimos éxito y no guardamos.
  if (clean(body.website, 200)) return Response.json({ ok: true });
  // Bots: nadie escribe un mensaje en menos de 2 segundos.
  const startedAt = Number(body.startedAt);
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < 2000) return Response.json({ ok: true });

  const message = clean(body.message, MAX);
  const name = clean(body.name, 80) || null;
  const email = clean(body.email, 120) || null;
  const lang = body.lang === "en" ? "en" : "es";

  if (message.length < 3) return Response.json({ error: "short" }, { status: 400 });
  if (message.length > MAX) return Response.json({ error: "long" }, { status: 400 });
  if (name && name.length > 80) return Response.json({ error: "generic" }, { status: 400 });
  if (email && (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return Response.json({ error: "email" }, { status: 400 });

  // Límite por visitante: se usa un hash efímero (no se guarda en ningún lado).
  const fwd = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const key = createHash("sha256").update(fwd + new Date().toDateString()).digest("hex").slice(0, 16);
  if (rateLimited(key)) return Response.json({ error: "rate" }, { status: 429 });

  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) return Response.json({ error: "off" }, { status: 503 });

  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/visitor_notes`, {
      method: "POST",
      headers: {
        apikey: secret,
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ message, name, email, lang }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("visitor_notes insert failed", res.status, await res.text().catch(() => ""));
      return Response.json({ error: "generic" }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (e) {
    console.error("visitor_notes insert error", e);
    return Response.json({ error: "generic" }, { status: 502 });
  }
}

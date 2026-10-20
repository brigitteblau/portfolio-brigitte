/**
 * POST /api/call — "Charlemos": alguien quiere agendar una call.
 * Se guarda en Supabase (call_requests) y un trigger te manda un mail con todo.
 */
import { SUPABASE_URL, supabaseHeaders, rateLimiter } from "@/lib/supabase-public";

const limited = rateLimiter(3, 30 * 60 * 1000);
const TOPICS = ["proyecto", "emprender", "programar", "colegio", "charla", "otro"];
const SLOTS = ["mañana", "tarde", "noche", "cualquiera"];
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max + 1) : "");
const fail = (error: string, status = 400) => Response.json({ error }, { status });

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("generic");
  }
  // Bots
  if (clean(body.website, 200)) return Response.json({ ok: true });
  const startedAt = Number(body.startedAt);
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < 2500) return Response.json({ ok: true });

  const name = clean(body.name, 80);
  const email = clean(body.email, 120);
  const message = clean(body.message, 1000) || null;
  const lang = body.lang === "en" ? "en" : "es";
  const slot = SLOTS.includes(String(body.slot)) ? String(body.slot) : "cualquiera";
  const topics = Array.isArray(body.topics) ? body.topics.map(String).filter((t) => TOPICS.includes(t)).slice(0, 6) : [];
  const today = new Date().toISOString().slice(0, 10);
  const days = Array.isArray(body.days)
    ? [...new Set(body.days.map(String).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && d >= today))].slice(0, 3)
    : [];

  if (name.length < 1 || name.length > 80) return fail("name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) return fail("email");
  if (message && message.length > 1000) return fail("long");
  if (limited(request)) return fail("rate", 429);

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/call_requests`, {
      method: "POST",
      headers: { ...supabaseHeaders, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ name, email, message, topics, days, slot, lang }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("call_requests insert failed", res.status, await res.text().catch(() => ""));
      return fail("generic", 502);
    }
    return Response.json({ ok: true });
  } catch (e) {
    console.error("call_requests error", e);
    return fail("generic", 502);
  }
}

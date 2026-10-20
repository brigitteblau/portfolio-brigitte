import "server-only";
import { createHash } from "node:crypto";

/**
 * Proyecto "mi portfolio" de Supabase, con su clave PÚBLICA (rol anon).
 * En la base, esa clave solo puede AGREGAR mensajes/fotos/pedidos de call: nunca leer,
 * cambiar ni borrar (RLS). Se puede pisar con SUPABASE_URL y SUPABASE_KEY.
 */
export const SUPABASE_URL = (process.env.SUPABASE_URL ?? "https://gloxzdqigdbtrlgwugvm.supabase.co").replace(/\/$/, "");
export const SUPABASE_KEY =
  process.env.SUPABASE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsb3h6ZHFpZ2RidHJsZ3d1Z3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1ODc5NjYsImV4cCI6MjA5ODE2Mzk2Nn0.AQJlpZY2SNxQueKeFhnIQmrEzOxTPpU8zIBANcDQRds";

export const supabaseHeaders = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

/** Límite simple por visitante, en memoria y con un hash efímero (no se guardan IPs). */
export function rateLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (request: Request) => {
    const fwd = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
    const key = createHash("sha256").update(fwd + new Date().toDateString()).digest("hex").slice(0, 16);
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (hits.size > 5000) hits.clear();
    if (recent.length >= max) {
      hits.set(key, recent);
      return true;
    }
    recent.push(now);
    hits.set(key, recent);
    return false;
  };
}

// Manda un mail a Brigitte cuando alguien le deja una foto o un mensaje en el portfolio,
// o cuando alguien pide agendar una call ("Charlemos").
// La llama un trigger de la base (private.visitor_notes_notify) cada vez que entra una fila.
// Solo procesa filas recién creadas y que todavía no avisó (así nadie puede usarla para mandar mails de más).
// La clave de Resend está guardada en el Vault de Supabase (resend_api_key), no en el código.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import postgres from "npm:postgres@3.4.4";
import { encodeBase64 } from "jsr:@std/encoding@1/base64";

const TO = "brigitteyaelblau@gmail.com";
const sql = postgres(Deno.env.get("SUPABASE_DB_URL")!, { prepare: false, max: 1 });

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("no", { status: 405 });
  let id = "";
  let kind = "note";
  try {
    const body = await req.json();
    id = String(body.id ?? "");
    kind = body.kind === "call" ? "call" : "note";
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  if (!/^[0-9a-f-]{36}$/.test(id)) return Response.json({ ok: false }, { status: 400 });
  if (kind === "call") return callMail(id);

  // Reclamar la fila (una sola vez, y solo si es nueva)
  const rows = await sql`
    update public.visitor_notes set notified_at = now()
    where id = ${id} and notified_at is null and created_at > now() - interval '15 minutes'
    returning id, created_at, message, name, email, lang, photo_path`;
  const note = rows[0];
  if (!note) return Response.json({ ok: true, skipped: true });

  try {
    const [{ secret }] = await sql`select decrypted_secret as secret from vault.decrypted_secrets where name = 'resend_api_key' limit 1`;

    const attachments: Record<string, string>[] = [];
    if (note.photo_path) {
      const res = await fetch(`${Deno.env.get("SUPABASE_URL")}/storage/v1/object/visitor-notes/${note.photo_path}`, {
        headers: { Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`, apikey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! },
      });
      if (res.ok) {
        const bytes = new Uint8Array(await res.arrayBuffer());
        const ext = String(note.photo_path).split(".").pop();
        attachments.push({ filename: `foto.${ext}`, content: encodeBase64(bytes), content_id: "foto" });
      }
    }

    const when = new Intl.DateTimeFormat("es-AR", { dateStyle: "full", timeStyle: "short", timeZone: "America/Argentina/Buenos_Aires" }).format(new Date(note.created_at));
    const who = note.name ? esc(note.name) : "Alguien";
    const html = `
      <div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:auto;color:#1f2128">
        <p style="font-size:22px;font-weight:800;margin:0 0 4px">${attachments.length ? "📸 Te dejaron una foto" : "💌 Te dejaron un mensaje"}</p>
        <p style="color:#777;margin:0 0 16px">${esc(when)} · desde tu portfolio (${note.lang})</p>
        ${attachments.length ? `<div style="background:#fff;padding:12px 12px 40px;box-shadow:0 10px 30px -12px rgba(0,0,0,.4);transform:rotate(-2deg);margin:0 0 20px"><img src="cid:foto" style="width:100%;display:block" alt=""></div>` : ""}
        ${note.message ? `<p style="font-size:20px;line-height:1.35;background:#fbf8ee;border-left:4px solid #e15cae;padding:12px 14px;margin:0 0 16px">${esc(note.message).replace(/\n/g, "<br>")}</p>` : ""}
        <p style="margin:0"><b>De:</b> ${who}${note.email ? ` · <a href="mailto:${esc(note.email)}">${esc(note.email)}</a>` : ""}</p>
      </div>`;

    const send = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Tu portfolio <onboarding@resend.dev>",
        to: [TO],
        reply_to: note.email ?? undefined,
        subject: attachments.length ? `📸 ${who} te dejó una foto` : `💌 ${who} te dejó un mensaje`,
        html,
        attachments,
      }),
    });
    if (!send.ok) throw new Error(`resend ${send.status}: ${await send.text()}`);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("notify-note", e);
    // Que se pueda reintentar
    await sql`update public.visitor_notes set notified_at = null where id = ${id}`;
    return Response.json({ ok: false }, { status: 502 });
  }
});

/** "Charlemos": alguien quiere una call. */
async function callMail(id: string) {
  const rows = await sql`
    update public.call_requests set notified_at = now()
    where id = ${id} and notified_at is null and created_at > now() - interval '15 minutes'
    returning id, created_at, name, email, topics, message, days, slot, lang`;
  const c = rows[0];
  if (!c) return Response.json({ ok: true, skipped: true });
  try {
    const [{ secret }] = await sql`select decrypted_secret as secret from vault.decrypted_secrets where name = 'resend_api_key' limit 1`;
    const fmtDay = new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
    const days = (c.days as (string | Date)[]).map((d) => fmtDay.format(new Date(d))).join(", ") || "cualquier día";
    const topics = (c.topics as string[]).join(" · ");
    const html = `
      <div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:auto;color:#1f2128">
        <p style="font-size:22px;font-weight:800;margin:0 0 4px">☎️ ${esc(c.name)} quiere charlar con vos</p>
        <p style="color:#777;margin:0 0 16px">desde tu portfolio (${c.lang})</p>
        <table style="font-size:16px;line-height:1.5;border-collapse:collapse">
          <tr><td style="padding:4px 12px 4px 0;color:#777">Mail</td><td><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#777">Días</td><td>${esc(days)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#777">Horario</td><td>${esc(c.slot)}</td></tr>
          ${topics ? `<tr><td style="padding:4px 12px 4px 0;color:#777">Temas</td><td>${esc(topics)}</td></tr>` : ""}
        </table>
        ${c.message ? `<p style="font-size:18px;line-height:1.4;background:#fbf8ee;border-left:4px solid #4e75e5;padding:12px 14px;margin:16px 0">${esc(c.message).replace(/\n/g, "<br>")}</p>` : ""}
        <p style="margin:16px 0 0;color:#555">Respondé este mail para confirmar el día y mandar el link de la call.</p>
      </div>`;
    const send = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Tu portfolio <onboarding@resend.dev>",
        to: [TO],
        reply_to: c.email,
        subject: `☎️ ${c.name} quiere agendar una call`,
        html,
      }),
    });
    if (!send.ok) throw new Error(`resend ${send.status}: ${await send.text()}`);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("notify-call", e);
    await sql`update public.call_requests set notified_at = null where id = ${id}`;
    return Response.json({ ok: false }, { status: 502 });
  }
}

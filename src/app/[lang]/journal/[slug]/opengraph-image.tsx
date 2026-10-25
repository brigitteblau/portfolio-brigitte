import { ImageResponse } from "next/og";
import { getEntry, publishedSlugs } from "@/lib/journal";
import { locales, type Locale } from "@/lib/i18n";

/** La imagen que aparece al compartir cada texto (WhatsApp, LinkedIn, Google): título + Brigitte Blau. */
export const alt = "Brigitte Blau · Journal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.flatMap((lang) => publishedSlugs().map((slug) => ({ lang, slug })));
}

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const e = getEntry(slug, lang as Locale);
  const title = e?.meta.title ?? "Journal";
  const excerpt = e?.meta.excerpt ?? "";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#ffffff", padding: "80px 90px" }}>
        <div style={{ display: "flex", fontSize: 28, color: "#86868b" }}>Journal · Brigitte Blau</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, lineHeight: 1.05, color: "#1d1d1f", letterSpacing: -2 }}>{title}</div>
          {excerpt && <div style={{ display: "flex", marginTop: 28, fontSize: 32, lineHeight: 1.35, color: "#55555a", maxWidth: 950 }}>{excerpt}</div>}
        </div>
        <div style={{ display: "flex", width: 120, height: 6, borderRadius: 3, background: "#E8A9BC" }} />
      </div>
    ),
    size,
  );
}

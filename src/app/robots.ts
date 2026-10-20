import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

/** Todo indexable (también para buscadores con IA); solo la API queda afuera. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}

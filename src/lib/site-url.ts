/** URL pública del sitio (para canonical, sitemap, Open Graph y llms.txt). */
const PROD = "https://brigitteblau.vercel.app";

export const siteUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL ? PROD : "http://localhost:3000")).replace(/\/$/, "");

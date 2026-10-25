import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@fontsource-variable/inter-tight/wght.css";
import "@fontsource-variable/inter-tight/wght-italic.css";
import "@fontsource-variable/caveat/index.css";
import "@fontsource-variable/bodoni-moda/standard.css";
import "@fontsource-variable/bodoni-moda/standard-italic.css";
import "@fontsource/vt323/index.css";
import "@fontsource-variable/jetbrains-mono/index.css";
import "../globals.css";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { ui, contacto } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const es = lang === "es";
  const title = es
    ? "Brigitte Blau — emprendedora y developer en Buenos Aires"
    : "Brigitte Blau — entrepreneur and developer in Buenos Aires";
  const description = es
    ? "Brigitte Blau, emprendedora y developer de Buenos Aires. Socia y directora de Grupo Mirrow, una marca argentina de ropa y uniformes para empresas. Programo web y apps."
    : "Brigitte Blau, entrepreneur and developer from Buenos Aires. Partner and director at Grupo Mirrow, an Argentine clothing and corporate uniform brand. I build web and mobile apps.";
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: "%s · Brigitte Blau" },
    description,
    applicationName: "Brigitte Blau",
    authors: [{ name: "Brigitte Blau", url: siteUrl() }],
    creator: "Brigitte Blau",
    keywords: es
      ? ["Brigitte Blau", "portfolio", "joven emprendedora", "jóvenes emprendedores", "desarrolladora backend", "desarrolladora frontend", "programadora", "ORT Argentina", "Grupo Mirrow", "Buenos Aires", "visión por computadora", "3D", "portfolio creativo"]
      : ["Brigitte Blau", "portfolio", "young entrepreneur", "backend developer", "frontend developer", "developer", "ORT Argentina", "Grupo Mirrow", "Buenos Aires", "computer vision", "3D", "creative portfolio", "cool portfolio"],
    alternates: { canonical: `/${lang}`, languages: { es: "/es", en: "/en", "x-default": "/es" } },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: {
      type: "website",
      siteName: "Brigitte Blau",
      title,
      description,
      url: `/${lang}`,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Brigitte Blau" }],
      locale: es ? "es_AR" : "en_US",
      alternateLocale: es ? "en_US" : "es_AR",
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
    verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const l = lang as Locale;

  return (
    <html
      lang={l}
    >
      <body>
        <script
          type="application/ld+json"
          // Datos estructurados: quién es la persona detrás del sitio
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": `${siteUrl()}/#brigitte`,
                  name: ui.fullName,
                  givenName: "Brigitte",
                  familyName: "Blau",
                  url: siteUrl(),
                  image: `${siteUrl()}/og.jpg`,
                  email: `mailto:${contacto.email}`,
                  jobTitle: l === "es" ? "Emprendedora y developer" : "Entrepreneur and developer",
                  description:
                    l === "es"
                      ? "Emprendedora y developer de Buenos Aires. Socia y directora de Grupo Mirrow."
                      : "Entrepreneur and developer from Buenos Aires. Partner and director at Grupo Mirrow.",
                  worksFor: { "@type": "Organization", name: "Grupo Mirrow", url: "https://grupomirrow.com" },
                  alumniOf: { "@type": "EducationalOrganization", name: "ORT Argentina" },
                  knowsAbout: ["Backend", "FastAPI", "Node.js", "TypeScript", "Next.js", "Supabase", "Computer vision", "3D", "CadQuery", "SEO", "Entrepreneurship"],
                  sameAs: contacto.links.map((x) => x.href),
                  address: { "@type": "PostalAddress", addressLocality: "Buenos Aires", addressCountry: "AR" },
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl()}/#web`,
                  url: siteUrl(),
                  name: "Brigitte Blau",
                  inLanguage: ["es", "en"],
                  author: { "@id": `${siteUrl()}/#brigitte` },
                },
              ],
            }),
          }}
        />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-12 focus:z-[100] focus:rounded focus:bg-paper focus:px-3 focus:py-2"
        >
          {ui.skip[l]}
        </a>
        <div id="contenido">{children}</div>
      </body>
    </html>
  );
}

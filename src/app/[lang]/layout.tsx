import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource-variable/bodoni-moda/standard.css";
import "@fontsource-variable/bodoni-moda/standard-italic.css";
import "@fontsource/vt323/index.css";
import "@fontsource/anton/index.css";
import "@fontsource-variable/jetbrains-mono/index.css";
import "../globals.css";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import SmoothScroll from "@/components/SmoothScroll";
import MenuBar from "@/components/MenuBar";
import { ui, contacto } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const es = lang === "es";
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: "Brigitte Blau", template: "%s · Brigitte Blau" },
    description: es
      ? "Brigitte Blau: proyectos de tecnología (backend, 3D, visión por computadora), mi historia por eras y un journal."
      : "Brigitte Blau: tech projects (backend, 3D, computer vision), my story told in eras, and a journal.",
    alternates: { canonical: `/${lang}`, languages: { es: "/es", en: "/en", "x-default": "/es" } },
    openGraph: { images: [{ url: "/og.jpg", width: 1200, height: 630 }], locale: es ? "es_AR" : "en_US", type: "website" },
    twitter: { card: "summary_large_image", images: ["/og.jpg"] },
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
              "@type": "Person",
              name: ui.fullName,
              url: siteUrl(),
              email: `mailto:${contacto.email}`,
              sameAs: contacto.links.map((x) => x.href),
              address: { "@type": "PostalAddress", addressLocality: "Buenos Aires", addressCountry: "AR" },
            }),
          }}
        />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-12 focus:z-[100] focus:rounded focus:bg-paper focus:px-3 focus:py-2"
        >
          {ui.skip[l]}
        </a>
        <SmoothScroll>
          <MenuBar lang={l} />
          <div id="contenido">{children}</div>
        </SmoothScroll>
      </body>
    </html>
  );
}

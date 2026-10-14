import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource-variable/bodoni-moda/standard.css";
import "@fontsource-variable/bodoni-moda/standard-italic.css";
import "@fontsource-variable/caveat/index.css";
import "@fontsource/vt323/index.css";
import "@fontsource/bowlby-one/index.css";
import "@fontsource-variable/jetbrains-mono/index.css";
import "../globals.css";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import SmoothScroll from "@/components/SmoothScroll";
import MenuBar from "@/components/MenuBar";
import { ui } from "@/content/site";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const es = lang === "es";
  return {
    title: { default: "Brigitte", template: "%s · Brigitte" },
    description: es
      ? "Mi historia, por eras: de nacer a programar y a lo que hago hoy."
      : "My story, era by era: from being born to coding to what I do today.",
    alternates: { languages: { es: "/es", en: "/en" } },
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

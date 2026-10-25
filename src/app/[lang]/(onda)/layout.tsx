import "@fontsource/pixelify-sans/700.css";
import "@fontsource/shrikhand/400.css";
import type { Locale } from "@/lib/i18n";
import OndaNav from "@/components/onda/OndaNav";

/** La versión "con onda": hoja crema rayada, como de carpeta, y la barra de arriba. */
export default async function OndaLayout({ children, params }: LayoutProps<"/[lang]">) {
  const lang = (await params).lang as Locale;
  return (
    <div
      className="min-h-screen text-[#2A1F24]"
      style={{ background: "repeating-linear-gradient(0deg, transparent 0 31px, #ECE3E6 31px 32px), #FBF8F1" }}
    >
      <style>{"html{scroll-behavior:smooth}body{background:#FBF8F1}"}</style>
      <OndaNav lang={lang} />
      {children}
    </div>
  );
}

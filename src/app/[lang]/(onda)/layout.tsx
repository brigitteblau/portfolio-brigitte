import type { Locale } from "@/lib/i18n";
import SmoothScroll from "@/components/SmoothScroll";
import MenuBar from "@/components/MenuBar";
import Footer from "@/components/Footer";

/** La versión "con onda": menú, scroll suave y pie de página. La portada sobria no los usa. */
export default async function OndaLayout({ children, params }: LayoutProps<"/[lang]">) {
  const lang = (await params).lang as Locale;
  return (
    <SmoothScroll>
      <MenuBar lang={lang} />
      {children}
      <Footer lang={lang} />
    </SmoothScroll>
  );
}

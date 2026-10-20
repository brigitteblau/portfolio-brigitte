import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import Charlemos from "@/components/sections/Charlemos";

export async function generateMetadata({ params }: PageProps<"/[lang]/charlemos">): Promise<Metadata> {
  const { lang } = await params;
  const es = lang === "es";
  return {
    title: es ? "Agendá una call conmigo" : "Book a call with me",
    description: es
      ? "Agendá una call con Brigitte Blau para hablar de un proyecto, de emprender, de programar, del colegio o de lo que quieras."
      : "Book a call with Brigitte Blau to talk about a project, starting something, coding, school, or anything you want.",
    alternates: { canonical: `/${lang}/charlemos`, languages: { es: "/es/charlemos", en: "/en/charlemos" } },
  };
}

export default async function CharlemosPage({ params }: PageProps<"/[lang]/charlemos">) {
  const lang = (await params).lang as Locale;
  const es = lang === "es";
  return (
    <main id="main" className="pt-12 sm:pt-14">
      <Charlemos lang={lang} />
      <p className="px-6 pb-6 text-center text-[0.95rem] text-ink/70">
        <Link href={`/${lang}`} className="font-semibold underline underline-offset-2 hover:text-blue">
          {es ? "Ver el portfolio de Brigitte Blau" : "See Brigitte Blau's portfolio"}
        </Link>
      </p>
    </main>
  );
}

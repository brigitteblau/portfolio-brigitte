import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import CallForm from "@/components/CallForm";
import { talk as T } from "@/content/onda";
import { Pix } from "@/components/onda/Kit";

export async function generateMetadata({ params }: PageProps<"/[lang]/charlemos">): Promise<Metadata> {
  const { lang } = await params;
  const es = lang === "es";
  return {
    title: es ? "Agendá una call conmigo" : "Book a call with me",
    description: es
      ? "Agendá una call con Brigitte Blau para hablar de un proyecto, de emprender, de programar o de lo que quieras."
      : "Book a call with Brigitte Blau to talk about a project, starting something, coding, or anything you want.",
    alternates: { canonical: `/${lang}/charlemos`, languages: { es: "/es/charlemos", en: "/en/charlemos" } },
  };
}

export default async function CharlemosPage({ params }: PageProps<"/[lang]/charlemos">) {
  const lang = (await params).lang as Locale;
  const es = lang === "es";
  return (
    <main id="main" className="px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-[560px] text-center">
        <Pix as="h1" className="text-[clamp(2.6rem,8vw,4.5rem)]">
          {T.title[lang]}
        </Pix>
        <p className="mx-auto mt-3 max-w-[36ch] text-[1.1rem] text-[#4A2C2A]/70">{T.sub[lang]}</p>
        <div className="mt-6 text-left">
          <CallForm lang={lang} startOpen />
        </div>
        <p className="mt-12 text-[0.95rem] text-[#4A2C2A]/70">
          <Link href={`/${lang}`} className="font-semibold underline underline-offset-2">
            {es ? "Ver el portfolio de Brigitte Blau" : "See Brigitte Blau's portfolio"}
          </Link>
        </p>
      </div>
    </main>
  );
}

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { story as S } from "@/content/onda";
import Video from "../Video";
import { Hand, Pix, Polaroid, Sheet, Tag } from "./Kit";
import Reveal from "./Reveal";

/** Mi historia: el video de bebé (con sonido), el golf y los libros. */
export default function Story({ lang, video, golf }: { lang: Locale; video?: string; golf?: string }) {
  return (
    <Sheet id="historia" label={S.title[lang]}>
      <Hand className="text-[1.7rem]">{S.kicker[lang]}</Hand>
      <Pix className="mt-1 text-[clamp(3rem,8vw,6rem)]">{S.title[lang]}</Pix>

      {video && (
        <Reveal className="mt-10">
          <div className="relative overflow-hidden rounded-[8px] bg-[#2A1F24] shadow-[0_24px_50px_-28px_rgba(0,0,0,.6)]">
            <Video src={video} poster={video.replace(/\.\w+$/, ".jpg")} lang={lang} loop={false} soundFirst={S.playWithSound[lang]} label={S.baby[lang]} className="relative aspect-video max-h-[80svh] w-full" />
            <span className="pointer-events-none absolute left-4 top-4 rounded-[4px] bg-[#F6E3A1] px-2.5 py-1 text-[0.75rem] font-bold uppercase tracking-[0.06em] text-[#2A1F24]">
              {S.baby[lang]}
            </span>
          </div>
        </Reveal>
      )}

      <div className="mt-16 grid items-start gap-12 lg:grid-cols-2">
        <Reveal>
          <div>
            <div className="flex items-center gap-3">
              <Pix as="p" className="text-[2.2rem]">
                {S.golfTitle[lang]}
              </Pix>
              <Tag c="mint" className="-rotate-3">
                {S.golfNote[lang]} ⛳
              </Tag>
            </div>
            <div className="mt-6 grid grid-cols-2 items-start gap-5">
              {golf ? (
                <div className="overflow-hidden rounded-[8px] bg-black">
                  <Video src={golf} poster={golf.replace(/\.\w+$/, ".jpg")} lang={lang} label="Golf" className="relative aspect-[9/16] w-full" />
                </div>
              ) : null}
              <Polaroid src="/fotos/deportes/1.webp" rotate={3} />
              {!golf && <Polaroid src="/fotos/deportes/4.webp" rotate={-3} />}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-[6px] border-[1.5px] border-[#E8A9BC] bg-white/70 p-6 sm:p-8">
            <Pix as="p" className="text-[1.9rem]">
              {S.booksTitle[lang]}
            </Pix>
            <ol className="mt-5 divide-y divide-dashed divide-[#2A1F24]/15">
              {S.books.map((b, i) => (
                <li key={b.title} className="flex items-baseline gap-4 py-3">
                  <span className="font-[Pixelify_Sans] text-[1.2rem] font-bold text-[#9C4F68]">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block text-[1.1rem] font-bold italic leading-tight">{b.title}</span>
                    <span className="text-[0.9rem] text-[#2A1F24]/60">{b.author}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-4 font-hand text-[1.4rem] text-[#2A1F24]/60">{S.booksSoon[lang]}</p>
            <Link href={`/${lang}/journal`} className="mt-4 inline-block rounded-[6px] bg-[#2A1F24] px-4 py-2 text-[0.82rem] font-bold uppercase tracking-[0.04em] text-white">
              {S.journal[lang]}
            </Link>
          </div>
        </Reveal>
      </div>
    </Sheet>
  );
}

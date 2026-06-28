export default function Footer({ dict }: any) {
  return (
    <footer className="px-6 pb-8 md:px-12">
      <div className="mx-auto flex max-w-6xl justify-between border-t border-neutral-200 pt-6 text-xs uppercase tracking-[0.2em] text-neutral-400">
        <span>Brigitte Blau</span>
        <span>{dict.footer.place}</span>
      </div>
    </footer>
  );
}
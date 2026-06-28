const studies = [
  ['ORT Argentina', 'TIC · programación, diseño, producto y proyectos reales.'],
  ['Web products', 'React, Next, Supabase, Vercel, Tailwind y experiencias digitales.'],
  ['Computer vision', 'Visual SLAM, OpenCV, geometría, mapas y tracking.'],
  ['AI + product', 'Ideas, prototipos y herramientas donde la IA no reemplaza: amplifica.'],
  ['Hackathons', 'NASA Space Apps, investigación rápida y trabajo en equipo.'],
];

export default function Studies({ dict }: any) {
  return (
    <section id="studies" className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="kicker">studies / background</p>
        <h2 className="title">Lo que estudio, lo que pruebo y lo que me va formando.</h2>

        <div className="mt-12 divide-y divide-neutral-200 border-y border-neutral-200">
          {studies.map(([title, text]) => (
            <div key={title} className="grid gap-3 py-7 md:grid-cols-[260px_1fr]">
              <h3 className="text-2xl font-black tracking-[-0.04em]">{title}</h3>
              <p className="max-w-2xl text-neutral-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
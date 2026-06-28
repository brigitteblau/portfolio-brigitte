export default function About({ dict }: any) {
  return (
    <section id="about" className="px-6 py-24 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.85fr_1.15fr]">
        <div className="relative min-h-[430px]">
          <img
            src="/1.jpeg"
            alt="Brigitte"
            className="absolute left-0 top-0 h-72 w-56 rotate-[-4deg] rounded-2xl object-cover shadow-xl"
          />
          <img
            src="/4.jpeg"
            alt=""
            className="absolute bottom-0 right-6 h-64 w-52 rotate-[5deg] rounded-2xl object-cover shadow-xl"
          />
        </div>

        <div>
          <p className="kicker">about</p>
          <h2 className="title-small">
            Soy Brigitte. Construyo para entender mejor lo que me interesa.
          </h2>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-600">
            Me gusta mezclar tecnología, diseño y preguntas. No quiero que mi portfolio sea
            una grilla de proyectos prolijos: quiero que se sienta como una forma de pensar.
            Cada proyecto guarda una etapa, una obsesión, algo que aprendí o algo que todavía
            estoy intentando resolver.
          </p>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-600">
            Estoy entre productos web, inteligencia artificial, visión por computadora,
            escritura, diseño y proyectos que nacen de una curiosidad muy concreta.
          </p>
        </div>
      </div>
    </section>
  );
}
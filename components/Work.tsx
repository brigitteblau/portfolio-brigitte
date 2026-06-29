import Reveal from './Reveal';
import ProjectsCarousel from './ProjectsCarousel';

export default function Work({ dict, projects, lang }: any) {
  return (
    <section id="work" className="py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <Reveal>
          <p className="kicker">{dict.work.kicker}</p>
          <h2 className="section-title">{dict.work.title}</h2>
        </Reveal>
      </div>

      <div className="mt-12">
        <ProjectsCarousel projects={projects} lang={lang} dict={dict} />
      </div>
    </section>
  );
}

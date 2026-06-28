const dictionaries = {
  es: {
    nav: {
      home: 'Brigitte',
      work: 'work',
      about: 'about',
      journal: 'journal',
      contact: 'contact',
      switch: 'EN',
    },
    hero: {
      eyebrow: 'portfolio como archivo vivo',
      title: 'Brigitte\nBlau',
      text: 'Construyo proyectos entre diseño, código e ideas. Me interesa entender el mundo haciendo cosas reales, guardando procesos y mostrando no solo el resultado.',
    },
    work: {
      kicker: 'selected work',
      title: 'Proyectos que muestran cómo pienso.',
      open: 'abrir',
    },
    about: {
      kicker: 'about / learning',
      title: 'No quiero mostrar solo estudios. Quiero mostrar proceso.',
      items: [
        ['ORT Argentina', 'TIC · programación, diseño, producto y proyectos reales.'],
        ['Ingeniería', 'Interés en informática, bioingeniería, IA y tecnología con impacto.'],
        ['Autodidacta', 'React, Supabase, visión por computadora, diseño web y prototipos.'],
        ['Hackathons', 'NASA Space Apps, trabajo en equipo y construcción bajo presión.'],
      ],
    },
    journal: {
      kicker: 'journal',
      title: 'Notas, ideas y cosas que me quedan dando vueltas.',
      empty: 'Todavía no hay notas publicadas.',
    },
    contact: {
      kicker: 'contact',
      title: 'Si algo de esto te resonó, escribime.',
    },
    footer: {
      place: 'Buenos Aires · 2026',
    },
  },

  en: {
    nav: {
      home: 'Brigitte',
      work: 'work',
      about: 'about',
      journal: 'journal',
      contact: 'contact',
      switch: 'ES',
    },
    hero: {
      eyebrow: 'portfolio as a living archive',
      title: 'Brigitte\nBlau',
      text: 'I build projects between design, code and ideas. I’m interested in understanding the world by making real things, saving the process and showing more than just the final result.',
    },
    work: {
      kicker: 'selected work',
      title: 'Projects that show how I think.',
      open: 'open',
    },
    about: {
      kicker: 'about / learning',
      title: 'I don’t just want to show studies. I want to show process.',
      items: [
        ['ORT Argentina', 'Technology, programming, design, product and real projects.'],
        ['Engineering', 'Interested in computer science, bioengineering, AI and technology with impact.'],
        ['Self-taught', 'React, Supabase, computer vision, web design and prototypes.'],
        ['Hackathons', 'NASA Space Apps, teamwork and building under pressure.'],
      ],
    },
    journal: {
      kicker: 'journal',
      title: 'Notes, ideas and things I keep thinking about.',
      empty: 'No notes published yet.',
    },
    contact: {
      kicker: 'contact',
      title: 'If any of this resonated with you, write me.',
    },
    footer: {
      place: 'Buenos Aires · 2026',
    },
  },
};

export function getDictionary(lang: string) {
  return dictionaries[lang as 'es' | 'en'] ?? dictionaries.es;
}
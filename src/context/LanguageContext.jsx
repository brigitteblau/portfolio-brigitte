import { createContext, useContext, useState } from 'react';
import { projects } from '../data/projects';
import { education, courses } from '../data/education';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('es');

  const translations = {
    es: {
      // nav
      hey: "Inicio",
      studies: "Estudios",
      about: "Estudios",
      work: "Proyectos",
      journal: "Journal",
      story: "Historia",
      chat: "Contacto",

      // hero
      heroKicker: "desarrolladora creativa",
      heroKicker2: "estudiante / builder",
      heroSideKicker: "Ahora",
      heroSideTitle: "Construyo cosas con criterio.",
      heroSideText: "Me gusta el diseño con intención, el código prolijo y los proyectos que se publican de verdad.",
      heroIntro: "Bienvenida a",
      heroEyebrow: "portfolio como archivo vivo",
      heroLine: "Intento entender el mundo construyendo cosas, escribiéndolas y guardando la pequeña prueba de que estuve prestando atención.",
      heroScroll: "scrolleá",
      heroText: "Desarrolladora creativa. Doy vida a marcas y experiencias digitales con estilo y sentido.",
      heroTitle: "BRIGITTE BLAU",
      heroFirst: "Brigitte",
      heroLast: "Blau",
      ideaLabel: "la idea",
      ideaStatement: "No un portfolio prolijo. Una primera página dramática que se convierte en un cuaderno.",
      ideaText: "El hero es el gancho: fotos cayendo, el nombre apareciendo, scroll, movimiento. Después la página se vuelve útil: proyectos, journal, reflexiones en audio, fotos y un lugar para guardar pensamientos sin que parezcan posts de LinkedIn.",

      // estudios / about
      aboutKicker: "Un poco sobre mí",
      aboutTitle: "Reflexiva, curiosa y obsesiva con los detalles (en el buen sentido).",
      aboutText:
        "Me gusta pensar antes de construir: entender el por qué, la historia y lo que se quiere provocar. Estoy creciendo entre proyectos web reales, experimentos de visión por computadora y diseño.",
      aboutTraits: ["Reflexiva", "Curiosa", "Autodidacta", "Creativa", "Perseverante"],
      aboutEduTitle: "Educación",
      aboutEducation: education.es,
      aboutCoursesTitle: "Extras y experiencia",
      aboutCoursesText: "Cursos, talleres y aprendizajes fuera de horario.",
      aboutCourses: courses.es,
      aboutCta: "Hablemos",

      // story
      storyTitle1: "Cada imagen guarda",
      storyTitle2: "un secreto brillante",
      storyOutro: "Esto no es solo un carrusel — es una pared de recuerdos, una mirada a lo que brilla detrás de cada instante.",

      // archivo (proyectos + journal)
      archiveKicker: "abrí las carpetas",
      archiveTitle: "Mi archivo",

      // work
      workTitle: "MIS ÚLTIMOS PROYECTOS",
      workFrom: "desde 2024 hasta hoy",
      workSubtitle: "Proyectos destacados (curados) + repos actualizados desde GitHub.",
      visitSite: "Ver sitio ✨",
      fastLine: "Prototipos creados con pasión y velocidad.",
      fastRibbon: "HECHO RÁPIDO",
      filterAll: "Todos",
      filterFeatured: "Destacados",
      filterGithub: "Con GitHub",
      filterLive: "Con demo",
      filterWip: "En progreso",

      // journal
      journalKicker: "archivo vivo",
      journalTitle: "Journal",
      journalLead: "Historias que me van pasando. Podés leerlas y escucharlas.",
      journalListen: "Escuchar",
      journalPause: "Pausar",
      journalRead: "Leer",
      journalBack: "Volver al journal",
      journalEmpty: "Todavía no hay historias publicadas. Pronto.",
      journalLoading: "Cargando historias...",
      journalError: "No se pudieron cargar las historias.",
      journalTranscript: "Transcripción",
      journalNotFound: "No encontré esta historia.",

      // contact
      contactPrompt: "Si te pinta, escribime algo lindo.",
      openToWork: "Abierta a trabajos",
      contactButton: "Conectar",
      contactTitle: "¿Armamos algo juntas?",
      contactLead: "Estoy abierta a trabajos, colaboraciones y proyectos con alma. Contame qué tenés en mente.",
      contactNameLabel: "Nombre",
      contactNamePlaceholder: "Tu nombre",
      contactEmailLabel: "Email",
      contactEmailPlaceholder: "tu@email.com",
      contactMessageLabel: "Mensaje",
      contactMessagePlaceholder: "Contame tu idea...",
      contactSend: "Enviar",
      contactHint: "Esto abre tu app de email.",

      projects: projects.es,
    },

    en: {
      // nav
      hey: "Home",
      studies: "Studies",
      about: "Studies",
      work: "Projects",
      journal: "Journal",
      story: "Story",
      chat: "Contact",

      // hero
      heroKicker: "creative developer",
      heroKicker2: "student / builder",
      heroSideKicker: "Currently",
      heroSideTitle: "I build things with taste.",
      heroSideText: "I like intentional design, clean code, and projects that actually ship.",
      heroIntro: "Welcome to",
      heroEyebrow: "portfolio as a living archive",
      heroLine: "I'm trying to understand the world by building things, writing about them, and saving the little proof that I was paying attention.",
      heroScroll: "scroll",
      heroText: "Creative developer. I bring brands and digital experiences to life with style and purpose.",
      heroTitle: "BRIGITTE BLAU",
      heroFirst: "Brigitte",
      heroLast: "Blau",
      ideaLabel: "the idea",
      ideaStatement: "Not a clean portfolio. A dramatic first page that turns into a notebook.",
      ideaText: "The hero is the hook: photos falling, the name appearing, scroll, movement. Then the page becomes useful: projects, journal, audio reflections, photos, and a place to keep thoughts without making them look like LinkedIn posts.",

      // estudios / about
      aboutKicker: "A bit about me",
      aboutTitle: "Reflective, curious, and (nicely) obsessed with details.",
      aboutText:
        "I like to think before I build: the why, the story, the feeling. I'm growing between real web products, computer vision experiments, and design.",
      aboutTraits: ["Reflective", "Curious", "Self-taught", "Creative", "Persistent"],
      aboutEduTitle: "Education",
      aboutEducation: education.en,
      aboutCoursesTitle: "Extra & experience",
      aboutCoursesText: "Courses, workshops, and the stuff I learn after hours.",
      aboutCourses: courses.en,
      aboutCta: "Let’s talk",

      // story
      storyTitle1: "Every picture holds",
      storyTitle2: "a bright secret",
      storyOutro: "This is not just a carousel — it’s a memory wall, a glimpse into what shines behind every moment.",

      // archive (projects + journal)
      archiveKicker: "open the folders",
      archiveTitle: "My archive",

      // work
      workTitle: "MY LATEST WORK",
      workFrom: "from 2024 'til today",
      workSubtitle: "Curated featured projects + repos freshly pulled from GitHub.",
      visitSite: "Visit site ✨",
      fastLine: "Prototypes built with speed and passion.",
      fastRibbon: "BUILT FAST",
      filterAll: "All",
      filterFeatured: "Featured",
      filterGithub: "With GitHub",
      filterLive: "Live demo",
      filterWip: "In progress",

      // journal
      journalKicker: "living archive",
      journalTitle: "Journal",
      journalLead: "Stories as they happen to me. You can read and listen to them.",
      journalListen: "Listen",
      journalPause: "Pause",
      journalRead: "Read",
      journalBack: "Back to journal",
      journalEmpty: "No stories published yet. Soon.",
      journalLoading: "Loading stories...",
      journalError: "Could not load the stories.",
      journalTranscript: "Transcript",
      journalNotFound: "I couldn't find this story.",

      // contact
      contactPrompt: "If you feel like it, write me something.",
      openToWork: "Open to work",
      contactButton: "Connect",
      contactTitle: "Want to build something?",
      contactLead: "I'm open to work, collaborations and projects with soul. Tell me what you have in mind.",
      contactNameLabel: "Name",
      contactNamePlaceholder: "Your name",
      contactEmailLabel: "Email",
      contactEmailPlaceholder: "you@email.com",
      contactMessageLabel: "Message",
      contactMessagePlaceholder: "Tell me your idea...",
      contactSend: "Send",
      contactHint: "This opens your email app.",

      projects: projects.en,
    },
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

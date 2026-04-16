import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('es');

  const translations = {
    es: {
      hey: "¡Hola!",
      about: "Sobre mí",
      work: "Proyectos",
      story: "Historia",
      chat: "Charlemos",
  
      heroKicker: "desarrolladora creativa",
      heroKicker2: "estudiante / builder",
      heroSideKicker: "Ahora",
      heroSideTitle: "Construyo cosas con criterio.",
      heroSideText: "Me gusta el diseño con intención, el código prolijo y los proyectos que se publican de verdad.",

      heroText: "Desarrolladora creativa. Doy vida a marcas y experiencias digitales con estilo y sentido.",
      heroTitle: "BRIGITTE BLAU",

      aboutKicker: "Un poco sobre mi",
      aboutTitle: "Reflexiva, curiosa y obsesiva con los detalles (en el buen sentido).",
      aboutText:
        "Me gusta pensar antes de construir: entender el por qué, la historia y lo que se quiere provocar. Estoy creciendo entre proyectos web reales, experimentos de visión por computadora y diseño.",
      aboutTraits: ["Reflexiva", "Curiosa", "Autodidacta", "Creativa", "Perseverante"],
      aboutEduTitle: "Educacion",
      aboutEducation: [
        {
          when: "2021-2026",
          title: "Ort Argenitna",
          place: "Buenos Aires, Argenitna",
          bullets: ["Escuela Tecnica muy valorada ", "Con especialidad en it"],
        },
        {
          when: "Facultad",
          title:omg "Ing. Informatica",
          place: "ITBA",
          bullets: ["Fecha de inicio (si queres)", "Por que elegiste esa carrera"],
        },
      ],
      aboutCoursesTitle: "Extras y experiencia",
      aboutCoursesText: "Cursos, talleres y aprendizajes fuera de horario.",
      aboutCourses: ["Curso de liderazgo", "Voluntariado", "vida"],
      aboutCta: "Hablemos",
  
      storyTitle1: "Cada imagen guarda",
      storyTitle2: "un secreto brillante",
      storyOutro: "Esto no es solo un carrusel — es una pared de recuerdos, una mirada a lo que brilla detrás de cada instante.",
  
      workTitle: "MIS ÚLTIMOS PROYECTOS",
      workFrom: "desde 2024 hasta hoy",
      visitSite: "Ver sitio ✨",
    fastLine: "Prototipos creados con pasión y velocidad.",
     fastRibbon: "HECHO RÁPIDO",
      filterAll: "Todos",
      filterGithub: "Con GitHub",
      filterLive: "Con demo",
      filterWip: "En progreso",
      immersiveKicker: "Experiencia inmersiva",
      immersiveTitle: "Modo Cosmos Creativo",
      immersiveDescription:
        "Three.js + GSAP construyen un universo vivo que reacciona a tu energía.",
      visionHint: "Activá la visión para que la luz responda a tu movimiento.",
      visionUnavailable: "La visión se activa solo en escritorio.",
      visionDenied: "Permiso denegado. Activá la cámara para el modo visión.",
      visionActive: "Visión activa: el cosmos sigue tu movimiento.",
      visionEnable: "Activar visión",
      visionActiveLabel: "Visión encendida",

      contactPrompt: "Si te pinta, escribime algo lindo.",
      contactButton: "Conectar",
      contactTitle: "Contame tu idea.",
      contactNameLabel: "Nombre",
      contactNamePlaceholder: "Tu nombre",
      contactEmailLabel: "Email",
      contactEmailPlaceholder: "tu@email.com",
      contactMessagePlaceholder: "Escribi un proyecto interesante.",
      contactSend: "Enviar",
      contactHint: "Esto abre tu app de email (sin backend por ahora).",

    projects: [
  {
    title: "Tus Pruebas",
    icon: "📚",
    description: 
      "Mi primer proyecto y el que más cariño me genera. Creé una comunidad real de alumnos que comparten resúmenes, parciales y materiales de estudio de distintas escuelas. Hoy tiene más de 300 visitas diarias, y todo lo aprendí sola: desde React y Supabase hasta desplegarlo online. Es una web viva, hecha por y para estudiantes, que demuestra lo que se puede lograr con iniciativa y constancia.",
    link: "https://tuspruebas.com",
    tech: ["React", "Supabase", "Prisma", "Node"],
    bgColor: "bg-pink-50",
    fast: true,
  },
  {
    title: "Tevila.it",
    icon: "🕍",
    description:
      "Una web de ayuda comunitaria pensada para facilitar el proceso de tevilá de vajilla. Es simple, directa y accesible: podés seguir el paso a paso, contactarte por WhatsApp y encontrar toda la información necesaria. Más allá de lo técnico, me gusta porque ayuda a la comunidad y demuestra que el diseño puede ser funcional, cálido y útil al mismo tiempo.",
    link: "https://tevilait.com",
    tech: ["React", "Supabase", "Tailwind"],
    bgColor: "bg-pink-100",
    fast: true,
  },
  {
    title: "vSLAM-py",
    icon: "🤖",
    description:
      "Un proyecto muy distinto a todo lo que había hecho: me metí en el mundo del SLAM (Simultaneous Localization and Mapping) con Python y C++. Es un pipeline propio para estimar trayectorias, generar mapas y detectar features visuales en tiempo real. Todavía está en desarrollo, pero me apasiona porque combina matemática, visión por computadora y creatividad técnica, y me saca totalmente de la zona de confort de las webs.",
    link: "null",
    github: "https://github.com/brigitteblau/vo-brigitte",
    tech: ["Python", "OpenCV", "NumPy", "g2o", "Pangolin"],
    bgColor: "bg-pink-50",
    fast: true,
  },
  {
    title: "Invitaciones digitales",
    icon: "💍",
    description:
      "Diseño y desarrollo invitaciones interactivas de casamiento personalizadas, con música, cuenta regresiva, confirmación de asistencia y acceso directo a calendarios o mapas. Una de las que más se destacó fue la de Flor & Nico, con un diseño elegante y moderno que refleja perfectamente su estilo. Es un proyecto que mezcla lo emocional con lo técnico, y me encanta ver cómo la gente lo disfruta.",
    link: "https://nos-casamos-six.vercel.app", // tu link real
    tech: ["React", "Tailwind", "ICS", "Figma"],
    bgColor: "bg-pink-100",
    fast: true,
  },
  {
    title: "MixIt.AI",
    icon: "🎧",
    description:
      "Un proyecto personal en el que estoy trabajando actualmente. MixIt.AI mezcla canciones automáticamente usando inteligencia artificial y datos en tiempo real de Spotify. Para hacerlo tuve que aprender sobre APIs de audio, BPM, key detection y procesamiento de señales. Es un desafío técnico enorme, pero me encanta porque combina dos cosas que disfruto mucho: la música y la tecnología.",
    link: "null",
    tech: ["React", "Expo", "Spotify API", "AI", "Tailwind"],
    bgColor: "bg-pink-50",
status: "Proximamente..."
  },
],

    },
  
    en: {
      hey: "Hey",
      about: "About",
      work: "Work",
      story: "Story",
      chat: "Chat",
  
      heroKicker: "creative developer",
      heroKicker2: "student / builder",
      heroSideKicker: "Currently",
      heroSideTitle: "I build things with taste.",
      heroSideText: "I like intentional design, clean code, and projects that actually ship.",

      heroText: "Creative developer. I bring brands and digital experiences to life with style and purpose.",
      heroTitle: "BRIGITTE BLAU",

      aboutKicker: "A bit about me",
      aboutTitle: "Reflective, curious, and (nicely) obsessed with details.",
      aboutText:
        "I like to think before I build: the why, the story, the feeling. I'm growing between real web products, computer vision experiments, and design. (Fill this with your school, university plans, and courses.)",
      aboutTraits: ["Reflective", "Curious", "Self-taught", "Creative", "Persistent"],
      aboutEduTitle: "Education",
      aboutEducation: [
        {
          when: "High school",
          title: "Fill in your school",
          place: "City, Country",
          bullets: ["Something that shaped you", "Track / specialization"],
        },
        {
          when: "University",
          title: "Fill in what you'll study",
          place: "University name",
          bullets: ["Start date (optional)", "Why you chose it"],
        },
      ],
      aboutCoursesTitle: "Extra",
      aboutCoursesText: "Courses, workshops, and the stuff I learn after hours.",
      aboutCourses: ["Fill: course 1", "Fill: course 2", "Fill: course 3"],
      aboutCta: "Let’s talk",

      storyTitle1: "Every picture holds",
      storyTitle2: "a bright secret",
      storyOutro: "This is not just a carousel — it’s a memory wall, a glimpse into what shines behind every moment.",
  
      workTitle: "MY LATEST WORK",
      workFrom: "from 2024 'til today",
      visitSite: "Visit site ✨",
fastLine: "Prototypes built with speed and passion.",
fastRibbon: "BUILT FAST",
      filterAll: "All",
      filterGithub: "With GitHub",
      filterLive: "Live demo",
      filterWip: "In progress",
      immersiveKicker: "Immersive experience",
      immersiveTitle: "Creative Cosmos Mode",
      immersiveDescription:
        "Three.js + GSAP build a living universe that reacts to your energy.",
      visionHint: "Enable vision to let the glow follow your movement.",
      visionUnavailable: "Vision mode is available on desktop only.",
      visionDenied: "Permission denied. Enable the camera to use vision.",
      visionActive: "Vision active: the cosmos follows your motion.",
      visionEnable: "Enable vision",
      visionActiveLabel: "Vision on",

      contactPrompt: "If you feel like it, write me something.",
      contactButton: "Connect",
      contactTitle: "Tell me your idea.",
      contactNameLabel: "Name",
      contactNamePlaceholder: "Your name",
      contactEmailLabel: "Email",
      contactEmailPlaceholder: "you@email.com",
      contactMessagePlaceholder: "Write an interesting project.",
      contactSend: "Send",
      contactHint: "This opens your email app (no backend yet).",

projects: [
  {
    title: "Tus Pruebas",
    icon: "📚",
    description:
      "My very first project — and still my favorite. I built a real community of students sharing notes, tests, and study materials from different schools. It now gets over 300 daily visits. I learned everything by myself: React, Supabase, deployment, and design. It’s a living website made by and for students — proof of what passion and perseverance can build.",
    link: "https://tuspruebas.com",
    tech: ["React", "Supabase", "Prisma", "Node"],
    bgColor: "bg-pink-50",

  },
  {
    title: "Tevila.it",
    icon: "🕍",
    description:
      "A community-oriented site designed to make the tevilá process (kashering dishware) simple and accessible. It guides users step-by-step and connects directly via WhatsApp. Beyond the code, I love it because it genuinely helps people and shows how thoughtful design can also feel warm and meaningful.",
    link: "https://tevilait.com",
    tech: ["React", "Supabase", "Tailwind"],
    bgColor: "bg-pink-100",
 
  },
  {
    title: "vSLAM-py",
    icon: "🤖",
    description:
      "A completely new field for me — my own Visual SLAM pipeline in Python and C++. It tracks camera motion, detects keypoints, and builds maps in real time. Still a work in progress, but I’m loving it because it blends math, computer vision, and creative engineering — far beyond my usual web/app comfort zone.",
    link: "null",
    github: "https://github.com/brigitteblau/vo-brigitte",
    tech: ["Python", "OpenCV", "NumPy", "g2o", "Pangolin"],
    bgColor: "bg-pink-50",
  },
  {
    title: "Digital invitations",
    icon: "💍",
    description:
      "I design and code interactive wedding invitations with music, countdowns, RSVP, and calendar/map integration. One of the most special ones was *Flor & Nico*, with a soft yet elegant look that perfectly matched their vibe. These projects merge design, storytelling, and code — and I love seeing people’s reactions when they open them.",
    link: "https://nos-casamos-six.vercel.app", // your link
    tech: ["React", "Tailwind", "ICS", "Figma"],
    bgColor: "bg-pink-100",
    fast: true,
  },
  {
    title: "MixIt.AI",
    icon: "🎧",
    description:
      "A personal project currently in development: MixIt.AI blends songs automatically using AI and real-time data from Spotify. I had to dive deep into audio APIs, BPM analysis, key detection, and signal processing. It’s a big technical challenge, but I love it — it combines two passions: music and technology.",
    link: "null",
    tech: ["React", "Expo", "Spotify API", "AI", "Tailwind"],
    bgColor: "bg-pink-50",
    status: "coming soon",
  },
],


      
    }
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

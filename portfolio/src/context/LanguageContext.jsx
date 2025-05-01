import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('es');

  const translations = {
    es: {
      hey: "¡Hola!",
      work: "Proyectos",
      story: "Historia",
      chat: "Charlemos",
  
      heroText: "Desarrolladora creativa. Doy vida a marcas y experiencias digitales con estilo y sentido.",
      heroTitle: "BRIGITTE BLAU",
  
      storyTitle1: "Cada imagen guarda",
      storyTitle2: "un secreto brillante",
      storyOutro: "Esto no es solo un carrusel — es una pared de recuerdos, una mirada a lo que brilla detrás de cada instante.",
  
      workTitle: "MIS ÚLTIMOS PROYECTOS",
      workFrom: "desde 2024 hasta hoy",
      visitSite: "Ver sitio ✨",
  
      contactPrompt: "Tocá este ‘botoncito’ para ponernos en contacto =)",
      contactButton: "Conectar",

      projects: [
        {
          title: "Tus Pruebas",
          icon: "📚",
          description:
            "Una plataforma web académica creada para organizar y compartir resúmenes y materiales de examen para estudiantes de más de cinco escuelas secundarias. Comencé este proyecto desde cero, desarrollando inicialmente dos versiones con HTML, CSS y JavaScript. Hoy, está completamente reconstruido con React y utiliza Supabase con Prisma para la gestión de datos. El sitio recibe más de 300 visitas diarias y ha fomentado una comunidad estudiantil colaborativa donde los usuarios envían activamente nuevos resúmenes y archivos de examen cada mes. Diseñé la interfaz de usuario e implementé todas las funcionalidades yo mismo, con un fuerte enfoque en la usabilidad y el rendimiento. TusPruebas.com continúa creciendo, ayudando a cientos de estudiantes a aprender y estudiar de forma más eficiente. Diseñé la interfaz de usuario e implementé todas las funcionalidades yo mismo, con un enfoque especial en la usabilidad y el rendimiento. TusPruebas.com sigue creciendo, ayudando a cientos de estudiantes a aprender y estudiar de forma más eficiente. ",
          link: "https://tuspruebas.com",
          tech: ["React", "Supabase", "Prisma", "Node"],
          bgColor: "bg-pink-50",
        },
        {
          title: "Tevila It",
          icon: "🕍",
          description:
            "Una plataforma creada para una iniciativa sin fines de lucro que ayuda a las personas a kasherizar sus utensilios de cocina. Diseñé la experiencia de usuario completa y la interfaz con Figma, y ​​luego desarrollé el sitio web con React y Vite. La aplicación guía a los usuarios a través de un formulario sencillo e interactivo y genera mensajes personalizados de WhatsApp para una comunicación fácil y directa con el equipo. Se centra en la accesibilidad, la simplicidad y el apoyo de la comunidad.",
          link: "https://tevilait.com",
          tech: ["React", "Supabase", "Tailwind"],
          bgColor: "bg-pink-100",
        },
      ],
    },
  
    en: {
      hey: "Hey",
      work: "Work",
      story: "Story",
      chat: "Chat",
  
      heroText: "Creative developer. I bring brands and digital experiences to life with style and purpose.",
      heroTitle: "BRIGITTE BLAU",
  
      storyTitle1: "Every picture holds",
      storyTitle2: "a bright secret",
      storyOutro: "This is not just a carousel — it’s a memory wall, a glimpse into what shines behind every moment.",
  
      workTitle: "MY LATEST WORK",
      workFrom: "from 2024 'til today",
      visitSite: "Visit site ✨",
  
      contactPrompt: "Tap this 'tiny' button to highlight your product =)",
      contactButton: "Connect",

      projects: [
        {
          title: "Tus Pruebas",
          icon: "📚",
          description:
            "An academic web platform created to organize and share summaries and test materials for students from over five high schools. I started this project from scratch, initially building two versions using plain HTML, CSS, and JavaScript. Today, it's fully rebuilt with React and uses Supabase with Prisma for data management. The site currently receives over 300 daily visits and has fostered a collaborative student community where users actively submit new summaries and exam files each month. I designed the UI and implemented all functionalities myself, with a strong focus on usability and performance. TusPruebas.com continues to grow, helping hundreds of students learn and study more efficiently.An academic web platform created to organize and share summaries and test materials for students from over five high schools. I started this project from scratch, initially building two versions using plain HTML, CSS, and JavaScript. Today, it's fully rebuilt with React and uses Supabase with Prisma for data management. The site currently receives over 300 daily visits and has fostered a collaborative student community where users actively submit new summaries and exam files each month. I designed the UI and implemented all functionalities myself, with a strong focus on usability and performance. TusPruebas.com continues to grow, helping hundreds of students learn and study more efficiently.",
          link: "https://tuspruebas.com",
          tech: ["React", "Supabase", "Prisma", "Node"],
          bgColor: "bg-pink-50",
        },
        {
          title: "Tevila It",
          icon: "🕍",
          description:
            "A platform created for a non-profit initiative that helps people kasher their kitchenware. I designed the full user experience and interface with Figma, then developed the site using React and Vite. The app guides users through a simple, interactive form and generates personalized WhatsApp messages for easy and direct communication with the team. Focused on accessibility, simplicity, and community support.",
          link: "https://tevilait.com",
          tech: ["React", "Supabase", "Tailwind"],
          bgColor: "bg-pink-100",
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

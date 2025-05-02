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
            "Una web que revolucionó cómo los estudiantes comparten resúmenes y exámenes. Con +300 visitas diarias, es una comunidad viva hecha con React, Supabase y pasión por aprender.",
          link: "https://tuspruebas.com",
          tech: ["React", "Supabase", "Prisma", "Node"],
          bgColor: "bg-pink-50",
        },
        {
          title: "Tevila It",
          icon: "🕍",
          description:
            "Un sitio pensado para ayudar y conectar. Guiás el kasherizado paso a paso y contactás directo por WhatsApp. Accesible, simple y con alma comunitaria.",
          link: "https://tevilait.com",
          tech: ["React", "Supabase", "Tailwind"],
          bgColor: "bg-pink-100",
        },
      ]
      
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
            "A web platform that transformed how students share summaries and exams. With 300+ daily visits, it’s a vibrant community powered by React, Supabase, and a love for learning.",
          link: "https://tuspruebas.com",
          tech: ["React", "Supabase", "Prisma", "Node"],
          bgColor: "bg-pink-50",
        },
        {
          title: "Tevila It",
          icon: "🕍",
          description:
            "A heartfelt project that guides users through kashering step-by-step and connects them via WhatsApp. Simple, accessible, and built around community care.",
          link: "https://tevilait.com",
          tech: ["React", "Supabase", "Tailwind"],
          bgColor: "bg-pink-100",
        },
      ]
      
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

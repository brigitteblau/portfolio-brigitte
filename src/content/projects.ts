/**
 * PROYECTOS (scroll tipo Pinterest) y EXPERIENCIA (la planilla de "¿Y ahora?").
 * Para la foto de un proyecto: poné la imagen en public/fotos/proyectos/
 * con el mismo nombre que el `id` (ej. hunda.jpg). Si no está, aparece un placeholder.
 */
import type { L } from "@/lib/i18n";

export type Project = {
  id: string;
  name: string;
  what: L;
  tags: string[];
  href?: string;
  /** alto relativo de la tarjeta en la grilla (para el efecto masonry) */
  h?: 1 | 2 | 3;
  color: string;
};

export const projects: Project[] = [
  {
    id: "hunda",
    name: "Hunda",
    what: {
      es: "Prótesis caninas impresas en 3D, generadas a medida desde las medidas del perro.",
      en: "3D-printed dog prostheses, generated to fit from the dog's measurements.",
    },
    tags: ["FastAPI", "CadQuery", "Blender"],
    h: 3,
    color: "#FF3D2E",
  },
  {
    id: "dragonfish-tiendanube",
    name: "Dragonfish × Tienda Nube",
    what: {
      es: "Conector a medida que sincroniza el stock del ERP con la tienda online. Reemplazó un módulo pago.",
      en: "Custom connector that syncs ERP stock with the online store. Replaced a paid module.",
    },
    tags: ["Node.js", "TypeScript", "Vercel"],
    h: 2,
    color: "#2B44FF",
  },
  {
    id: "trak",
    name: "Trak",
    what: {
      es: "Analítica de tienda física con visión por computadora: cómo se mueve la gente en el local.",
      en: "In-store analytics with computer vision: how people move around the shop.",
    },
    tags: ["Computer vision", "Python"],
    h: 2,
    color: "#0E4D33",
  },
  {
    id: "mirrow-web",
    name: "Mirrow",
    what: {
      es: "Landing con SEO y el rediseño de la tienda online.",
      en: "SEO landing page and the online store redesign.",
    },
    tags: ["Next.js", "SEO"],
    href: "https://tiendamirrow.com",
    h: 3,
    color: "#0D1124",
  },
  {
    id: "forma",
    name: "FORMA",
    what: {
      es: "Web B2B de uniformes corporativos, con el respaldo de Grupo Mirrow. SEO pensado desde el día uno.",
      en: "B2B site for corporate uniforms, backed by Grupo Mirrow. SEO built in from day one.",
    },
    tags: ["Next.js", "SEO", "B2B"],
    h: 1,
    color: "#D9DBE2",
  },
  {
    id: "mema",
    name: "Mema",
    what: {
      es: "Red de agentes de IA: cada persona tiene un link público y su agente mide compatibilidad.",
      en: "An AI agent network: everyone gets a public link and their agent scores compatibility.",
    },
    tags: ["React", "AI"],
    h: 2,
    color: "#D9DBE2",
  },
  {
    id: "photobooth",
    name: "TIC Experience",
    what: {
      es: "Photobooth interactivo para un evento de ORT, con estética tipo TouchDesigner.",
      en: "Interactive photobooth for an ORT event, TouchDesigner-style.",
    },
    tags: ["React", "Creative tech"],
    h: 1,
    color: "#D4FF3A",
  },
  {
    id: "rega",
    name: "Rega",
    what: {
      es: "App de mindfulness que intercepta las redes y te propone una pausa.",
      en: "A mindfulness app that intercepts social media and offers a pause.",
    },
    tags: ["Supabase", "Prisma", "Mobile"],
    h: 2,
    color: "#9AA0B4",
  },
  {
    id: "hand-tracking",
    name: "Hand tracking",
    what: {
      es: "Partículas y visuales generativos que siguen tus manos.",
      en: "Particles and generative visuals that follow your hands.",
    },
    tags: ["MediaPipe", "Generative art"],
    h: 3,
    color: "#5B6178",
  },
  {
    id: "fitform",
    name: "FitForm",
    what: {
      es: "Férulas de muñeca paramétricas desde un formulario web.",
      en: "Parametric wrist splints from a web form.",
    },
    tags: ["CadQuery"],
    h: 1,
    color: "#FF3D2E",
  },
  {
    id: "cupertino",
    name: "Cupertino Store",
    what: {
      es: "Estrategia y landing para un negocio de importación de iPhones.",
      en: "Strategy and landing page for an iPhone import business.",
    },
    tags: ["Next.js", "Radix"],
    h: 2,
    color: "#2B44FF",
  },
  {
    id: "vulkan",
    name: "Vulkán",
    what: {
      es: "Una marca de volcanes de chocolate. Idea en el horno.",
      en: "A chocolate lava cake brand. Still in the oven.",
    },
    tags: ["Branding"],
    h: 1,
    color: "#0D1124",
  },
  {
    id: "mas",
    name: "✎ y más",
    what: { es: "✎ Agregá los que falten en src/content/projects.ts", en: "✎ Add the missing ones in src/content/projects.ts" },
    tags: [],
    h: 1,
    color: "#D4FF3A",
  },
];

/** La planilla de experiencia. El último renglón es el presente. ✎ completá. */
export type Experience = { what: L; where: string; role: L; kept: L; href?: string };

export const experience: Experience[] = [
  {
    what: { es: "✎ Primera web", en: "✎ First website" },
    where: "tispruebas.com",
    role: { es: "todo", en: "everything" },
    kept: { es: "✎ que podía hacerlo", en: "✎ that I could do it" },
  },
  {
    what: { es: "Hunda / BBM", en: "Hunda / BBM" },
    where: "ORT Argentina",
    role: { es: "backend y generación 3D", en: "backend & 3D generation" },
    kept: { es: "✎ trabajar en equipo", en: "✎ teamwork" },
  },
  {
    what: { es: "Proyectos para clientes", en: "Client projects" },
    where: "freelance",
    role: { es: "desarrolladora backend", en: "backend developer" },
    kept: { es: "✎ escuchar antes de programar", en: "✎ listen before coding" },
  },
  {
    what: { es: "Grupo Mirrow", en: "Grupo Mirrow" },
    where: "grupomirrow.com",
    role: { es: "partner y directora", en: "partner & director" },
    kept: { es: "✎ (en eso estoy)", en: "✎ (working on it)" },
    href: "https://grupomirrow.com",
  },
];

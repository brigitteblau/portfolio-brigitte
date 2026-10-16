/**
 * PROYECTOS y EXPERIENCIA.
 *
 * - `featured`: los 3 proyectos que se cuentan como mini caso (una diapositiva cada uno).
 * - `projects`: el resto, en el muro compacto.
 * - Todo texto que empiece con "✎" es un pendiente y NO se publica.
 * - Foto de un proyecto: public/fotos/proyectos/<id>.webp (o .jpg/.png). Si no está, va el color.
 *
 * Regla: nada inventado. Si no sabés un dato, dejalo con ✎ y anotalo en CONTENT_TODO.md.
 */
import type { L } from "@/lib/i18n";

export type Status = "dev" | "mvp" | "prototype" | "idea" | "proposal" | "exploring";

export const statusLabel: Record<Status, L> = {
  dev: { es: "en desarrollo", en: "in progress" },
  mvp: { es: "MVP", en: "MVP" },
  prototype: { es: "prototipo", en: "prototype" },
  idea: { es: "idea", en: "idea" },
  proposal: { es: "propuesta", en: "proposal" },
  exploring: { es: "exploración", en: "exploration" },
};

export type Featured = {
  id: string;
  name: string;
  status?: Status;
  /** Qué es, en una oración. */
  what: L;
  /** Qué hice yo, concretamente. */
  did: L;
  /** El problema técnico más interesante y cómo lo resolví (o cómo lo estoy resolviendo). */
  challenge: L;
  /** En qué estado está, con hechos. */
  now: L;
  stack: string[];
  /** Contexto: equipo, cliente, escuela. */
  context?: L;
  repo?: string;
  href?: string;
  color: string;
};

export const featured: Featured[] = [
  {
    id: "hunda",
    name: "Hunda",
    status: "dev",
    what: {
      es: "Un sistema que recibe las medidas de un perro y de su pata y genera un archivo STL para imprimir una prótesis en 3D.",
      en: "A system that takes a dog's measurements and generates an STL file to 3D-print a prosthesis that fits.",
    },
    did: {
      es: "Lideré el backend y la generación 3D: la API en FastAPI, un generador paramétrico de sockets con CadQuery y el guardado de cada modelo en Supabase.",
      en: "I led the backend and the 3D generation: the FastAPI service, a parametric socket generator in CadQuery, and storing every model in Supabase.",
    },
    challenge: {
      es: "La geometría se intenta generar con Blender (Geometry Nodes) y, si falla, hay un plan B con trimesh que escala modelos base. Cada modelo guarda qué algoritmo lo generó y por qué, para poder rastrearlo.",
      en: "Geometry is generated with Blender (Geometry Nodes) first; if that fails, a trimesh fallback scales base models. Every model records which algorithm produced it and why, so it's traceable.",
    },
    now: {
      es: "El flujo completo ya funciona de punta a punta con el plan B. Falta terminar la versión con Blender.",
      en: "The full pipeline works end to end with the fallback. The Blender version is still in progress.",
    },
    stack: ["FastAPI", "Python", "CadQuery", "Blender", "trimesh", "Supabase"],
    context: { es: "Proyecto escolar en ORT, en equipo: frontend, UX/UI y yo en backend.", en: "School project at ORT, as a team: frontend, UX/UI, and me on backend." },
    repo: "https://github.com/brigitteblau/hunda",
    color: "#FF3D2E",
  },
  {
    id: "dragonfish-tiendanube",
    name: "Dragonfish × Tienda Nube",
    status: "dev",
    what: {
      es: "Un conector a medida que sincroniza el ERP de una tienda de ropa (Dragonfish) con su tienda online en Tienda Nube.",
      en: "A custom connector that syncs a clothing store's ERP (Dragonfish) with its Tienda Nube online shop.",
    },
    did: {
      es: "Lo construí desde cero para reemplazar un módulo pago: funciones serverless en Node.js y TypeScript en Vercel, una tarea programada en PowerShell en un Amazon WorkSpace y una app de partner de Tienda Nube.",
      en: "I built it from scratch to replace a paid module: Node.js/TypeScript serverless functions on Vercel, a PowerShell scheduled task on an Amazon WorkSpace, and a Tienda Nube partner app.",
    },
    challenge: {
      es: "Los problemas vinieron en cadena: un error 502 en el panel embebido, renovar el token OAuth después de reinstalar la app, los webhooks de privacidad que exige Tienda Nube y el manejo de variables de entorno.",
      en: "Problems came in a chain: a 502 in the embedded panel, refreshing the OAuth token after reinstalling the app, the privacy webhooks Tienda Nube requires, and environment variable management.",
    },
    now: {
      es: "En desarrollo, con la integración armada y ajustando la sincronización de productos.",
      en: "In progress: the integration is in place and I'm tuning the product sync.",
    },
    stack: ["Node.js", "TypeScript", "Vercel", "PowerShell", "OAuth"],
    context: { es: "Para Mirrow, una tienda de ropa en Buenos Aires.", en: "For Mirrow, a clothing store in Buenos Aires." },
    repo: "https://github.com/brigitteblau/dragonfish-vercel",
    color: "#2B44FF",
  },
  {
    id: "trak",
    name: "Trak",
    status: "mvp",
    what: {
      es: "Analítica de una tienda física con visión por computadora: a partir del video de las cámaras, cuánta gente entra, cuánto tiempo se queda y por dónde se mueve.",
      en: "Computer-vision analytics for a physical store: from camera footage, how many people come in, how long they stay, and where they move.",
    },
    did: {
      es: "Armé el MVP: un backend en FastAPI que sigue personas con YOLO y extrae eventos (entrada, salida, cambio de zona), el esquema en Supabase y un dashboard en React con horas pico y tiempo de permanencia.",
      en: "I built the MVP: a FastAPI backend that tracks people with YOLO and extracts events (entry, exit, zone change), the Supabase schema, and a React dashboard with peak hours and dwell time.",
    },
    challenge: {
      es: "Pasar de detectar personas en un video a eventos que sirvan para el negocio: zonas como entrada, vidriera y mostrador, y métricas agregadas por hora.",
      en: "Going from detecting people in a video to events a business can use: zones like entrance, window and counter, and metrics aggregated by hour.",
    },
    now: {
      es: "MVP funcionando. Lo próximo es probarlo con grabaciones reales y ajustar las zonas al plano del local.",
      en: "Working MVP. Next: testing it on real footage and fitting the zones to the actual floor plan.",
    },
    stack: ["Python", "YOLO", "FastAPI", "Supabase", "React"],
    context: { es: "Para Mirrow.", en: "For Mirrow." },
    repo: "https://github.com/brigitteblau/trak",
    color: "#0E4D33",
  },
];

export type Project = {
  id: string;
  name: string;
  status?: Status;
  what: L;
  tags: string[];
  href?: string;
  /** alto relativo de la tarjeta en el muro */
  h?: 1 | 2 | 3;
  color: string;
};

export const projects: Project[] = [
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
      es: "Web B2B de uniformes corporativos para Grupo Mirrow, con SEO pensado desde el principio.",
      en: "B2B site for Grupo Mirrow's corporate uniforms, with SEO built in from the start.",
    },
    tags: ["Next.js", "SEO", "B2B"],
    h: 1,
    color: "#D9DBE2",
  },
  {
    id: "mema",
    name: "Mema",
    status: "prototype",
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
    href: "https://github.com/brigitteblau/photobooth",
    h: 1,
    color: "#D4FF3A",
  },
  {
    id: "rega",
    name: "Rega",
    what: {
      es: "App de mindfulness que intercepta las redes y propone una pausa.",
      en: "A mindfulness app that intercepts social media and offers a pause.",
    },
    tags: ["Supabase", "Prisma", "Mobile"],
    h: 2,
    color: "#9AA0B4",
  },
  {
    id: "hand-tracking",
    name: "Hand tracking",
    status: "exploring",
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
    status: "proposal",
    what: {
      es: "Férulas de muñeca paramétricas a partir de un formulario web.",
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
    status: "idea",
    what: {
      es: "Una marca de volcanes de chocolate.",
      en: "A chocolate lava cake brand.",
    },
    tags: ["Branding"],
    h: 1,
    color: "#0D1124",
  },
];

/** La planilla de experiencia. El último renglón es el presente. */
export type Experience = { what: L; where: string; role: L; did: L; href?: string };

export const experience: Experience[] = [
  {
    what: { es: "Primera web", en: "First website" },
    where: "tispruebas.com",
    role: { es: "todo", en: "everything" },
    did: { es: "✎ qué tenía y con qué la hiciste", en: "✎ what it had and what you built it with" },
  },
  {
    what: { es: "Hunda / BBM", en: "Hunda / BBM" },
    where: "ORT Argentina",
    role: { es: "backend y generación 3D", en: "backend & 3D generation" },
    did: { es: "API en FastAPI y generador de prótesis con CadQuery", en: "FastAPI service and a CadQuery prosthesis generator" },
  },
  {
    what: { es: "Proyectos para clientes", en: "Client projects" },
    where: "freelance",
    role: { es: "desarrolladora backend", en: "backend developer" },
    did: { es: "Integraciones a medida, como Dragonfish × Tienda Nube", en: "Custom integrations, like Dragonfish × Tienda Nube" },
  },
  {
    what: { es: "Grupo Mirrow", en: "Grupo Mirrow" },
    where: "grupomirrow.com",
    role: { es: "partner y directora", en: "partner & director" },
    did: {
      es: "Web y SEO, integración con el ERP, analítica con visión por computadora y prospección B2B de uniformes",
      en: "Web and SEO, ERP integration, computer-vision analytics, and B2B sales for the uniforms line",
    },
    href: "https://grupomirrow.com",
  },
];

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

export type Status = "dev" | "mvp" | "prototype" | "idea" | "proposal" | "exploring" | "dream" | "live";

export const statusLabel: Record<Status, L> = {
  dev: { es: "en desarrollo", en: "in progress" },
  mvp: { es: "MVP", en: "MVP" },
  prototype: { es: "prototipo", en: "prototype" },
  idea: { es: "idea", en: "idea" },
  proposal: { es: "propuesta", en: "proposal" },
  exploring: { es: "exploración", en: "exploration" },
  dream: { es: "mi sueño", en: "my dream" },
  live: { es: "en marcha", en: "running" },
};

/** Una parte de un proyecto grande (lo que hago dentro de Grupo Mirrow). */
export type Part = { name: string; what: L; href?: string; repo?: string; tags?: string[] };

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
  /** mi rol, si es una empresa */
  role?: L;
  /** lo que hago adentro, cuando es algo grande */
  parts?: Part[];
};

export const featured: Featured[] = [
  {
    id: "mirrow",
    name: "Grupo Mirrow",
    status: "live",
    role: { es: "Partner y directora", en: "Partner and director" },
    what: {
      es: "Empresa argentina con 56 años de trayectoria que fabrica indumentaria masculina y uniformes para empresas. Soy partner y directora, y llevo toda la parte digital.",
      en: "An Argentine company with 56 years in the business, making menswear and corporate uniforms. I'm a partner and director, and I run everything digital.",
    },
    did: {
      es: "Las webs, la tienda online, las integraciones con el sistema de gestión, el Instagram y la venta B2B de uniformes.",
      en: "The websites, the online store, the integrations with the management system, the Instagram and B2B uniform sales.",
    },
    challenge: {
      es: "Conectar el ERP Dragonfish con Tienda Nube desde cero para reemplazar un módulo pago: los problemas vinieron en cadena (un 502 en el panel embebido, el token OAuth después de reinstalar, los webhooks de privacidad).",
      en: "Connecting the Dragonfish ERP to Tienda Nube from scratch to replace a paid module: problems came in a chain (a 502 in the embedded panel, the OAuth token after reinstalling, the privacy webhooks).",
    },
    now: { es: "✎ en qué estás ahora en Mirrow", en: "✎ what you're on right now at Mirrow" },
    stack: ["Next.js", "Node.js", "TypeScript", "Tienda Nube", "FastAPI", "YOLO", "SEO"],
    href: "https://grupomirrow.com",
    color: "#0D1124",
    parts: [
      {
        name: "tiendamirrow.com",
        what: { es: "La tienda online: rediseño con look futurista, versión mobile y animaciones 3D, manteniendo el logo.", en: "The online store: a futuristic redesign, mobile version and 3D animations, keeping the logo." },
        href: "https://tiendamirrow.com",
        tags: ["E-commerce", "Diseño"],
      },
      {
        name: "Landing con SEO",
        what: { es: "Landing en Next.js pensada para Google: keywords de cada producto, datos estructurados, sitemap y robots.", en: "A Next.js landing built for Google: product keywords, structured data, sitemap and robots." },
        tags: ["Next.js", "SEO"],
      },
      {
        name: "uniformesmirrow.com",
        what: { es: "La web de uniformes para empresas, y la venta B2B: busco y contacto empresas desde LinkedIn.", en: "The corporate uniforms site, plus B2B sales: I find and reach out to companies on LinkedIn." },
        href: "https://uniformesmirrow.com",
        tags: ["B2B", "Ventas"],
      },
      {
        name: "Dragonfish × Tienda Nube",
        what: { es: "Un conector a medida que sincroniza el stock del ERP con la tienda online.", en: "A custom connector that syncs ERP stock with the online store." },
        repo: "https://github.com/brigitteblau/dragonfish-vercel",
        tags: ["Node.js", "Vercel", "OAuth"],
      },
      {
        name: "Trak",
        what: { es: "Analítica del local con visión por computadora: cuánta gente entra, cuánto se queda y por dónde se mueve (MVP).", en: "In-store analytics with computer vision: how many people come in, how long they stay and where they go (MVP)." },
        repo: "https://github.com/brigitteblau/trak",
        tags: ["YOLO", "FastAPI", "React"],
      },
      {
        name: "Instagram",
        what: { es: "El Instagram de la marca: contenido, fotos de producto y campañas.", en: "The brand's Instagram: content, product photos and campaigns." },
        href: "https://www.instagram.com/mirrow.oficial/",
        tags: ["Contenido"],
      },
    ],
  },
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
    id: "vulkan",
    name: "Vulkán",
    status: "dream",
    what: {
      es: "Una marca de volcanes de chocolate. Todavía no existe: es mi sueño.",
      en: "A chocolate lava cake brand. It doesn't exist yet: it's my dream.",
    },
    tags: ["Branding"],
    h: 1,
    color: "#e5483d",
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

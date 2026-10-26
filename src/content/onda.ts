/**
 * La versión con onda: hoja rayada, letra pixelada, etiquetitas y polaroids.
 * Regla de siempre: nada inventado. Todo sale de lo que contó Brigitte.
 */

type T = { es: string; en: string };

export const nav: { id: string; label: T }[] = [
  { id: "hola", label: { es: "inicio", en: "start" } },
  { id: "nacer", label: { es: "historia", en: "story" } },
  { id: "libros", label: { es: "libros", en: "books" } },
  { id: "proyectos", label: { es: "proyectos", en: "projects" } },
  { id: "dejame", label: { es: "dejame una foto", en: "leave a photo" } },
];

export const hero = {
  hello: { es: "hola, soy", en: "hi, I'm" } as T,
  tags: [
    { t: { es: "golf ⛳", en: "golf ⛳" }, c: "mint" },
    { t: { es: "socia en Mirrow", en: "partner at Mirrow" }, c: "blush" },
    { t: { es: "developer", en: "developer" }, c: "butter" },
    { t: { es: "libros 📚", en: "books 📚" }, c: "sky" },
    { t: { es: "no hago humo", en: "no hype" }, c: "dashed" },
    { t: { es: "workaholic ✶", en: "workaholic ✶" }, c: "rosa" },
  ],
  line: { es: ["Programo, emprendo ", "y no hago humo."], en: ["I code, I build businesses ", "and I don't do hype."] },
  sub: { es: "Socia y directora en Grupo Mirrow · Buenos Aires", en: "Partner and director at Grupo Mirrow · Buenos Aires" } as T,
  ctaWork: { es: "Ver lo que hago ↓", en: "See my work ↓" } as T,
  ctaPhoto: { es: "📸 Dejame una foto", en: "📸 Leave me a photo" } as T,
};

export const fun = {
  kicker: { es: "fuera de la compu", en: "away from the screen" } as T,
  title: "Just for fun",
  photos: [
    { src: "/fotos/carpetas/design/2.webp", note: { es: "lettering 🎨", en: "lettering 🎨" } },
    { src: "/fotos/deportes/1.webp", note: { es: "golf, mi cable a tierra", en: "golf keeps me grounded" } },
    { src: "/fotos/avatar/2.webp", note: { es: "modo laburo", en: "work mode" } },
    { src: "/fotos/carpetas/life/5.webp", note: { es: "café + ideas", en: "coffee + ideas" } },
    { src: "/fotos/ahora/1.webp", note: { es: "Mirrow ♡", en: "Mirrow ♡" } },
    { src: "/fotos/carpetas/random/2.jpg", note: { es: "paisajes", en: "views" } },
    { src: "/fotos/carpetas/life/8.webp", note: { es: "mate ♡", en: "mate ♡" } },
  ],
  tags: [
    { t: { es: "BeReal fan 📸", en: "BeReal fan 📸" }, c: "butter" },
    { t: { es: "siempre con una idea nueva", en: "always chasing a new idea" }, c: "sky" },
  ],
};

export const about = {
  kicker: { es: "quién soy", en: "who I am" } as T,
  title: { es: "Sobre mí", en: "About" } as T,
  hand: {
    es: "Soy emprendedora y siempre ando buscando ideas nuevas. Empecé a programar porque quería que una página existiera: tenía guardadas todas mis pruebas de la secundaria y quise compartirlas. Probé con Canva, no funcionó, y fui al piso de tecnología del colegio a que me explicaran. Dos meses después estaba online.",
    en: "I'm an entrepreneur, always looking for new ideas. I started coding because I wanted a website to exist: I'd kept every exam from high school and wanted to share them. I tried Canva, it didn't work, so I went to my school's tech floor and asked them to teach me. Two months later it was live.",
  } as T,
  body: {
    es: "Hoy soy socia y directora en Grupo Mirrow: me ocupo de todo lo digital y del día a día del negocio. Me gusta que las cosas sean útiles y funcionen de verdad.",
    en: "Today I'm a partner and director at Grupo Mirrow: I run everything digital and the day-to-day of the business. I like things to be useful and to actually work.",
  } as T,
  skills: [
    { t: "TypeScript · React · Next.js", c: "blush" },
    { t: "Node.js · FastAPI", c: "butter" },
    { t: "Supabase · Vercel", c: "sky" },
    { t: "3D paramétrico", c: "mint" },
    { t: "SEO", c: "rosa" },
  ],
  photo: "/fotos/portada.webp",
};

export type Project = {
  id: string;
  name: string;
  kicker: T;
  short: T;
  year?: string;
  role: T;
  team?: T;
  status?: T;
  stat?: { n: string; label: T };
  body: T[];
  links?: { label: string; href: string }[];
  stack?: string[];
  photo?: string;
  color: "ink" | "butter" | "sky" | "blush";
};

export const projectsCopy = {
  kicker: { es: "lo que hice y lo que hago", en: "what I've built and what I'm building" } as T,
  title: { es: "Proyectos", en: "Projects" } as T,
  see: { es: "Ver proyecto →", en: "See project →" } as T,
  back: { es: "← Todos los proyectos", en: "← All projects" } as T,
  role: { es: "Mi rol", en: "My role" } as T,
  team: { es: "Equipo", en: "Team" } as T,
  status: { es: "Estado", en: "Status" } as T,
  stack: { es: "Con qué", en: "Built with" } as T,
  links: { es: "Links", en: "Links" } as T,
};

export const projects: Project[] = [
  {
    id: "mirrow",
    name: "Grupo Mirrow",
    kicker: { es: "Hoy · socia y directora", en: "Today · partner and director" },
    short: {
      es: "Marca argentina de ropa y uniformes para empresas. Hago las tres páginas, el SEO y lidero el Instagram.",
      en: "Argentine clothing and corporate uniform brand. I build the three sites, run SEO and lead the Instagram.",
    },
    role: { es: "Socia y directora · todo lo digital", en: "Partner and director · everything digital" },
    status: { es: "En marcha", en: "Ongoing" },
    body: [
      {
        es: "Soy socia de Grupo Mirrow y me ocupo de todo lo digital: las tres páginas (uniformes para empresas, venta mayorista y venta minorista), el SEO y el Instagram de la marca.",
        en: "I'm a partner at Grupo Mirrow and I run everything digital: our three sites (corporate uniforms, wholesale and retail), SEO and the brand's Instagram.",
      },
      {
        es: "El resto del día estoy en el negocio: stock, qué se puede mejorar, qué se puede hacer. Me obsesiona y lo disfruto.",
        en: "The rest of the day I'm in the business: stock, what to improve, what to do next. I'm obsessed with it and I love it.",
      },
    ],
    links: [
      { label: "uniformesmirrow.com", href: "https://uniformesmirrow.com" },
      { label: "grupomirrow.com.ar", href: "https://www.grupomirrow.com.ar" },
      { label: "tiendamirrow.com", href: "https://tiendamirrow.com" },
      { label: "@mirrow.oficial", href: "https://www.instagram.com/mirrow.oficial/" },
    ],
    stack: ["Next.js", "Tienda Nube", "SEO"],
    photo: "/fotos/proyectos/mirrow.webp",
    color: "ink",
  },
  {
    id: "tuspruebas",
    name: "tuspruebas.com",
    kicker: { es: "Mi primer proyecto", en: "My first project" },
    short: {
      es: "Aprendí a programar para hacerla: mis pruebas de toda la secundaria, para que otros estudien.",
      en: "I learned to code to build it: all my high school exams, so others could study.",
    },
    role: { es: "Todo: idea, diseño y código", en: "Everything: idea, design and code" },
    status: { es: "Ya no está online", en: "No longer online" },
    stat: { n: "200", label: { es: "usuarios", en: "users" } },
    body: [
      {
        es: "Tenía guardadas todas las pruebas de mi secundaria y no tenía hermanos más chicos a quién dárselas. Quise hacer una página para compartirlas.",
        en: "I'd kept every exam from high school and had no younger siblings to pass them on to. I wanted to build a site to share them.",
      },
      {
        es: "Probé con Canva y no funcionó. Me dijeron que tenía que programar, así que fui al piso de tecnología del colegio a que me explicaran. Dos meses después la página estaba online y llegó a 200 usuarios.",
        en: "I tried Canva and it didn't work. People told me I had to code, so I went to my school's tech floor to learn. Two months later the site was live, and it reached 200 users.",
      },
      {
        es: "Ya no está online, pero es el proyecto al que más cariño le tengo: ahí empezó todo.",
        en: "It's no longer online, but it's the project I love most: it's where everything started.",
      },
    ],
    color: "butter",
  },
  {
    id: "hunda",
    name: "Hunda",
    kicker: { es: "En equipo", en: "Team project" },
    short: {
      es: "Prótesis caninas a medida. Hice el backend y la generación de los modelos 3D.",
      en: "Custom-fit dog prostheses. I built the backend and the 3D model generation.",
    },
    role: { es: "Backend y generación 3D", en: "Backend and 3D generation" },
    team: { es: "3 personas", en: "3 people" },
    body: [
      {
        es: "Un proyecto en equipo con dos compañeros para generar prótesis caninas a medida, a partir de las medidas de cada perro.",
        en: "A team project with two classmates to generate custom-fit dog prostheses from each dog's measurements.",
      },
      {
        es: "Yo me ocupé del backend y de la generación de las prótesis: modelos 3D paramétricos que se arman solos con las medidas.",
        en: "I handled the backend and the prosthesis generation: parametric 3D models built automatically from the measurements.",
      },
    ],
    stack: ["Python", "FastAPI", "CadQuery", "3D paramétrico"],
    color: "sky",
  },
  {
    id: "tevila-it",
    name: "Tevila It",
    kicker: { es: "Comunidad", en: "Community" },
    short: {
      es: "Organizaba la tevilat kelim para quienes no la hacían.",
      en: "Took care of tevilat kelim for people who didn't do it themselves.",
    },
    role: { es: "Idea y desarrollo", en: "Idea and development" },
    status: { es: "Ya no está online", en: "No longer online" },
    body: [
      {
        es: "La tevilat kelim es la inmersión de los utensilios de cocina para que sean kasher. Tevila It se encargaba de hacerla para la gente que no la hacía.",
        en: "Tevilat kelim is the immersion of kitchen utensils so they're kosher. Tevila It took care of it for people who didn't do it themselves.",
      },
      {
        es: "El judaísmo es una parte grande de mi vida, y este proyecto juntaba eso con lo que sé hacer.",
        en: "Judaism is a big part of my life, and this project brought that together with what I know how to do.",
      },
    ],
    color: "blush",
  },
];

export const story = {
  kicker: { es: "de dónde vengo", en: "where I come from" } as T,
  title: { es: "Mi historia", en: "My story" } as T,
  baby: { es: "Así empezó todo ♡", en: "How it all started ♡" } as T,
  playWithSound: { es: "Tocá play · con sonido 🔊", en: "Tap play · sound on 🔊" } as T,
  golfTitle: { es: "Golf", en: "Golf" } as T,
  golfNote: { es: "mi cable a tierra", en: "keeps me grounded" } as T,
  booksTitle: { es: "Libros que me marcaron", en: "Books that shaped me" } as T,
  books: [
    { title: "Living Inspired", author: "Akiva Tatz" },
    { title: "El hombre en busca de sentido", author: "Viktor Frankl" },
    { title: "Demian", author: "Hermann Hesse" },
    { title: "Fragmentos sagrados", author: "Neil Gillman" },
  ],
  booksSoon: { es: "pronto: mis 10 lecturas obligatorias en el journal", en: "soon: my 10 must-reads on the journal" } as T,
  journal: { es: "Leer mi journal →", en: "Read my journal →" } as T,
};

export const dejame = {
  kicker: { es: "lo más lindo del portfolio", en: "the best part of this site" } as T,
  title: { es: "Dejame una foto", en: "Leave me a photo" } as T,
  sub: {
    es: "Sacate una foto y dejámela. Quiero ver quién pasó por acá.",
    en: "Snap a photo and leave it for me. I want to see who stopped by.",
  } as T,
  you: { es: "¡vos! ♡", en: "you! ♡" } as T,
  wall: [
    { src: "/fotos/portada.webp", note: { es: "yo, en el frío", en: "me, in the cold" } },
    { src: "/fotos/avatar/3.webp", note: { es: "hola!!", en: "hi!!" } },
    { src: "/fotos/deportes/3.webp", note: { es: "swing", en: "swing" } },
    { src: "/fotos/carpetas/life/6.webp", note: { es: "♡", en: "♡" } },
  ],
};

export const talk = {
  question: { es: "¿Querés conocerme?", en: "Want to meet me?" } as T,
  yes: { es: "Sí", en: "Yes" } as T,
  no: { es: "No", en: "No" } as T,
  taunts: [
    { es: "no.", en: "no." },
    { es: "intentá de nuevo.", en: "try again." },
    { es: "esa opción no existe.", en: "that's not an option." },
    { es: "el otro botón.", en: "the other button." },
  ] as T[],
  title: { es: "Charlemos", en: "Let's talk" } as T,
  sub: {
    es: "Un proyecto, una idea o una charla. Elegí un día y te escribo.",
    en: "A project, an idea or just a chat. Pick a day and I'll write to you.",
  } as T,
};

export const contact = {
  kicker: { es: "¿seguimos?", en: "shall we?" } as T,
  title: { es: "Contacto", en: "Contact" } as T,
  body: {
    es: "Escribime por lo que sea: un proyecto, una idea o una charla. Respondo todo.",
    en: "Write to me about anything: a project, an idea or a chat. I answer everything.",
  } as T,
  email: "brigitteyaelblau@gmail.com",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/brigitte-blau-17567835b/" },
    { label: "GitHub", href: "https://github.com/brigitteblau" },
    { label: "Journal", href: "/journal" },
  ],
  sober: { es: "Ver la versión sobria", en: "See the simple version" } as T,
  photos: ["/fotos/contacto/1.webp", "/fotos/deportes/2.webp"],
};

/* ───────────── La presentación (versión con onda) ───────────── */

export const NAME = "Brigitte";

export const deck = {
  hint: { es: "scroll → o flechas", en: "scroll → or arrow keys" } as T,
  hola: {
    hello: { es: "hola, soy", en: "hi, I'm" } as T,
    line: { es: "Te cuento mi historia en diapositivas.", en: "Here's my story, in slides." } as T,
    sub: { es: "Con cada una vas a ir descubriendo mi nombre.", en: "With each one you'll uncover a bit more of my name." } as T,
    tags: [
      { t: { es: "emprendedora", en: "entrepreneur" }, c: "choco" },
      { t: { es: "developer ✿", en: "developer ✿" }, c: "white" },
      { t: { es: "socia en Mirrow", en: "partner at Mirrow" }, c: "latte" },
    ],
  },
  nacer: {
    label: { es: "nacer", en: "day one" } as T,
    title: { es: "Así empezó todo", en: "How it all started" } as T,
    play: { es: "Tocá play · con sonido 🔊", en: "Tap play · sound on 🔊" } as T,
  },
  deportes: {
    label: { es: "deportes", en: "sports" } as T,
    kicker: { es: "mi cable a tierra", en: "what keeps me grounded" } as T,
    title: { es: "Golf", en: "Golf" } as T,
  },
  perfeccion: {
    label: { es: "de la perfección a la pasión", en: "from perfection to passion" } as T,
    before: { es: "a los 13 escribía en mayúsculas:", en: "at 13 I wrote in all caps:" } as T,
    wrong: { es: "QUIERO SER PERFECTA", en: "I WANT TO BE PERFECT" } as T,
    now: { es: "hoy:", en: "today:" } as T,
    right: { es: "quiero dejar algo en el mundo.", en: "I want to leave something in the world." } as T,
    from: { es: "de la perfección", en: "from perfection" } as T,
    to: { es: "a la pasión ♡", en: "to passion ♡" } as T,
  },
  libros: {
    label: { es: "libros", en: "books" } as T,
    kicker: { es: "los que me cambiaron la cabeza", en: "the ones that changed how I think" } as T,
    title: { es: "Libros", en: "Books" } as T,
    soon: { es: "pronto: mis 10 lecturas obligatorias, en el journal", en: "soon: my 10 must-reads, on the journal" } as T,
    /** Tapa real: public/fotos/libros/<id>.webp si existe; si no, la de Open Library (si carga); si no, una dibujada. */
    books: [
      { id: "living-inspired", title: "Living Inspired", author: "Akiva Tatz", bg: "#F2C9D3", fg: "#4A2C2A" },
      { id: "frankl", title: { es: "El hombre en busca de sentido", en: "Man's Search for Meaning" }, author: "Viktor Frankl", bg: "#4A2C2A", fg: "#FBF4EE", isbn: "9788425432026" },
      { id: "demian", title: "Demian", author: "Hermann Hesse", bg: "#E9D6C4", fg: "#4A2C2A", isbn: "9788420674360" },
      { id: "fragmentos", title: { es: "Fragmentos sagrados", en: "Sacred Fragments" }, author: "Neil Gillman", bg: "#A47551", fg: "#FBF4EE" },
    ] as { id: string; title: string | T; author: string; bg: string; fg: string; isbn?: string }[],
  },
  programar: {
    label: { es: "programar", en: "coding" } as T,
    kicker: { es: "cómo empecé", en: "how I started" } as T,
    title: { es: "Quería que una página existiera", en: "I wanted a website to exist" } as T,
    hand: {
      es: "Tenía guardadas todas mis pruebas de la secundaria y no tenía hermanos más chicos a quién dárselas. Probé con Canva, no funcionó. Me dijeron que tenía que programar, así que fui al piso de tecnología del colegio a que me explicaran.",
      en: "I'd kept every exam from high school and had no younger siblings to pass them on to. I tried Canva, it didn't work. People told me I had to code, so I went to my school's tech floor to learn.",
    } as T,
    result: { es: "Dos meses después, tuspruebas.com estaba online.", en: "Two months later, tuspruebas.com was live." } as T,
  },
  proyectos: {
    label: { es: "proyectos", en: "projects" } as T,
    kicker: { es: "lo que hice y lo que hago", en: "what I've built and what I'm building" } as T,
  },
  hoy: {
    label: { es: "hoy", en: "today" } as T,
    title: { es: "Hoy", en: "Today" } as T,
    body: {
      es: "Soy socia y directora en Grupo Mirrow, una marca argentina de ropa y uniformes para empresas. Hago nuestras tres páginas, el SEO y lidero el Instagram. El resto del día estoy en el negocio: stock, qué mejorar, qué sigue.",
      en: "I'm a partner and director at Grupo Mirrow, an Argentine clothing and corporate uniform brand. I build our three sites, run SEO and lead the Instagram. The rest of the day I'm in the business: stock, what to improve, what's next.",
    } as T,
    workaholic: { es: "workaholic, lo admito", en: "workaholic, I admit it" } as T,
  },
  dejame: {
    label: { es: "dejame una foto", en: "leave a photo" } as T,
    title: { es: "Dejame una foto", en: "Leave me a photo" } as T,
  },
  fin: {
    label: { es: "¿y?", en: "so?" } as T,
    end: { es: "ahora sí, mi nombre completo:", en: "now, my full name:" } as T,
  },
};

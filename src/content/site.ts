/**
 * ─────────────────────────────────────────────────────────────
 *  TODO EL TEXTO DEL SITIO VIVE ACÁ (español + inglés)
 *  Buscá "✎" para encontrar lo que todavía tenés que completar.
 * ─────────────────────────────────────────────────────────────
 */
import type { L } from "@/lib/i18n";

export const NAME = "Brigitte";

/** Cuántas letras del nombre se revelan al terminar cada parte. */
export const NAME_STEPS = {
  intro: 0,
  nacer: 2, // B R
  deportes: 4, // I G
  programacion: 6, // I T
  proyectos: 7, // T
  ahora: 8, // E  → nombre completo
} as const;

export const ui = {
  menu: {
    home: { es: "Inicio", en: "Home" },
    projects: { es: "Proyectos", en: "Projects" },
    journal: { es: "Journal", en: "Journal" },
    note: { es: "Dejame algo", en: "Leave a note" },
    contact: { es: "Contacto", en: "Contact" },
  },
  fullName: "Brigitte Blau",
  nameTag: { es: "nombre:", en: "name:" },
  photoMissing: { es: "foto acá", en: "photo here" },
  skip: { es: "Saltar al contenido", en: "Skip to content" },
} satisfies Record<string, unknown>;

export const intro = {
  hello: { es: "Holaaa", en: "Hiii" },
  nameLine: {
    es: "Mi nombre lo vas a ir conociendo de a poco. Es parte de mí, de mi historia y de lo que voy armando con ella.",
    en: "You'll get to know my name little by little. It's part of me, of my story, and of what I'm building with it.",
  },
  notFirst: {
    es: "No creo que lo primero que tenga que decirte es que soy",
    en: "I don't think the first thing I should tell you is that I'm a",
  },
  labels: [
    { es: "golfista", en: "golfer" },
    { es: "programadora", en: "developer" },
    { es: "estudiante", en: "student" },
    { es: "y que pienso mucho", en: "and that I overthink" },
  ] as L[],
  withTime: {
    es: "Eso lo podés ir conociendo con el tiempo.",
    en: "You can find that out over time.",
  },
  /** La pista profesional del inicio: qué hago, sin título corporativo. */
  does: {
    es: "Construyo proyectos de tecnología —backend, 3D, visión por computadora— y escribo lo que voy pensando.",
    en: "I build tech projects —backend, 3D, computer vision— and write about what I'm thinking.",
  },
  shortcuts: {
    projects: { es: "Ver proyectos", en: "See projects" },
    journal: { es: "Leer el journal", en: "Read the journal" },
    note: { es: "Dejame algo", en: "Leave me a note" },
  },
};

/** Canción o reflexión que acompaña cada era. ✎ cambialas por las tuyas. */
export type Soundtrack = { kind: "song" | "thought"; title: L; by?: string };

export const nacer = {
  era: { es: "Nacer", en: "Day one" },
  soundtrack: {
    kind: "song",
    title: { es: "✎ canción de esta era", en: "✎ song for this era" },
    by: "✎ artista",
  } as Soundtrack,
  /** Transcript del video. `at` = segundo del video en que aparece la frase. ✎ */
  transcript: [
    { at: 0, text: { es: "Hoy es mi cumpleaños", en: "Today is my birthday" } },
    { at: 2, text: { es: "✎ (lo que digo después en el video)", en: "✎ (what I say next in the video)" } },
    { at: 4, text: { es: "✎ (y después)", en: "✎ (and then)" } },
  ],
  margin: [
    { es: "así nací,", en: "this is how I arrived," },
    { es: "con esta alegría", en: "with this joy" },
    { es: "crecí", en: "I grew up" },
    { es: "y con la creatividad que siempre tuve", en: "with the creativity I always had" },
  ] as L[],
  videoHint: {
    es: "✎ dejá el video en public/video/cumple.mp4",
    en: "✎ drop the video at public/video/cumple.mp4",
  },
};

export const deportes = {
  era: { es: "Deportes", en: "Sports" },
  soundtrack: {
    kind: "song",
    title: { es: "✎ canción de esta era", en: "✎ song for this era" },
    by: "✎ artista",
  } as Soundtrack,
  sports: [
    { name: { es: "Golf", en: "Golf" }, note: { es: "✎ desde cuándo / un logro", en: "✎ since when / a highlight" } },
    { name: { es: "Patín", en: "Skating" }, note: { es: "✎ algo que te acuerdes", en: "✎ something you remember" } },
    { name: { es: "✎ otro", en: "✎ another" }, note: { es: "bla bla", en: "blah blah" } },
  ],
  /** La segunda diapositiva de deportes: el golf, en grande. */
  golf: {
    title: { es: "Golf", en: "Golf" },
    line: {
      es: "✎ Lo que me enseñó: paciencia, precisión y volver a intentar.",
      en: "✎ What it taught me: patience, precision, and trying again.",
    },
  },
};

export const programacion = {
  era: { es: "Programación", en: "Programming" },
  soundtrack: {
    kind: "thought",
    title: {
      es: "De querer ser perfecta a querer dejar algo en el mundo.",
      en: "From wanting to be perfect to wanting to leave something in the world.",
    },
  } as Soundtrack,
  from: { es: "de la perfección", en: "from perfection" },
  to: { es: "a la pasión", en: "to passion" },
  typedWrong: { es: "quiero ser perfecta", en: "i want to be perfect" },
  typedRight: { es: "quiero dejar algo en el mundo", en: "i want to leave something in the world" },
  booksTitle: { es: "Libros que me marcaron acá", en: "Books that shaped this part" },
  books: [
    { title: "Living Inspired", author: "Akiva Tatz", color: "#2B44FF" },
    { title: "✎ otro libro", author: "✎ autor", color: "#0D1124" }, // los que empiezan con ✎ no se muestran
  ],
  firstSite: {
    label: { es: "Mi primera página web", en: "My first website" },
    url: "tispruebas.com", // ✎ confirmá cómo se escribe
    caption: {
      es: "De ahí, todo lo demás es historia…",
      en: "The rest is history…",
    },
  },
};

export const proyectos = {
  era: { es: "Proyectos", en: "Projects" },
  title: { es: "(muchos, muchos)", en: "(many, many)" },
  featuredTitle: { es: "Tres, contados de cerca", en: "Three, up close" },
  othersTitle: { es: "Y otros", en: "And others" },
  labels: {
    what: { es: "Qué es", en: "What it is" },
    did: { es: "Qué hice", en: "What I did" },
    challenge: { es: "El desafío", en: "The challenge" },
    now: { es: "Hoy", en: "Today" },
    code: { es: "Ver el código", en: "See the code" },
    visit: { es: "Visitar", en: "Visit" },
  },
  soundtrack: {
    kind: "song",
    title: { es: "✎ canción de esta era", en: "✎ song for this era" },
    by: "✎ artista",
  } as Soundtrack,
};

export const ahora = {
  question: {
    es: "Ya te mostré quién fui. ¿Y ahora qué hago?",
    en: "You've seen who I was. So what am I doing now?",
  },
  sheetName: { es: "experiencia", en: "experience" },
  cols: {
    what: { es: "qué", en: "what" },
    where: { es: "dónde", en: "where" },
    role: { es: "mi rol", en: "my role" },
    did: { es: "qué hice", en: "what I did" },
  },
  soundtrack: {
    kind: "thought",
    title: { es: "✎ una reflexión sobre el presente", en: "✎ a thought about the present" },
  } as Soundtrack,
};

export const conocerme = {
  end: { es: "Hasta acá, la historia.", en: "That's the story so far." },
  question: { es: "¿Querés conocerme?", en: "Want to get to know me?" },
  yes: { es: "Sí", en: "Yes" },
  no: { es: "No", en: "No" },
  noTaunts: [
    { es: "no.", en: "no." },
    { es: "intentá de nuevo.", en: "try again." },
    { es: "esa opción no existe.", en: "that's not an option." },
    { es: "el otro botón.", en: "the other button." },
  ] as L[],
};

export const contacto = {
  title: { es: "Hola de nuevo.", en: "Hi again." },
  body: {
    es: "Escribime por lo que sea: un proyecto, una idea o una charla.",
    en: "Write to me about anything: a project, an idea, or just a chat.",
  },
  email: "brigitteyaelblau@gmail.com",
  /** Solo links reales. ✎ Sumá LinkedIn e Instagram cuando tengas las URLs. */
  links: [{ label: "GitHub", href: "https://github.com/brigitteblau" }],
  copy: { es: "Copiar mail", en: "Copy email" },
  copied: { es: "Mail copiado", en: "Email copied" },
  journalCta: { es: "Leer mi journal", en: "Read my journal" },
};

export const journal = {
  title: { es: "Journal", en: "Journal" },
  intro: {
    es: "Lo que pienso, lo que veo, lo que voy aprendiendo. Fotos, videos y posts.",
    en: "What I think, what I see, what I'm learning. Photos, videos and posts.",
  },
  back: { es: "Volver al journal", en: "Back to the journal" },
  empty: {
    es: "Todavía no hay entradas publicadas. Pronto.",
    en: "No entries published yet. Soon.",
  },
  topics: { es: "Temas", en: "Topics" },
  latest: { es: "Lo último", en: "Latest" },
  next: { es: "Siguiente entrada", en: "Next entry" },
  prev: { es: "Entrada anterior", en: "Previous entry" },
  readTime: { es: "min de lectura", en: "min read" },
  onlyIn: { es: "Esta entrada solo está en español.", en: "This entry is only available in Spanish." },
};

/**
 * "Explicaciones": notitas chiquitas en cada diapositiva, como notas al margen.
 * ✎ cambialas a tu gusto (o dejá el texto vacío "" para ocultarlas).
 */
export const notes = {
  hola: { es: "scroll o flechas del teclado", en: "scroll or use the arrow keys" },
  labels: { es: "etiquetas que no me definen (tanto)", en: "labels that don't define me (that much)" },
  nacer: { es: "un video casero, el original", en: "a home video, the original" },
  nacer2: { es: "notas al margen de un álbum", en: "notes in the margin of an album" },
  deportes: { es: "mi primera cancha fue el club", en: "my first field was the club" },
  golf: { es: "mi swing, sin cortes", en: "my swing, uncut" },
  programacion: { es: "lo que cambió en mí", en: "what changed in me" },
  libros: { es: "los que me acompañaron", en: "the ones that came along" },
  historia: { es: "y entonces…", en: "and then…" },
  proyectos: { es: "pasá el mouse para leer cada uno", en: "hover to read each one" },
  ahora: { es: "mi experiencia, en una planilla. obvio.", en: "my experience, in a spreadsheet. obviously." },
  conocerme: { es: "hay una sola respuesta correcta", en: "there's only one right answer" },
} satisfies Record<string, L>;

export const hud = {
  prev: { es: "Anterior", en: "Previous" },
  next: { es: "Siguiente", en: "Next" },
  eras: {
    hola: { es: "Hola", en: "Hi" },
    nacer: { es: "Nacer", en: "Day one" },
    deportes: { es: "Deportes", en: "Sports" },
    programacion: { es: "Programación", en: "Programming" },
    proyectos: { es: "Proyectos", en: "Projects" },
    ahora: { es: "Ahora", en: "Now" },
    fin: { es: "¿Y?", en: "So?" },
    sigue: { es: "Lo que sigue", en: "What's next" },
  } satisfies Record<string, L>,
};

/** La segunda parte: lo que todavía se está escribiendo. */
export const sigue = {
  title: { es: "Lo que sigue se está escribiendo.", en: "What comes next is still being written." },
  journalLead: { es: "En el journal", en: "In the journal" },
  allEntries: { es: "Todas las entradas", en: "All entries" },
};

/** "Dejame algo": un lugar para que cualquiera me deje una idea, pregunta o mensaje. */
export const dejame = {
  title: { es: "Dejame algo.", en: "Leave me something." },
  body: {
    es: "Una idea, una pregunta, algo que pensaste leyendo esto. No hace falta que pongas tu nombre.",
    en: "An idea, a question, something you thought while reading this. You don't need to leave your name.",
  },
  placeholder: { es: "Escribí acá…", en: "Write here…" },
  placeholderOptional: { es: "Un mensaje (opcional)…", en: "A message (optional)…" },
  name: { es: "Nombre (opcional)", en: "Name (optional)" },
  email: { es: "Mail, si querés que te conteste (opcional)", en: "Email, if you'd like a reply (optional)" },
  send: { es: "Enviar", en: "Send" },
  sending: { es: "Enviando…", en: "Sending…" },
  sent: { es: "Llegó. Gracias por escribir.", en: "Got it. Thanks for writing." },
  another: { es: "Escribir otra cosa", en: "Write something else" },
  errors: {
    short: { es: "Escribí un poco más (mínimo 3 caracteres).", en: "Write a bit more (at least 3 characters)." },
    long: { es: "Es demasiado largo (máximo 2000 caracteres).", en: "That's too long (2000 characters max)." },
    email: { es: "Ese mail no parece válido.", en: "That email doesn't look right." },
    rate: { es: "Mandaste varios seguidos. Probá de nuevo en unos minutos.", en: "You've sent a few in a row. Try again in a few minutes." },
    off: { es: "Este espacio todavía no está activado. Mientras tanto, escribime por mail.", en: "This space isn't switched on yet. In the meantime, email me." },
    generic: { es: "No se pudo enviar. Probá de nuevo en un rato.", en: "It didn't go through. Try again in a bit." },
    big: { es: "La foto es muy pesada (máximo 5 MB).", en: "That photo is too big (5 MB max)." },
    photo: { es: "Esa foto no se pudo leer. Probá con otra (JPG, PNG o WebP).", en: "Couldn't read that photo. Try another one (JPG, PNG or WebP)." },
    empty: { es: "Sacate una foto o escribí algo (mínimo 3 caracteres).", en: "Snap a photo or write something (at least 3 characters)." },
  },
  privacy: {
    es: "Lo leo solo yo. No se publica nada.",
    en: "Only I read it. Nothing gets published.",
  },
};

/** La portada */
export const hero = {
  hello: { es: "Holaaa!", en: "Hiii!" },
  screenTitle: "brigitte.exe",
  funFact: { es: "Dato", en: "Fun fact" },
  funFactText: { es: "mi nombre lo vas a ir descubriendo", en: "you'll find out my name as you go" },
  stickies: {
    projects: { es: "mis proyectos", en: "my projects" },
    journal: { es: "mi journal", en: "my journal" },
    note: { es: "dejame algo!", en: "leave me a note!" },
  },
  scroll: { es: "bajá", en: "scroll" },
};

/** La ficha tipo "hello!" con datos */
export const perfil = {
  title: { es: "hola!", en: "hello!" },
  fields: {
    name: { es: "Nombre", en: "Name" },
    notOnly: { es: "No solo soy", en: "Not just a" },
    now: { es: "Ahora", en: "Now" },
    goal: { es: "Meta", en: "Goal" },
  },
  nowValue: { es: "estudiante en ORT y partner en Grupo Mirrow", en: "student at ORT and partner at Grupo Mirrow" },
  goalValue: { es: "dejar algo en el mundo", en: "leave something in the world" },
};

/** La frase grande con palabras de colores (es tuya, del cuaderno) */
export const statement = {
  tag: { es: "lo que cambió", en: "what changed" },
  parts: {
    es: [["De querer ser ", ""], ["perfecta", "blue"], [" a querer ", ""], ["dejar algo", "pink"], [" en el mundo ", ""], [":)", "yellow"]],
    en: [["From wanting to be ", ""], ["perfect", "blue"], [" to wanting to ", ""], ["leave something", "pink"], [" in the world ", ""], [":)", "yellow"]],
  } as Record<"es" | "en", [string, "" | "blue" | "pink" | "yellow"][]>,
};

/** El escritorio con carpetas */
export const carpetas = {
  title: { es: "Yep!", en: "Yep!" },
  sub: { es: "Esta soy yo.", en: "That's me." },
  hint: { es: "abrí una carpeta", en: "open a folder" },
  close: { es: "Cerrar", en: "Close" },
  items: { es: "elementos", en: "items" },
};

/** "Dejame algo" estilo BeReal */
export const bereal = {
  title: { es: "Tu BeReal para mí", en: "Your BeReal for me" },
  intro: {
    es: "Sacate una foto (las dos cámaras, como BeReal) y dejame un mensaje. O solo el mensaje, también vale.",
    en: "Snap a photo (both cameras, BeReal-style) and leave me a message. Or just the message, that works too.",
  },
  open: { es: "Sacate una foto", en: "Take a photo" },
  shoot: { es: "Sacar", en: "Snap" },
  retake: { es: "Otra vez", en: "Retake" },
  remove: { es: "Sin foto", en: "No photo" },
  upload: { es: "o subí una", en: "or upload one" },
  waiting: { es: "abriendo cámara…", en: "opening camera…" },
  second: { es: "ahora la otra cámara…", en: "now the other camera…" },
  noCamera: {
    es: "No pude abrir la cámara. Podés subir una foto o mandar solo el mensaje.",
    en: "I couldn't open the camera. You can upload a photo or just send the message.",
  },
  tooBig: { es: "La foto es muy pesada (máximo 5 MB).", en: "That photo is too big (5 MB max)." },
  sentWithPhoto: { es: "Llegó tu BeReal. Gracias!", en: "Your BeReal arrived. Thanks!" },
  privacy: { es: "La foto y el mensaje los veo solo yo. No se publica nada.", en: "Only I see the photo and the message. Nothing gets published." },
};

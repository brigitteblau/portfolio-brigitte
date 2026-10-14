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
    journal: { es: "Journal", en: "Journal" },
    contact: { es: "Contacto", en: "Contact" },
  },
  nameTag: { es: "me llamo", en: "my name is" },
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
  scroll: { es: "bajá despacito", en: "scroll slowly" },
};

/** Canción o reflexión que acompaña cada era. ✎ cambialas por las tuyas. */
export type Soundtrack = { kind: "song" | "thought"; title: L; by?: string };

export const nacer = {
  era: { es: "Nacer", en: "Being born" },
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
    { es: "así nací,", en: "this is how I was born," },
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
  booksTitle: { es: "Libros que me marcaron acá", en: "Books that shaped me here" },
  books: [
    { title: "Living Inspired", author: "Akiva Tatz", color: "#2B44FF" },
    { title: "✎ otro libro", author: "✎ autor", color: "#0D1124" },
  ],
  firstSite: {
    label: { es: "Mi primera página web", en: "My first website" },
    url: "tispruebas.com", // ✎ confirmá cómo se escribe
    caption: {
      es: "De ahí, todo lo demás es historia…",
      en: "From there, everything else is history…",
    },
  },
};

export const proyectos = {
  era: { es: "Proyectos", en: "Projects" },
  title: { es: "(muchos, muchos)", en: "(many, many)" },
  soundtrack: {
    kind: "song",
    title: { es: "✎ canción de esta era", en: "✎ song for this era" },
    by: "✎ artista",
  } as Soundtrack,
};

export const ahora = {
  question: {
    es: "Ya te mostré quién fui. ¿Y ahora qué hago?",
    en: "I've shown you who I was. So what do I do now?",
  },
  sheetName: { es: "experiencia", en: "experience" },
  cols: {
    what: { es: "qué", en: "what" },
    where: { es: "dónde", en: "where" },
    role: { es: "mi rol", en: "my role" },
    kept: { es: "lo que me llevé", en: "what I took from it" },
  },
  soundtrack: {
    kind: "thought",
    title: { es: "✎ una reflexión sobre el presente", en: "✎ a thought about the present" },
  } as Soundtrack,
};

export const conocerme = {
  end: { es: "Y ahí termina.", en: "And that's where it ends." },
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
  links: [
    { label: "Instagram", href: "https://instagram.com/" }, // ✎
    { label: "LinkedIn", href: "https://linkedin.com/" }, // ✎
    { label: "GitHub", href: "https://github.com/" }, // ✎
  ],
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
    es: "Todavía no hay entradas. Agregá un archivo en src/content/journal.",
    en: "No entries yet. Add a file to src/content/journal.",
  },
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
    nacer: { es: "Nacer", en: "Being born" },
    deportes: { es: "Deportes", en: "Sports" },
    programacion: { es: "Programación", en: "Programming" },
    proyectos: { es: "Proyectos", en: "Projects" },
    ahora: { es: "Ahora", en: "Now" },
    fin: { es: "¿Y?", en: "So?" },
  } satisfies Record<string, L>,
};

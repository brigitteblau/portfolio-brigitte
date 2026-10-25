/**
 * La portada sobria: todo el texto, en español y en inglés.
 * Regla: nada inventado. Si falta un dato (un link, un año), se deja afuera hasta que Brigitte lo pase.
 */

type T = { es: string; en: string };

export type Item = { name: string; href?: string; desc: T; note?: T };

/** Vista previa de cada link (al pasar el mouse). Imágenes y textos sacados de cada página. */
export const previews: Record<string, { title: string; desc: T; img: string; fit?: "contain" }> = {
  "https://www.grupomirrow.com.ar": {
    title: "Grupo Mirrow",
    desc: { es: "Mayorista de ropa de hombre. 56 años de fábrica propia.", en: "Menswear wholesaler. 56 years with our own factory." },
    img: "https://www.grupomirrow.com.ar/images/fabrica-fachada.jpg",
  },
  "https://uniformesmirrow.com": {
    title: "MIRROW Uniformes",
    desc: { es: "Uniformes para empresas con tu logo, bordado o estampado.", en: "Company uniforms with your logo, embroidered or printed." },
    img: "https://www.uniformesmirrow.com/og-image.png",
  },
  "https://tiendamirrow.com": {
    title: "Tienda Mirrow",
    desc: { es: "La tienda online: remeras, chombas, buzos y jeans.", en: "The online store: tees, polos, sweatshirts and jeans." },
    img: "https://acdn-us.mitiendanube.com/stores/002/745/865/themes/common/logo-7921355818590155275-1790164912-c7c349edaa66959c22f818e591d34a5e1790164913.png?0",
    fit: "contain",
  },
};

export const sobrio = {
  photo: "/fotos/avatar/3.webp",
  name: "Brigitte Blau",
  role: { es: "Emprendedora y developer · Buenos Aires", en: "Entrepreneur and developer · Buenos Aires" } as T,
  onda: { es: "Ver mi versión con onda", en: "See the fun version" } as T,

  todayTitle: { es: "Hoy", en: "Today" } as T,
  /** Cada párrafo es una lista de pedazos: texto suelto o [texto, link]. */
  today: [
    {
      es: [
        "Soy socia y directora de ",
        ["Grupo Mirrow", "https://www.grupomirrow.com.ar"],
        ", una marca argentina de ropa y uniformes para empresas. Programo y mantengo nuestras tres páginas: ",
        ["uniformes", "https://uniformesmirrow.com"],
        ", ",
        ["venta mayorista", "https://www.grupomirrow.com.ar"],
        " y ",
        ["venta minorista", "https://tiendamirrow.com"],
        ". El resto del día estoy en el negocio: stock, qué mejorar, qué sigue.",
      ],
      en: [
        "I'm a partner and director at ",
        ["Grupo Mirrow", "https://www.grupomirrow.com.ar"],
        ", an Argentine clothing and corporate uniform brand. I build and run our three sites: ",
        ["uniforms", "https://uniformesmirrow.com"],
        ", ",
        ["wholesale", "https://www.grupomirrow.com.ar"],
        " and ",
        ["retail", "https://tiendamirrow.com"],
        ". The rest of the day I'm in the business: stock, what to improve, what's next.",
      ],
    },
    {
      es: ["Tengo base técnica y programo web y apps. No me gusta hacer humo: quiero que lo que hago sea útil y funcione."],
      en: ["I have a technical background and build web and mobile apps. I don't like hype: I want what I make to be useful and to actually work."],
    },
  ] as { es: (string | [string, string])[]; en: (string | [string, string])[] }[],

  projectsTitle: { es: "Proyectos", en: "Projects" } as T,
  projects: [
    {
      name: "tuspruebas.com",
      desc: {
        es: "Empecé a programar para hacerla: una página con todas mis pruebas de la secundaria, para que otros pudieran estudiar. En dos meses estaba online y se armó una comunidad alrededor.",
        en: "I learned to code to build it: a site with all my high school exams so others could study. It was live in two months and a community grew around it.",
      },
      note: { es: "Ya no está online.", en: "No longer online." },
    },
    {
      name: "Tevila It",
      desc: {
        es: "Organizaba la tevilat kelim (la inmersión de los utensilios para que sean kasher) para quienes no la hacían.",
        en: "Took care of tevilat kelim (immersing utensils so they're kosher) for people who didn't do it themselves.",
      },
      note: { es: "Ya no está online.", en: "No longer online." },
    },
    {
      name: "Hunda",
      desc: {
        es: "Proyecto en equipo de prótesis caninas a medida. Hice el backend y la generación de los modelos 3D.",
        en: "Team project for custom-fit dog prostheses. I built the backend and the 3D model generation.",
      },
    },
  ] as Item[],

  writingTitle: { es: "Escritos", en: "Writing" } as T,
  writingEmpty: { es: "Pronto.", en: "Soon." } as T,

  studiesTitle: { es: "Estudios", en: "Education" } as T,
  studies: [
    { what: { es: "Ingeniería en Sistemas", en: "Information Systems Engineering" }, where: "UTN", when: "2027 –" },
    { what: { es: "Escuela técnica, especialidad TIC", en: "Technical high school, ICT track" }, where: "ORT Argentina", when: "2021 – 2026" },
  ] as { what: T; where: string; when: string }[],

  moreTitle: { es: "Más", en: "More" } as T,
  /** LinkedIn e Instagram se suman cuando estén los links exactos. */
  links: [
    { label: "Mail", href: "mailto:brigitteyaelblau@gmail.com" },
    { label: "GitHub", href: "https://github.com/brigitteblau" },
  ],
};

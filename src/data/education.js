// Education timeline + extra courses, bilingual.
// Consumed by LanguageContext as t.aboutEducation / t.aboutCourses (per language).

export const education = {
  es: [
    {
      when: "2021-2026",
      title: "ORT Argentina",
      place: "Buenos Aires, Argentina",
      bullets: ["Escuela técnica muy valorada", "Especialidad en IT"],
    },
    {
      when: "Facultad",
      title: "Ing. Informática",
      place: "ITBA",
      bullets: ["Fecha de inicio (si querés)", "Por qué elegiste esa carrera"],
    },
  ],
  en: [
    {
      when: "2021-2026",
      title: "ORT Argentina",
      place: "Buenos Aires, Argentina",
      bullets: ["Well-regarded technical high school", "IT specialization"],
    },
    {
      when: "University",
      title: "Computer Engineering",
      place: "ITBA",
      bullets: ["Start date (optional)", "Why you chose it"],
    },
  ],
};

export const courses = {
  es: ["Curso de liderazgo", "Voluntariado", "Vida"],
  en: ["Leadership course", "Volunteering", "Life"],
};

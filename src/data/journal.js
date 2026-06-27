// Historias del journal (fallback local — funciona SIN Supabase).
// Editá / agregá entradas acá libremente. Cuando conectes Supabase,
// las historias se cargan desde la base de datos y esto deja de usarse.
//
// Campos: slug (único), date (YYYY-MM-DD), title_es/en, summary_es/en,
// body_es/en, cover_url (foto tuya en /public/img), audio_url (opcional),
// tags, transcript (opcional).

export const posts = [
  {
    id: 'local-post-capri',
    kind: 'post',
    slug: 'un-viaje-que-se-quedo',
    date: '2026-06-15',
    title_es: 'Un viaje que se me quedó',
    title_en: 'A trip that stayed with me',
    summary_es:
      'Volví de un viaje pensando distinto sobre dónde quiero poner mi energía este año.',
    summary_en:
      'I came back from a trip thinking differently about where I want to put my energy this year.',
    body_es:
      'Hay viajes que no terminan cuando volvés. Este fue uno de esos. Me llevé la sensación de que aprender no es solo saber cosas: es decidir a dónde va tu atención.\n\nEscribo esto para acordarme.',
    body_en:
      "Some trips don't end when you come back. This was one of those. I left with the feeling that learning isn't only about knowing things — it's about deciding where your attention goes.\n\nI'm writing this to remember.",
    cover_url: '/img/2.jpg',
    audio_url: null,
    tags: ['viaje', 'reflexión'],
  },
  {
    id: 'local-post-branding',
    kind: 'post',
    slug: 'construyendo-mi-marca',
    date: '2026-05-02',
    title_es: 'Construyendo mi marca, despacio',
    title_en: 'Building my brand, slowly',
    summary_es:
      'Empecé a pensar el portfolio no como una vidriera sino como un archivo vivo de lo que voy haciendo.',
    summary_en:
      'I started thinking of the portfolio not as a showcase but as a living archive of what I make.',
    body_es:
      'Quiero que quien entre no vea solo proyectos lindos, sino que me conozca un poco. Por eso este journal. Me comprometo a mantenerlo al día.',
    body_en:
      'I want whoever lands here to not just see nice projects, but to know me a bit. That\'s why this journal. I commit to keeping it updated.',
    cover_url: '/img/9.jpg',
    audio_url: null,
    tags: ['branding', 'proceso'],
  },
  {
    id: 'local-post-skate',
    kind: 'post',
    slug: 'tardes-de-skate',
    date: '2026-04-10',
    title_es: 'Tardes que valen guardar',
    title_en: 'Afternoons worth keeping',
    summary_es: 'Pequeñas pruebas de que estuve prestando atención.',
    summary_en: 'Little proof that I was paying attention.',
    body_es: 'Una tarde cualquiera que igual quiero recordar. A veces eso alcanza.',
    body_en: 'An ordinary afternoon I still want to remember. Sometimes that\'s enough.',
    cover_url: '/img/10.jpg',
    audio_url: null,
    tags: ['vida'],
  },
];

# Lo que falta completar (con información real)

Todo lo que está acá **no se ve en el sitio** hasta que lo completes. En el código, cualquier texto que empiece con `✎` se oculta automáticamente.

## Inicio y eras

- [ ] **Transcript del video del cumple** (`src/content/site.ts` → `nacer.transcript`): ahora solo está "Hoy es mi cumpleaños". Agregá lo que decís después, con el segundo (`at`) en que aparece cada frase.
- [ ] **Canciones o reflexiones de cada era** (`soundtrack` en Nacer, Deportes y Proyectos, y la reflexión de "Ahora"). Si no querés canción en alguna era, dejala con ✎.
- [ ] **Deportes:** una nota real para Golf y para Patín (desde cuándo, un logro, algo que te acuerdes). Si hay un tercer deporte, sumalo.
- [ ] **La frase del golf** (`deportes.golf.line`): está escrita por mí como ejemplo y por eso está oculta. Escribí la tuya.
- [ ] **Fotos de patín** → `public/fotos/deportes/`.
- [ ] **Libros** (ya están los 4: *Living Inspired* de Akiva Tatz, *El hombre en busca de sentido* de Viktor Frankl, *Demian* de Hermann Hesse y *Fragmentos sagrados* de Neil Gillman):
  - Por ahora tienen una tapa dibujada con color. Si querés la tapa real, sacales una foto y dejala en `public/fotos/libros/` con estos nombres: `living-inspired.jpg`, `frankl.jpg`, `demian.jpg` y `fragmentos.jpg`. Aparecen solas.
  - Una línea tuya de por qué te marcó cada uno (`site.ts` → `programacion.books` → `why`).
- [ ] **Primera web:** confirmá cómo se escribe (`tispruebas.com`) y, si podés, dejá un screenshot en `public/fotos/programacion/`.
- [ ] **De la perfección a la pasión:** según la devolución, es el corazón del sitio. Si querés desarrollarlo, escribí con tus palabras:
  - qué te hizo cambiar,
  - qué construiste gracias a ese cambio,
  - qué te seguís preguntando.

  Lo ideal es que sea una entrada del journal enlazada desde esa diapositiva.

## Proyectos (`src/content/projects.ts`)

Los 3 destacados (Hunda, Dragonfish × Tienda Nube y Trak) están escritos **solo con datos que me contaste**. Revisá:

- [ ] Que el estado de cada uno sea el correcto (hoy: Hunda "en desarrollo", Dragonfish "en desarrollo", Trak "MVP").
- [ ] Que los repos enlazados sean los correctos: `github.com/brigitteblau/hunda`, `…/dragonfish-vercel` y `…/trak`. ¿El de Dragonfish es ese?
- [ ] Capturas reales de cada uno → `public/fotos/proyectos/hunda.webp`, `dragonfish-tiendanube.webp` y `trak.webp`.
- [ ] **Por qué decidiste construir cada uno** y **qué aprendiste**. No lo escribí porque no lo sé.
- [ ] Resultados reales, si los hay. Por ejemplo: ¿el conector de Dragonfish ya está en producción en Mirrow?
- [ ] El estado de los demás: Mirrow, FORMA, TIC Experience, Rega y Cupertino no tienen estado. ¿Están terminados o en uso?
- [ ] **FORMA:** ¿la web está publicada (uniformesmirrow.com)? Si es así, sumo el link.
- [ ] **Hand tracking:** ¿es un proyecto con código o una exploración? Hoy dice "exploración".

## Experiencia (la planilla)

- [ ] **Primera web:** qué tenía y con qué la hiciste (columna "qué hice").
- [ ] **Proyectos para clientes:** ¿hay otros clientes además de Mirrow que se puedan nombrar?
- [ ] **Fechas:** si querés, agrego una columna con el año.

## Contacto

- [ ] URL real de tu **LinkedIn** (y de Instagram, si querés que aparezca). Hoy solo está el GitHub, que es lo único que pude verificar.

## Journal

- [ ] **"Momentos, sin orden"** quedó publicada solo con fotos y el video del mar, sin texto. Si querés, sumale una línea tuya.
- [ ] **"Este sitio empezó en un cuaderno"** es una entrada de ejemplo y está como **borrador** (`draft: true`): no se publica. Usala de plantilla o borrala.
- [ ] Primeras entradas reales. Temas que sugirió la devolución: ideas a las 2 AM, cosas que estoy construyendo, preguntas que todavía no respondí, lo que voy aprendiendo, fotos y momentos.

## Carpetas (life / design / random)

- [ ] Revisá que estés cómoda con las fotos que puse en cada carpeta (`public/fotos/carpetas/`), sobre todo las que tienen a otras personas: confirmá que están de acuerdo con aparecer.
- [ ] El video `random/3.mp4` lo giré; fijate que haya quedado derecho.
- [ ] ¿Querés más carpetas? Creá otra subcarpeta (por ejemplo `golf/` o `viajes/`) y aparece sola.

## Inicio

- [ ] El "Dato" de la portada hoy es "mi nombre lo vas a ir descubriendo". Si tenés un fun fact real tuyo, cambialo en `site.ts` → `hero.funFactText`.

## "Dejame una foto"

- [x] Conectado a Supabase y con aviso por mail.
- [ ] Mandá una foto de prueba desde el celu para ver que llegue con la foto adjunta.

## SEO

- [ ] Dar de alta el sitio en Google Search Console y mandar el sitemap (pasame el código de verificación).
- [ ] Poner el link del portfolio en tu LinkedIn, GitHub, Instagram y en grupomirrow.com: los links desde otros sitios son lo que más ayuda a salir arriba en Google.
- [ ] Mirrow: en qué estás ahora (`projects.ts` → mirrow → `now`).

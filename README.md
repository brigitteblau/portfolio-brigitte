# Portfolio de Brigitte

![Moodboard](docs/moodboard.jpg)

Un escritorio celeste con tarjetas, stickers, polaroids y post-its. La mayor parte de la página baja normal; solo la historia (las eras) va de costado. Mi nombre se revela de a una letra.

**Stack:** Next.js 16 (App Router) + TypeScript + Tailwind 4 + GSAP (ScrollTrigger) + Lenis. Es bilingüe: `/es` y `/en`.

## Moodboard

**Idea:** un scrapbook digital. Fondo celeste rayado, tarjetas crema tipo diapositiva, y encima cosas pegadas: polaroids con clip o chinche, post-its, etiquetas de color, brillitos, una compu retro y carpetas de Mac.

| Color | Hex | Dónde se usa |
|---|---|---|
| Celeste | `#C9D5F2` | el fondo, con rayitas blancas finas |
| Crema | `#FBF8EE` | las tarjetas |
| Tinta | `#1F2128` | texto |
| Azul | `#4E75E5` | el degradé de "Holaaa!", acentos |
| Rosa | `#E15CAE` | el sello, "dejar algo", el botón de enviar |
| Amarillo | `#F6C744` | brillitos, post-its |
| Verde | `#3B9A5E` | la etiqueta "Dato", Deportes |
| Rojo | `#E5483D` | chinches y tachaduras |
| Beige | `#E9E0C9` | la compu retro |

**Tipografías:** Inter Tight (títulos pesados en itálica y texto), Caveat (lo escrito a mano), Bodoni Moda (el "Yep!" y frases), VT323 (la cámara del cumple), JetBrains Mono (código).

**Motivos:** el nombre tapado que se destapa, la compu `brigitte.exe`, la ficha "hola!" con campos, las palabras de colores, la planilla que termina en `=AHORA()`, las carpetas life/design/random y el "Dejame algo" tipo BeReal.

## Correrlo

```bash
npm install
npm run dev        # http://localhost:3000  → redirige a /es o /en según el navegador
```

Cada `git push` a `main` se publica solo en Vercel.

Lo que falta completar con información real está en **[CONTENT_TODO.md](CONTENT_TODO.md)**. Cualquier texto que empiece con `✎` no se publica.

## "Dejame una foto" (ya está andando)

La gente se saca una foto con la cámara de rollo (o sube una) y te deja un mensaje. Va todo a tu proyecto **"mi portfolio"** de Supabase:

- **Te llega un mail** a brigitteyaelblau@gmail.com con la foto adjunta, el mensaje y el nombre/mail si lo pusieron (lo manda la Edge Function `notify-note` con Resend).
- Los mensajes quedan en **Table Editor → visitor_notes**. Las fotos, en **Storage → visitor-notes** (privado), una carpeta por mes.

**Cómo está protegido:** el sitio usa la clave pública de Supabase, que en la base solo puede *agregar* un mensaje o *subir* una foto nueva: no puede leer, cambiar ni borrar nada. Además: validación en el servidor, la foto se chequea por sus bytes (JPG/PNG/WebP, máx. 5 MB), campo trampa para bots, tiempo mínimo y límite de envíos por visitante. La clave de Resend está guardada en el Vault de Supabase, no en el código. Todo el SQL está en [`supabase/visitor_notes.sql`](supabase/visitor_notes.sql).

## "Charlemos" (agendar una call)

Un formulario para que cualquiera te pida una call "como una charla con una amiga": elige temas, hasta 3 días (los próximos 14, hora de Buenos Aires) y un horario. Se guarda en Supabase (**Table Editor → call_requests**) y **te llega un mail** con todo; respondés ese mail para confirmar y mandar el link. También está en su propia página: `/es/charlemos`.

## SEO (para que Google y las IAs te encuentren)

- Título, descripción y palabras clave en español e inglés (joven emprendedora, desarrolladora backend/frontend, ORT, Grupo Mirrow, Buenos Aires, portfolio).
- Datos estructurados (JSON-LD): quién sos (`Person`, con Grupo Mirrow y ORT) y cada entrada del journal (`BlogPosting`, con tu nombre como autora).
- Páginas propias e indexables: `/es` y `/en`, `/journal`, **cada entrada del journal**, `/foto` (la cámara tipo BeReal) y `/charlemos`.
- [`/sitemap.xml`](https://brigitteblau.vercel.app/sitemap.xml), [`/robots.txt`](https://brigitteblau.vercel.app/robots.txt) y [`/llms.txt`](https://brigitteblau.vercel.app/llms.txt) (un resumen para ChatGPT, Perplexity, Claude, etc.). Todo se arma solo con el contenido real: cuando sumás una entrada al journal, aparece sola.
- Para ensayos o tesis: en el `.mdx` del journal poné `kind: ensayo`.
- Google Search Console: si Google te da un código de verificación, va en la variable `GOOGLE_SITE_VERIFICATION` (o pasámelo y lo pongo).

**Opcional:** `NEXT_PUBLIC_SITE_URL` (por ejemplo, `https://brigitteblau.vercel.app`) fija la URL del sitemap y de Open Graph.

## Dónde va cada cosa

### Fotos: soltalas en la carpeta y aparecen solas

| Carpeta | Qué va | Cuántas |
|---|---|---|
| `public/fotos/avatar/` | fotos tipo avatar para golfista, programadora, estudiante y "pienso mucho" (en ese orden) | 4 |
| `public/fotos/nacer/` | fotos de chiquita (la 4ª es el fondo si no hay video) | 3–4 |
| `public/fotos/deportes/` | golf, patín… (la 5ª va adentro de la pulsera) | 5 |
| `public/fotos/programacion/` | screenshot de tu primera web | 1 |
| `public/fotos/proyectos/` | una por proyecto, **con el mismo nombre que su `id`**: `hunda.jpg`, `trak.png`… | opcional |
| `public/fotos/ahora/` | una foto tuya de hoy (aparece en la planilla) | 1 |
| `public/fotos/contacto/` | la foto tirando un beso 💋 | 1 |
| `public/video/cumple.mp4` | el video de "hoy es mi cumpleaños" | 1 |

Se ordenan por nombre, así que podés llamarlas `1.jpg`, `2.jpg`, etc.
Si son **.HEIC** (del iPhone), corré `npm run fotos` y se convierten a JPG.

### Textos

- **`src/content/site.ts`** tiene todo el texto en español e inglés, las canciones de cada era, el transcript del video y las notitas de cada diapositiva. Buscá `✎` para ver lo que falta completar.
- **`src/content/projects.ts`** tiene los proyectos (el muro tipo Pinterest) y la planilla de experiencia.
- Para el transcript del video, cada frase tiene un `at` con el segundo del video en que aparece.

### Journal

Cada entrada es un archivo en `src/content/journal/`:

```
mi-entrada.es.mdx   ← obligatorio
mi-entrada.en.mdx   ← opcional (si falta, muestra la versión en español con un aviso)
```

Arriba del archivo:

```yaml
---
title: Título
date: 2026-10-14
kind: post        # post | fotos | video
cover: /fotos/journal/portada.jpg   # opcional
excerpt: Una línea para la lista
---
```

Adentro podés usar `<Nota>…</Nota>` (un post-it), `<Fotos>…</Fotos>` (una grilla de fotos) y `<Video src="/video/x.mp4" />`.

## Cómo funciona (para cuando quieras tocarlo)

- La página (`src/app/[lang]/page.tsx`) va en este orden: Hero → la historia (de costado: el video del cumple a pantalla completa, deportes, programación, libros) → Hoy (con "ver más") → Proyectos (tarjetitas; cada una abre su ficha en un pop-up) → Dejame una foto → Carpetas → Journal → Contacto. Cada parte está en `src/components/sections/`. El botón flotante 📸 (`PhotoFab.tsx`) lleva a la cámara y la prende.
- `src/components/Track.tsx` es el tramo horizontal: fija la pantalla solo mientras estás en las eras y convierte el scroll en movimiento de costado. En celular (y con "reducir movimiento") las tarjetas van una abajo de la otra.
- `src/components/Panel.tsx` es una diapositiva de ese tramo. `hold={1.2}` la deja quieta un rato mientras pasa algo adentro (el tipeo). `usePanel(({ enter, hold, through, exit }) => …)` da el progreso para animar.
- `src/components/Video.tsx`: los videos arrancan solos (sin sonido) cuando aparecen, con play/pausa y botón de sonido.
- **Carpetas:** cada subcarpeta de `public/fotos/carpetas/` es una carpeta del escritorio. Soltá fotos o videos `.mp4` (con un `.jpg` del mismo nombre como portada) y aparecen solos.
- El nombre: `NameStep` (o `nameStep` en un Panel) dice cuántas letras se ven a partir de esa parte. Los valores están en `NAME_STEPS`, en `site.ts`.
- Los stickers (polaroid, post-it, etiqueta, brillito, compu retro, carpetas, manchitas con cara) están en `src/components/Stickers.tsx`.

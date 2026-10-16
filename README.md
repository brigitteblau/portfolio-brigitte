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

## "Dejame algo" (estilo BeReal)

La gente se puede sacar una foto (en el celular, las dos cámaras: la de atrás grande y la selfie chiquita, como BeReal), o subir una, y dejarte un mensaje. Todo queda **privado** en tu Supabase:

- los mensajes, en la tabla `visitor_notes` (Table Editor);
- las fotos, en el bucket privado `visitor-notes` (Storage). En la tabla, `photo_path` te dice cuál es la foto de cada mensaje.

Para activarlo hay que hacer tres cosas:

1. En Supabase, abrí **SQL Editor** y corré [`supabase/visitor_notes.sql`](supabase/visitor_notes.sql). Crea la tabla y el bucket privado (si ya tenías la tabla vieja, la actualiza).
2. En Vercel, entrá a **Settings → Environment Variables** y agregá:

   | Variable | Valor |
   |---|---|
   | `SUPABASE_URL` | la Project URL (`https://xxxx.supabase.co`) |
   | `SUPABASE_SERVICE_ROLE_KEY` | la service role key (Settings → API). Es secreta: nunca va con el prefijo `NEXT_PUBLIC_`. |

3. Volvé a desplegar (Deployments → Redeploy).

Mientras no esté activado, el formulario lo dice y sugiere escribir por mail. No simula que se envió.

**Protecciones:** validación en el servidor (mensaje de 3 a 2000 caracteres, o solo foto), la foto se chequea por sus bytes (JPG, PNG o WebP, máx. 5 MB) y se achica en el navegador antes de subir, campo trampa para bots, tiempo mínimo, y límite de 3 envíos cada 10 minutos por visitante con un hash efímero en memoria (sin guardar IPs). Las fotos nunca son públicas.

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

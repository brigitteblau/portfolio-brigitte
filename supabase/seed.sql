-- ============================================================================
-- Seed: tus proyectos como filas (kind = 'project'). Corré DESPUÉS de schema.sql.
-- Las portadas son capturas automáticas de cada sitio (se ven solas).
-- ============================================================================

insert into public.entries (kind, slug, date, published, title_es, title_en, summary_es, summary_en, link, github, cover_url, tech)
values
  ('project', 'tus-pruebas', '2024-03-01', true, 'Tus Pruebas', 'Tus Pruebas',
   'Mi primer proyecto y el que más cariño me genera: una comunidad real de alumnos que comparten resúmenes y parciales. +300 visitas diarias. Aprendí todo sola.',
   'My very first project and still my favorite: a real community of students sharing notes and tests. 300+ daily visits. I learned everything myself.',
   'https://tuspruebas.com', null, 'https://image.thum.io/get/width/1200/crop/900/noanimate/https://tuspruebas.com', array['React','Supabase','Prisma','Node']),

  ('project', 'tevila-it', '2024-06-01', true, 'Tevila.it', 'Tevila.it',
   'Web de ayuda comunitaria para el proceso de tevilá de vajilla. Simple, directa y accesible, con paso a paso y contacto por WhatsApp.',
   'A community site to make the tevilá process simple and accessible, with a step-by-step guide and WhatsApp contact.',
   'https://tevilait.com', null, 'https://image.thum.io/get/width/1200/crop/900/noanimate/https://tevilait.com', array['React','Supabase','Tailwind']),

  ('project', 'vslam-py', '2024-09-01', true, 'vSLAM-py', 'vSLAM-py',
   'Pipeline propio de Visual SLAM en Python y C++: estima trayectorias, genera mapas y detecta features en tiempo real.',
   'My own Visual SLAM pipeline in Python and C++: tracks motion, builds maps and detects keypoints in real time.',
   null, 'https://github.com/brigitteblau/vo-brigitte', 'https://opengraph.githubassets.com/1/brigitteblau/vo-brigitte', array['Python','OpenCV','NumPy','g2o']),

  ('project', 'invitaciones-digitales', '2025-01-01', true, 'Invitaciones digitales', 'Digital invitations',
   'Invitaciones interactivas de casamiento con música, cuenta regresiva, RSVP y links a calendario/mapa.',
   'Interactive wedding invitations with music, countdowns, RSVP and calendar/map links.',
   'https://nos-casamos-six.vercel.app', null, 'https://image.thum.io/get/width/1200/crop/900/noanimate/https://nos-casamos-six.vercel.app', array['React','Tailwind','ICS','Figma']),

  ('project', 'mixit-ai', '2025-05-01', true, 'MixIt.AI', 'MixIt.AI',
   'Proyecto personal en desarrollo: mezcla canciones automáticamente con IA y datos de Spotify en tiempo real.',
   'Personal project in progress: blends songs automatically using AI and real-time Spotify data.',
   null, null, null, array['React','Expo','Spotify API','AI']);

-- Para el journal: subí historias desde el panel de Supabase (tabla entries,
-- kind = 'post', con title_es, body_es, date, cover_url y audio_url).

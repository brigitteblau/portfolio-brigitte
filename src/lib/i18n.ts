export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

/** Texto en los dos idiomas. Todo el contenido del sitio usa este formato. */
export type L = { es: string; en: string };

export const isLocale = (v: string): v is Locale =>
  (locales as readonly string[]).includes(v);

export const t = (text: L, lang: Locale) => text[lang];

/**
 * Convención de borradores: cualquier texto que empiece con "✎" es un pendiente
 * y NUNCA se muestra en el sitio publicado.
 */
export const filled = (text?: string | null): text is string => !!text && !text.trim().startsWith("✎");
export const filledL = (text: L | undefined, lang: Locale) => (text && filled(text[lang]) ? text[lang] : undefined);

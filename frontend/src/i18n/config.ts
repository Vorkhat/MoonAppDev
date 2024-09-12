export type Locale = (typeof locales)[number];

export const locales = ['En', 'Ru'] as const;
export const defaultLocale: Locale = 'Ru';
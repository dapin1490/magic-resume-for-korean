export const locales = ["zh", "en", "ko"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  zh: "中文",
  en: "English",
  ko: "한국어",
};

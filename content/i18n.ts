/**
 * Ядро локализации. Обе локали живут под префиксом (/en/..., /ru/...),
 * корень «/» отдаёт редирект на локаль, определённую по Accept-Language
 * (см. proxy.ts). Так у каждой языковой версии свой канонический URL
 * и работает hreflang — критично для индексации.
 */

export const LOCALES = ["en", "ru"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Значение для атрибута lang="" и hreflang. */
export const HTML_LANG: Record<Locale, string> = {
  en: "en",
  ru: "ru",
};

/** Подпись локали в переключателе — всегда на своём языке. */
export const LOCALE_LABEL: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
};

export const isLocale = (v: string): v is Locale =>
  (LOCALES as readonly string[]).includes(v);

/**
 * Собирает путь с префиксом локали.
 *   href("ru", "/services/seo-aeo") -> "/ru/services/seo-aeo"
 *   href("en", "/")                 -> "/en"
 */
export function href(locale: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/**
 * Меняет локаль в текущем пути, сохраняя саму страницу.
 *   swapLocale("/ru/services/seo-aeo", "en") -> "/en/services/seo-aeo"
 */
export function swapLocale(pathname: string, next: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length > 0 && isLocale(parts[0])) {
    parts[0] = next;
    return `/${parts.join("/")}`;
  }
  return href(next, pathname);
}

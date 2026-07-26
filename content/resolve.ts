import type { Locale } from "./i18n";
import { SOLUTIONS, SERVICES, type ContentPage } from "./site";
import { SOLUTIONS_RU, SERVICES_RU } from "./site.ru";
import { LEGAL_DOCS, type LegalDoc } from "./legal";
import { LEGAL_DOCS_RU } from "./legal.ru";

/**
 * Единая точка получения контента под локаль. Страницы обращаются
 * только сюда и не знают, из какого файла пришёл текст.
 */

export const getSolutions = (locale: Locale): ContentPage[] =>
  locale === "ru" ? SOLUTIONS_RU : SOLUTIONS;

export const getServices = (locale: Locale): ContentPage[] =>
  locale === "ru" ? SERVICES_RU : SERVICES;

export const getLegalDocs = (locale: Locale): LegalDoc[] =>
  locale === "ru" ? LEGAL_DOCS_RU : LEGAL_DOCS;

export const findSolutionIn = (locale: Locale, slug: string) =>
  getSolutions(locale).find((p) => p.slug === slug);

export const findServiceIn = (locale: Locale, slug: string) =>
  getServices(locale).find((p) => p.slug === slug);

export const findLegalIn = (locale: Locale, slug: string) =>
  getLegalDocs(locale).find((d) => d.slug === slug);

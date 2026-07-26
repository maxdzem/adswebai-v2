import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { LOCALES, href, type Locale } from "@/content/i18n";
import { getSolutions, getServices } from "@/content/resolve";

/**
 * Карта сайта для обеих локалей. У каждой записи проставлены alternates
 * с hreflang — поисковик видит, что /en/... и /ru/... это одна страница
 * на разных языках, а не дубли.
 *
 * Юридические документы (/legal/*) намеренно не включены: они noindex,
 * пока в них не появится реальный текст.
 */

/** Пути без префикса локали — общие для обоих языков. */
function pathsFor(locale: Locale): { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] {
  const staticPaths = [
    { path: "/", priority: 1, freq: "weekly" as const },
    { path: "/what-we-do", priority: 0.9, freq: "monthly" as const },
    { path: "/solutions", priority: 0.9, freq: "monthly" as const },
    { path: "/services", priority: 0.9, freq: "monthly" as const },
    { path: "/technology-services", priority: 0.8, freq: "monthly" as const },
    { path: "/work", priority: 0.8, freq: "weekly" as const },
    { path: "/partners", priority: 0.6, freq: "monthly" as const },
    { path: "/thinking", priority: 0.7, freq: "weekly" as const },
    { path: "/about", priority: 0.7, freq: "monthly" as const },
    { path: "/about/leadership", priority: 0.5, freq: "monthly" as const },
    { path: "/about/careers", priority: 0.6, freq: "weekly" as const },
    { path: "/about/newsroom", priority: 0.5, freq: "weekly" as const },
    { path: "/contact", priority: 0.7, freq: "yearly" as const },
  ];

  const solutionPaths = getSolutions(locale).map((p) => ({
    path: `/solutions/${p.slug}`,
    priority: 0.8,
    freq: "monthly" as const,
  }));

  const servicePaths = getServices(locale).map((p) => ({
    path: `/services/${p.slug}`,
    priority: 0.7,
    freq: "monthly" as const,
  }));

  return [...staticPaths, ...solutionPaths, ...servicePaths];
}

/**
 * lastModified намеренно отсутствует: даты правки по страницам мы нигде не
 * храним, а проставлять всем `new Date()` — значит на каждом деплое
 * заявлять поисковику, что обновился весь сайт. Такой сигнал он быстро
 * перестаёт принимать всерьёз; лучше не давать его вовсе.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    pathsFor(locale).map(({ path, priority, freq }) => ({
      url: `${SITE_URL}${href(locale, path)}`,
      changeFrequency: freq,
      priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${SITE_URL}${href(l, path)}`])
        ),
      },
    }))
  );
}

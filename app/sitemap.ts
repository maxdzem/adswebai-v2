import type { MetadataRoute } from "next";
import { SITE_URL, SOLUTIONS, SERVICES } from "@/content/site";

/**
 * Карта сайта. Статические роуты перечислены явно, страницы решений
 * и услуг разворачиваются из того же контент-модуля, что их рендерит —
 * добавил страницу в site.ts, она автоматически попала в sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/solutions`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/services`, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${SITE_URL}/technology-services`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: `${SITE_URL}/work`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${SITE_URL}/about/leadership`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/about/careers`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/about/newsroom`,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.7 },
  ];

  const solutionRoutes: MetadataRoute.Sitemap = SOLUTIONS.map((p) => ({
    url: `${SITE_URL}/solutions/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((p) => ({
    url: `${SITE_URL}/services/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...solutionRoutes, ...serviceRoutes].map((r) => ({
    ...r,
    lastModified,
  }));
}

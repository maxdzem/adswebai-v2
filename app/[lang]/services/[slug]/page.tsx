import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { getServices, findServiceIn } from "@/content/resolve";
import { LOCALES, isLocale, href, type Locale } from "@/content/i18n";
import { getDict } from "@/content/dict";
import { SITE_NAME } from "@/content/site";

type Props = { params: Promise<{ lang: string; slug: string }> };

/** Все страницы обеих локалей известны на сборке. */
export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    getServices(lang).map((p) => ({ lang, slug: p.slug }))
  );
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const page = findServiceIn(locale, slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.lede,
    keywords: page.keywords,
    alternates: {
      canonical: href(locale, `/services/${page.slug}`),
      languages: {
        en: href("en", `/services/${page.slug}`),
        ru: href("ru", `/services/${page.slug}`),
      },
    },
    openGraph: {
      title: `${page.title} — ${SITE_NAME}`,
      description: page.lede,
      url: href(locale, `/services/${page.slug}`),
      type: "article",
    },
  };
}

export default async function DetailPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const page = findServiceIn(lang, slug);
  if (!page) notFound();

  const dict = getDict(lang);

  return (
    <PageShell
      page={page}
      layout="compact"
      locale={lang}
      dict={dict}
      trail={[
        { label: dict.common.home, href: href(lang) },
        { label: dict.nav.services, href: href(lang, "/services") },
        { label: page.title, href: href(lang, `/services/${page.slug}`) },
      ]}
      related={getServices(lang)
        .filter((p) => p.slug !== page.slug)
        .slice(0, 6)
        .map((p) => ({ label: p.title, href: href(lang, `/services/${p.slug}`) }))}
    />
  );
}

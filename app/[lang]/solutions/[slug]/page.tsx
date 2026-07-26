import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { getSolutions, findSolutionIn } from "@/content/resolve";
import { LOCALES, isLocale, href, type Locale } from "@/content/i18n";
import { getDict } from "@/content/dict";
import { SITE_NAME } from "@/content/site";

type Props = { params: Promise<{ lang: string; slug: string }> };

/** Все страницы обеих локалей известны на сборке. */
export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    getSolutions(lang).map((p) => ({ lang, slug: p.slug }))
  );
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const page = findSolutionIn(locale, slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.lede,
    keywords: page.keywords,
    alternates: {
      canonical: href(locale, `/solutions/${page.slug}`),
      languages: {
        en: href("en", `/solutions/${page.slug}`),
        ru: href("ru", `/solutions/${page.slug}`),
      },
    },
    openGraph: {
      title: `${page.title} — ${SITE_NAME}`,
      description: page.lede,
      url: href(locale, `/solutions/${page.slug}`),
      type: "article",
    },
  };
}

export default async function DetailPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const page = findSolutionIn(lang, slug);
  if (!page) notFound();

  const dict = getDict(lang);

  return (
    <PageShell
      page={page}
      layout="feature"
      locale={lang}
      dict={dict}
      trail={[
        { label: dict.common.home, href: href(lang) },
        { label: dict.nav.solutions, href: href(lang, "/solutions") },
        { label: page.title, href: href(lang, `/solutions/${page.slug}`) },
      ]}
      related={getSolutions(lang)
        .filter((p) => p.slug !== page.slug)
        .slice(0, 6)
        .map((p) => ({ label: p.title, href: href(lang, `/solutions/${p.slug}`) }))}
    />
  );
}

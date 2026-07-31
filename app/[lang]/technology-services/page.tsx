import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HugeHome from "@/components/huge/HugeHome";
import { getTechPage } from "@/content/pages";
import { isLocale, href, type Locale } from "@/content/i18n";
import { SITE_NAME } from "@/content/site";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const page = getTechPage(locale);

  return {
    title: page.title,
    description: page.lede,
    keywords: page.keywords,
    alternates: {
      canonical: href(locale, "/technology-services"),
      languages: { en: href("en", "/technology-services"), ru: href("ru", "/technology-services") },
    },
    openGraph: {
      title: `${page.title} — ${SITE_NAME}`,
      description: page.lede,
      url: href(locale, "/technology-services"),
    },
  };
}

/**
 * Страница-порт главной hugeinc.com. Всё содержимое и все анимации —
 * в components/huge (тексты и картинки собраны в components/huge/data.ts).
 *
 * Обычного каркаса внутренних страниц (PageShell) здесь нет намеренно:
 * порт приносит свою сетку, типографику, шапку и футер. Шапка сайта из
 * layout.tsx остаётся сверху, поэтому навигация порта сдвинута ниже —
 * см. TOP_OFFSET в components/huge/HugeNav.tsx.
 */
export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <HugeHome />;
}

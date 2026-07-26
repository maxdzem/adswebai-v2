import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { getTechPage } from "@/content/pages";
import { isLocale, href, type Locale } from "@/content/i18n";
import { getDict } from "@/content/dict";
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

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDict(lang);
  const page = getTechPage(lang);

  return (
    <PageShell
      page={page}
      layout="technical"
      locale={lang}
      dict={dict}
      trail={[
        { label: dict.common.home, href: href(lang) },
        { label: page.title, href: href(lang, "/technology-services") },
      ]}
      related={undefined}
    />
  );
}

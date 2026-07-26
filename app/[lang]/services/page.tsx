import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IndexList from "@/components/IndexList";
import { getServices } from "@/content/resolve";
import { isLocale, href, type Locale } from "@/content/i18n";
import { getDict } from "@/content/dict";
import { SITE_NAME } from "@/content/site";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const t = getDict(locale).pages.services;

  return {
    title: t.title,
    description: t.lede,
    alternates: {
      canonical: href(locale, "/services"),
      languages: {
        en: href("en", "/services"),
        ru: href("ru", "/services"),
      },
    },
    openGraph: {
      title: `${t.title} — ${SITE_NAME}`,
      description: t.lede,
      url: href(locale, "/services"),
    },
  };
}

export default async function Index({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDict(lang);
  const t = dict.pages.services;

  return (
    <IndexList
      eyebrow={t.eyebrow}
      title={t.title}
      lede={t.lede}
      base="/services"
      items={getServices(lang)}
      display="rows"
      locale={lang}
      dict={dict}
    />
  );
}

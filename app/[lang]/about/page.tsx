import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { getAboutPage } from "@/content/pages";
import { isLocale, href, type Locale } from "@/content/i18n";
import { getDict } from "@/content/dict";
import { SITE_NAME } from "@/content/site";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const page = getAboutPage(locale);

  return {
    title: page.title,
    description: page.lede,
    keywords: page.keywords,
    alternates: {
      canonical: href(locale, "/about"),
      languages: { en: href("en", "/about"), ru: href("ru", "/about") },
    },
    openGraph: {
      title: `${page.title} — ${SITE_NAME}`,
      description: page.lede,
      url: href(locale, "/about"),
    },
  };
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDict(lang);
  const page = getAboutPage(lang);

  return (
    <PageShell
      page={page}
      layout="editorial"
      locale={lang}
      dict={dict}
      trail={[
        { label: dict.common.home, href: href(lang) },
        { label: page.title, href: href(lang, "/about") },
      ]}
      related={[
        { label: dict.nav.aboutSub.leadership, href: href(lang, "/about/leadership") },
        { label: dict.nav.aboutSub.careers, href: href(lang, "/about/careers") },
        { label: dict.nav.aboutSub.newsroom, href: href(lang, "/about/newsroom") },
      ]}
    />
  );
}

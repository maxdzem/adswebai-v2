import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getContactMeta } from "@/content/pages";
import { isLocale, href, type Locale } from "@/content/i18n";
import { getDict } from "@/content/dict";
import { SITE_NAME } from "@/content/site";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const t = getContactMeta(locale);

  return {
    title: t.title,
    description: t.lede,
    alternates: {
      canonical: href(locale, "/contact"),
      languages: { en: href("en", "/contact"), ru: href("ru", "/contact") },
    },
    openGraph: {
      title: `${t.title} — ${SITE_NAME}`,
      description: t.lede,
      url: href(locale, "/contact"),
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDict(lang);

  return (
    <main className="pt-[100px]">
      {/* Переиспользуем ту же пошаговую форму, что и на главной,
          чтобы у /contact и якоря #connect не разъезжались поля. */}
      <Contact dict={dict} />
      <Footer locale={lang} dict={dict} />
    </main>
  );
}

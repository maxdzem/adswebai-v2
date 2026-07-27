import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Newsreader } from "next/font/google";
import "../globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/content/site";
import { LOCALES, HTML_LANG, isLocale, href, type Locale } from "@/content/i18n";
import { getDict } from "@/content/dict";

const inter = Inter({
  // cyrillic — иначе русский текст падал бы на системный шрифт
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

/** Обе локали известны на сборке — рендерим статически. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

const TITLE: Record<Locale, string> = {
  en: `${SITE_NAME} — AI-driven brand, media and marketing systems`,
  ru: `${SITE_NAME} — бренд, медиа и маркетинг на основе AI`,
};

const DESCRIPTION: Record<Locale, string> = {
  en: SITE_DESCRIPTION,
  ru: "Маркетинговая и технологическая практика: бренд-системы, медиа, контентная цепочка и AI, встроенный в ежедневные процессы команды.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";

  return {
    // metadataBase делает относительные пути в openGraph/alternates абсолютными.
    metadataBase: new URL(SITE_URL),
    title: {
      // Внутренние страницы задают только своё имя — суффикс подставится сам.
      default: TITLE[locale],
      template: `%s — ${SITE_NAME}`,
    },
    description: DESCRIPTION[locale],
    applicationName: SITE_NAME,
    alternates: {
      canonical: href(locale),
      // hreflang: обе языковые версии знают друг о друге
      languages: {
        en: href("en"),
        ru: href("ru"),
        "x-default": href("en"),
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: locale === "ru" ? "ru_RU" : "en_US",
      url: href(locale),
      title: TITLE[locale],
      description: DESCRIPTION[locale],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE[locale],
      description: DESCRIPTION[locale],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDict(lang);

  return (
    // Расширения браузера (Grammarly, ColorZilla, инспекторы на Plasmo)
    // дописывают свои атрибуты в <html>/<body> и вставляют туда узлы ДО
    // того, как React начнёт гидрацию. Без флага React считает это
    // расхождением, роняет гидрацию и пересобирает дерево на клиенте —
    // а пересборка сносит инлайн-стили, которые GSAP уже успел поставить
    // шапке. Флаг действует ровно на один уровень (атрибуты и прямой текст
    // самого элемента), поэтому нужен и на <html>, и на <body>; настоящие
    // расхождения внутри дерева он не глушит.
    <html
      lang={HTML_LANG[lang]}
      className={`${inter.variable} ${newsreader.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-cream text-ink font-sans" suppressHydrationWarning>
        <SmoothScroll>
          <Header locale={lang} dict={dict} />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

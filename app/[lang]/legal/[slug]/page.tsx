import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { FxUp } from "@/components/Fx";
import Button from "@/components/Button";
import { getLegalDocs, findLegalIn } from "@/content/resolve";
import { LOCALES, isLocale, href, type Locale } from "@/content/i18n";
import { getDict } from "@/content/dict";
import { SITE_NAME } from "@/content/site";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    getLegalDocs(lang).map((d) => ({ lang, slug: d.slug }))
  );
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const doc = findLegalIn(locale, slug);
  if (!doc) return {};

  return {
    title: doc.title,
    description: doc.purpose,
    alternates: {
      canonical: href(locale, `/legal/${doc.slug}`),
      languages: {
        en: href("en", `/legal/${doc.slug}`),
        ru: href("ru", `/legal/${doc.slug}`),
      },
    },
    // Документ ещё не опубликован — в индекс он попасть не должен
    robots: { index: false, follow: true },
    openGraph: {
      title: `${doc.title} — ${SITE_NAME}`,
      description: doc.purpose,
      url: href(locale, `/legal/${doc.slug}`),
    },
  };
}

export default async function LegalPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const doc = findLegalIn(lang, slug);
  if (!doc) notFound();

  const dict = getDict(lang);
  const t = dict.pages.legal;
  const others = getLegalDocs(lang)
    .filter((d) => d.slug !== doc.slug)
    .slice(0, 6);

  return (
    <main className="bg-cream pt-[100px]">
      <article className="px-6 pb-32 pt-24 lg:px-10">
        <div className="lg:ml-[12%]">
          <nav aria-label="Breadcrumb" className="fs-label mb-10 font-medium">
            <ol className="flex flex-wrap items-center gap-2 text-ink/50">
              <li>
                <Link
                  href={href(lang)}
                  className="transition-colors hover:text-ink"
                >
                  {dict.common.home}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={href(lang, "/legal")}
                  className="transition-colors hover:text-ink"
                >
                  {t.breadcrumb}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink" aria-current="page">
                {doc.title}
              </li>
            </ol>
          </nav>

          <FxUp>
            <p className="fs-label font-medium text-ink/60">
              {t.groups[doc.group]}
            </p>
          </FxUp>
          <FxUp delay={0.08}>
            <h1 className="type-display fs-display-m mt-5 max-w-[24ch]">
              {doc.title}
            </h1>
          </FxUp>
          <FxUp delay={0.16}>
            <p className="fs-body-l mt-8 max-w-[56ch] text-ink/70">
              {doc.purpose}
            </p>
          </FxUp>

          {/* Честный статус вместо выдуманного юридического текста */}
          <FxUp delay={0.24}>
            <div className="mt-16 max-w-[56ch] border-t border-ink/15 pt-10">
              <h2 className="type-display fs-display-s">{t.statusHeading}</h2>
              <p className="fs-body-m mt-5 text-ink/70">{t.statusBody}</p>
              <p className="fs-body-m mt-4 text-ink/70">{t.statusBody2}</p>

              <div className="mt-10">
                <Link
                  href={href(lang, "/contact")}
                  data-btn-hover
                  className="inline-block"
                >
                  <Button label={t.request} href={null} />
                </Link>
              </div>
            </div>
          </FxUp>
        </div>
      </article>

      <div className="bg-mist px-6 py-20 lg:px-10">
        <FxUp className="lg:ml-[12%]">
          <h2 className="fs-label font-medium text-ink/60">{t.others}</h2>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {others.map((d) => (
              <li key={d.slug}>
                <Link
                  href={href(lang, `/legal/${d.slug}`)}
                  className="fs-body-m underline-offset-4 transition-colors hover:text-ink/60 hover:underline"
                >
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </FxUp>
      </div>

      <Footer locale={lang} dict={dict} />
    </main>
  );
}

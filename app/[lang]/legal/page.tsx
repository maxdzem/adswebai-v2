import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { FxUp } from "@/components/Fx";
import { getLegalDocs } from "@/content/resolve";
import { LEGAL_GROUPS } from "@/content/legal";
import { isLocale, href, type Locale } from "@/content/i18n";
import { getDict } from "@/content/dict";
import { SITE_NAME } from "@/content/site";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const t = getDict(locale).pages.legal;

  return {
    title: t.title,
    description: t.lede,
    alternates: {
      canonical: href(locale, "/legal"),
      languages: { en: href("en", "/legal"), ru: href("ru", "/legal") },
    },
    openGraph: {
      title: `${t.title} — ${SITE_NAME}`,
      description: t.lede,
      url: href(locale, "/legal"),
    },
  };
}

export default async function LegalIndex({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDict(lang);
  const t = dict.pages.legal;
  const docs = getLegalDocs(lang);

  return (
    <main className="bg-mist pt-[100px]">
      <div className="px-6 pb-32 pt-24 lg:px-10">
        <div className="lg:ml-[12%]">
          <FxUp>
            <p className="fs-label font-medium text-ink/60">{t.eyebrow}</p>
          </FxUp>
          <FxUp delay={0.08}>
            <h1 className="type-display fs-display-m mt-5 max-w-[20ch]">
              {t.title}
            </h1>
          </FxUp>
          <FxUp delay={0.16}>
            <p className="fs-body-l mt-8 max-w-[52ch] text-ink/70">{t.lede}</p>
          </FxUp>
        </div>

        <div className="mt-20 lg:ml-[12%]">
          {LEGAL_GROUPS.map((group, gi) => {
            const inGroup = docs.filter((d) => d.group === group);
            if (inGroup.length === 0) return null;

            return (
              <FxUp key={group} delay={gi * 0.06}>
                <section className="mb-14 border-t border-ink/15 pt-8 lg:flex lg:gap-16">
                  <h2 className="type-display fs-display-s lg:w-[28%] lg:shrink-0">
                    {t.groups[group]}
                  </h2>
                  <ul className="mt-5 lg:mt-0 lg:flex-1">
                    {inGroup.map((d) => (
                      <li key={d.slug} className="border-b border-ink/15">
                        <Link
                          href={href(lang, `/legal/${d.slug}`)}
                          className="block py-5 transition-opacity hover:opacity-60"
                        >
                          <span className="fs-body-m block font-medium">
                            {d.title}
                          </span>
                          <span className="fs-label mt-1 block max-w-[62ch] text-ink/60">
                            {d.purpose}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </FxUp>
            );
          })}
        </div>
      </div>

      <Footer locale={lang} dict={dict} />
    </main>
  );
}

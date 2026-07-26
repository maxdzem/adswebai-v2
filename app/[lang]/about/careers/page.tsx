import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { isLocale, href, type Locale } from "@/content/i18n";
import { getDict } from "@/content/dict";
import { SITE_NAME } from "@/content/site";
import { getCareers } from "@/content/pages";
import Link from "next/link";
import MediaSlot from "@/components/MediaSlot";
import { FxUp, FxSide } from "@/components/Fx";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const t = getCareers(locale);

  return {
    title: t.title,
    description: t.lede,
    alternates: {
      canonical: href(locale, "/about/careers"),
      languages: { en: href("en", "/about/careers"), ru: href("ru", "/about/careers") },
    },
    openGraph: {
      title: `${t.title} — ${SITE_NAME}`,
      description: t.lede,
      url: href(locale, "/about/careers"),
    },
  };
}

/** Реальные вакансии подставляются сюда (или из ATS) перед публикацией. */
const OPENINGS: { title: string; team: string; location: string }[] = [];

export default async function CareersPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDict(lang);
  const t = getCareers(lang);

  return (
    <main className="bg-mist pt-[100px]">
      <div className="px-6 pb-32 pt-24 lg:px-10">
        <div className="lg:ml-[12%]">
          <FxUp>
            <p className="fs-label font-medium text-ink/60">{t.eyebrow}</p>
          </FxUp>
          <FxUp delay={0.08}>
            <h1 className="type-display fs-display-m mt-5 max-w-[18ch]">
              {t.title}
            </h1>
          </FxUp>
          <FxUp delay={0.16}>
            <p className="fs-body-l mt-8 max-w-[52ch] text-ink/70">{t.lede}</p>
          </FxUp>
        </div>

        {/* Двухколоночник: текст слева, пара слотов «жизнь команды» справа */}
        <section className="mt-20 lg:ml-[12%] lg:flex lg:items-start lg:gap-16">
          <FxUp className="max-w-[56ch] lg:flex-1">
            <h2 className="type-display fs-display-s">{t.howHeading}</h2>
            <p className="fs-body-m mt-5 text-ink/70">{t.howBody}</p>
            <ul className="mt-8 border-t border-ink/15">
              {t.bullets.map((b) => (
                <li
                  key={b}
                  className="fs-body-m border-b border-ink/15 py-4 text-ink/80"
                >
                  {b}
                </li>
              ))}
            </ul>
          </FxUp>

          <FxSide side="right" className="mt-12 lg:mt-0 lg:w-[34%] lg:shrink-0">
            <MediaSlot ratio="4/3" />
            <MediaSlot ratio="1/1" className="mt-6" />
          </FxSide>
        </section>

        <section className="mt-24 max-w-[62ch] lg:ml-[12%]">
          <h2 className="type-display fs-display-s">{t.rolesHeading}</h2>

          {OPENINGS.length === 0 ? (
            <p className="fs-body-m mt-5 text-ink/70">
              {t.empty}{" "}
              <Link
                href={href(lang, "/contact")}
                className="underline underline-offset-4"
              >
                {t.emptyLink}
              </Link>{" "}
              {t.emptyTail}
            </p>
          ) : (
            <ul className="mt-8 border-t border-ink/15">
              {OPENINGS.map((o) => (
                <li
                  key={o.title}
                  className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-ink/15 py-5"
                >
                  <span className="fs-body-m font-medium">{o.title}</span>
                  <span className="fs-label text-ink/50">{o.team}</span>
                  <span className="fs-label text-ink/50">{o.location}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <Footer locale={lang} dict={dict} />
    </main>
  );
}

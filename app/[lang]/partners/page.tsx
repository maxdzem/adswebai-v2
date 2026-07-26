import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { isLocale, href, type Locale } from "@/content/i18n";
import { getDict } from "@/content/dict";
import { SITE_NAME } from "@/content/site";
import Link from "next/link";
import MediaSlot from "@/components/MediaSlot";
import Button from "@/components/Button";
import { FxUp, FxSide } from "@/components/Fx";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const t = getDict(locale).pages.partners;

  return {
    title: t.title,
    description: t.lede,
    alternates: {
      canonical: href(locale, "/partners"),
      languages: { en: href("en", "/partners"), ru: href("ru", "/partners") },
    },
    openGraph: {
      title: `${t.title} — ${SITE_NAME}`,
      description: t.lede,
      url: href(locale, "/partners"),
    },
  };
}

/**
 * Категории партнёрского стека. Конкретные вендоры и уровни сертификации
 * намеренно не перечислены: заявлять партнёрский статус, которого нет —
 * ложное утверждение о компании. Слоты под логотипы стоят и ждут реальных.
 */
export default async function PartnersPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDict(lang);
  const t = dict.pages.partners;

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
            <p className="fs-body-l mt-8 max-w-[54ch] text-ink/70">{t.lede}</p>
          </FxUp>
        </div>

        {/* Сетка слотов под логотипы партнёров */}
        <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:ml-[12%] lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <FxUp key={i} delay={(i % 6) * 0.05}>
              <MediaSlot ratio="4/3" note="Logo" />
            </FxUp>
          ))}
        </div>

        {/* Категории стека */}
        <div className="mt-24 lg:ml-[12%]">
          {t.areas.map((a, i) => (
            <section
              key={a.title}
              className="mb-14 border-t border-ink/15 pt-8 lg:flex lg:gap-16"
            >
              <FxUp className="lg:w-[32%] lg:shrink-0">
                <span className="fs-label font-medium text-ink/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="type-display fs-display-s mt-3">{a.title}</h2>
              </FxUp>
              <FxUp delay={0.08} className="mt-4 max-w-[56ch] lg:mt-0 lg:flex-1">
                <p className="fs-body-m text-ink/70">{a.body}</p>
              </FxUp>
            </section>
          ))}
        </div>

        {/* Условия партнёрства */}
        <section className="mt-16 lg:ml-[12%] lg:flex lg:items-start lg:gap-16">
          <FxUp className="max-w-[54ch] lg:flex-1">
            <h2 className="type-display fs-display-s">
{t.pickHeading}
            </h2>
<p className="fs-body-m mt-5 text-ink/70">{t.pickBody}</p>
            <ul className="mt-8 border-t border-ink/15">
              {t.pickBullets.map((b) => (
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
            <MediaSlot ratio="3/4" />
          </FxSide>
        </section>
      </div>

      <div className="bg-cream px-6 py-20 lg:px-10">
        <FxUp className="lg:ml-[12%]">
<p className="fs-body-m max-w-[52ch] text-ink/70">{t.outro}</p>
          <div className="mt-10">
            <Link href={href(lang, "/contact")} data-btn-hover className="inline-block">
              <Button label={dict.common.startConversation} href={null} />
            </Link>
          </div>
        </FxUp>
      </div>

      <Footer locale={lang} dict={dict} />
    </main>
  );
}

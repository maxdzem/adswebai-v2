import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { isLocale, href, type Locale } from "@/content/i18n";
import { getDict } from "@/content/dict";
import { SITE_NAME } from "@/content/site";
import Link from "next/link";
import MediaSlot from "@/components/MediaSlot";
import Button from "@/components/Button";
import SwapLink from "@/components/SwapLink";
import { FxUp, FxSide, FxDrift } from "@/components/Fx";
import { getSolutions, getServices } from "@/content/resolve";
import { photo } from "@/content/media";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const t = getDict(locale).pages.whatWeDo;

  return {
    title: t.title,
    description: t.lede,
    alternates: {
      canonical: href(locale, "/what-we-do"),
      languages: { en: href("en", "/what-we-do"), ru: href("ru", "/what-we-do") },
    },
    openGraph: {
      title: `${t.title} — ${SITE_NAME}`,
      description: t.lede,
      url: href(locale, "/what-we-do"),
    },
  };
}

/**
 * Обзорная страница-развилка: собирает три ветки предложения
 * (решения, услуги, технологии) и ведёт в соответствующие разделы.
 * Контент не дублируется — тянется из content/site.ts.
 */
export default async function WhatWeDoPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDict(lang);
  const t = dict.pages.whatWeDo;

  return (
    <main className="bg-cream pt-[100px]">
      <div className="pb-32 pt-24">
        <div className="px-6 lg:px-10">
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
              <p className="fs-body-l mt-8 max-w-[54ch] text-ink/70">{t.lede}</p>
            </FxUp>
          </div>
        </div>

        <FxDrift to="left" amount={5}>
          <MediaSlot ratio="21/9" className="mt-16" src={photo(3)} />
        </FxDrift>

        {/* Ветка 1 — решения, крупными карточками */}
        <div className="px-6 lg:px-10">
          <section className="mt-28 lg:ml-[12%]">
            <FxUp>
              <span className="fs-label font-medium text-ink/40">01</span>
              <h2 className="type-display fs-display-s mt-3">{t.solutionsHeading}</h2>
<p className="fs-body-m mt-5 max-w-[54ch] text-ink/70">{t.solutionsBody}</p>
            </FxUp>

            <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-2">
              {getSolutions(lang).map((p, i) => (
                <li key={p.slug}>
                  <FxSide side={i % 2 === 0 ? "left" : "right"}>
                    <Link
                      href={href(lang, `/solutions/${p.slug}`)}
                      data-btn-hover
                      className="group block"
                    >
                      <MediaSlot ratio="4/3" src={photo(4 + i)} />
                      <h3 className="fs-body-m mt-6 font-bold leading-[1.15]">
                        <SwapLink label={p.title} href={null} size={32} iconSize={12} />
                      </h3>
                      <p className="fs-body-m mt-3 max-w-[46ch] text-ink/70">
                        {p.lede}
                      </p>
                    </Link>
                  </FxSide>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Ветка 2 — услуги: тёмная полоса, плотный список */}
        <div className="mt-28 bg-ink py-24 text-cream">
          <div className="px-6 lg:px-10">
            <FxUp className="lg:ml-[12%]">
              <span className="fs-label font-medium text-cream/40">02</span>
              <h2 className="type-display fs-display-s mt-3">
{t.servicesHeading}
              </h2>
<p className="fs-body-m mt-5 max-w-[54ch] text-cream/70">{t.servicesBody}</p>
            </FxUp>

            <ul className="mt-14 grid grid-cols-1 gap-x-10 border-t border-cream/25 sm:grid-cols-2 lg:ml-[12%] lg:grid-cols-3">
              {getServices(lang).map((p, i) => (
                <li key={p.slug} className="border-b border-cream/20">
                  <FxUp delay={(i % 3) * 0.05}>
                    <Link
                      href={href(lang, `/services/${p.slug}`)}
                      className="flex items-baseline gap-4 py-5 transition-opacity hover:opacity-60"
                    >
                      <span className="fs-label shrink-0 font-medium text-cream/40">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="fs-body-m font-medium">{p.title}</span>
                    </Link>
                  </FxUp>
                </li>
              ))}
            </ul>

            <FxUp className="mt-12 lg:ml-[12%]">
              <Link href={href(lang, "/services")} data-btn-hover className="inline-block">
                <Button
                  label={t.allServices}
                  href={null}
                  colorClass="bg-cream text-ink"
                />
              </Link>
            </FxUp>
          </div>
        </div>

        {/* Ветка 3 — технологии */}
        <div className="px-6 lg:px-10">
          <section className="mt-28 lg:ml-[12%] lg:flex lg:items-start lg:gap-16">
            <FxUp className="max-w-[54ch] lg:flex-1">
              <span className="fs-label font-medium text-ink/40">03</span>
              <h2 className="type-display fs-display-s mt-3">
{t.technologyHeading}
              </h2>
<p className="fs-body-m mt-5 text-ink/70">{t.technologyBody}</p>
              <div className="mt-10">
                <Link
                  href={href(lang, "/technology-services")}
                  data-btn-hover
                  className="inline-block"
                >
                  <Button label={t.technologyCta} href={null} />
                </Link>
              </div>
            </FxUp>

            <FxSide side="right" className="mt-12 lg:mt-0 lg:w-[38%] lg:shrink-0">
              <MediaSlot ratio="1/1" src={photo(17)} />
            </FxSide>
          </section>
        </div>
      </div>

      <div className="bg-mist px-6 py-20 lg:px-10">
        <FxUp className="lg:ml-[12%]">
          <h2 className="fs-label font-medium text-ink/60">{dict.common.alsoInThisArea}</h2>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { label: dict.footer.links.work, href: href(lang, "/work") },
              { label: dict.footer.links.partners, href: href(lang, "/partners") },
              { label: dict.footer.links.thinking, href: href(lang, "/thinking") },
              { label: dict.nav.about, href: href(lang, "/about") },
            ].map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="fs-body-m underline-offset-4 transition-colors hover:text-ink/60 hover:underline"
                >
                  {r.label}
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

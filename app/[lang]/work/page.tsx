import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { isLocale, href, type Locale } from "@/content/i18n";
import { getDict } from "@/content/dict";
import { SITE_NAME } from "@/content/site";
import Link from "next/link";
import MediaSlot from "@/components/MediaSlot";
import { FxUp, FxSide, FxDrift } from "@/components/Fx";
import { photo } from "@/content/media";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const t = getDict(locale).pages.work;

  return {
    title: t.title,
    description: t.lede,
    alternates: {
      canonical: href(locale, "/work"),
      languages: { en: href("en", "/work"), ru: href("ru", "/work") },
    },
    openGraph: {
      title: `${t.title} — ${SITE_NAME}`,
      description: t.lede,
      url: href(locale, "/work"),
    },
  };
}

/**
 * Галерея кейсов. Клиенты и метрики намеренно не подписаны — в слотах стоят
 * кадры из общего пула (content/media.ts), они работают как визуальный фон,
 * а не как заявление о конкретных проектах. Когда появятся свои съёмки,
 * достаточно заменить пути в пуле.
 *
 * Сетка нарочно разноразмерная и со сдвигами по вертикали — раздел
 * читается как галерея, а не как таблица.
 */
const SLOTS: { ratio: string; span: string; offset?: string }[] = [
  { ratio: "16/9", span: "lg:col-span-7" },
  { ratio: "3/4", span: "lg:col-span-5", offset: "lg:mt-24" },
  { ratio: "1/1", span: "lg:col-span-5" },
  { ratio: "16/9", span: "lg:col-span-7", offset: "lg:mt-16" },
  { ratio: "21/9", span: "lg:col-span-12", offset: "lg:mt-8" },
  { ratio: "4/3", span: "lg:col-span-6" },
  { ratio: "4/3", span: "lg:col-span-6", offset: "lg:mt-20" },
];

export default async function WorkPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDict(lang);
  const t = dict.pages.work;

  return (
    <main className="bg-mist pt-[100px]">
      <div className="pb-32 pt-24">
        <div className="px-6 lg:px-10">
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
        </div>

        {/* Широкий слот-открывашка на всю ширину */}
        <FxDrift to="left" amount={5}>
          <MediaSlot ratio="21/9" className="mt-16" src={photo(0)} />
        </FxDrift>

        <div className="px-6 lg:px-10">
          <FxUp className="mt-24 max-w-[62ch] lg:ml-[12%]">
            <p className="fs-body-m text-ink/70">
              {t.empty}{" "}
              <Link
                href={href(lang, "/contact")}
                className="underline underline-offset-4"
              >
                {t.emptyLink}
              </Link>{" "}
              {t.emptyTail}
            </p>
          </FxUp>

          {/* Разноразмерная сетка пустых слотов под будущие ролики */}
          <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:ml-[12%] lg:grid-cols-12">
            {SLOTS.map((s, i) => (
              <FxSide
                key={i}
                side={i % 2 === 0 ? "left" : "right"}
                className={`${s.span} ${s.offset ?? ""}`}
              >
                <MediaSlot ratio={s.ratio} src={photo(i + 1)} />
              </FxSide>
            ))}
          </div>
        </div>
      </div>

      {/* Кремовый финал — тот же приём, что у остальных внутренних страниц */}
      <div className="bg-cream px-6 py-20 lg:px-10">
        <FxUp className="lg:ml-[12%]">
          <h2 className="fs-label font-medium text-ink/60">{dict.common.alsoInThisArea}</h2>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { label: dict.nav.solutions, href: href(lang, "/solutions") },
              { label: dict.nav.services, href: href(lang, "/services") },
              { label: dict.nav.technology, href: href(lang, "/technology-services") },
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

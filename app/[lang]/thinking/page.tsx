import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { isLocale, href, type Locale } from "@/content/i18n";
import { getDict } from "@/content/dict";
import { SITE_NAME } from "@/content/site";
import Link from "next/link";
import MediaSlot from "@/components/MediaSlot";
import Button from "@/components/Button";
import { FxUp, FxSide, FxDrift } from "@/components/Fx";
import { photo } from "@/content/media";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const t = getDict(locale).pages.thinking;

  return {
    title: t.title,
    description: t.lede,
    alternates: {
      canonical: href(locale, "/thinking"),
      languages: { en: href("en", "/thinking"), ru: href("ru", "/thinking") },
    },
    openGraph: {
      title: `${t.title} — ${SITE_NAME}`,
      description: t.lede,
      url: href(locale, "/thinking"),
    },
  };
}

/**
 * Индекс материалов. Реальные статьи подставляются сюда (или из CMS)
 * в POSTS — выдуманных заголовков с датами здесь намеренно нет.
 * Пока пусто: крупный слот-открывашка + сетка слотов под будущие материалы.
 */
const POSTS: {
  title: string;
  kind: string;
  read: string;
  href: string;
}[] = [];

export default async function ThinkingPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDict(lang);
  const t = dict.pages.thinking;

  return (
    <main className="bg-cream pt-[100px]">
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
              <p className="fs-body-l mt-8 max-w-[54ch] text-ink/70">{t.lede}</p>
            </FxUp>
          </div>
        </div>

        {/* Слот под ведущий материал */}
        <FxDrift to="left" amount={5}>
          <MediaSlot ratio="21/9" className="mt-16" src={photo(12)} />
        </FxDrift>

        <div className="px-6 lg:px-10">
          {/* Темы */}
          <FxUp className="mt-20 lg:ml-[12%]">
            <h2 className="fs-label font-medium text-ink/60">{t.topicsLabel}</h2>
            <ul className="mt-5 flex flex-wrap gap-3">
              {t.topics.map((topic) => (
                <li
                  key={topic}
                  className="fs-label rounded-full border border-ink/25 px-4 py-2 font-medium text-ink/70"
                >
                  {topic}
                </li>
              ))}
            </ul>
          </FxUp>

          {POSTS.length === 0 ? (
            <>
              <FxUp className="mt-20 max-w-[62ch] lg:ml-[12%]">
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

              {/* Сетка слотов под будущие материалы */}
              <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:ml-[12%] lg:grid-cols-3">
                {["16/9", "4/3", "16/9", "1/1", "16/9", "4/3"].map((r, i) => (
                  <FxSide
                    key={i}
                    side={i % 2 === 0 ? "left" : "right"}
                    delay={(i % 3) * 0.06}
                    className={i % 3 === 1 ? "lg:mt-12" : ""}
                  >
                    <MediaSlot ratio={r} src={photo(13 + i)} />
                  </FxSide>
                ))}
              </div>
            </>
          ) : (
            <ul className="mt-20 border-t border-ink/15 lg:ml-[12%]">
              {POSTS.map((p) => (
                <li key={p.href} className="border-b border-ink/15">
                  <Link
                    href={p.href}
                    className="flex flex-col gap-2 py-7 transition-opacity hover:opacity-60 lg:flex-row lg:items-center lg:gap-10"
                  >
                    <span className="fs-label shrink-0 text-ink/60 lg:w-40">
                      {p.kind}
                    </span>
                    <span className="fs-body-m flex-1 font-medium">
                      {p.title}
                    </span>
                    <span className="fs-label shrink-0 text-ink/60">
                      {p.read} {dict.common.minRead}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-mist px-6 py-20 lg:px-10">
        <FxUp className="lg:ml-[12%]">
          <h2 className="fs-label font-medium text-ink/60">{dict.common.alsoInThisArea}</h2>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { label: dict.nav.aboutSub.newsroom, href: href(lang, "/about/newsroom") },
              { label: dict.footer.links.work, href: href(lang, "/work") },
              { label: dict.footer.links.whatWeDo, href: href(lang, "/what-we-do") },
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
          <div className="mt-12">
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

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { isLocale, href, type Locale } from "@/content/i18n";
import { getDict } from "@/content/dict";
import { SITE_NAME } from "@/content/site";
import { getLeadership } from "@/content/pages";
import Link from "next/link";
import MediaSlot from "@/components/MediaSlot";
import { FxUp, FxSide } from "@/components/Fx";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const t = getLeadership(locale);

  return {
    title: t.title,
    description: t.lede,
    alternates: {
      canonical: href(locale, "/about/leadership"),
      languages: { en: href("en", "/about/leadership"), ru: href("ru", "/about/leadership") },
    },
    openGraph: {
      title: `${t.title} — ${SITE_NAME}`,
      description: t.lede,
      url: href(locale, "/about/leadership"),
    },
  };
}

export default async function LeadershipPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDict(lang);
  const t = getLeadership(lang);

  return (
    // Портретная сетка: у каждой роли свой слот под фото — раздел
    // отличается от списочных страниц и сразу готов под реальные портреты
    <main className="bg-cream pt-[100px]">
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

        <ul className="mt-20 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:ml-[12%] lg:grid-cols-3">
          {t.roles.map((r, i) => (
            <li key={r.role}>
              <FxSide
                side={i % 2 === 0 ? "left" : "right"}
                delay={(i % 3) * 0.06}
              >
                <MediaSlot ratio="3/4" note={t.portrait} />
                <h2 className="type-display fs-display-s mt-6">{r.role}</h2>
                <p className="fs-body-m mt-3 text-ink/70">{r.remit}</p>
              </FxSide>
            </li>
          ))}
        </ul>

        <FxUp className="mt-20 lg:ml-[12%]">
          <p className="fs-body-m max-w-[52ch] text-ink/60">
            {t.outro}{" "}
            <Link
              href={href(lang, "/contact")}
              className="underline underline-offset-4"
            >
              {t.outroLink}
            </Link>{" "}
            {t.outroTail}
          </p>
        </FxUp>
      </div>

      <Footer locale={lang} dict={dict} />
    </main>
  );
}

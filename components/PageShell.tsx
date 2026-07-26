import Link from "next/link";
import MediaSlot from "./MediaSlot";
import Button from "./Button";
import { FxUp, FxSide, FxDrift } from "./Fx";
import Footer from "./Footer";
import type { ContentPage } from "@/content/site";
import { href, type Locale } from "@/content/i18n";
import type { Dict } from "@/content/dict";

/**
 * Каркас внутренней страницы. Четыре макета, чтобы разделы не выглядели
 * под копирку:
 *
 *  - "feature"    (решения)    — широкий вход: полноразмерный слот,
 *    крупная типографика, медиа чередуется между секциями.
 *  - "compact"    (услуги)     — деловой двухколоночник: слева липкий
 *    заголовок секции, справа текст. Одно небольшое медиа.
 *  - "editorial"  (About)      — колонка-статья: крупный лид, секции
 *    разделены линиями во всю ширину, портретный слот на выносе.
 *  - "technical"  (Technology) — сетка из пронумерованных карточек-плит
 *    на тёмном фоне: раздел читается как спецификация, а не как эссе.
 *
 * Серверный компонент: анимации — в клиентских обёртках Fx.
 * pt-[100px] компенсирует фиксированную шапку из Header.tsx.
 */

export type ShellLayout = "feature" | "compact" | "editorial" | "technical";

function Crumb({ trail }: { trail: { label: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="fs-label mb-10 font-medium">
      <ol className="flex flex-wrap items-center gap-2 text-ink/50">
        {trail.map((c, i) => (
          <li key={c.href} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {i === trail.length - 1 ? (
              <span className="text-ink" aria-current="page">
                {c.label}
              </span>
            ) : (
              <Link href={c.href} className="transition-colors hover:text-ink">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-8 border-t border-ink/15">
      {items.map((b) => (
        <li
          key={b}
          className="fs-body-m border-b border-ink/15 py-4 text-ink/80"
        >
          {b}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* «feature» — решения                                                 */
/* ------------------------------------------------------------------ */

function FeatureBody({ page }: { page: ContentPage }) {
  return (
    <>
      {/* Полноширинный слот: по мере скролла плавно уходит влево */}
      <FxDrift to="left" amount={6}>
        <MediaSlot ratio="21/9" className="mt-16" />
      </FxDrift>

      <div className="mt-28 lg:ml-[12%]">
        {page.sections.map((s, i) => (
          <section key={s.heading} className="mb-24 max-w-[62ch]">
            <FxUp>
              <span className="fs-label font-medium text-ink/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="type-display fs-display-s mt-3">{s.heading}</h2>
              <p className="fs-body-m mt-5 text-ink/70">{s.body}</p>
              {s.bullets && <Bullets items={s.bullets} />}
            </FxUp>

            {i === 1 && (
              <FxSide side="right">
                <MediaSlot ratio="16/9" className="mt-12" />
              </FxSide>
            )}
          </section>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* «compact» — услуги                                                  */
/* ------------------------------------------------------------------ */

function CompactBody({ page }: { page: ContentPage }) {
  return (
    <div className="mt-20 lg:ml-[12%]">
      {page.sections.map((s, i) => (
        <section
          key={s.heading}
          className="mb-16 border-t border-ink/15 pt-10 lg:flex lg:gap-16"
        >
          {/* FxUp на колонке целиком — иначе сломается lg:sticky внутри */}
          <FxUp className="lg:w-[30%] lg:shrink-0">
            <h2 className="type-display fs-display-s lg:sticky lg:top-[130px]">
              {s.heading}
            </h2>
          </FxUp>

          <div className="mt-5 max-w-[56ch] lg:mt-0 lg:flex-1">
            <FxUp delay={0.08}>
              <p className="fs-body-m text-ink/70">{s.body}</p>
              {s.bullets && <Bullets items={s.bullets} />}
            </FxUp>

            {i === 0 && (
              <FxSide side="right">
                <MediaSlot ratio="16/9" className="mt-10" />
              </FxSide>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* «editorial» — About                                                 */
/* ------------------------------------------------------------------ */

function EditorialBody({ page }: { page: ContentPage }) {
  return (
    <div className="mt-24">
      {/* Портретный слот на выносе справа, текст обтекает его слева */}
      <div className="lg:ml-[12%] lg:flex lg:items-start lg:gap-20">
        <div className="lg:flex-1">
          {page.sections.map((s, i) => (
            <section
              key={s.heading}
              className="mb-20 max-w-[58ch] border-t border-ink/15 pt-10 first:border-t-0 first:pt-0"
            >
              <FxUp>
                <h2 className="type-display fs-display-s">{s.heading}</h2>
                {/* Первый абзац раздела крупнее — вход в текст */}
                <p
                  className={`mt-5 text-ink/70 ${
                    i === 0 ? "fs-body-l" : "fs-body-m"
                  }`}
                >
                  {s.body}
                </p>
                {s.bullets && <Bullets items={s.bullets} />}
              </FxUp>
            </section>
          ))}
        </div>

        <FxSide side="right" className="lg:w-[30%] lg:shrink-0">
          <MediaSlot ratio="3/4" className="lg:sticky lg:top-[130px]" />
        </FxSide>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* «technical» — Technology Services                                   */
/* ------------------------------------------------------------------ */

function TechnicalBody({ page }: { page: ContentPage }) {
  return (
    <>
      {/* Тёмная полоса на всю ширину: раздел ощутимо отличается тоном */}
      <div className="mt-20 bg-ink py-24 text-cream">
        <div className="px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:ml-[12%] lg:grid-cols-3">
            {page.sections.map((s, i) => (
              <FxUp key={s.heading} delay={i * 0.08}>
                <article className="border-t border-cream/25 pt-6">
                  <span className="fs-label font-medium text-cream/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="type-display fs-display-s mt-3">{s.heading}</h2>
                  <p className="fs-body-m mt-4 text-cream/70">{s.body}</p>
                  {s.bullets && (
                    <ul className="mt-6 border-t border-cream/20">
                      {s.bullets.map((b) => (
                        <li
                          key={b}
                          className="fs-label border-b border-cream/20 py-3 text-cream/80"
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </FxUp>
            ))}
          </div>
        </div>
      </div>

      {/* Широкий слот после тёмной полосы — визуальная пауза */}
      <FxDrift to="right" amount={5}>
        <MediaSlot ratio="21/9" className="mt-20" />
      </FxDrift>
    </>
  );
}

/* ------------------------------------------------------------------ */

export default function PageShell({
  page,
  trail,
  related,
  layout = "feature",
  locale,
  dict,
}: {
  page: ContentPage;
  trail: { label: string; href: string }[];
  /** Соседние страницы того же раздела — внутренняя перелинковка для SEO. */
  related?: { label: string; href: string }[];
  layout?: ShellLayout;
  locale: Locale;
  dict: Dict;
}) {
  const wideTitle = layout === "feature" || layout === "editorial";
  // Тон страницы задаётся макетом — разделы не читаются как один шаблон
  const bg =
    layout === "editorial" ? "bg-cream" : layout === "technical" ? "bg-mist" : "bg-mist";

  return (
    <main className={`${bg} pt-[100px]`}>
      <article className="pb-32 pt-24">
        <div className="px-6 lg:px-10">
          <div className="lg:ml-[12%]">
            <Crumb trail={trail} />
            {/* Шапка страницы выпрыгивает каскадом: лейбл → заголовок → лид */}
            <FxUp>
              <p className="fs-label font-medium text-ink/60">{page.eyebrow}</p>
            </FxUp>
            <FxUp delay={0.08}>
              <h1
                className={`type-display mt-5 ${
                  wideTitle
                    ? "fs-display-m max-w-[20ch]"
                    : "fs-display-s max-w-[26ch]"
                }`}
              >
                {page.title}
              </h1>
            </FxUp>
            <FxUp delay={0.16}>
              <p className="fs-body-l mt-8 max-w-[52ch] text-ink/70">
                {page.lede}
              </p>
            </FxUp>
          </div>
        </div>

        {layout === "feature" && <FeatureBody page={page} />}
        {layout === "compact" && (
          <div className="px-6 lg:px-10">
            <CompactBody page={page} />
          </div>
        )}
        {layout === "editorial" && (
          <div className="px-6 lg:px-10">
            <EditorialBody page={page} />
          </div>
        )}
        {layout === "technical" && <TechnicalBody page={page} />}

        {/* Финал страницы — светлая полоса на всю ширину: двухтоновая
            композиция, страница не выглядит однотонной */}
        <div
          className={`mt-24 px-6 py-20 lg:px-10 ${
            layout === "editorial" ? "bg-mist" : "bg-cream"
          }`}
        >
          {related && related.length > 0 && (
            <FxUp className="lg:ml-[12%]">
              <h2 className="fs-label font-medium text-ink/60">
                {dict.common.alsoInThisArea}
              </h2>
              <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                {related.map((r) => (
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
          )}

          <FxUp delay={0.1} className="mt-16 lg:ml-[12%]">
            {/* Тот же swap, что у Connect: Link даёт клиентскую навигацию,
                Button внутри рендерится span'ом */}
            <Link
              href={href(locale, "/contact")}
              data-btn-hover
              className="inline-block"
            >
              <Button label={dict.common.startConversation} href={null} />
            </Link>
          </FxUp>
        </div>
      </article>

      <Footer locale={locale} dict={dict} />
    </main>
  );
}

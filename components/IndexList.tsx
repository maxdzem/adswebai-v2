import Link from "next/link";
import MediaSlot from "./MediaSlot";
import IconSwap from "./IconSwap";
import { FxUp, FxSide, FxDrift } from "./Fx";
import Footer from "./Footer";
import type { ContentPage } from "@/content/site";
import { href as L, type Locale } from "@/content/i18n";
import type { Dict } from "@/content/dict";

/**
 * Страница-указатель раздела. Два представления, чтобы /solutions
 * и /services не читались как одна и та же страница:
 *
 *  - "cards" — крупная сетка карточек с видео. Подходит, когда пунктов
 *    мало и каждый заслуживает веса (4 решения).
 *  - "rows"  — плотный список строк без медиа. Подходит, когда пунктов
 *    много и важна сканируемость (9 услуг).
 */

export type IndexDisplay = "cards" | "rows";

export default function IndexList({
  eyebrow,
  title,
  lede,
  base,
  items,
  display = "cards",
  locale,
  dict,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  /** Префикс роута без слеша на конце, напр. "/services". */
  base: string;
  items: ContentPage[];
  display?: IndexDisplay;
  locale: Locale;
  dict: Dict;
}) {
  return (
    // Разные тона у разделов: карточный вид (/solutions) — светлый cream,
    // строчный (/services) — серый mist. Разделы не выглядят под копирку.
    <main className={`${display === "cards" ? "bg-cream" : "bg-mist"} pt-[100px]`}>
      <div className="pb-32 pt-24">
        <div className="px-6 lg:px-10">
          <div className="lg:ml-[12%]">
            {/* Шапка выпрыгивает каскадом */}
            <FxUp>
              <p className="fs-label font-medium text-ink/60">{eyebrow}</p>
            </FxUp>
            <FxUp delay={0.08}>
              <h1 className="type-display fs-display-m mt-5 max-w-[20ch]">
                {title}
              </h1>
            </FxUp>
            <FxUp delay={0.16}>
              <p className="fs-body-l mt-8 max-w-[52ch] text-ink/70">{lede}</p>
            </FxUp>
          </div>
        </div>

        {display === "cards" ? (
          <>
            {/* Широкий слот на всю ширину — уходит влево по мере скролла */}
            <FxDrift to="left" amount={6}>
              <MediaSlot ratio="21/9" className="mt-16" />
            </FxDrift>

            <div className="px-6 lg:px-10">
              <ul className="mt-20 grid grid-cols-1 gap-x-8 gap-y-14 lg:ml-[12%] lg:grid-cols-2">
                {items.map((p, i) => (
                  <li key={p.slug}>
                    {/* Левая колонка въезжает слева, правая — справа */}
                    <FxSide side={i % 2 === 0 ? "left" : "right"}>
                      <Link
                        href={L(locale, `${base}/${p.slug}`)}
                        className="group block transition-opacity hover:opacity-70"
                      >
                        <MediaSlot ratio="4/3" />
                        <span className="fs-label mt-5 block font-medium text-ink/40">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="type-display fs-display-s mt-2 block">
                          {p.title}
                        </span>
                        <span className="fs-body-m mt-3 block text-ink/70">
                          {p.lede}
                        </span>
                      </Link>
                    </FxSide>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="px-6 lg:px-10">
            {/* Плотный список: без медиа, ставка на скорость просмотра.
                Строки выпрыгивают по одной при входе во вьюпорт */}
            <ul className="mt-20 border-t border-ink/15 lg:ml-[12%]">
              {items.map((p, i) => (
                <li key={p.slug} className="border-b border-ink/15">
                  <FxUp>
                    {/* data-btn-hover: swap стрелки при ховере всей строки */}
                    <Link
                      href={L(locale, `${base}/${p.slug}`)}
                      data-btn-hover
                      className="group flex flex-col gap-2 py-7 transition-colors hover:bg-ink/[0.03] lg:flex-row lg:items-center lg:gap-10"
                    >
                      <span className="fs-label shrink-0 font-medium text-ink/40 lg:w-10">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="type-display fs-display-s shrink-0 lg:w-[32%]">
                        {p.title}
                      </span>
                      <span className="fs-body-m max-w-[52ch] text-ink/70 lg:flex-1">
                        {p.lede}
                      </span>
                      <IconSwap size={32} iconSize={12} />
                    </Link>
                  </FxUp>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Footer locale={locale} dict={dict} />
    </main>
  );
}

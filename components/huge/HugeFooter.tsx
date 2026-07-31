"use client";

import { FOOTER } from "./data";
import { ArrowUp } from "./icons";

/**
 * Футер Huge: слева подписка, справа четыре колонки ссылок, ниже —
 * копирайт и кнопка «Back to top» в рамке.
 *
 * Ссылки подчёркнуты не по умолчанию, а наоборот: у Huge на
 * `v2__link--reveal` черта появляется под курсором (см. app/huge.css).
 * На телефоне подчёркивания нет вовсе — поэтому класс под xl:.
 *
 * Форма подписки без эндпоинта: submit просто гасится. У Huge на этом
 * месте встроенная форма из их CRM.
 */
export default function HugeFooter() {
  return (
    <footer className="relative bg-huge-black py-[40px] text-huge-white xl:py-[64px]">
      <div className="v2__grid">
        <div className="col-span-full mb-[56px] md:col-span-5 xl:col-span-6 xl:mb-0">
          <h2 className="t__l w-full max-w-[281px] md:max-w-[348px] xl:max-w-[394px]">
            {FOOTER.newsletterHeading}
          </h2>
          <form
            className="mt-[32px] flex w-full flex-col gap-y-[16px] xl:mt-[40px]"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder={FOOTER.newsletterPlaceholder}
              className="t__body border-b border-huge-border bg-transparent py-[12px] outline-none transition-colors placeholder:text-huge-footnote focus:border-huge-magenta"
            />
            <button
              type="submit"
              className="t__body self-start bg-huge-white px-[40px] py-[16px] text-huge-black transition-colors hover:bg-huge-green"
            >
              {FOOTER.newsletterSubmit}
            </button>
          </form>
        </div>

        {FOOTER.columns.map((col, i) => (
          <div
            key={col.title}
            className={`col-span-2 mb-[40px] flex flex-col md:row-start-2 md:mb-0 xl:col-span-3 xl:row-start-auto ${
              i === 0 ? "xl:col-start-9" : ""
            }`}
          >
            <h3 className="t__body font-medium text-huge-footnote">{col.title}</h3>
            <ul className="t__body mt-[24px] flex w-full flex-col gap-y-[16px] xl:mt-[40px]">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="xl:v2__link xl:v2__link--reveal"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="v2__grid__column-gap col-span-full mt-[56px] flex items-end justify-between xl:mt-[80px]">
          <p className="t__caption w-full max-w-[179px] text-huge-footnote md:max-w-full">
            {FOOTER.copyright}
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="t__body flex min-h-[48px] min-w-[109px] shrink-0 items-center gap-x-[8px] border border-current px-[24px] py-[12px] text-huge-white xl:min-h-[64px] xl:px-[40px] xl:py-[20px]"
          >
            <span className="xl:hidden">{FOOTER.backToTop.short}</span>
            <span className="hidden xl:inline-block">{FOOTER.backToTop.long}</span>
            <ArrowUp className="size-[24px]" />
          </button>
        </div>
      </div>
    </footer>
  );
}

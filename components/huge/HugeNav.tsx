"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { NAV } from "./data";
import CubeButton from "./CubeButton";
import { Cross } from "./icons";

gsap.registerPlugin(useGSAP);

/**
 * Шапка порта: розовый квадрат «Huge», раскрывающееся меню и кнопка-куб
 * «Let's talk» справа.
 *
 * Меню у Huge выезжает ИЗ-ПОД квадрата с логотипом: на десктопе список
 * разъезжается вправо (clip-path/ширина), на телефоне падает вниз. Пункты
 * проявляются друг за другом. Кнопка «Menu» на своём месте меняется на
 * крестик.
 *
 * Отступ сверху не как в оригинале (24/40px): над портом остаётся своя
 * шапка сайта высотой 100px — иначе две панели наложились бы друг на
 * друга. Если шапку сайта на этой странице убрать, вернуть можно
 * top-[24px] md:top-[40px].
 */
const TOP_OFFSET = "top-[112px] md:top-[128px]";

export default function HugeNav({ onOpenContact }: { onOpenContact: () => void }) {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      const list = root.current?.querySelector<HTMLElement>("[data-nav-list]");
      if (!list) return;

      const items = list.querySelectorAll("[data-nav-link]");

      // От 1280px список стоит в потоке справа от розового квадрата и
      // раскрывается по ширине; ниже — падает вниз и раскрывается по
      // высоте. Анимировать нужно именно размер, а не только
      // прозрачность: закрытый список НЕ должен занимать место, иначе
      // он отталкивает кнопку «Menu» от логотипа.
      const horizontal = window.matchMedia("(min-width: 1280px)").matches;
      const axis = horizontal ? "width" : "height";
      const cross = horizontal ? "height" : "width";

      if (open) {
        // Раскрываемую ось меряем при снятых ограничениях: у закрытого
        // списка оба размера нулевые, и scrollWidth в этом состоянии
        // соврал бы.
        gsap.set(list, { visibility: "visible", opacity: 1, width: "auto", height: "auto" });
        const full = horizontal ? list.offsetWidth : list.offsetHeight;

        gsap.set(list, { [cross]: "auto" });
        gsap.fromTo(
          list,
          { [axis]: 0 },
          { [axis]: full, duration: 0.5, ease: "power3.out" }
        );
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.05, delay: 0.15 }
        );
      } else {
        gsap.to(items, { autoAlpha: 0, duration: 0.2 });
        gsap.to(list, {
          [axis]: 0,
          duration: 0.35,
          ease: "power2.in",
          onComplete: () =>
            gsap.set(list, {
              visibility: "hidden",
              opacity: 0,
              width: 0,
              height: 0,
            }),
        });
      }
    },
    { dependencies: [open], scope: root }
  );

  return (
    <header
      ref={root}
      className={`v2__grid pointer-events-none fixed left-0 ${TOP_OFFSET} z-50 w-full`}
    >
      <nav className="pointer-events-none col-span-full flex justify-between">
        <div className="pointer-events-auto">
          <div className="t__body relative flex">
            {/* Розовый квадрат: наверх страницы */}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="relative z-[10]"
            >
              <div className="t__body flex size-[56px] shrink-0 items-center justify-center bg-huge-magenta text-huge-black md:size-[64px]">
                {NAV.brand}
              </div>
            </button>

            <ul
              data-nav-list
              // h-0 w-0 в начальном состоянии: до первого запуска GSAP
              // список не должен занимать места в потоке
              className="invisible absolute top-full flex h-0 w-0 flex-col overflow-hidden bg-[#1B1E23] text-huge-white opacity-0 xl:relative xl:top-auto xl:flex-row"
            >
              {NAV.items.map((item) => (
                <li key={item.label} className="t__body group">
                  <a
                    data-nav-link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="relative flex h-[56px] w-full items-center whitespace-nowrap px-[12px] py-[16px] transition-colors group-hover:text-huge-magenta xl:h-[64px] xl:px-[24px] xl:py-[20px]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* «Menu» ↔ крестик. Обе подписи лежат друг на друге и
                переключаются прозрачностью — квадрат не меняет размер. */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Menu"
              className="relative flex size-[56px] shrink-0 items-center justify-center bg-huge-white text-huge-black transition-colors duration-500 ease-in-out md:size-[64px]"
            >
              <span className={open ? "opacity-0" : "opacity-100"}>Menu</span>
              <span
                className={`absolute inset-0 flex h-full w-full items-center justify-center bg-[#424A53] text-huge-white transition-opacity duration-300 ${
                  open ? "opacity-100" : "opacity-0"
                }`}
              >
                <Cross />
              </span>
            </button>
          </div>
        </div>

        <div className="pointer-events-auto">
          <CubeButton
            label={NAV.cta.front}
            hoverLabel={NAV.cta.bottom}
            back={NAV.cta.back}
            top={NAV.cta.top}
            onClick={onOpenContact}
            className="w-[56px] md:w-auto md:min-w-[186px]"
            labelClassName="hidden md:inline-block"
            frontClassName="bg-huge-white text-huge-black"
            hoverClassName="bg-huge-green text-huge-black"
          />
        </div>
      </nav>
    </header>
  );
}

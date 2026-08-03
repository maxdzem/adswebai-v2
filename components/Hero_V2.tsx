"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import LazyVideo from "./LazyVideo";
import type { Dict } from "@/content/dict";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Hero второй версии: заголовок собирается из расфокуса, фон уезжает
 * параллаксом, сетка точек дышит вместе с ним.
 *
 * Пока НЕ подключён в app/[lang]/page.tsx — там по-прежнему Hero.tsx.
 * Ставится заменой одной строки, когда наиграетесь.
 *
 * Что здесь принципиально иначе, чем в Hero.tsx:
 *
 *  1. Заголовок разбит на слова, и каждое проявляется из блюра со сдвигом.
 *     Разбивка сделана в JSX, без SplitText: слова остаются настоящим
 *     текстом — выделяются мышью, читаются скринридером подряд и попадают
 *     в поиск. Плагин ради этого не нужен.
 *
 *  2. Стартовое состояние ставится gsap.set() ВНУТРИ useGSAP, а не классом
 *     в разметке. useGSAP работает на useLayoutEffect, то есть до первой
 *     отрисовки, — заголовок не успевает мигнуть чётким. Обратная сторона:
 *     если бы состояние пряталось через CSS, при выключенных анимациях
 *     текст остался бы невидимым навсегда. Отсюда пункт 3.
 *
 *  3. Всё движение живёт внутри gsap.matchMedia() и строится только при
 *     (prefers-reduced-motion: no-preference). Кому движение не нужно —
 *     тот получает готовый статичный экран, а не пустой.
 */
export default function Hero_V2({
  dict,
  videoSrc = "/AdsWebAI-Sizzle_1280x720.mp4",
}: {
  dict: Dict;
  /** Заглушка под фон: подменяется на любой ролик без правок компонента. */
  videoSrc?: string;
}) {
  const root = useRef<HTMLElement>(null);

  // contextSafe нужен для анимаций, которые запускаются ПОСЛЕ выполнения
  // хука — из onClick. Такие твины не попадают в контекст сами и не были
  // бы вычищены при размонтировании.
  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Стартовое состояние: слова размыты и приспущены, фон чуть крупнее
        // (чтобы параллаксу было куда двигаться, не открывая краёв).
        gsap.set("[data-word]", { autoAlpha: 0, y: 44, filter: "blur(14px)" });
        gsap.set("[data-hero-bg]", { scale: 1.12 });
        gsap.set("[data-hero-cue]", { autoAlpha: 0, y: 24 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.to("[data-hero-bg]", { scale: 1, duration: 1.8, ease: "expo.out" }, 0)
          .to(
            "[data-word]",
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1.2,
              stagger: 0.075,
              // Снимаем will-change сразу после появления: оставленный
              // навсегда, он держит для каждого слова отдельный слой
              // композитинга и жрёт память на длинных заголовках.
              onComplete: () => gsap.set("[data-word]", { willChange: "auto" }),
            },
            0.35
          )
          .to("[data-hero-cue]", { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.55");

        // Параллакс: фон уходит медленнее страницы, заголовок — быстрее.
        // scrub привязывает движение к позиции скролла, а не проигрывает
        // его разово: именно это читается как «дорого».
        gsap.to("[data-hero-bg]", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 },
        });

        gsap.to("[data-hero-copy]", {
          yPercent: -12,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "60% top", scrub: 1 },
        });

        // Сетка точек сдвигается на свой шаг — рисунок «дышит», а не ползёт.
        gsap.to("[data-hero-grid]", {
          backgroundPositionY: "32px",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 },
        });

        // Подсказка «Scroll» не нужна, как только человек поехал вниз.
        gsap.to("[data-hero-cue]", {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { start: 10, end: 160, scrub: true },
        });

        return () => {
          // matchMedia сам вернёт стили при смене настройки ОС.
        };
      });
    },
    { scope: root }
  );

  /**
   * Клик по подсказке — короткий отскок и мягкая доводка к следующей секции.
   *
   * Цель приходит аргументом, а не читается из root.current внутри: функция
   * передаётся в contextSafe() во время рендера, и правило react-hooks/refs
   * справедливо запрещает замыкать ref в том, что вызывается на этом этапе.
   * Сам ref читается в обработчике onClick ниже — там это разрешено.
   */
  const scrollOn = contextSafe((next: HTMLElement | null) => {
    gsap.to("[data-cue-arrow]", {
      y: 12,
      duration: 0.22,
      ease: "power2.in",
      yoyo: true,
      repeat: 1,
    });

    // scrollTo средствами браузера, а не GSAP: страницу ведёт Lenis
    // (см. components/SmoothScroll.tsx), и два аниматора, тянущие одну
    // и ту же позицию, дерутся друг с другом.
    next?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  const line1 = dict.hero.line1.split(" ");
  const line2 = dict.hero.line2.split(" ");

  return (
    // id="hero" обязателен: по нему Header понимает, что под ним видео,
    // и остаётся прозрачным (см. components/Header.tsx).
    <section id="hero" ref={root} className="relative h-[100svh] overflow-hidden bg-ink">
      {/* Заглушка под фон. Обёртка отдельно от <video>: параллакс двигает
          именно её, а внутренняя разметка ролика остаётся нетронутой. */}
      <div data-hero-bg className="absolute inset-0 will-change-transform">
        <LazyVideo src={videoSrc} eager className="h-full w-full object-cover" />
      </div>

      {/* Затемнение — чтобы белый заголовок держал контраст на любом кадре. */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Сетка точек: чистый CSS, без картинки и без запроса. */}
      <div
        data-hero-grid
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(rgb(255 255 255 / 0.16) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 78%)",
        }}
      />

      <div
        data-hero-copy
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white"
      >
        <h1 className="type-display max-w-[18ch]">
          {/* Каждая строка — свой блок, слова внутри inline-block: трансформ
              и фильтр не действуют на inline-элементы. */}
          <span className="fs-display-l block font-black">
            {line1.map((word, i) => (
              <span key={`${word}-${i}`} className="inline-block will-change-[filter,transform]">
                <span data-word className="inline-block">
                  {word}
                </span>
                {i < line1.length - 1 && " "}
              </span>
            ))}
          </span>
          <span className="fs-display-l block font-serif font-medium tracking-normal">
            {line2.map((word, i) => (
              <span key={`${word}-${i}`} className="inline-block will-change-[filter,transform]">
                <span data-word className="inline-block">
                  {word}
                </span>
                {i < line2.length - 1 && " "}
              </span>
            ))}
          </span>
        </h1>
      </div>

      {/* Кнопка, а не div: подсказка кликабельна и доступна с клавиатуры. */}
      <button
        type="button"
        data-hero-cue
        onClick={() => scrollOn(root.current?.nextElementSibling as HTMLElement | null)}
        className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2 text-white outline-offset-8"
      >
        <span className="fs-body-l inline-block font-serif italic tracking-wide">
          {dict.hero.scroll}
        </span>
        <svg
          data-cue-arrow
          width="30"
          height="46"
          viewBox="0 0 30 46"
          fill="none"
          className="mx-auto mt-1"
          aria-hidden
        >
          <path d="M6 2c13 9 19 19 12 36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M11 33l6.5 8 6-8.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </section>
  );
}

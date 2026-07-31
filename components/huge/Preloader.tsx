"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PRELOADER } from "./data";

gsap.registerPlugin(useGSAP);

/**
 * Заставка Huge. Слои и их имена — из разметки оригинала
 * (js-number, js-hello, js-we-are, js-slices, js-blinking-square):
 *
 *   1. счётчик 0% → 100% на весь экран (38vw);
 *   2. «Hello» и розовый квадрат с подписью «AI-native.»;
 *   3. подпись сменяется на «HATs.», «Hello» — на «We are»;
 *   4. три полосы уезжают вверх и открывают страницу.
 *
 * Пока заставка на экране, скролл заблокирован — иначе страница уедет
 * под ней и первый экран человек не увидит.
 *
 * Заставка проигрывается при каждом входе на страницу, как у Huge.
 * Клик по ней досматривать не обязательно — она сразу закрывается.
 * При prefers-reduced-motion её нет вовсе.
 */
export default function Preloader() {
  const root = useRef<HTMLElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        setDone(true);
        return;
      }

      // Скролл на паузе, пока идёт заставка. html, а не body: Lenis
      // крутит именно документ.
      const html = document.documentElement;
      const prevOverflow = html.style.overflow;
      html.style.overflow = "hidden";

      const finish = () => {
        html.style.overflow = prevOverflow;
        setDone(true);
      };

      const counter = { value: 0 };
      const number = el.querySelector<HTMLElement>("[data-number]");

      const tl = gsap.timeline({ onComplete: finish });

      tl.set("[data-hello]", { autoAlpha: 0 })
        .set("[data-we-are]", { autoAlpha: 0 })
        .set("[data-square]", { autoAlpha: 0 })
        .set("[data-tag='0']", { autoAlpha: 0 })
        .set("[data-tag='1']", { autoAlpha: 0 })
        .set("[data-slices]", { autoAlpha: 0, scaleY: 1 })

        // 1. Счётчик. onUpdate пишет в DOM напрямую — состояние React
        // на шестидесяти кадрах в секунду держать незачем.
        .to(counter, {
          value: 100,
          duration: 1.5,
          ease: "power1.inOut",
          onUpdate: () => {
            if (number) number.textContent = `${Math.round(counter.value)}%`;
          },
        })
        .to("[data-number]", { autoAlpha: 0, duration: 0.3 }, "+=0.1")

        // 2. «Hello» и розовый квадрат
        .to("[data-hello]", { autoAlpha: 1, duration: 0.4 })
        .to("[data-square]", { autoAlpha: 1, duration: 0.3 }, "<")
        .to("[data-tag='0']", { autoAlpha: 1, duration: 0.25 }, "<+0.15")

        // 3. Подмена подписей
        .to("[data-hello]", { autoAlpha: 0, duration: 0.3 }, "+=0.5")
        .to("[data-tag='0']", { autoAlpha: 0, duration: 0.25 }, "<")
        .to("[data-we-are]", { autoAlpha: 1, duration: 0.3 }, "<+0.1")
        .to("[data-tag='1']", { autoAlpha: 1, duration: 0.25 }, "<")

        // 4. Занавес: три полосы схлопываются к верху и уносят заставку
        .to("[data-slices]", { autoAlpha: 1, duration: 0.01 }, "+=0.45")
        .to("[data-we-are]", { autoAlpha: 0, duration: 0.25 }, "<")
        .to("[data-tag='1']", { autoAlpha: 0, duration: 0.25 }, "<")
        .to("[data-slices]", {
          scaleY: 0,
          transformOrigin: "top",
          duration: 0.8,
          ease: "power3.inOut",
        })
        .to(
          ["[data-bg]", "[data-foreground]"],
          { autoAlpha: 0, duration: 0.5, ease: "power2.out" },
          "<+0.15"
        );

      // Клик — досмотреть не обязательно.
      const skip = () => {
        tl.progress(1);
        tl.kill();
        finish();
      };
      el.addEventListener("click", skip);

      return () => {
        el.removeEventListener("click", skip);
        html.style.overflow = prevOverflow;
      };
    },
    { scope: root }
  );

  if (done) return null;

  return (
    <section
      ref={root}
      aria-hidden
      className="fixed inset-0 top-0 z-[100] grid h-screen w-full cursor-pointer items-center justify-items-center leading-none text-huge-white"
    >
      <div data-bg className="absolute inset-0 h-full w-full bg-huge-black" />

      <span
        data-number
        className="absolute inset-0 flex h-full w-full items-center justify-center text-[38vw] leading-none tracking-[-0.03em]"
      >
        0%
      </span>

      <div data-foreground className="absolute inset-0 h-full w-full bg-huge-black/90" />

      {/* Три полосы с волосяными зазорами — тот же занавес, что у Huge */}
      <div
        data-slices
        className="absolute inset-0 grid h-full w-full origin-bottom grid-cols-[1fr_0.35vw_1fr]"
      >
        <div className="relative bg-[#191919]" />
        <div className="relative bg-[#191919]" />
        <div className="relative bg-[#191919]" />
      </div>

      <p
        data-hello
        className="absolute inset-0 flex h-full w-full items-center justify-center text-center text-[10vw] tracking-[-0.03em]"
      >
        {PRELOADER.hello}
      </p>

      <p
        data-we-are
        className="absolute inset-0 flex h-full w-full translate-x-[-0.03em] items-center justify-center gap-[0.25em] text-center text-[10vw] tracking-[-0.03em]"
      >
        {PRELOADER.weAre.map((w) => (
          <span key={w} className="relative inline-block">
            {w}
          </span>
        ))}
      </p>

      <div data-square className="absolute top-[61px]">
        <div className="relative flex items-center gap-x-[5px]">
          <div className="size-[12px] bg-huge-magenta" />
          {/* Обе подписи лежат в одной клетке грида — сменяются на месте,
              строка не дёргается по ширине */}
          <div className="relative grid items-center justify-center text-[16px] tracking-[-0.03em]">
            {PRELOADER.tags.map((t, i) => (
              <p key={t} data-tag={i} className="col-start-1 row-start-1">
                {t}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CASE_STUDY, CTA_BAND } from "./data";
import CubeButton from "./CubeButton";
import { Cross } from "./icons";

gsap.registerPlugin(useGSAP);

/**
 * Кейс, который открывается по клику на карточку в «Our work».
 *
 * Раскладка оригинала: слева липкая колонка на весь экран с четырьмя
 * кадрами, справа — колонка с текстом (bg #F2F8FE, максимум 936px).
 * Кадры не перелистываются, а перекрываются по прогрессу прокрутки:
 * у Huge на каждой figure стоит
 *   opacity: calc((var(--scroll-progress) - 0.25) / 0.12)
 * то есть второй кадр начинает проявляться на 25% прокрутки и выходит
 * в полную непрозрачность за 12%. Те же формулы оставлены здесь —
 * переменную --scroll-progress пишет обработчик ниже.
 *
 * Прогресс считается по прокрутке САМОЙ панели, а не страницы: панель
 * своя область прокрутки (overflow-y-auto), страница под ней стоит.
 */
export default function CaseStudyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!root.current) return;

      if (open) {
        gsap.set(root.current, { autoAlpha: 1 });
        gsap.fromTo(
          root.current,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.7, ease: "power3.out" }
        );
        // Панель открывается всегда с начала
        if (scroller.current) scroller.current.scrollTop = 0;
      } else {
        gsap.to(root.current, {
          yPercent: 100,
          duration: 0.45,
          ease: "power2.in",
          onComplete: () => gsap.set(root.current, { autoAlpha: 0 }),
        });
      }
    },
    { dependencies: [open], scope: root }
  );

  // Прогресс прокрутки панели → CSS-переменная. Пишем в style напрямую:
  // на каждом кадре прокрутки перерисовывать React незачем.
  useEffect(() => {
    const el = scroller.current;
    if (!open || !el) return;

    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? el.scrollTop / max : 0;
      el.style.setProperty("--scroll-progress", String(p));
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <div
      ref={root}
      className="invisible fixed inset-0 z-[95] opacity-0"
      role="dialog"
      aria-modal="true"
      aria-label={CASE_STUDY.client}
    >
      <div
        ref={scroller}
        className="h-full w-full overflow-y-auto overflow-x-hidden overscroll-contain bg-huge-black"
      >
        <article className="relative flex w-full">
          {/* Липкая колонка с кадрами. Ниже 1280px её нет — как у Huge */}
          <div className="sticky top-0 hidden h-screen w-full xl:block">
            {CASE_STUDY.images.map((src, i) => (
              <figure
                key={src}
                className="absolute inset-0 h-full w-full"
                style={{
                  // Первый кадр виден сразу, остальные вступают по прогрессу
                  opacity:
                    i === 0
                      ? 1
                      : `calc((var(--scroll-progress, 0) - ${(
                          i * 0.25
                        ).toFixed(2)}) / 0.12)`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </figure>
            ))}
          </div>

          {/* Колонка с текстом */}
          <div className="relative w-full shrink-0 grow bg-[#F2F8FE] text-huge-black xl:max-w-[936px]">
            {/* Липкая шапка кейса: полоса прогресса + название + закрыть */}
            <div className="v2__grid__padding sticky top-0 z-50 flex items-center justify-between py-[24px] backdrop-blur-lg md:py-[40px]">
              <div
                className="absolute left-0 top-0 h-full w-full origin-left bg-huge-white"
                style={{ transform: "scaleX(var(--scroll-progress, 0))" }}
              />
              <div className="relative flex items-center gap-x-[16px] xl:gap-x-[24px]">
                <div className="t__body flex size-[56px] shrink-0 items-center justify-center bg-huge-black text-huge-white xl:size-[64px]">
                  {CASE_STUDY.client.slice(0, 1)}
                </div>
                <span className="t__subtitle py-[8px] pr-[16px] xl:pr-[24px] xl:after:content-['_—']">
                  {CASE_STUDY.tagline}
                </span>
              </div>

              <button type="button" onClick={onClose} className="relative flex">
                <span className="t__body flex size-[56px] items-center justify-center bg-huge-white text-huge-black md:size-[64px]">
                  Close
                </span>
                <span className="flex size-[56px] items-center justify-center bg-huge-black text-huge-white md:size-[64px]">
                  <Cross />
                </span>
              </button>
            </div>

            {/* Лид + услуги + обзор — по сетке 3.75fr / 6.25fr, как в оригинале */}
            <div className="v2__grid__padding grid w-full grid-cols-1 py-[40px] md:grid-cols-[3.75fr_6.25fr] md:gap-x-[24px] md:pb-[56px] md:pt-[24px] xl:grid-cols-[4.1fr_5.9fr] xl:gap-x-[64px] xl:pb-[64px] xl:pt-[72px]">
              <h1 className="t__l col-span-full mb-[16px] w-full">
                {CASE_STUDY.client}&nbsp;—
              </h1>
              <p className="t__l col-span-full">{CASE_STUDY.lede}</p>
            </div>

            <div className="v2__grid__padding grid w-full grid-cols-1 gap-y-[40px] pb-[64px] md:grid-cols-[3.75fr_6.25fr] md:gap-x-[24px] xl:grid-cols-[4.1fr_5.9fr] xl:gap-x-[64px]">
              <h2 className="t__subtitle w-full">Services&nbsp;—</h2>
              <ul className="t__body flex flex-col gap-y-[8px]">
                {CASE_STUDY.services.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>

              <h2 className="t__subtitle w-full">Overview&nbsp;—</h2>
              <p className="t__body">{CASE_STUDY.overview}</p>

              <h2 className="t__subtitle w-full">Results&nbsp;—</h2>
              <div className="flex flex-col gap-y-[40px]">
                {CASE_STUDY.results.map((r) => (
                  <div key={r.value}>
                    <h3 className="t__xxl">{r.value}</h3>
                    <p className="t__body mt-[8px] text-huge-graytext">{r.label}</p>
                  </div>
                ))}
              </div>

              <h2 className="t__subtitle w-full">{CASE_STUDY.closingCta}</h2>
              <div>
                <CubeButton
                  label={CASE_STUDY.closingButton}
                  onClick={onClose}
                  className="w-[200px] md:w-[244px]"
                />
              </div>
            </div>

            {/* Чёрная концовка кейса — та же полоса, что на главной */}
            <section className="v2__grid__padding grid w-full grid-cols-1 bg-huge-black py-[40px] text-huge-white md:grid-cols-[4.1fr_5.9fr] md:gap-x-[24px] xl:gap-x-[64px] xl:pb-[64px]">
              <div className="w-full">
                <span className="t__body mb-[24px] block md:mb-[16px] xl:mb-[24px]">
                  {CTA_BAND.eyebrow}
                </span>
                <h2 className="t__l">{CTA_BAND.heading}</h2>
              </div>
              <div className="mt-[56px] w-full md:mt-[120px]">
                <CubeButton
                  label={CASE_STUDY.closingButton}
                  onClick={onClose}
                  className="w-[200px] md:w-[244px]"
                  frontClassName="bg-huge-white text-huge-black"
                />
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}

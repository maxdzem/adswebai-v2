"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BELIEVE, HERO_BACKGROUNDS } from "./data";
import { ArrowUp } from "./icons";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * «We believe» — манифест на чёрном во весь экран.
 *
 * В оригинале секция высотой больше трёх экранов: фон (h-screen) стоит
 * липко, поверх него лежит контент, поднятый на mt-[-100vh], а дальше
 * пустые js-end-trigger и h-[120vh] дают запас прокрутки. Пока идёт
 * этот запас, заголовок стоит на месте, а абзацы проявляются по одному.
 *
 * Градиент снят из их инлайнового стиля: снизу прозрачный, к верху —
 * в чистый чёрный. Он гасит фоновый кадр под текстом.
 */
export default function SectionWeBelieve() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-believe-title]", {
          y: 100,
          autoAlpha: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
        });

        // Абзацы выходят один за другим по мере запаса прокрутки —
        // не разом, а с привязкой к колесу
        gsap.utils.toArray<HTMLElement>("[data-believe-p]").forEach((p, i) => {
          gsap.from(p, {
            y: 60,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: root.current,
              start: `top ${50 - i * 14}%`,
              once: true,
            },
          });
        });

        // Кадр за текстом медленно наезжает — параллакс на scrub
        gsap.to("[data-believe-bg]", {
          scale: 1.12,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="about"
      className="relative w-full bg-huge-black text-huge-white"
    >
      {/* Липкий фон: кадр + градиент, гасящий его к верху экрана */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-believe-bg
            src={HERO_BACKGROUNDS[0]}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div
            className="absolute inset-0 origin-top"
            style={{
              background:
                "linear-gradient(0deg, rgba(2,0,36,0) 0%, rgba(1,0,14,1) 39%, rgba(0,0,0,1) 100%)",
            }}
          />
        </div>
      </div>

      {/* Контент поднят на экран вверх — ровно поверх липкого фона */}
      <div className="v2__grid relative mt-[-100vh] h-full justify-between pt-[176px] md:pt-[248px]">
        <div className="v2__subgrid col-span-full mb-[264px] items-end">
          <h2 data-believe-title className="t__mega col-span-full">
            {BELIEVE.heading}
            <span className="hidden md:inline-block"> —</span>
          </h2>
        </div>

        <div className="v2__subgrid col-span-full">
          <div className="col-span-full md:col-span-5 md:col-start-4 xl:col-span-8 xl:col-start-13">
            <div className="flex w-full flex-col gap-y-[40px] md:gap-y-[64px] xl:gap-y-[88px]">
              {BELIEVE.paragraphs.map((p) => (
                <p key={p} data-believe-p className="t__l whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Запас прокрутки: пока он идёт, фон стоит, а текст доезжает */}
      <div className="h-[120vh]" />

      {/* Подсказка «Scroll to explore» — липкая плашка у нижней кромки */}
      <div className="pointer-events-none sticky bottom-[40px] z-40 mx-auto flex w-full justify-center">
        <div className="h-[64px] w-auto bg-transparent xl:border xl:border-huge-border xl:backdrop-blur-[2px]">
          <p className="t__body px-[24px] py-[20px]">
            {BELIEVE.hint}
            <ArrowUp className="ml-[8px] inline-block size-[16px] rotate-180 fill-huge-magenta" />
          </p>
        </div>
      </div>
    </section>
  );
}

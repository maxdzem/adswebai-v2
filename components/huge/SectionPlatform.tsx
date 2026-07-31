"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LIVE, PARTNERS } from "./data";
import { ArrowUp } from "./icons";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Чёрная полоса из двух движений, как у Huge: «Powered by LIVE» и сразу
 * под ней «And industry-leading alliances.» с сеткой партнёров.
 *
 * Обе секции живут на одном фоне и читаются как одна мысль — поэтому
 * лежат в одном файле.
 *
 * Клетки партнёров у Huge пустые: логотипы туда подставляет CMS, в
 * зеркале их нет. Здесь в клетках имена текстом — менять проще, а
 * геометрия (квадрат, рамка #424A53) та же.
 */
export default function SectionPlatform() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils
          .toArray<HTMLElement>("[data-reveal]")
          .forEach((el) =>
            gsap.from(el, {
              y: 60,
              autoAlpha: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            })
          );

        // Клетки партнёров проявляются волной — по строкам сетки
        gsap.from("[data-partner]", {
          autoAlpha: 0,
          y: 40,
          duration: 0.7,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-partners-list]",
            start: "top 85%",
            once: true,
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative bg-huge-black text-huge-white">
      {/* ── Powered by LIVE ─────────────────────────────────────────── */}
      <section className="v2__grid relative pt-[176px] md:pt-[248px]">
        <div className="relative z-[2] col-span-full mb-[112px] xl:col-span-14">
          <h3 data-reveal className="t__mega w-full max-w-[1176px] xl:whitespace-pre-line">
            {LIVE.heading}
          </h3>
        </div>

        <div className="relative col-span-full md:col-span-5 md:col-start-4 xl:col-span-8 xl:col-start-13">
          <div data-reveal className="relative z-0 mb-[56px] aspect-square size-[112px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LIVE.logo}
              alt={LIVE.heading}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
          <div data-reveal className="t__l flex w-full flex-col gap-y-[1em]">
            <div className="flex flex-col gap-[15px] lg:gap-[20px]">
              {LIVE.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Партнёрства ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[264px] md:pt-[400px] xl:pt-[584px]">
        <div className="v2__grid">
          <h3 data-reveal className="t__xxl col-span-full xl:col-span-14 xl:mt-0">
            {PARTNERS.heading}
          </h3>
          <p
            data-reveal
            className="t__l col-span-full mt-[112px] md:col-span-5 md:col-start-4 xl:col-span-8 xl:col-start-13"
          >
            {PARTNERS.lede}
          </p>

          <ul
            data-partners-list
            className="v2__grid__column-gap col-span-full mb-[88px] mt-[112px] grid grid-cols-2 gap-y-[24px] md:mt-[208px] md:grid-cols-4 xl:col-span-18 xl:col-start-3 xl:mb-[128px] xl:mt-[264px] xl:grid-cols-6"
          >
            {PARTNERS.items.map((name) => (
              <li key={name}>
                <div
                  data-partner
                  className="t__body flex aspect-square w-full items-center justify-center border border-huge-border px-[16px] text-center text-huge-footnote transition-colors duration-500 hover:border-huge-white hover:text-huge-white"
                >
                  {name}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 z-40 mx-auto flex w-full justify-center">
          <div className="h-[64px] w-auto bg-transparent xl:border xl:border-huge-border xl:backdrop-blur-[2px]">
            <p className="t__body px-[24px] py-[20px]">
              {PARTNERS.hint}
              <ArrowUp className="ml-[8px] inline-block size-[16px] rotate-180 fill-huge-magenta" />
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

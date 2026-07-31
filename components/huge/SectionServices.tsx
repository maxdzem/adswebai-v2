"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SERVICES, SERVICES_SECTION } from "./data";
import CubeButton from "./CubeButton";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * «What we do» — шесть услуг горизонтальной лентой на белом.
 *
 * У Huge лента шириной 600vw (шесть экранов по 100vw, см. переменные
 * --width-desktop / --total-width-desktop в их разметке): секция
 * прилипает, и колесо гонит ленту вбок. Ниже 1280px пина нет вовсе —
 * слайды просто идут вертикальным списком, как в оригинале.
 *
 * Лента едет на свою ширину (scrollWidth - clientWidth), а не на
 * xPercent: -100 * (n - 1): второй вариант верен только когда каждый
 * слайд ровно 100vw, а здесь между ними ещё зазор 40px, и на нём лента
 * не доехала бы до конца.
 */
export default function SectionServices() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Заголовок и лид — общий вход, он нужен на всех размерах
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-section-title]", {
          y: 80,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        });
        gsap.from("[data-section-lede]", {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        });
      });

      mm.add(
        "(min-width: 1280px) and (prefers-reduced-motion: no-preference)",
        () => {
          const el = track.current;
          const section = wrapper.current;
          if (!el || !section) return;

          const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);

          const tween = gsap.to(el, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              // Ход прокрутки равен пути ленты: она доезжает ровно
              // в момент, когда секция отлипает
              end: () => "+=" + distance(),
              pin: true,
              scrub: 1,
              // Ширина ленты зависит от вьюпорта и от подгруженных
              // картинок — пересчитываем на каждом refresh
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          return () => tween.kill();
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="services"
      className="relative w-full bg-huge-white text-huge-black"
    >
      <header className="v2__grid__padding relative py-[176px] md:pt-[248px] xl:pb-0">
        <div className="v2__subgrid mb-[112px]">
          <h2 data-section-title className="t__mega col-span-full">
            {SERVICES_SECTION.heading}
            <span className="hidden md:inline-block"> —</span>
          </h2>
        </div>
        <div className="v2__subgrid">
          <h3
            data-section-lede
            className="t__l col-span-4 md:col-span-5 md:col-start-4 xl:col-span-8 xl:col-start-13"
          >
            {SERVICES_SECTION.lede}
          </h3>
        </div>
      </header>

      <div ref={wrapper} className="relative">
        <div className="relative mb-[88px] mt-0 text-huge-black lg:mt-[200px] xl:mb-0 xl:overflow-hidden">
          <ul
            ref={track}
            className="flex w-full flex-col gap-0 xl:h-screen xl:w-max xl:flex-row xl:items-center xl:gap-[40px]"
          >
            {SERVICES.map((s) => (
              <li
                key={s.n}
                className="w-full pb-[144px] last:pb-0 xl:h-screen xl:w-screen xl:items-center xl:pb-0 xl:pt-0"
              >
                <div className="v2__grid h-full grid-rows-[auto_1fr] xl:grid-rows-[auto_1fr_auto]">
                  <div className="col-span-full xl:mb-[64px]">
                    <h2 className="t__xxl overflow-hidden break-words xl:overflow-visible xl:break-normal">
                      {s.title}
                      <span
                        aria-label={`Service number: ${s.n}`}
                        className="t__l ml-[10px] text-huge-graytext xl:align-top"
                      >
                        {s.n}
                      </span>
                    </h2>
                  </div>

                  <div className="relative col-span-full mt-12 aspect-video overflow-hidden xl:col-span-9 xl:row-start-2 xl:mt-0">
                    {/* Обычный <img>: картинки лежат на чужом CDN, гонять
                        их через оптимизатор next/image смысла нет */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>

                  <div className="col-span-full mt-[24px] w-full xl:col-span-8 xl:col-start-11 xl:row-start-2">
                    <p className="t__solid">{s.copy}</p>
                    <div className="pointer-events-auto col-span-full mt-5">
                      <CubeButton
                        label={SERVICES_SECTION.cta}
                        href={s.href}
                        icon="out"
                        className="min-w-[121px] md:min-w-[157px] xl:w-auto"
                      />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CUBE_FACES, IDEAS, IDEAS_SECTION } from "./data";
import CubeButton from "./CubeButton";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Ребро куба. Меньше, чем половина экрана: лента статей идёт прямо
 * поверх куба, и на крупном кубе белый заголовок налезал на светлые
 * грани (логотипы Nike и Google почти белые) и перестал читаться.
 */
const CUBE_SIZE = "min(34vw, 40vh)";

/**
 * Ideas — лента статей, которая едет поверх вращающегося куба.
 *
 * У Huge куб нарисован на WebGL (three.js, канвас в js-cube-container),
 * а на его гранях — шесть текстур: пять логотипов клиентов и одна
 * «рубашка». Здесь тот же куб собран на CSS-трансформах: смысл и вид
 * те же, а 600КБ three.js в бандл не попадают. Грани — те же файлы
 * с их CDN, см. CUBE_FACES в data.ts.
 *
 * Куб стоит липко (sticky), лента статей поднята на mt-[-100vh] и
 * лежит поверх: от 1280px она едет вбок (у Huge 340vw), ниже —
 * обычным вертикальным списком.
 *
 * Вращение куба и ход ленты снимаются с ОДНОГО скролла (scrub), поэтому
 * не могут разъехаться между собой.
 */
export default function SectionIdeas() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const cube = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-ideas-title]", {
          y: 90,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        });
        gsap.from("[data-ideas-body]", {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });

        // Куб проворачивается на полтора оборота за проход секции
        if (cube.current && stage.current) {
          gsap.fromTo(
            cube.current,
            { "--cube-ry": "0deg", "--cube-rx": "-20deg" },
            {
              "--cube-ry": "540deg",
              "--cube-rx": "20deg",
              ease: "none",
              scrollTrigger: {
                trigger: stage.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );
        }
      });

      // Горизонтальная лента — только на десктопе, как в оригинале
      mm.add(
        "(min-width: 1280px) and (prefers-reduced-motion: no-preference)",
        () => {
          const el = track.current;
          const section = stage.current;
          if (!el || !section) return;

          const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);

          const tween = gsap.to(el, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => "+=" + distance(),
              pin: true,
              scrub: 1,
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
      id="ideas"
      className="relative min-h-screen bg-huge-black pt-[176px] text-huge-white md:pt-[248px]"
    >
      <div className="overflow-x-clip">
        <div className="v2__grid mb-[88px] h-full justify-between xl:mb-[128px]">
          <div
            data-ideas-title
            className="v2__subgrid col-span-full mb-[112px] items-end"
          >
            <h2 className="t__mega col-span-full">
              {IDEAS_SECTION.heading}
              <span className="hidden md:inline-block"> —</span>
            </h2>
          </div>

          <div className="v2__subgrid col-span-full">
            <div
              data-ideas-body
              className="col-span-full md:col-span-5 md:col-start-4 xl:col-span-8 xl:col-start-13"
            >
              <div className="mb-[40px]">
                <p className="t__l whitespace-pre-line">{IDEAS_SECTION.lede}</p>
              </div>
              <CubeButton
                label={IDEAS_SECTION.cta}
                href={IDEAS_SECTION.href}
                className="z-50 w-[200px] md:w-[244px]"
                frontClassName="bg-huge-white text-huge-black"
              />
            </div>
          </div>
        </div>
      </div>

      <div ref={stage} className="relative">
        {/* Куб: липкий, во весь экран, под лентой */}
        <div className="pointer-events-none sticky top-0 z-0 h-screen overflow-hidden">
          <div className="flex h-full w-full items-end xl:items-center">
            <div className="flex h-[70%] w-full translate-y-[9%] items-center justify-center xl:h-full xl:translate-y-0">
              <div
                style={{
                  width: CUBE_SIZE,
                  height: CUBE_SIZE,
                  perspective: "1200px",
                }}
              >
                <div ref={cube} className="huge-cube relative h-full w-full">
                  {CUBE_FACES.map((src, i) => {
                    // Шесть граней: 4 по кругу + верх и низ
                    const rotations = [
                      "rotateY(0deg)",
                      "rotateY(90deg)",
                      "rotateY(180deg)",
                      "rotateY(-90deg)",
                      "rotateX(90deg)",
                      "rotateX(-90deg)",
                    ];
                    return (
                      <div
                        key={src}
                        className="huge-cube__face"
                        style={{
                          backgroundImage: `url(${src})`,
                          backgroundColor: "#111",
                          transform: `${rotations[i]} translateZ(calc(${CUBE_SIZE} / 2))`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Притеняющий слой поверх куба: без него белый текст ленты
              пропадал на светлых гранях. Куб при этом читается. */}
          <div className="absolute inset-0 bg-huge-black/45" />
        </div>

        {/* Лента статей поверх куба */}
        <div className="v2__grid relative z-10 mt-[-100vh] text-huge-white xl:max-h-screen xl:overflow-hidden">
          <div
            ref={track}
            className="col-span-full flex flex-col gap-0 pr-[40px] xl:h-screen xl:w-max xl:flex-row xl:items-center xl:gap-[40px] xl:pr-0"
          >
            {IDEAS.map((a) => (
              <div
                key={a.title}
                className="h-screen w-full pt-[144px] transition-opacity duration-700 ease-in-out xl:h-auto xl:w-[68vw] xl:pt-0"
              >
                <div className="max-w-[728px]">
                  <div>
                    <p className="t__subtitle">{a.topic}</p>
                    <h2 className="t__xl pointer-events-none mt-[16px] whitespace-pre-line">
                      {a.title}
                    </h2>
                  </div>
                  <div className="mt-[40px] flex md:mt-[64px]">
                    <CubeButton
                      label={a.cta}
                      href={a.href}
                      icon="out"
                      className="min-w-[121px] md:min-w-[157px] xl:w-auto"
                      frontClassName="bg-huge-white text-huge-black"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

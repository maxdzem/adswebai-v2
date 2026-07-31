"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CAREERS } from "./data";
import CubeButton from "./CubeButton";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Careers — белая секция: крупный заголовок, широкий кадр 16:9 с
 * потолком в 45vh и кнопка «See job openings».
 *
 * Кадр слегка наезжает по мере прокрутки (scale на scrub) — тот же
 * приём, что у Huge на этом блоке.
 */
export default function SectionCareers() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-careers-title]", {
          y: 90,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });
        gsap.from("[data-careers-body]", {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
        });
        gsap.fromTo(
          "[data-careers-image]",
          { scale: 1.14 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-careers-image]",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="careers"
      className="relative min-h-screen bg-huge-white pt-[176px] text-huge-black"
    >
      <div className="min-h-screen content-center">
        <div className="v2__grid">
          <div data-careers-title className="t__mega col-span-3 col-start-1 row-start-1 md:col-span-full">
            <h2>
              {CAREERS.heading}
              <span className="hidden md:inline-block"> —</span>
            </h2>
          </div>
        </div>

        <div className="v2__grid h-full grid-rows-1 items-start">
          <div className="relative col-span-full mt-[64px] aspect-video max-h-[45vh] overflow-hidden md:col-span-10 xl:mt-[112px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-careers-image
              src={CAREERS.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="col-span-full w-full md:col-span-10">
            <div
              data-careers-body
              className="t__l-v2 mb-[40px] mt-[64px] flex flex-col gap-y-[1em] xl:mt-[112px]"
            >
              <p className="t__l-v2">{CAREERS.copy}</p>
            </div>
            <CubeButton
              label={CAREERS.cta}
              href={CAREERS.href}
              className="z-50 w-[200px] md:w-[244px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

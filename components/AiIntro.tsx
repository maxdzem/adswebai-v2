"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Button from "./Button";

import type { Dict } from "@/content/dict";
import { href, type Locale } from "@/content/i18n";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AiIntro({ dict }: { dict: Dict }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-ai-block]").forEach((block) => {
        gsap.from(block, {
          y: 70,
          autoAlpha: 0,
          filter: "blur(10px)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: block, start: "top 82%", once: true },
        });
      });

      // Hand-drawn ellipse around "you" draws itself in
      gsap.from("[data-ai-ellipse]", {
        strokeDashoffset: 640,
        duration: 1.4,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: "[data-ai-ellipse]",
          start: "top 75%",
          once: true,
        },
      });

      // Оранжевый баннер: мягкий scrub-вход — подрастает и доезжает
      // на место по мере скролла, без резких порогов
      gsap.fromTo(
        "[data-flow-banner]",
        { y: 80, scale: 0.94 },
        {
          y: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-flow-banner]",
            start: "top 95%",
            end: "top 45%",
            scrub: 1,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="bg-cream px-6 pb-40 pt-16 lg:px-10">
      {/* Connect / What can we do for you? */}
      <div data-ai-block className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3 lg:col-start-2">
          <p className="fs-label font-medium">{dict.ai.connect}</p>
          <div className="mt-16">
            {/* Та же swap-анимация, что у Connect в шапке */}
            <Button label={dict.ai.reachOut} href="#connect" />
          </div>
        </div>
        <div className="lg:col-span-8">
          <h2 className="type-display fs-display-m">
            {dict.ai.question}{" "}
            <span className="relative inline-block">
              {dict.ai.questionYou}
              <svg
                className="pointer-events-none absolute -left-[14%] -top-[18%] h-[136%] w-[132%]"
                viewBox="0 0 200 100"
                fill="none"
                aria-hidden
              >
                <ellipse
                  data-ai-ellipse
                  cx="100"
                  cy="50"
                  rx="95"
                  ry="44"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray="640"
                  transform="rotate(-4 100 50)"
                />
              </svg>
            </span>
            ?
          </h2>
        </div>
      </div>

      {/* Our Agents / adswebai.flow */}
      <div
        data-ai-block
        className="mt-56 grid grid-cols-1 gap-10 lg:grid-cols-12"
      >
        <div className="lg:col-span-3">
          <p className="fs-label font-medium">{dict.ai.ourAgents}</p>
        </div>
        <div className="lg:col-span-7">
          <h3 className="type-display fs-display-m">
            {dict.ai.agentsHeading}
          </h3>
          <div className="mt-12 lg:pl-[14%]">
            {/* Та же swap-анимация, что у Connect в шапке */}
            <Button label={dict.ai.explore} href="#" />
          </div>
        </div>
      </div>

      {/* adswebai.flow product banner — вход привязан к скроллу (scrub) */}
      <div
        data-flow-banner
        className="mx-auto mt-28 h-[65vh] w-full max-w-[72%]"
        style={{
          background:
            "radial-gradient(120% 140% at 20% 0%, #f8bd7e 0%, #f2a45c 45%, #e88d33 100%)",
        }}
      />
    </section>
  );
}

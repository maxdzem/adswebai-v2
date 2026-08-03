"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import LazyVideo from "./LazyVideo";
import type { Dict } from "@/content/dict";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Hero({ dict }: { dict: Dict }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-hero-line]", {
          y: 90,
          autoAlpha: 0,
          duration: 1.1,
          stagger: 0.14,
          delay: 0.25,
        })
        .from("[data-hero-cue]", { autoAlpha: 0, y: 24, duration: 0.7 }, "-=0.5");

      // Кью «Scroll» намекает на скролл: подпись мягко покачивается,
      // а стрелка ныряет вниз и растворяется — и так по кругу
      gsap
        .timeline({ repeat: -1, repeatDelay: 1.1, delay: 1.8 })
        .to("[data-cue-label]", {
          y: 6,
          duration: 0.5,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
        })
        .fromTo(
          "[data-cue-arrow]",
          { y: -6, autoAlpha: 1 },
          { y: 10, autoAlpha: 0, duration: 0.7, ease: "power2.in" },
          0.15
        )
        .to("[data-cue-arrow]", { y: -6, autoAlpha: 1, duration: 0.4, ease: "power2.out" });

      // Начали скроллить — намёк больше не нужен, кью гаснет
      gsap.to("[data-hero-cue]", {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { start: 10, end: 160, scrub: true },
      });
    },
    { scope: ref }
  );

  return (
    // id="hero" — по нему Header понимает, что за ним ещё видео, и держится прозрачным
    // h-[100svh], а не h-screen: vh в мобильных браузерах равен большому
    // вьюпорту (адресная строка спрятана), поэтому подсказка «Scroll»
    // у нижнего края оказывалась под хромом браузера — ровно в момент,
    // когда она нужна
    <section id="hero" ref={ref} className="relative h-[100svh] overflow-hidden bg-ink">
      <LazyVideo
        src="/AdsWebAI-Sizzle_1280x720x2.mp4"
        eager
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="type-display">
          <span data-hero-line className="fs-display-l block font-black">
            {dict.hero.line1}
          </span>
          <span
            data-hero-line
            className="fs-display-l block font-serif font-medium tracking-normal"
          >
            {dict.hero.line2}
          </span>
        </h1>
      </div>

      <div
        data-hero-cue
        className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2 text-white"
      >
        <span data-cue-label className="fs-body-l inline-block font-serif italic tracking-wide">
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
          <path
            d="M6 2c13 9 19 19 12 36"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M11 33l6.5 8 6-8.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function Hero() {
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
    },
    { scope: ref }
  );

  return (
    // id="hero" — по нему Header понимает, что за ним ещё видео, и держится прозрачным
    <section id="hero" ref={ref} className="relative h-screen overflow-hidden bg-ink">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/Monks-Sizzle_1280x720.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="type-display">
          <span data-hero-line className="fs-display-l block font-black">
            Transforming brands
          </span>
          <span
            data-hero-line
            className="fs-display-l block font-serif font-medium tracking-normal"
          >
            for the real-time world
          </span>
        </h1>
      </div>

      <div
        data-hero-cue
        className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2 text-white"
      >
        <span className="fs-body-l font-serif italic tracking-wide">Scroll</span>
        <svg
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

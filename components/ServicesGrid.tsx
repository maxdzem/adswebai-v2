"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SwapLink from "./SwapLink";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SERVICES = [
  {
    n: "01",
    title: "Real-Time Brands",
    copy: "Brands built as living systems to move at the speed of culture.",
    gradient: "linear-gradient(150deg, #1c130b 0%, #4a3014 55%, #0d0a07 100%)",
    aspect: "aspect-[4/5]",
    offset: "lg:mt-0",
  },
  {
    n: "02",
    title: "Media Acceleration",
    copy: "Unifying intelligence, content, media, and measurement into one performance system.",
    gradient: "linear-gradient(150deg, #23262c 0%, #14171b 60%, #0b0d10 100%)",
    aspect: "aspect-[3/4]",
    offset: "lg:mt-16",
  },
  {
    n: "03",
    title: "Marketing Orchestration",
    copy: "We collapse your content supply chain into one AI-powered system.",
    gradient: "linear-gradient(150deg, #101623 0%, #1d2b47 55%, #0a0e17 100%)",
    aspect: "aspect-[4/3]",
    offset: "lg:mt-4",
  },
  {
    n: "04",
    title: "AI Transformation",
    copy: "AI embedded across your business, from strategy to scale.",
    gradient: "linear-gradient(150deg, #171b1e 0%, #2c3a42 55%, #0e1113 100%)",
    aspect: "aspect-[4/3.4]",
    offset: "lg:mt-20",
  },
];

function Arrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M1 7h11m0 0L7.5 2.5M12 7l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ServicesGrid() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Мягкое «айфоновское» появление: лёгкий blur растворяется вместе
      // с фейдом — заметно, но без вычурности
      gsap.from("[data-services-heading]", {
        y: 60,
        autoAlpha: 0,
        filter: "blur(10px)",
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
      });

      gsap.utils.toArray<HTMLElement>("[data-service-card]").forEach((card, i) => {
        gsap.from(card, {
          y: 80,
          autoAlpha: 0,
          filter: "blur(10px)",
          duration: 0.9,
          delay: i * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="bg-cream px-6 pb-36 pt-28 lg:px-10">
      <h2
        data-services-heading
        className="type-display fs-display-m max-w-[62ch]"
      >
        Your trusted partner for innovation across four strategic service
        offerings:
      </h2>

      <div className="mt-20 grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s) => (
          // data-btn-hover: ховер на любой части карточки запускает
          // swap-анимацию стрелки в заголовке
          <article
            key={s.n}
            data-service-card
            data-btn-hover
            className={`relative ${s.offset}`}
          >
            <div className="relative">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-[0.55em] right-1 z-10 text-[clamp(5.4rem,7.8vw,8.4rem)] font-black leading-none text-white/90"
              >
                {s.n}
              </span>
              <div
                className={`${s.aspect} w-full`}
                style={{ background: s.gradient }}
              />
            </div>

            <p className="fs-label mt-6 font-medium text-ink/80">Solutions</p>

            {/* Механика Connect: слово уезжает вправо, круг-стрелка
                появляется перед словом. Ховер-зона — вся карточка */}
            <h3 className="fs-body-m mt-2 font-bold leading-[1.15] tracking-normal">
              <SwapLink label={s.title} href={null} size={32} iconSize={12} />
            </h3>

            <p className="fs-label mt-3 max-w-[38ch] leading-relaxed text-ink/70">
              {s.copy}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SwapLink from "./SwapLink";
import Link from "next/link";
import type { Dict } from "@/content/dict";
import { href, type Locale } from "@/content/i18n";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SERVICES = [
  {
    n: "01",
    slug: "real-time-brands",
    title: "Real-Time Brands",
    copy: "Brands built as living systems to move at the speed of culture.",
    gradient: "linear-gradient(150deg, #1c130b 0%, #4a3014 55%, #0d0a07 100%)",
    aspect: "aspect-[4/5]",
    offset: "lg:mt-0",
  },
  {
    n: "02",
    slug: "media-acceleration",
    title: "Media Acceleration",
    copy: "Unifying intelligence, content, media, and measurement into one performance system.",
    gradient: "linear-gradient(150deg, #23262c 0%, #14171b 60%, #0b0d10 100%)",
    aspect: "aspect-[3/4]",
    offset: "lg:mt-16",
  },
  {
    n: "03",
    slug: "marketing-orchestration",
    title: "Marketing Orchestration",
    copy: "We collapse your content supply chain into one AI-powered system.",
    gradient: "linear-gradient(150deg, #101623 0%, #1d2b47 55%, #0a0e17 100%)",
    aspect: "aspect-[4/3]",
    offset: "lg:mt-4",
  },
  {
    n: "04",
    slug: "ai-transformation",
    title: "AI Transformation",
    copy: "AI embedded across your business, from strategy to scale.",
    gradient: "linear-gradient(150deg, #171b1e 0%, #2c3a42 55%, #0e1113 100%)",
    aspect: "aspect-[4/3.4]",
    offset: "lg:mt-20",
  },
];

export default function ServicesGrid({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  // Тексты карточек берутся из словаря, визуал (градиенты, пропорции,
  // вертикальные сдвиги) остаётся в SERVICES
  const cards = SERVICES.map((s, i) => ({ ...s, ...dict.services.cards[i] }));
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
        {dict.services.heading}
      </h2>

      <div className="mt-20 grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((s) => (
          // data-btn-hover: ховер на любой части карточки запускает
          // swap-анимацию стрелки в заголовке. Сама карточка ведёт на
          // страницу своего решения — раньше стрелка обещала переход,
          // которого не было
          <Link
            key={s.n}
            href={href(locale, `/solutions/${s.slug}`)}
            data-service-card
            data-btn-hover
            className={`relative block ${s.offset}`}
          >
            <div className="relative">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-[0.45em] right-1 z-10 text-[clamp(3.4rem,7.8vw,8.4rem)] font-black leading-none text-white/90"
              >
                {s.n}
              </span>
              <div
                className={`${s.aspect} w-full`}
                style={{ background: s.gradient }}
              />
            </div>

            <p className="fs-label mt-6 font-medium text-ink/80">
              {dict.services.label}
            </p>

            {/* Механика Connect: слово уезжает вправо, круг-стрелка
                появляется перед словом. Ховер-зона — вся карточка */}
            <h3 className="fs-body-m mt-2 font-bold leading-[1.15] tracking-normal">
              <SwapLink label={s.title} href={null} size={32} iconSize={12} />
            </h3>

            <p className="fs-label mt-3 max-w-[38ch] leading-relaxed text-ink/70">
              {s.copy}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

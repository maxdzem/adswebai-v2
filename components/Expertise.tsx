"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import SwapLink from "./SwapLink";
import LazyVideo from "./LazyVideo";

import type { Dict } from "@/content/dict";
import { href, type Locale } from "@/content/i18n";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Expertise({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Мягкое появление с растворением blur — как на главной у карточек
      gsap.from("[data-exp-heading]", {
        y: 60,
        autoAlpha: 0,
        filter: "blur(10px)",
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 78%", once: true },
      });

      gsap.utils.toArray<HTMLElement>("[data-exp-card]").forEach((card, i) => {
        gsap.from(card, {
          y: 80,
          autoAlpha: 0,
          filter: "blur(10px)",
          duration: 0.9,
          delay: i * 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="bg-cream px-6 pb-40 pt-24 lg:px-10">
      <h2
        data-exp-heading
        className="type-display fs-display-m"
      >
        {dict.expertise.heading}
      </h2>

      <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-16 lg:grid-cols-12">
        {/* Case Study */}
        <Link
          href={href(locale, "/work")}
          data-exp-card
          data-btn-hover
          className="block lg:col-span-5"
        >
          <div
            className="flex aspect-[16/11] w-full items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, #0e1013 0%, #2a2140 45%, #0e1013 100%)",
            }}
          >
            <p className="fs-display-s text-center font-serif leading-[1.15] text-white/90">
              Boomtown
              <span className="fs-body-l block font-sans font-black tracking-[0.25em]">
                UNBOXED
              </span>
            </p>
          </div>
          <p className="fs-label mt-5 font-medium text-ink/80">{dict.expertise.caseStudy}</p>
          <h3 className="fs-body-m mt-2 font-bold leading-[1.15] tracking-normal">
            <SwapLink label={dict.expertise.boomtown} href={null} size={32} iconSize={12} />
          </h3>
        </Link>

        {/* Report */}
        <Link
          href={href(locale, "/thinking")}
          data-exp-card
          data-btn-hover
          className="block lg:col-span-2 lg:col-start-7"
        >
          <div
            className="aspect-square w-full"
            style={{
              background:
                "linear-gradient(160deg, #ff4fd8 0%, #b14dff 60%, #4f2be8 100%)",
            }}
          />
          <p className="fs-label mt-5 font-medium text-ink/80">{dict.expertise.report}</p>
          <h3 className="fs-body-m mt-2 font-bold leading-[1.25] tracking-normal">
            <SwapLink
              label={dict.expertise.owningAnswer}
              href={null}
              size={32}
              iconSize={12}
              className="max-w-full"
            />
          </h3>
        </Link>

        {/* Video block */}
        <Link
          href={href(locale, "/thinking")}
          data-exp-card
          data-btn-hover
          className="block lg:col-span-3 lg:col-start-10"
        >
          <LazyVideo
            src="/SMS-Personalization.mp4"
            className="aspect-[16/10] w-full object-cover"
          />
          <p className="fs-label mt-5 font-medium text-ink/80">{dict.expertise.content}</p>
          <h3 className="fs-body-m mt-2 font-bold leading-[1.25] tracking-normal">
            <SwapLink
              label={dict.expertise.smarter}
              href={null}
              size={32}
              iconSize={12}
              className="max-w-full"
            />
          </h3>
        </Link>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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

export default function Expertise() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-exp-heading]", {
        y: 60,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 78%", once: true },
      });

      gsap.utils.toArray<HTMLElement>("[data-exp-card]").forEach((card, i) => {
        gsap.from(card, {
          y: 80,
          autoAlpha: 0,
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
        Our Expertise
      </h2>

      <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-16 lg:grid-cols-12">
        {/* Case Study */}
        <article data-exp-card className="lg:col-span-5">
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
          <p className="fs-label mt-5 font-medium text-ink/80">Case Study</p>
          <h3 className="fs-body-m mt-2 flex items-center gap-3 font-bold leading-[1.15] tracking-normal">
            Boomtown Unboxed
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-cream">
              <Arrow />
            </span>
          </h3>
        </article>

        {/* Report */}
        <article data-exp-card className="lg:col-span-2 lg:col-start-7">
          <div
            className="aspect-square w-full"
            style={{
              background:
                "linear-gradient(160deg, #ff4fd8 0%, #b14dff 60%, #4f2be8 100%)",
            }}
          />
          <p className="fs-label mt-5 font-medium text-ink/80">Report</p>
          <h3 className="fs-body-m mt-2 font-bold leading-[1.25] tracking-normal">
            Owning the Answer: The Marketer’s Playbook for AEO, GEO and the AI
            Search Era{" "}
            <span className="ml-1 inline-grid h-8 w-8 shrink-0 translate-y-1 place-items-center rounded-full bg-ink text-cream">
              <Arrow />
            </span>
          </h3>
        </article>

        {/* Video block */}
        <article data-exp-card className="lg:col-span-3 lg:col-start-10">
          <video
            className="aspect-[16/10] w-full object-cover"
            src="/SMS-Personalization.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <p className="fs-label mt-5 font-medium text-ink/80">Content</p>
          <h3 className="fs-body-m mt-2 font-bold leading-[1.25] tracking-normal">
            Smarter Investments for an Evolving Marketing Landscape{" "}
            <span className="ml-1 inline-grid h-8 w-8 shrink-0 translate-y-1 place-items-center rounded-full bg-ink text-cream">
              <Arrow />
            </span>
          </h3>
        </article>
      </div>
    </section>
  );
}

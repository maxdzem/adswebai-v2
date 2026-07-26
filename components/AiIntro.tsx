"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
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

function PillButton({ label }: { label: string }) {
  return (
    <a href="#connect" className="inline-flex items-center gap-1">
      <span className="fs-label rounded-full bg-ink px-5 py-2.5 font-medium text-cream">
        {label}
      </span>
      <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-cream">
        <Arrow />
      </span>
    </a>
  );
}

export default function AiIntro() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-ai-block]").forEach((block) => {
        gsap.from(block, {
          y: 70,
          autoAlpha: 0,
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
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="bg-cream px-6 pb-40 pt-16 lg:px-10">
      {/* Connect / What can we do for you? */}
      <div data-ai-block className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3 lg:col-start-2">
          <p className="fs-label font-medium">Connect</p>
          <div className="mt-16">
            <PillButton label="Reach out" />
          </div>
        </div>
        <div className="lg:col-span-8">
          <h2 className="type-display fs-display-m">
            What can we do for{" "}
            <span className="relative inline-block">
              you
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
          <p className="fs-label font-medium">Our Agents</p>
        </div>
        <div className="lg:col-span-7">
          <h3 className="type-display fs-display-m">
            Your always-on agents for last-mile intelligence — rapid, real, and
            powered by adswebai.flow
          </h3>
          <div className="mt-12 lg:pl-[14%]">
            <a href="#" className="inline-flex items-center gap-1">
              <span className="fs-label rounded-full bg-ink px-4 py-2 font-medium text-cream">
                Explore adswebai.flow
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-cream">
                <Arrow />
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* adswebai.flow product banner */}
      <div
        data-ai-block
        className="mx-auto mt-28 h-[65vh] w-full max-w-[72%]"
        style={{
          background:
            "radial-gradient(120% 140% at 20% 0%, #f8bd7e 0%, #f2a45c 45%, #e88d33 100%)",
        }}
      />
    </section>
  );
}

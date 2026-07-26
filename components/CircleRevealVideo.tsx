"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface CircleRevealVideoProps {
  videoSrc: string;
  posterSrc?: string;
  caption?: string;
  subcaption?: string;
  /** Фон секции, напр. "#FEAFE6" */
  accentColor?: string;
}

/**
 * Переиспользуемый circle-reveal по замерам аудита: круг с видео
 * непрерывно масштабируется от скролла — растёт с ~0.32 до 1, пока его
 * центр приближается к центру вьюпорта, и симметрично сжимается после.
 * Не clip-path и не toggle по пересечению: чистый scroll-linked scale,
 * форма всегда остаётся кругом.
 *
 * Реализовано на GSAP ScrollTrigger (scrub) — тот же расчёт, что
 * useScroll/useTransform, но без второй анимационной библиотеки в бандле.
 */
export default function CircleRevealVideo({
  videoSrc,
  posterSrc,
  caption,
  subcaption,
  accentColor = "#EAE8E4",
}: CircleRevealVideoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Прогресс прохода секции через вьюпорт: 0 — входит снизу,
      // 0.5 — центр совпал с центром экрана (пик масштаба), 1 — ушла вверх
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        })
        .fromTo(circleRef.current, { scale: 0.32 }, { scale: 1, duration: 50 })
        .to(circleRef.current, { scale: 0.32, duration: 50 });
    },
    { scope: sectionRef }
  );

  return (
    // Секция выше вьюпорта + sticky-контейнер — «окно» скролла, в котором
    // прогресс плавно проходит через пиковую точку 0.5
    <section
      ref={sectionRef}
      className="relative min-h-[150vh] overflow-hidden"
      style={{ backgroundColor: accentColor }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center">
        <div
          ref={circleRef}
          className="relative aspect-square w-[45vw] max-w-[700px] overflow-hidden rounded-full"
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={videoSrc}
            poster={posterSrc}
            loop
            muted
            playsInline
            autoPlay
          />

          {/* Play-оверлей 70×70 по центру, как в замере */}
          <button
            type="button"
            aria-label="Play video"
            className="absolute left-1/2 top-1/2 grid h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/40 backdrop-blur-sm"
          >
            <span className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-white" />
          </button>
        </div>

        {(caption || subcaption) && (
          <div className="absolute bottom-10 left-10 text-ink">
            {caption && <p className="fs-label font-semibold">{caption}</p>}
            {subcaption && <p className="fs-label opacity-70">{subcaption}</p>}
          </div>
        )}
      </div>
    </section>
  );
}

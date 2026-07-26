"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Скролл-эффекты внутренних страниц. Три примитива под нашу тему —
 * сдержанные, короткие, без смены цветов:
 *
 *  - FxUp    — текст «выпрыгивает» снизу с лёгким перелётом (один раз)
 *  - FxSide  — блок въезжает сбоку (один раз)
 *  - FxDrift — медиа плавно уходит в сторону по мере скролла (scrub)
 *
 * Все — клиентские обёртки-div: серверные страницы передают контент
 * как children и остаются серверными.
 */

type BaseProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function FxUp({ children, className = "", delay = 0 }: BaseProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(ref.current, {
        y: 48,
        autoAlpha: 0,
        duration: 0.7,
        delay,
        // «Выпрыгивание»: небольшой перелёт вверх и мягкая посадка
        ease: "back.out(1.4)",
        scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function FxSide({
  children,
  className = "",
  delay = 0,
  side = "right",
}: BaseProps & { side?: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(ref.current, {
        x: side === "right" ? 90 : -90,
        autoAlpha: 0,
        duration: 0.9,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function FxDrift({
  children,
  className = "",
  to = "left",
  amount = 8,
}: {
  children: ReactNode;
  className?: string;
  to?: "left" | "right";
  /** Смещение в % собственной ширины за полный проход через вьюпорт */
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(ref.current, {
        xPercent: to === "left" ? -amount : amount,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

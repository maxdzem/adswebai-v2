"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Круг со стрелкой и swap-анимацией «как у Connect»: при ховере стрелка
 * уходит вправо, ужимаясь в ноль, а её дубль въезжает слева.
 *
 * Зона ховера — ближайший предок с [data-btn-hover] (карточка, строка,
 * ссылка) или сам кружок, если предка нет. Тайминги те же, что у Button:
 * 0.3s, cubic-bezier(0.2,0,0,1) ≈ power3.out.
 */
export default function IconSwap({
  size = 32,
  iconSize = 12,
  className = "bg-ink text-cream",
}: {
  size?: number;
  iconSize?: number;
  /** Стили круга: заливка/бордер/цвет стрелки */
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-swap-in]", { x: -size, scale: 0.4 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { duration: 0.3, ease: "power3.out" },
      });
      tl.to("[data-swap-out]", { x: size, scale: 0.4 }, 0).to(
        "[data-swap-in]",
        { x: 0, scale: 1 },
        0
      );
      tlRef.current = tl;
    }, root);

    const target = root.closest<HTMLElement>("[data-btn-hover]") ?? root;
    const enter = () => tlRef.current?.play();
    const leave = () => tlRef.current?.reverse();
    target.addEventListener("mouseenter", enter);
    target.addEventListener("mouseleave", leave);

    return () => {
      target.removeEventListener("mouseenter", enter);
      target.removeEventListener("mouseleave", leave);
      ctx.revert();
    };
  }, [size]);

  const arrow = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
    >
      <path
        d="M1 7h11m0 0L7.5 2.5M12 7l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <span
      ref={ref}
      style={{ width: size, height: size }}
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full ${className}`}
      aria-hidden
    >
      <span data-swap-out className="absolute inset-0 grid place-items-center">
        {arrow}
      </span>
      {/* дубль до гидрации спрятан классом, дальше им управляет GSAP */}
      <span
        data-swap-in
        className="absolute inset-0 grid scale-0 place-items-center"
      >
        {arrow}
      </span>
    </span>
  );
}

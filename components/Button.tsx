"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden>
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

type ButtonProps = {
  label?: string;
  /** null — рендерится <span>: для вложения в собственную ссылку (шапка) */
  href?: string | null;
  className?: string;
  /** Цвета пилюли и кругов — переопределяются, например, в шапке */
  colorClass?: string;
};

/**
 * Кнопка «Read now» / «Connect»: пилюля (min 104.1px) + круг 40x40 без зазора.
 * Ширина считается по контенту — увеличенный кегль лейбла не обрезается.
 *
 * Ховер: лейбл уезжает вправо ровно на ширину круга, стрелки кросс-фейдятся.
 * Сдвиг берётся из offsetWidth круга — как в оригинале, а не хардкодом.
 *
 * Зона ховера: ближайший предок с [data-btn-hover] (строка списка,
 * ссылка в шапке) — или сама кнопка, если такого предка нет.
 */
export default function Button({
  label = "Read now",
  href = "#",
  className = "",
  colorClass = "bg-ink text-cream",
}: ButtonProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const iconWidth =
        root.querySelector<HTMLElement>("[data-btn-icon-right]")?.offsetWidth ??
        40;

      const tl = gsap.timeline({
        paused: true,
        // cubic-bezier(0.2, 0, 0, 1) ≈ power3.out
        defaults: { duration: 0.3, ease: "power3.out" },
      });

      tl.to("[data-btn-label]", { x: iconWidth }, 0)
        .to("[data-btn-arrow-right]", { scale: 0, x: iconWidth }, 0)
        .fromTo("[data-btn-arrow-left]", { scale: 0 }, { scale: 1 }, 0);

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
  }, []);

  const setRef = (el: HTMLElement | null) => {
    rootRef.current = el;
  };

  const baseClass = `relative inline-flex h-[40px] shrink-0 items-center ${className}`;
  const surface = `${colorClass} transition-colors duration-300`;

  const inner = (
    <>
      {/* Левый круг: лежит под пилюлей, открывается при её сдвиге */}
      <span
        className={`absolute left-0 top-0 grid h-[40px] w-[40px] place-items-center overflow-hidden rounded-[100px] ${surface}`}
      >
        <span data-btn-arrow-left className="grid scale-0 place-items-center">
          <ArrowIcon />
        </span>
      </span>

      {/* Лейбл-пилюля: ширина по контенту, но не меньше 104.1px */}
      <span
        data-btn-label
        className={`relative z-10 grid h-[40px] min-w-[104.1px] place-items-center rounded-[100px] px-[15px] fs-label font-medium ${surface}`}
      >
        {label}
      </span>

      {/* Правый круг: стрелка уходит вправо, ужимаясь в ноль */}
      <span
        data-btn-icon-right
        className={`relative grid h-[40px] w-[40px] place-items-center overflow-hidden rounded-[100px] ${surface}`}
      >
        <span data-btn-arrow-right className="grid place-items-center">
          <ArrowIcon />
        </span>
      </span>
    </>
  );

  return href == null ? (
    <span ref={setRef} className={baseClass}>
      {inner}
    </span>
  ) : (
    <a ref={setRef} href={href} className={baseClass}>
      {inner}
    </a>
  );
}

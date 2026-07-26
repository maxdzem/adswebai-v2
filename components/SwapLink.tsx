"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

function ArrowIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden>
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

/**
 * Текст со стрелкой и механикой Connect: при ховере слово уезжает вправо,
 * стрелка за словом гаснет, и её дубль-круг появляется ПЕРЕД словом.
 * [word (→)]  →  [(→) word]
 *
 * Зона ховера — ближайший предок с [data-btn-hover] (карточка, строка)
 * или сам элемент. href={null} рендерит <span> — для заголовков и
 * вложения в собственные ссылки.
 */
export default function SwapLink({
  label,
  href = "#",
  size = 32,
  gap = 12,
  iconSize = 12,
  circleClass = "bg-ink text-cream",
  className = "",
}: {
  label: ReactNode;
  href?: string | null;
  size?: number;
  gap?: number;
  iconSize?: number;
  circleClass?: string;
  className?: string;
}) {
  const rootRef = useRef<HTMLElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-sl-left]", { scale: 0 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { duration: 0.3, ease: "power3.out" },
      });
      tl.to("[data-sl-label]", { x: size + gap }, 0)
        .to("[data-sl-right]", { autoAlpha: 0, scale: 0.4, x: 8 }, 0)
        .to("[data-sl-left]", { scale: 1 }, 0);

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
  }, [size, gap]);

  const setRef = (el: HTMLElement | null) => {
    rootRef.current = el;
  };

  const baseClass = `relative inline-flex items-center ${className}`;

  const inner = (
    <>
      {/* Круг-дубль перед словом: скрыт (scale 0), появляется на ховере */}
      <span
        data-sl-left
        style={{ width: size, height: size }}
        className={`absolute left-0 top-1/2 grid -translate-y-1/2 scale-0 place-items-center rounded-full ${circleClass}`}
        aria-hidden
      >
        <ArrowIcon size={iconSize} />
      </span>

      <span data-sl-label className="inline-block">
        {label}
      </span>

      {/* Круг после слова: гаснет, уступая место дублю слева */}
      <span
        data-sl-right
        style={{ width: size, height: size }}
        className={`grid shrink-0 place-items-center rounded-full ${circleClass}`}
        aria-hidden
      >
        <ArrowIcon size={iconSize} />
      </span>
    </>
  );

  return href == null ? (
    <span ref={setRef} className={baseClass} style={{ gap }}>
      {inner}
    </span>
  ) : (
    <a ref={setRef} href={href} className={baseClass} style={{ gap }}>
      {inner}
    </a>
  );
}

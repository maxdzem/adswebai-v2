"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

function ArrowIcon({ size = 16 }: { size?: number }) {
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

// Классы — литералами на каждый размер, а не собраны через `h-[${n}px]`:
// Tailwind ищет произвольные значения статическим сканом исходников,
// динамическая интерполяция в такой строке просто не попадёт в сборку
const SIZES = {
  md: {
    dim: "h-[40px] w-[40px]",
    pillH: "h-[40px]",
    minW: "min-w-[104.1px]",
    text: "fs-label",
    after: "after:-inset-y-[5px]",
    icon: 16,
    px: 40,
  },
  lg: {
    dim: "h-[56px] w-[56px]",
    pillH: "h-[56px]",
    minW: "min-w-[148px]",
    text: "fs-body-m",
    after: "after:-inset-y-0",
    icon: 20,
    px: 56,
  },
} as const;

type ButtonProps = {
  label?: string;
  /** null — рендерится <span>: для вложения в собственную ссылку (шапка) */
  href?: string | null;
  className?: string;
  /** Цвета пилюли и кругов — переопределяются, например, в шапке */
  colorClass?: string;
  /** lg — крупная версия для акцентных мест вроде Connect в мобильном меню */
  size?: keyof typeof SIZES;
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
  href,
  className = "",
  colorClass = "bg-ink text-cream",
  size = "md",
}: ButtonProps) {
  const s = SIZES[size];
  const rootRef = useRef<HTMLElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const iconWidth =
        root.querySelector<HTMLElement>("[data-btn-icon-right]")?.offsetWidth ??
        s.px;

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

    // Только там, где есть настоящий курсор. На тач-экране браузер шлёт
    // синтетический mouseenter при тапе, лейбл уезжал вправо и оставался
    // так до тапа по другому элементу — mouseleave не приходит.
    const target = root.closest<HTMLElement>("[data-btn-hover]") ?? root;
    const hover = window.matchMedia("(hover: hover)");
    const enter = () => tlRef.current?.play();
    const leave = () => tlRef.current?.reverse();

    if (hover.matches) {
      target.addEventListener("mouseenter", enter);
      target.addEventListener("mouseleave", leave);
    }

    return () => {
      target.removeEventListener("mouseenter", enter);
      target.removeEventListener("mouseleave", leave);
      ctx.revert();
    };
  }, [s.px]);

  const setRef = (el: HTMLElement | null) => {
    rootRef.current = el;
  };

  // after — невидимое расширение зоны нажатия у md-пилюли (40px) до 50px:
  // для пальца 40px мало, минимум 44px. У lg (56px) запас уже есть.
  // active:scale — тактильный отклик на нажатие: работает и от тача,
  // и от мыши через нативный :active, в отличие от JS-таймлайна ниже,
  // который на тач-экранах намеренно не биндится (см. эффект)
  const baseClass = `relative inline-flex ${s.pillH} shrink-0 items-center transition-transform duration-150 after:absolute after:inset-x-0 after:content-[''] ${s.after} active:scale-[0.96] ${className}`;
  const surface = `${colorClass} transition-colors duration-300`;

  const inner = (
    <>
      {/* Левый круг: лежит под пилюлей, открывается при её сдвиге */}
      <span
        className={`absolute left-0 top-0 grid ${s.dim} place-items-center overflow-hidden rounded-[100px] ${surface}`}
      >
        <span data-btn-arrow-left className="grid scale-0 place-items-center">
          <ArrowIcon size={s.icon} />
        </span>
      </span>

      {/* Лейбл-пилюля: ширина по контенту, но не меньше минимума размера */}
      <span
        data-btn-label
        className={`relative z-10 grid ${s.pillH} ${s.minW} place-items-center rounded-[100px] px-[15px] ${s.text} font-medium ${surface}`}
      >
        {label}
      </span>

      {/* Правый круг: стрелка уходит вправо, ужимаясь в ноль */}
      <span
        data-btn-icon-right
        className={`relative grid ${s.dim} place-items-center overflow-hidden rounded-[100px] ${surface}`}
      >
        <span data-btn-arrow-right className="grid place-items-center">
          <ArrowIcon size={s.icon} />
        </span>
      </span>
    </>
  );

  // Внутренние маршруты — через next/link: обычный <a> перезагружал
  // всю страницу вместо клиентского перехода. Якоря и внешние ссылки
  // остаются нативными.
  if (href == null) {
    return (
      <span ref={setRef} className={baseClass}>
        {inner}
      </span>
    );
  }

  if (href.startsWith("/")) {
    return (
      <Link ref={setRef} href={href} className={baseClass}>
        {inner}
      </Link>
    );
  }

  return (
    <a ref={setRef} href={href} className={baseClass}>
      {inner}
    </a>
  );
}

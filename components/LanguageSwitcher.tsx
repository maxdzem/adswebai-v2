"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import {
  LOCALES,
  LOCALE_LABEL,
  swapLocale,
  type Locale,
} from "@/content/i18n";
import type { Dict } from "@/content/dict";

/** Желаемая ширина раскрытой пилюли с заголовком в шапке. */
const PILL_W = 268;
/** Круг с шевроном (44px) + зазор — их место надо оставить свободным. */
const CHEV_SPACE = 52;
/** Запас до логотипа и меню, чтобы пилюля к ним не прижималась. */
const SIDE_GAP = 24;
/** Ниже этой ширины пилюля не раскрывается: незачем — текст всё равно
 *  не поместится, а раскрытие полезло бы на соседние элементы. */
const PILL_MIN = 150;

function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.4 2.4 3.6 5.4 3.6 9s-1.2 6.6-3.6 9c-2.4-2.4-3.6-5.4-3.6-9S9.6 5.4 12 3z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Панель выбора языка: только названия, без флагов и подписей статуса.
 * Активный язык выделен насыщенностью.
 */
function Panel({
  locale,
  onPick,
}: {
  locale: Locale;
  onPick: (l: Locale) => void;
}) {
  return (
    <ul className="p-2">
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <li key={l}>
            {/* Ховер: строка подсвечивается, название уезжает вправо —
                видно, какой язык будет выбран */}
            <button
              data-lang-item
              type="button"
              onClick={() => onPick(l)}
              className="group flex w-full rounded-[10px] px-4 py-2.5 text-left transition-colors duration-200 hover:bg-ink/[0.07]"
            >
              <span
                className={`fs-body-m transition-transform duration-200 group-hover:translate-x-1.5 ${
                  active ? "font-medium text-ink" : "text-ink/80"
                }`}
              >
                {LOCALE_LABEL[l]}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Переключатель языка.
 *  - variant="dot"  — точка с глобусом в шапке, панель раскрывается ВНИЗ
 *  - variant="pill" — пилюля с текущим языком в футере, панель вверх
 */
export default function LanguageSwitcher({
  locale,
  dict,
  variant = "dot",
  placement = "down",
}: {
  locale: Locale;
  dict: Dict;
  variant?: "dot" | "pill";
  /** Куда раскрывается панель. В мобильном оверлее пилюля стоит внизу
   *  экрана — панель обязана идти вверх, иначе она уезжает за край. */
  placement?: "down" | "up";
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Триггер в шапке: точка раскрывается в пилюлю с названием языка
  const pillRef = useRef<HTMLButtonElement>(null);
  const globeRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const chevRef = useRef<HTMLButtonElement>(null);
  // Футерная пилюля: подпись переключается с текущего языка на заголовок
  const pillCurrentRef = useRef<HTMLSpanElement>(null);
  const pillChooseRef = useRef<HTMLSpanElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Стартовое состояние панели и свёрнутого триггера
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(panelRef.current, {
        autoAlpha: 0,
        y: placement === "up" ? 12 : -12,
        scale: 0.97,
      });
      gsap.set("[data-lang-item]", { autoAlpha: 0, y: 8 });

      if (variant === "dot") {
        // Свёрнуто: круг 44px с глобусом, ни названия, ни шеврона
        gsap.set(pillRef.current, { width: 44 });
        gsap.set(globeRef.current, { autoAlpha: 1, scale: 1 });
        gsap.set(labelRef.current, { autoAlpha: 0, x: -10 });
        gsap.set(chevRef.current, { scale: 0, autoAlpha: 0 });
      } else {
        // Свёрнуто: видно текущий язык, заголовок скрыт под ним
        gsap.set(pillCurrentRef.current, { autoAlpha: 1, y: 0 });
        gsap.set(pillChooseRef.current, { autoAlpha: 0, y: 10 });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [variant, placement]);

  // Раскрытие: точка растягивается в пилюлю с языком и шевроном
  // (как на референсе), следом выезжает панель, строки — каскадом
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (open) {
        if (variant === "dot") {
          // Переключатель центрирован оверлеем, поэтому меряем реальный
          // зазор между логотипом и меню шапки: раскрытая пилюля растёт
          // симметрично от центра, и наехать она может на любую из сторон.
          // Берём минимальное из двух полурасстояний — так безопасно
          // и при открытых девтулзах, и на промежуточных ширинах.
          const header = rootRef.current?.closest("header");
          const logo = header?.querySelector("[data-header-logo]");
          const nav = header?.querySelector("[data-header-nav]");
          const centre = (rootRef.current?.getBoundingClientRect().left ?? 0) +
            (rootRef.current?.offsetWidth ?? 0) / 2;

          const leftEdge = logo?.getBoundingClientRect().right ?? 0;
          const rightEdge =
            nav?.getBoundingClientRect().left ?? window.innerWidth;
          const halfRoom = Math.min(centre - leftEdge, rightEdge - centre);
          const room = (halfRoom - SIDE_GAP) * 2 - CHEV_SPACE;

          const target = Math.max(44, Math.min(PILL_W, room));

          gsap.to(pillRef.current, {
            width: target < PILL_MIN ? 44 : target,
            duration: 0.45,
            ease: "power3.out",
            overwrite: "auto",
          });
          gsap.to(globeRef.current, {
            autoAlpha: 0,
            scale: 0.5,
            duration: 0.15,
            ease: "power2.in",
            overwrite: "auto",
          });
          gsap.to(labelRef.current, {
            autoAlpha: 1,
            x: 0,
            duration: 0.35,
            delay: 0.12,
            ease: "power3.out",
            overwrite: "auto",
          });
          gsap.to(chevRef.current, {
            scale: 1,
            autoAlpha: 1,
            duration: 0.35,
            delay: 0.1,
            ease: "back.out(1.6)",
            overwrite: "auto",
          });
        }

        if (variant === "pill") {
          // Подпись перелистывается: текущий язык уходит вверх,
          // заголовок «Выберите язык» приходит снизу
          gsap.to(pillCurrentRef.current, {
            autoAlpha: 0,
            y: -10,
            duration: 0.22,
            ease: "power2.in",
            overwrite: "auto",
          });
          gsap.to(pillChooseRef.current, {
            autoAlpha: 1,
            y: 0,
            duration: 0.32,
            delay: 0.1,
            ease: "power3.out",
            overwrite: "auto",
          });
        }

        gsap.to(panelRef.current, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          delay: variant === "dot" ? 0.14 : 0.06,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to("[data-lang-item]", {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.05,
          delay: variant === "dot" ? 0.2 : 0.06,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else {
        // Закрытие мягче открытия: элементы уходят по очереди, все
        // изинги — inOut, поэтому движение не обрывается, а затухает
        if (variant === "dot") {
          gsap.to(chevRef.current, {
            scale: 0,
            autoAlpha: 0,
            duration: 0.3,
            ease: "power2.inOut",
            overwrite: "auto",
          });
          gsap.to(labelRef.current, {
            autoAlpha: 0,
            x: -8,
            duration: 0.26,
            ease: "power2.inOut",
            overwrite: "auto",
          });
          // Пилюля сжимается неспешно и стартует, когда подпись уже угасла
          gsap.to(pillRef.current, {
            width: 44,
            duration: 0.55,
            delay: 0.16,
            ease: "power2.inOut",
            overwrite: "auto",
          });
          gsap.to(globeRef.current, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.32,
            delay: 0.38,
            ease: "power2.out",
            overwrite: "auto",
          });
        }

        if (variant === "pill") {
          // Подпись перелистывается обратно: заголовок уходит вниз,
          // текущий язык возвращается сверху
          gsap.to(pillChooseRef.current, {
            autoAlpha: 0,
            y: 10,
            duration: 0.28,
            ease: "power2.inOut",
            overwrite: "auto",
          });
          gsap.to(pillCurrentRef.current, {
            autoAlpha: 1,
            y: 0,
            duration: 0.34,
            delay: 0.14,
            ease: "power2.out",
            overwrite: "auto",
          });
        }

        // Строки гаснут первыми, в обратном порядке — панель не
        // «схлопывается» разом, а разбирается снизу вверх
        gsap.to("[data-lang-item]", {
          autoAlpha: 0,
          y: 6,
          duration: 0.22,
          stagger: { each: 0.045, from: "end" },
          ease: "power2.inOut",
          overwrite: "auto",
        });
        gsap.to(panelRef.current, {
          autoAlpha: 0,
          y: placement === "up" ? 10 : -10,
          scale: 0.98,
          duration: 0.38,
          delay: 0.1,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [open, variant, placement]);

  // Закрытие по клику снаружи и Escape
  useEffect(() => {
    if (!open) return;

    // touchstart рядом с mousedown: на тач-экранах синтетический mouse-
    // событие приходит с задержкой, панель успевала «залипнуть»
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (code: Locale) => {
    setOpen(false);
    if (code === locale) return;
    // Переходим на ту же страницу в другой локали
    router.push(swapLocale(pathname, code));
  };

  const panelClass =
    "invisible absolute z-30 w-[min(220px,calc(100vw-3rem))] overflow-hidden rounded-[12px] border border-ink/15 bg-white text-ink opacity-0 shadow-[0_28px_60px_-20px_rgba(0,0,0,0.35)]";

  if (variant === "pill") {
    return (
      <div ref={rootRef} className="relative">
        {/* Направление раскрытия задаётся placement: в футере панель
            уходит вниз, в мобильном оверлее — вверх, там до низа экрана
            остаётся меньше её высоты */}
        <div
          ref={panelRef}
          className={`${panelClass} right-0 ${
            placement === "up" ? "bottom-[calc(100%+14px)]" : "top-[calc(100%+14px)]"
          }`}
        >
          <Panel locale={locale} onPick={pick} />
        </div>

        {/* Свёрнутое состояние: текущий язык + круг с шевроном */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={dict.lang.change}
          className="flex max-w-full items-center gap-2"
        >
          {/* Две подписи стопкой — при раскрытии они перелистываются.
              min-w-0 + max-w-full: PILL_W здесь не жёсткая ширина,
              а максимум — на экранах уже 375px пилюля ужимается,
              вместо того чтобы вылезать за поля */}
          <span
            className="relative grid h-12 min-w-0 items-center overflow-hidden rounded-full bg-white/10 px-6 text-left transition-colors duration-300 hover:bg-white/15"
            style={{ width: PILL_W }}
          >
            <span
              ref={pillCurrentRef}
              className="fs-label absolute left-6 whitespace-nowrap font-medium text-cream"
            >
              {LOCALE_LABEL[locale]}
            </span>
            <span
              ref={pillChooseRef}
              className="fs-label absolute left-6 whitespace-nowrap font-medium text-cream opacity-0"
            >
              {dict.lang.choose}
            </span>
          </span>
          <span
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/10 text-cream transition-all duration-300 hover:bg-white/15 ${
              open ? "rotate-180" : ""
            }`}
          >
            <Chevron />
          </span>
        </button>
      </div>
    );
  }

  // dot — шапка
  return (
    <div ref={rootRef} className="relative h-full w-full">
      {/* Триггер: свёрнут — круг с глобусом, раскрыт — пилюля с языком
          и отдельный круг с шевроном (как на референсе). Обёртка
          центрируется по своей ширине, поэтому при росте пилюли
          композиция остаётся посередине шапки. */}
      <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 items-center gap-2">
        <button
          ref={pillRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={dict.lang.change}
          aria-expanded={open}
          className="relative grid h-[44px] w-[44px] shrink-0 place-items-center overflow-hidden rounded-full bg-[#2d2d2d] text-white/90"
        >
          <span ref={globeRef} className="grid place-items-center">
            <GlobeIcon />
          </span>
          <span
            ref={labelRef}
            className="fs-label absolute left-6 whitespace-nowrap font-medium opacity-0"
          >
            {dict.lang.choose}
          </span>
        </button>

        <button
          ref={chevRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-hidden={!open}
          tabIndex={open ? 0 : -1}
          aria-label={dict.lang.close}
          className={`grid h-[44px] w-[44px] shrink-0 scale-0 place-items-center rounded-full bg-[#2d2d2d] text-white/90 opacity-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          <Chevron />
        </button>
      </div>

      {/* Панель раскрывается ВНИЗ из-под триггера, по центру шапки */}
      <div
        ref={panelRef}
        className={`${panelClass} left-1/2 top-[62px] -translate-x-1/2`}
      >
        <Panel locale={locale} onPick={pick} />
      </div>
    </div>
  );
}

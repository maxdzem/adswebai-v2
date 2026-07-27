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

function GlobeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
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
    <ul className="p-1.5">
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <li key={l}>
            {/* fs-label вместо fs-body-m: тот фиксирован на 22px — для
                строки в компактном списке слишком крупно и рыхло.
                Активный язык теперь помечен точкой слева, а не только
                весом шрифта — заметнее с первого взгляда */}
            <button
              data-lang-item
              type="button"
              onClick={() => onPick(l)}
              className="group flex w-full items-center gap-2.5 rounded-[8px] px-3.5 py-2 text-left transition-colors duration-200 hover:bg-ink/[0.07]"
            >
              <span
                aria-hidden
                className={`h-1.5 w-1.5 shrink-0 rounded-full bg-ink transition-opacity duration-200 ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />
              <span
                className={`fs-label transition-transform duration-200 group-hover:translate-x-1 ${
                  active ? "font-medium text-ink" : "text-ink/70"
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
  compact = false,
}: {
  locale: Locale;
  dict: Dict;
  variant?: "dot" | "pill";
  /** Куда раскрывается панель. Если пилюля стоит внизу экрана —
   *  панель обязана идти вверх, иначе она уезжает за край. */
  placement?: "down" | "up";
  /** Узкая пилюля по ширине содержимого: только текущий язык и шеврон.
   *  Для бара мобильного меню, где на полные 268px места нет. */
  compact?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Триггер в шапке: фирменный значок-«кубик», разворачивается 3D-flip'ом
  const cubeRef = useRef<HTMLButtonElement>(null);
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
        // Свёрнуто: значок стоит лицевой (розовой) гранью к зрителю
        gsap.set(cubeRef.current, { rotationX: 0 });
      } else if (!compact) {
        // Свёрнуто: видно текущий язык, заголовок скрыт под ним.
        // В compact второй подписи нет — перелистывать нечего
        gsap.set(pillCurrentRef.current, { autoAlpha: 1, y: 0 });
        gsap.set(pillChooseRef.current, { autoAlpha: 0, y: 10 });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [variant, placement, compact]);

  // Раскрытие: точка растягивается в пилюлю с языком и шевроном
  // (как на референсе), следом выезжает панель, строки — каскадом
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (open) {
        if (variant === "dot") {
          // Значок разворачивается на 180° вокруг горизонтальной оси —
          // розовая грань (закрыто) уходит назад, тёмная грань со
          // стрелкой (открыто) встаёт на её место лицом к зрителю.
          // Раньше здесь круг растягивался в пилюлю с текстом — заменено
          // на flip, ближе к референсу с 3D-кубом
          gsap.to(cubeRef.current, {
            rotationX: 180,
            duration: 0.5,
            ease: "power3.inOut",
            overwrite: "auto",
          });
        }

        if (variant === "pill" && !compact) {
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
          // Флип обратно — чуть быстрее открытия, симметрично закрытию
          // мобильного меню и других оверлеев в проекте
          gsap.to(cubeRef.current, {
            rotationX: 0,
            duration: 0.4,
            ease: "power2.inOut",
            overwrite: "auto",
          });
        }

        if (variant === "pill" && !compact) {
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
  }, [open, variant, placement, compact]);

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
            остаётся меньше её высоты.
            По центру всего триггера (left-1/2 + translate), а не right-0:
            right-0 выравнивал панель по правому краю круга-шеврона —
            узкая панель (220px) против широкого триггера (пилюля+шеврон,
            ~324px) повисала перекошенной вправо, никак не читаясь как
            выпадение из-под самой кнопки */}
        <div
          ref={panelRef}
          className={`${panelClass} left-1/2 -translate-x-1/2 ${
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
          {compact ? (
            // Компакт: ширина по содержимому, одна подпись, без
            // перелистывания — в баре меню на 268px места нет
            <span className="fs-label grid h-12 shrink-0 items-center whitespace-nowrap rounded-full bg-white/10 px-5 font-medium text-cream transition-colors duration-300 hover:bg-white/15">
              {LOCALE_LABEL[locale]}
            </span>
          ) : (
            // Две подписи стопкой — при раскрытии они перелистываются.
            // min-w-0 + max-w-full: PILL_W здесь не жёсткая ширина,
            // а максимум — на экранах уже 375px пилюля ужимается,
            // вместо того чтобы вылезать за поля
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
          )}
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

  // dot — шапка, сразу после логотипа
  return (
    <div ref={rootRef} className="relative flex items-center">
      {/* Фирменный значок: розовый квадрат со вписанным кругом — тот же
          мотив, что у аватара в контактной форме и в фавиконе. Триггер
          не растёт в пилюлю, а разворачивается на 180° вокруг
          горизонтальной оси, как кубик: closed — розовая грань с белым
          кругом и символом языка; open — тёмная грань с розовым кругом
          и шевроном. perspective — на неподвижной обёртке (иначе объём
          не читается), сам flip — на кнопке через transform-style */}
      <div
        className="relative z-10 h-11 w-11 shrink-0"
        style={{ perspective: 600 }}
      >
        <button
          ref={cubeRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? dict.lang.close : dict.lang.change}
          aria-expanded={open}
          className="relative block h-11 w-11 outline-none [transform-style:preserve-3d]"
        >
          {/* Закрытая грань: без собственного поворота — лежит в той же
              плоскости, что и кнопка, поэтому видна первой */}
          <span className="absolute inset-0 grid place-items-center rounded-[14px] bg-blush [backface-visibility:hidden]">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-ink">
              <GlobeIcon size={14} />
            </span>
          </span>

          {/* Открытая грань: развёрнута на 180° заранее — когда кнопка
              довернётся до конца, суммарный поворот даст 360°, и грань
              встанет прямо, а не вверх ногами */}
          <span
            className="absolute inset-0 grid place-items-center rounded-[14px] bg-[#2d2d2d] [backface-visibility:hidden]"
            style={{ transform: "rotateX(180deg)" }}
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-blush text-ink">
              <Chevron />
            </span>
          </span>
        </button>
      </div>

      {/* Панель раскрывается вниз прямо из-под кружка, левым краем
          вровень с ним — не по центру всей шапки, как было.
          top: calc(100%+14px), а не хардкод — обёртка больше не h-full
          на все 100px бара, её высота теперь равна высоте самой кнопки */}
      <div
        ref={panelRef}
        className={`${panelClass} left-0 top-[calc(100%+14px)]`}
      >
        <Panel locale={locale} onPick={pick} />
      </div>
    </div>
  );
}

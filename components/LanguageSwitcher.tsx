"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import {
  LOCALES,
  LOCALE_LABEL,
  DEFAULT_LOCALE,
  swapLocale,
  type Locale,
} from "@/content/i18n";
import type { Dict } from "@/content/dict";

/** Ширина раскрытой пилюли с названием языка в шапке. */
const PILL_W = 268;

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
 * Панель выбора языка. Без флагов: слева название языка, справа —
 * статус перевода. Английский помечен как основной, остальные локали
 * честно подписаны как переведённые с помощью AI.
 */
function Panel({
  locale,
  dict,
  onPick,
}: {
  locale: Locale;
  dict: Dict;
  onPick: (l: Locale) => void;
}) {
  return (
    <ul className="px-6 py-3">
        {LOCALES.map((l) => {
          const active = l === locale;
          return (
            <li key={l}>
              <button
                data-lang-item
                type="button"
                onClick={() => onPick(l)}
                className="flex w-full items-baseline justify-between gap-8 py-2.5 text-left"
              >
                <span
                  className={`fs-body-m ${
                    active ? "font-medium text-ink" : "text-ink/80"
                  }`}
                >
                  {LOCALE_LABEL[l]}
                </span>
                <span
                  className={`fs-label shrink-0 ${
                    active ? "text-ink/70" : "text-ink/45"
                  }`}
                >
                  {l === DEFAULT_LOCALE
                    ? dict.lang.isDefault
                    : dict.lang.isTranslated}
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
}: {
  locale: Locale;
  dict: Dict;
  variant?: "dot" | "pill";
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Триггер в шапке: точка раскрывается в пилюлю с названием языка
  const pillRef = useRef<HTMLButtonElement>(null);
  const globeRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const chevRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Стартовое состояние панели и свёрнутого триггера
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(panelRef.current, {
        autoAlpha: 0,
        y: variant === "dot" ? -12 : 12,
        scale: 0.97,
      });
      gsap.set("[data-lang-item]", { autoAlpha: 0, y: 8 });

      if (variant === "dot") {
        // Свёрнуто: круг 44px с глобусом, ни названия, ни шеврона
        gsap.set(pillRef.current, { width: 44 });
        gsap.set(globeRef.current, { autoAlpha: 1, scale: 1 });
        gsap.set(labelRef.current, { autoAlpha: 0, x: -10 });
        gsap.set(chevRef.current, { scale: 0, autoAlpha: 0 });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [variant]);

  // Раскрытие: точка растягивается в пилюлю с языком и шевроном
  // (как на референсе), следом выезжает панель, строки — каскадом
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (open) {
        if (variant === "dot") {
          gsap.to(pillRef.current, {
            width: PILL_W,
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

        gsap.to(panelRef.current, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          delay: variant === "dot" ? 0.14 : 0,
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
        if (variant === "dot") {
          // Сворачивание в обратном порядке: сначала пилюля, потом глобус
          gsap.to(chevRef.current, {
            scale: 0,
            autoAlpha: 0,
            duration: 0.18,
            ease: "power2.in",
            overwrite: "auto",
          });
          gsap.to(labelRef.current, {
            autoAlpha: 0,
            x: -10,
            duration: 0.15,
            ease: "power2.in",
            overwrite: "auto",
          });
          gsap.to(pillRef.current, {
            width: 44,
            duration: 0.4,
            delay: 0.08,
            ease: "power3.inOut",
            overwrite: "auto",
          });
          gsap.to(globeRef.current, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.25,
            delay: 0.22,
            ease: "power2.out",
            overwrite: "auto",
          });
        }

        gsap.to(panelRef.current, {
          autoAlpha: 0,
          y: variant === "dot" ? -12 : 12,
          scale: 0.97,
          duration: 0.22,
          ease: "power2.in",
          overwrite: "auto",
        });
        gsap.set("[data-lang-item]", { autoAlpha: 0, y: 8, delay: 0.22 });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [open, variant]);

  // Закрытие по клику снаружи и Escape
  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
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
    "invisible absolute z-30 w-[min(380px,calc(100vw-3rem))] overflow-hidden rounded-[12px] border border-ink/15 bg-white text-ink opacity-0 shadow-[0_28px_60px_-20px_rgba(0,0,0,0.35)]";

  if (variant === "pill") {
    return (
      <div ref={rootRef} className="relative">
        {/* Панель раскрывается вверх — футер стоит внизу страницы */}
        <div
          ref={panelRef}
          className={`${panelClass} bottom-[calc(100%+14px)] right-0`}
        >
          <Panel locale={locale} dict={dict} onPick={pick} />
        </div>

        {/* Свёрнутое состояние: текущий язык + круг с шевроном */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={dict.lang.change}
          className="flex items-center gap-2"
        >
          <span className="fs-label rounded-full bg-white/10 px-6 py-3 font-medium text-cream transition-colors duration-300 hover:bg-white/15">
            {LOCALE_LABEL[locale]}
          </span>
          <span
            className={`grid h-12 w-12 place-items-center rounded-full bg-white/10 text-cream transition-all duration-300 hover:bg-white/15 ${
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
        <Panel locale={locale} dict={dict} onPick={pick} />
      </div>
    </div>
  );
}

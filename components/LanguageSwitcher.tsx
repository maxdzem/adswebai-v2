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

/** Стрелка вверх/вниз в кружке — закрывает панель. */
function CloseArrow({ up }: { up: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={up ? "" : "rotate-180"}
    >
      <path
        d="M12 19V5m0 0-6 6m6-6 6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
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
  onClose,
  closeArrowUp,
}: {
  locale: Locale;
  dict: Dict;
  onPick: (l: Locale) => void;
  onClose: () => void;
  closeArrowUp: boolean;
}) {
  return (
    <>
      {/* Шапка панели: заголовок + кнопка «свернуть» */}
      <div className="flex items-center justify-between gap-8 px-7 py-6">
        <span className="fs-body-m font-medium text-ink">
          {dict.lang.choose}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={dict.lang.close}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-cream transition-transform duration-300 hover:scale-105"
        >
          <CloseArrow up={closeArrowUp} />
        </button>
      </div>

      <div className="h-px bg-ink/15" />

      <ul className="px-7 py-3">
        {LOCALES.map((l) => {
          const active = l === locale;
          return (
            <li key={l}>
              <button
                data-lang-item
                type="button"
                onClick={() => onPick(l)}
                className="flex w-full items-baseline justify-between gap-8 py-3 text-left"
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
    </>
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
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Стартовое состояние панели — до первой анимации
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(panelRef.current, {
        autoAlpha: 0,
        y: variant === "dot" ? -12 : 12,
        scale: 0.97,
      });
      gsap.set("[data-lang-item]", { autoAlpha: 0, y: 8 });
    }, rootRef);

    return () => ctx.revert();
  }, [variant]);

  // Раскрытие: панель выезжает от триггера, строки — каскадом
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (open) {
        gsap.to(panelRef.current, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to("[data-lang-item]", {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.05,
          delay: 0.06,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else {
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
    "invisible absolute z-30 w-[min(460px,calc(100vw-3rem))] overflow-hidden rounded-[12px] border border-ink/15 bg-white text-ink opacity-0 shadow-[0_28px_60px_-20px_rgba(0,0,0,0.35)]";

  if (variant === "pill") {
    return (
      <div ref={rootRef} className="relative">
        {/* Панель раскрывается вверх — футер стоит внизу страницы */}
        <div
          ref={panelRef}
          className={`${panelClass} bottom-[calc(100%+14px)] right-0`}
        >
          <Panel
            locale={locale}
            dict={dict}
            onPick={pick}
            onClose={() => setOpen(false)}
            closeArrowUp={false}
          />
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
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={dict.lang.change}
        aria-expanded={open}
        className="absolute left-1/2 top-0 z-10 grid h-[44px] w-[44px] -translate-x-1/2 place-items-center rounded-full bg-[#2d2d2d] text-white/90 transition-transform duration-300 hover:scale-105"
      >
        <GlobeIcon />
      </button>

      {/* Панель раскрывается ВНИЗ из-под точки, по центру шапки */}
      <div
        ref={panelRef}
        className={`${panelClass} left-1/2 top-[58px] -translate-x-1/2`}
      >
        <Panel
          locale={locale}
          dict={dict}
          onPick={pick}
          onClose={() => setOpen(false)}
          closeArrowUp
        />
      </div>
    </div>
  );
}

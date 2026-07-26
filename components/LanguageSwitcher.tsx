"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { LOCALE_LABEL, swapLocale, type Locale } from "@/content/i18n";
import type { Dict } from "@/content/dict";

// Переключение реально меняет локаль в URL, сохраняя текущую страницу
const LANGS: { code: Locale; name: string; Flag: () => React.ReactElement }[] = [
  { code: "en", name: LOCALE_LABEL.en, Flag: FlagUS },
  { code: "ru", name: LOCALE_LABEL.ru, Flag: FlagRU },
];

const COLLAPSED = 44;
const PANEL_W = 236;

function FlagUS() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <rect width="24" height="24" fill="#f7f7f7" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={i * 1.846} width="24" height="1.846" fill="#c9243f" />
      ))}
      <rect width="11" height="9.23" fill="#2a3560" />
      {[1.6, 4.2, 6.8].map((y) =>
        [1.4, 3.6, 5.8, 8, 9.6].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.5" fill="#f7f7f7" />
        ))
      )}
    </svg>
  );
}

function FlagRU() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <rect width="24" height="8" fill="#f7f7f7" />
      <rect y="8" width="24" height="8" fill="#1c3b8b" />
      <rect y="16" width="24" height="8" fill="#c9243f" />
    </svg>
  );
}

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

function LangRow({
  lang,
  active,
  onPick,
}: {
  lang: (typeof LANGS)[number];
  active: boolean;
  onPick: () => void;
}) {
  return (
    <button
      data-lang-item
      type="button"
      onClick={onPick}
      className={`flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left transition-colors duration-200 ${
        active
          ? "bg-white/10 text-white"
          : "text-white/55 hover:bg-white/5 hover:text-white/85"
      }`}
    >
      <span className="h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15">
        <lang.Flag />
      </span>
      <span className="fs-label font-medium">{lang.name}</span>
    </button>
  );
}

/** Закрытие по клику мимо и Escape — общее для обоих вариантов. */
function useOutsideClose(
  open: boolean,
  rootRef: React.RefObject<HTMLDivElement | null>,
  close: () => void
) {
  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, rootRef, close]);
}

/**
 * Переключатель языка.
 *  - variant="dot"  — серая точка в шапке, морфится в шторку (как раньше)
 *  - variant="pill" — пилюля «Choose your language» в футере, меню
 *    выпадает ВВЕРХ тем же дизайном (тёмная панель, флаги, подсветка)
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
  const shellRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  // Активный язык берётся из URL, а не из локального стейта —
  // он остаётся верным при прямом заходе и при навигации назад
  const active = locale;

  useOutsideClose(open, rootRef, () => setOpen(false));

  // dot: морфинг точка → шторка
  useEffect(() => {
    if (variant !== "dot") return;

    const ctx = gsap.context(() => {
      // xPercent -50: шторка растёт из центра якоря 44×44 в шапке,
      // GSAP пересчитывает центр на каждом кадре анимации ширины
      gsap.set(shellRef.current, {
        xPercent: -50,
        width: COLLAPSED,
        height: COLLAPSED,
        borderRadius: 100,
      });
      gsap.set("[data-lang-item]", { autoAlpha: 0, y: 12 });

      const tl = gsap.timeline({ paused: true });

      tl.to(
        shellRef.current,
        {
          width: PANEL_W,
          height: () => panelRef.current?.offsetHeight ?? 140,
          borderRadius: 22,
          duration: 0.55,
          ease: "expo.out",
        },
        0
      )
        .to(
          globeRef.current,
          { autoAlpha: 0, scale: 0.5, duration: 0.15, ease: "power2.in" },
          0
        )
        .to(
          "[data-lang-item]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.045,
            ease: "power3.out",
          },
          0.12
        );

      tlRef.current = tl;
    }, rootRef);

    return () => ctx.revert();
  }, [variant]);

  // pill: панель выпадает вверх коротким fade+slide
  useEffect(() => {
    if (variant !== "pill") return;

    const ctx = gsap.context(() => {
      gsap.set(panelRef.current, { autoAlpha: 0, y: 10 });
      gsap.set("[data-lang-item]", { autoAlpha: 0, y: 8 });
    }, rootRef);

    return () => ctx.revert();
  }, [variant]);

  useEffect(() => {
    if (variant === "dot") {
      const tl = tlRef.current;
      if (!tl) return;
      if (open) tl.play();
      else tl.reverse();
      return;
    }

    // pill
    if (open) {
      gsap.to(panelRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.3,
        ease: "power3.out",
      });
      gsap.to("[data-lang-item]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.25,
        stagger: 0.05,
        delay: 0.05,
        ease: "power3.out",
        overwrite: "auto",
      });
    } else {
      gsap.to(panelRef.current, {
        autoAlpha: 0,
        y: 10,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.set("[data-lang-item]", { autoAlpha: 0, y: 8, delay: 0.2 });
    }
  }, [open, variant]);

  const pick = (code: Locale) => {
    setOpen(false);
    if (code === locale) return;
    // Переходим на ту же страницу в другой локали
    router.push(swapLocale(pathname, code));
  };

  if (variant === "pill") {
    return (
      <div ref={rootRef} className="relative">
        {/* Панель над пилюлей */}
        <div
          ref={panelRef}
          className="invisible absolute bottom-[calc(100%+12px)] right-0 w-[236px] rounded-[18px] bg-[#2d2d2d] p-2 opacity-0 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)]"
        >
          {LANGS.map((l) => (
            <LangRow
              key={l.code}
              lang={l}
              active={l.code === active}
              onPick={() => pick(l.code)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          // Ховер заметный: пилюля заливается кремовым и инвертирует текст
          className="fs-label group inline-flex items-center gap-3 rounded-full border border-white/30 px-5 py-2.5 transition-colors duration-300 hover:border-cream hover:bg-cream hover:text-ink"
        >
          {dict.lang.choose}
          {/* Стрелка указывает НАВЕРХ (-90°) — меню раскрывается вверх;
              в открытом состоянии переворачивается вниз, на «свернуть» */}
          <span
            className={`grid h-7 w-7 place-items-center rounded-full border border-white/25 transition-all duration-300 group-hover:border-ink/40 ${
              open ? "rotate-90" : "-rotate-90"
            }`}
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M1 7h11m0 0L7.5 2.5M12 7l-4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>
    );
  }

  // dot
  return (
    <div ref={rootRef} className="relative h-full w-full">
      {/* Серая точка (цвет панелей меню), раскрывается в тёмную шторку.
          Абсолют от центра якоря: раскрытие не расталкивает грид шапки */}
      <div
        ref={shellRef}
        className="absolute left-1/2 top-0 z-20 overflow-hidden bg-[#2d2d2d] text-white shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)]"
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={dict.lang.change}
          aria-expanded={open}
          className={`absolute left-0 top-0 z-10 grid h-[44px] w-[44px] place-items-center ${
            open ? "pointer-events-none" : ""
          }`}
        >
          <span ref={globeRef} className="grid place-items-center text-white/90">
            <GlobeIcon />
          </span>
        </button>

        <div
          ref={panelRef}
          className="absolute left-1/2 top-0 w-[236px] -translate-x-1/2 p-2"
        >
          {LANGS.map((l) => (
            <LangRow
              key={l.code}
              lang={l}
              active={l.code === active}
              onPick={() => pick(l.code)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

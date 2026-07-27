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

/** Залитый треугольник вниз — на открытой грани куба, крупнее и весомее
 *  тонкого штрихового шеврона. */
function TriangleDown({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 6h18L12 20 3 6z" />
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
  square = false,
}: {
  locale: Locale;
  onPick: (l: Locale) => void;
  /** Острые углы и компактная типографика — для панели куба: её высота
   *  зажата между верхом значка и чёрной линией низа шапки (68px), обычный
   *  fs-label туда не помещается на 3+ строках. */
  square?: boolean;
}) {
  return (
    <ul className={square ? "p-1" : "p-1.5"}>
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
              className={`group flex w-full items-center gap-2 text-left transition-colors duration-200 hover:bg-ink/[0.07] ${
                square ? "rounded-none px-2.5 py-1" : "rounded-[8px] px-3.5 py-2"
              }`}
            >
              <span
                aria-hidden
                className={`h-1.5 w-1.5 shrink-0 rounded-full bg-ink transition-opacity duration-200 ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />
              <span
                className={`transition-transform duration-200 group-hover:translate-x-1 ${
                  square ? "text-[15px] leading-[20px]" : "fs-label"
                } ${active ? "font-medium text-ink" : "text-ink/70"}`}
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
  // Внутренний под-куб, отвечающий ТОЛЬКО за цвет языка (вращение по Y).
  // Раньше язык крутился на том же элементе, что открытие/закрытие
  // (rotationX) — на RU кубик в покое уже стоял с rotationY:180, и клик
  // добавлял к нему ещё rotationX:90 НА ОДНОМ И ТОМ ЖЕ элементе. Два
  // поворота на разных осях одного transform не складываются как
  // независимые: результат — не «грань bottom прямо перед зрителем»,
  // а некоторый диагональный поворот куба, из-за чего треугольник на
  // открытой грани не вставал на место. Вложенный элемент разносит
  // оси по разным узлам: внешний cubeRef крутится только по X
  // (открытие), внутренний langCubeRef — только по Y (язык), и они
  // больше не комбинируются на одной матрице.
  const langCubeRef = useRef<HTMLSpanElement>(null);
  // Футерная пилюля: подпись переключается с текущего языка на заголовок
  const pillCurrentRef = useRef<HTMLSpanElement>(null);
  const pillChooseRef = useRef<HTMLSpanElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Стартовое состояние панели и свёрнутого триггера
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (variant === "dot") {
        // Панель — как ещё одна грань, откидывающаяся от правого борта
        // куба: сложена по вертикальной оси у левого края (там, где она
        // примыкает к кубу) и довёрнута на 90°, как и сам кубик рядом
        gsap.set(panelRef.current, {
          autoAlpha: 0,
          rotationY: -90,
          transformPerspective: 700,
          transformOrigin: "left center",
        });
        // Свёрнуто: значок стоит лицевой (розовой) гранью к зрителю
        gsap.set(cubeRef.current, { rotationX: 0 });
      } else {
        gsap.set(panelRef.current, {
          autoAlpha: 0,
          y: placement === "up" ? 12 : -12,
          scale: 0.97,
        });
      }
      gsap.set("[data-lang-item]", { autoAlpha: 0, y: 8 });

      if (variant === "pill" && !compact) {
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
          // Куб довёртывается на 90° вокруг X — грань bottom
          // (transform: rotateX(-90deg) ...) при таком повороте родителя
          // получает суммарные -90+90=0° и встаёт лицом к зрителю на
          // месте front. Дуга cubic-bezier(0,0,0.2,1) из референса —
          // это ease-out по кубической кривой, ближайший встроенный
          // аналог в GSAP: power2.out
          gsap.to(cubeRef.current, {
            rotationX: 90,
            duration: 0.4,
            ease: "power2.out",
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

        if (variant === "dot") {
          // Панель откидывается от куба тем же движением, что и его
          // собственная грань, — она стартует чуть позже, когда куб уже
          // начал доворачиваться, и укладывается в те же 0.4с
          gsap.to(panelRef.current, {
            autoAlpha: 1,
            rotationY: 0,
            duration: 0.4,
            delay: 0.08,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          gsap.to(panelRef.current, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.35,
            delay: 0.06,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
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
          // Куб возвращается в исходное положение — front снова лицом
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
        if (variant === "dot") {
          // Складывается обратно к кубу тем же движением, что открытие,
          // но без задержки — сразу вслед за строками
          gsap.to(panelRef.current, {
            autoAlpha: 0,
            rotationY: -90,
            duration: 0.32,
            ease: "power2.inOut",
            overwrite: "auto",
          });
        } else {
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

  // Колёсико над кубом (только dot-вариант, только настоящая мышь —
  // у тача и клавиатуры нет wheel-события, поэтому клик по кубу
  // по-прежнему открывает обычную панель, это основной путь).
  // Крутим по Y: каждый «щелчок» колеса переключает грань на другой
  // язык, у грани — свой цвет (розовый EN / фиолетовый RU). Пока
  // языков всего два, поворот — простой тумблер 0↔180°; больше двух
  // потребует настоящей карусели граней.
  const localeIndex = Math.max(0, LOCALES.indexOf(locale));
  const [previewIndex, setPreviewIndex] = useState(localeIndex);
  const hasPendingChange = previewIndex !== localeIndex;
  const wheelAccum = useRef(0);
  const cubeWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cubeWrapRef.current;
    if (!el || variant !== "dot") return;

    const onWheel = (e: WheelEvent) => {
      // preventDefault нужен, чтобы колесо над крошечным 36px-значком не
      // прокручивало страницу под курсором — React-овский onWheel это
      // делает в пассивном режиме и preventDefault там просто не сработает
      e.preventDefault();
      wheelAccum.current += e.deltaY;

      const STEP = 50;
      if (Math.abs(wheelAccum.current) < STEP) return;
      const dir = wheelAccum.current > 0 ? 1 : -1;
      wheelAccum.current = 0;

      setPreviewIndex((i) => (i + dir + LOCALES.length) % LOCALES.length);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [variant]);

  // Отвели мышь, не кликнув, — превью сбрасывается на реальный язык
  const resetPreview = () => {
    wheelAccum.current = 0;
    setPreviewIndex(localeIndex);
  };

  // Первый рендер: под-куб должен СРАЗУ стоять на грани текущего языка
  // страницы (например, открыли /ru — сразу фиолетовая), без анимации.
  // Все следующие смены previewIndex (колесо, сброс на mouseleave) —
  // уже настоящий, видимый доворот. Крутим langCubeRef, а НЕ cubeRef —
  // см. комментарий у объявления рефа.
  const cubeMounted = useRef(false);
  useEffect(() => {
    if (variant !== "dot" || !langCubeRef.current) return;

    if (!cubeMounted.current) {
      gsap.set(langCubeRef.current, { rotationY: previewIndex * 180 });
      cubeMounted.current = true;
      return;
    }

    gsap.to(langCubeRef.current, {
      rotationY: previewIndex * 180,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [previewIndex, variant]);

  // Пульсирующее кольцо-подсказка: пока выбор не подтверждён кликом
  useEffect(() => {
    if (variant !== "dot" || !cubeWrapRef.current) return;
    const ring = cubeWrapRef.current.querySelector<HTMLElement>(
      "[data-confirm-ring]"
    );
    if (!ring) return;

    if (hasPendingChange) {
      const tl = gsap.to(ring, {
        scale: 1.35,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power1.out",
        repeat: -1,
      });
      return () => {
        tl.kill();
        gsap.set(ring, { autoAlpha: 0, scale: 1 });
      };
    }
  }, [hasPendingChange, variant]);

  // Скругление и overflow — отдельными классами на каждый вариант:
  // у кубика (dot) панель прямоугольная и с внутренним скроллом (её
  // высота зажата между верхом значка и чёрной линией низа шапки),
  // у пилюли — как раньше, скруглённая и растущая по контенту
  const panelClass =
    "invisible absolute z-30 w-[min(220px,calc(100vw-3rem))] border border-ink/15 bg-white text-ink opacity-0 shadow-[0_28px_60px_-20px_rgba(0,0,0,0.35)]";

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
          className={`${panelClass} overflow-hidden rounded-[12px] left-1/2 -translate-x-1/2 ${
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

  // dot — шапка, сразу после логотипа.
  // rootRef растянут на всю высоту бара (100px, как у самой шапки) —
  // не по своему контенту, как раньше. Так у куба и у панели появляется
  // общий, точно известный ориентир по вертикали: 100% этой обёртки —
  // это низ шапки, где проходит чёрная линия. Куб абсолютно центрируется
  // внутри неё (top-1/2 -translate-y-1/2), а не выравнивается флексом —
  // без этого верх куба гулял бы на пару пикселей от метрик шрифта
  // логотипа, и панель ниже не могла бы встать вровень с ним.
  // Ширина — тоже явно w-9 (36px, как у куба): куб absolute, в потоке
  // rootRef ничего не осталось, и без явной ширины блок схлопывался
  // в 0 — тогда left-[calc(100%+14px)] у панели считался от нулевой
  // ширины и панель вставала прямо на куб вместо того, чтобы отступить
  // за его правый край.
  return (
    <div ref={rootRef} className="relative h-[100px] w-9 shrink-0">
      {/* Фирменный значок: розовый квадрат С ОСТРЫМИ УГЛАМИ, символ языка —
          белым по нему напрямую, без круга-подложки. Настоящий 4-гранный
          куб, как в референсе: perspective на неподвижной обёртке, сама
          кнопка — preserve-3d плюс постоянный сдвиг translateZ(-half),
          благодаря которому ось вращения проходит через центр куба, а не
          через переднюю грань. Грани разложены по X на ±90°/180°:
          front — закрыто (символ языка), bottom — открыто (шеврон);
          top/back держат те же цвета соседних граней про запас, они не
          участвуют в единственном используемом повороте 0↔90°, но делают
          коробку настоящей, а не бутафорской с одной стороной */}
      <div
        ref={cubeWrapRef}
        onMouseLeave={resetPreview}
        className="absolute left-0 top-1/2 z-10 h-9 w-9 shrink-0 -translate-y-1/2"
        style={{ perspective: 600 }}
      >
        {/* Кольцо-подсказка «нажмите, чтобы подтвердить»: пульсирует,
            пока превью (выбранное колёсиком) отличается от реального
            языка страницы. Живёт вне preserve-3d кнопки — иначе
            вращение куба крутило бы и его тоже */}
        <span
          data-confirm-ring
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[2px] opacity-0"
          style={{ boxShadow: "0 0 0 2px var(--color-blush)" }}
        />

        <button
          ref={cubeRef}
          type="button"
          onClick={() => {
            if (hasPendingChange) {
              // Колёсиком уже выбрали другой язык — клик подтверждает
              // его и переходит, вместо того чтобы открывать список
              pick(LOCALES[previewIndex]);
            } else {
              setOpen((v) => !v);
            }
          }}
          aria-label={
            hasPendingChange
              ? `${LOCALE_LABEL[LOCALES[previewIndex]]} — ${dict.lang.change}`
              : open
                ? dict.lang.close
                : dict.lang.change
          }
          aria-expanded={open}
          className="relative block h-9 w-9 outline-none [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-cream/60"
          style={{ transform: "translateZ(-18px)" }}
        >
          {/* «Слот» передней грани куба: сам НЕ вращается (только
              translateZ на глубину куба), поэтому при открытии/закрытии
              (rotationX внешней кнопки) уходит и возвращается ЦЕЛИКОМ,
              вместе с тем, что внутри — независимо от того, какой язык
              там сейчас показан. preserve-3d обязателен: иначе браузер
              схлопнул бы вложенный langCubeRef в плоскость */}
          <span
            className="absolute inset-0 [transform-style:preserve-3d]"
            style={{ transform: "translateZ(18px)" }}
          >
            {/* Под-куб языка: крутится ТОЛЬКО по Y, полностью отдельно
                от открытия/закрытия. Тонкий (halfZ=9 вместо 18) — ему не
                нужна глубина всего куба, только чтобы ось прошла по центру */}
            <span
              ref={langCubeRef}
              className="absolute inset-0 [transform-style:preserve-3d]"
              style={{ transform: "translateZ(-9px)" }}
            >
              {/* EN — фирменный розовый #FF0091, как в фавиконе вкладки */}
              <span
                className="absolute inset-0 grid place-items-center bg-[#FF0091] text-white [backface-visibility:hidden]"
                style={{ transform: "translateZ(9px)" }}
              >
                <GlobeIcon size={22} />
              </span>

              {/* RU — та же грань, развёрнутая на 180° по Y. Доворот
                  колёсиком с 0 до 180° показывает именно её.
                  Чёрная #000000, а не фиолетовая — по прямому запросу */}
              <span
                className="absolute inset-0 grid place-items-center bg-black text-white [backface-visibility:hidden]"
                style={{ transform: "rotateY(180deg) translateZ(9px)" }}
              >
                <GlobeIcon size={22} />
              </span>
            </span>
          </span>

          {/* top — верх коробки, чтобы при довороте по X не зияла пустота */}
          <span
            className="absolute inset-0 bg-[#FF0091] [backface-visibility:hidden]"
            style={{ transform: "rotateX(90deg) translateZ(18px)" }}
          />

          {/* Грани «back» здесь нет — она и не нужна: внешний куб ходит
              только 0↔90° по X (front-slot ↔ bottom), до 180° никогда
              не доворачивается, значит истинная задняя грань (z=-18)
              просто никогда не оказывается лицом к зрителю */}

          {/* bottom — открыто: доворот на 90° приводит именно её лицом
              к зрителю. Крупный залитый треугольник вниз, тот же
              фирменный розовый #FF0091, на тёмной грани */}
          <span
            className="absolute inset-0 grid place-items-center bg-[#2d2d2d] text-[#FF0091] [backface-visibility:hidden]"
            style={{ transform: "rotateX(-90deg) translateZ(18px)" }}
          >
            <TriangleDown size={24} />
          </span>
        </button>
      </div>

      {/* Панель раскрывается вправо от квадрата, вровень с его верхним
          краем (top: calc(50%-18px) — то же вычисление центра, что и у
          самого куба, minus половина его высоты) и не доходит до чёрной
          линии внизу шапки 4px (запас от верха куба — 100% - 32px = 68px,
          но вплотную к линии панель визуально с ней сливалась — граница
          читалась как «залезает»). h-[64px], а не max-h — панель всегда
          заполняет это место целиком. Шрифт и отступы строк подобраны
          так, чтобы ровно укладываться (64 = 8 паддинг панели + 2 × 28
          на строку); третий-четвёртый язык уйдут во внутренний скролл,
          а не сдвинут низ панели к линии. Острые углы — как у куба,
          не как у пилюли */}
      <div
        ref={panelRef}
        className={`${panelClass} overflow-y-auto rounded-none left-[calc(100%+14px)] top-[calc(50%-18px)] h-[64px]`}
      >
        <Panel locale={locale} onPick={pick} square />
      </div>
    </div>
  );
}

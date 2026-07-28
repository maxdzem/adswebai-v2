"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./Button";
import LanguageSwitcher from "./LanguageSwitcher";
import { getSolutions, getServices } from "@/content/resolve";
import { href, type Locale } from "@/content/i18n";
import type { Dict } from "@/content/dict";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Пункты и подменю. Подпункты собираются из того же контент-модуля,
// что рендерит страницы: добавил решение/услугу — оно само появилось
// в меню, и ссылка гарантированно ведёт на существующий роут.
// Все href прогоняются через href(locale, ...) — префикс языка в URL.
type NavItem = {
  label: string;
  href: string;
  submenu?: { label: string; href: string }[];
};

function buildNav(locale: Locale, dict: Dict): NavItem[] {
  const L = (p: string) => href(locale, p);

  return [
    {
      label: dict.nav.solutions,
      href: L("/solutions"),
      submenu: getSolutions(locale).map((p) => ({
        label: p.title,
        href: L(`/solutions/${p.slug}`),
      })),
    },
    {
      label: dict.nav.services,
      href: L("/services"),
      submenu: getServices(locale).map((p) => ({
        label: p.title,
        href: L(`/services/${p.slug}`),
      })),
    },
    { label: dict.nav.technology, href: L("/technology-services") },
    { label: dict.nav.work, href: L("/work") },
    {
      label: dict.nav.about,
      href: L("/about"),
      submenu: [
        { label: dict.nav.aboutSub.story, href: L("/about") },
        { label: dict.nav.aboutSub.leadership, href: L("/about/leadership") },
        { label: dict.nav.aboutSub.careers, href: L("/about/careers") },
        { label: dict.nav.aboutSub.newsroom, href: L("/about/newsroom") },
        { label: dict.nav.aboutSub.contact, href: L("/contact") },
      ],
    },
  ];
}

/** Шеврон вниз в кружке — раскрывает подменю в мобильном меню. */
function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
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

function ArrowRight() {
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

function Chevron() {
  return (
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      aria-hidden
      // Переворот на 180° + сдвиг вниз, transform .3s — как у dropdown-indicator
      className="transition-transform duration-300 group-hover:translate-y-[1px] group-hover:-rotate-180"
    >
      <path
        d="M1 1l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  const NAV = buildNav(locale, dict);
  const ref = useRef<HTMLElement>(null);
  // Всё, что уезжает вверх при скролле, живёт в barRef, а не в <header>.
  // Причина: GSAP оставляет на анимированном элементе transform (даже
  // нулевой — translate(0, 0)), а элемент с transform становится
  // containing block для position: fixed потомков. Пока твины висели на
  // <header>, мобильный оверлей с inset-0 растягивался не по вьюпорту,
  // а по 100-пиксельной полосе шапки — отсюда «плывёт и ничего не видно».
  const barRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  // Единственный источник правды: «кремовое полотно шапки показано».
  // Им же красится текст, им же — базовая видимость полос и линии, в одном
  // и том же рендере. Разойтись они физически не могут.
  //
  // Это принципиально: полотно и text-cream — ОДИН И ТОТ ЖЕ цвет #eae8e4,
  // так что любое расхождение делает шапку невидимой. Раньше цвет держал
  // React, а видимость полотна — GSAP, и стоило анимации не отработать
  // (упавшая гидрация, прерванный тикер), как шапка оставалась пустой
  // светлой полосой навсегда.
  //
  // barOn — НЕ «scrollY > 100»: он встаёт в true в момент начала включения
  // полотна и падает в false только когда глитч-выключение доиграло. Эта
  // асимметрия убирает 0.3с кремового по кремовому на каждом скролле вверх.
  // SSR всегда false — сервер отдаёт прозрачную шапку с кремовым текстом
  // поверх тёмного героя, и это валидное читаемое состояние.
  const [barOn, setBarOn] = useState(false);
  // Тёмный видео-герой есть только на главной. Определяем ПО МАРШРУТУ:
  // шапка живёт в layout и не перемонтируется при клиентских переходах,
  // поэтому разовая проверка DOM при маунте «залипала» на первом значении —
  // из-за этого на внутренних страницах логотип не розовел.
  const pathname = usePathname();

  // Оверлей запоминает маршрут, на котором его открыли, и считается
  // открытым только пока маршрут прежний. Так переход по ссылке закрывает
  // меню сам, без useEffect с setState на смену pathname — тот вызывал
  // лишний каскад рендеров (react-hooks/set-state-in-effect).
  const [menu, setMenu] = useState({ open: false, at: pathname });
  const menuOpen = menu.open && menu.at === pathname;
  // Какой пункт мобильного меню раскрыт (одновременно только один)
  const [openSub, setOpenSub] = useState<string | null>(null);

  const setMenuOpen = (next: boolean | ((open: boolean) => boolean)) => {
    setMenu((m) => {
      const open = m.open && m.at === pathname;
      return { open: typeof next === "function" ? next(open) : next, at: pathname };
    });
    // И открытие, и закрытие схлопывают аккордеон
    setOpenSub(null);
  };
  // Тёмный видео-герой есть только на главной каждой локали
  const darkHero = pathname === href(locale);

  useGSAP(
    () => {
      // Intro: контейнер 0.3s, пункты всплывают y:+30 за 0.5s, stagger 0.05
      const intro = gsap
        .timeline()
        .from(barRef.current, { autoAlpha: 0, duration: 0.3 })
        .from(
          "[data-nav-item]",
          {
            y: 30,
            autoAlpha: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
            clearProps: "all", // не оставляем инлайн-transform — иначе сломаются CSS-ховеры
          },
          "+=0.1"
        );

      // Страховка. gsap.from ставит стартовое состояние (autoAlpha: 0)
      // СРАЗУ при создании твина, а видимость возвращает только доиграв.
      // Значит любая заминка — ошибка в соседнем эффекте, прерванный
      // тикер, «отравленный» Fast Refresh — оставляет шапку пустой
      // навсегда: логотип успел проявиться, остальное так и висит
      // на нуле прозрачности. Через 3с принудительно снимаем инлайновые
      // стили, если таймлайн почему-то не дошёл до конца. Нормальный
      // прогон укладывается в ~1.2с, так что в штатном случае страховка
      // просто не срабатывает.
      // querySelectorAll по ref, а не строковый селектор: скоуп useGSAP
      // действует только на вызовы внутри тела колбэка, а этот код
      // выполнится позже, уже вне его — строка искала бы по всему документу.
      // Smart header: скрытие при скролле вниз, выезд при скролле вверх —
      // твин 0.5s power2.out (как sticky-твин референса).
      //
      // immediateRender НЕ трогать. С immediateRender: false твин
      // инициализируется сразу в конце (progress(1)) и на reverse уже не
      // возвращает стартовое yPercent: -100 — бар просто перестаёт прятаться
      // при скролле вниз. Замерено: transform оставался matrix(1,0,0,1,0,0)
      // на любой глубине прокрутки. Та же грабля, что у твинов прозрачности
      // в tvOff ниже.
      //
      // По умолчанию gsap.from уводит бар за верх экрана прямо при создании,
      // а следующая строка progress(1) возвращает его на место. Обе строки —
      // в одном layout-эффекте, кадр между ними не рисуется, мигания нет.
      const showAnim = gsap
        .from(barRef.current, {
          yPercent: -100,
          paused: true,
          duration: 0.5,
          ease: "power2.out",
        })
        .progress(1);

      // Глитч-выключение «выдернули кабель» (версия, которая понравилась):
      // сбой питания → полотно рвётся на пиксельные полосы, они дёргаются
      // в стороны ступенчатыми рывками (steps) и гаснут — всё за ~0.3s.
      // Reverse — такой же резкий глитч-вход.
      const strips = gsap.utils.toArray<HTMLElement>("[data-tv-strip]");

      // fromTo вместо to у всего, чьё состояние покоя теперь «спрятано»:
      // разметка приходит с сервера уже погашенной, и .to записал бы стартом
      // текущее (невидимое) состояние — reverse не включал бы ничего.
      // Стартовые значения задаём явно, и они ровно те, что описывает класс
      // opacity-100 в покое. Хореография — тайминги, смещения, easing,
      // разбросы — не менялась ни на йоту.
      //
      // immediateRender разный, и это НЕ небрежность:
      //
      // • у твина трансформа — false. По умолчанию fromTo применяет
      //   from-состояние сразу при создании, даже в паузе; здесь это лишний
      //   писк в DOM, и без него спокойнее.
      // • у твинов прозрачности — по умолчанию (true). С false они не
      //   восстанавливались на reverse: проверено замером — трансформ
      //   откатывался, а opacity залипала на нуле, и полотно не зажигалось
      //   при скролле. Риска это не несёт: скрытость в покое держит КЛАСС
      //   (invisible), а visibility классу не перебить инлайновой opacity —
      //   так что мелькнуть кремовым по кремовому полосы не могут.
      const tvOff = gsap
        .timeline({
          paused: true,
          // Полотно догорело — только теперь текст имеет право стать
          // кремовым. Пока полосы видны, barOn остаётся true и текст тёмный.
          onComplete: () => setBarOn(false),
        })
        // сбой питания: два жёстких моргания всего полотна.
        // Здесь .to намеренно: у bgRef оба конца таймлайна — opacity: 1,
        // разночтения быть не может, и разметка его не гасит.
        .to(bgRef.current, { opacity: 0.55, duration: 0.04, ease: "steps(1)" }, 0)
        .to(bgRef.current, { opacity: 1, duration: 0.04, ease: "steps(1)" }, 0.05)
        // полосы дёргаются вбок и рвутся — смещения кратны 8px, «пиксельно»
        .fromTo(
          strips,
          { x: 0, scaleX: 1, transformOrigin: "50% 50%" },
          {
            x: () => gsap.utils.random(-64, 64, 8),
            scaleX: () => gsap.utils.random(0.2, 0.9, 0.1),
            transformOrigin: () =>
              gsap.utils.random(0, 1, 1) ? "left center" : "right center",
            duration: 0.12,
            ease: "steps(2)",
            stagger: { each: 0.012, from: "random" },
            immediateRender: false,
          },
          0.1
        )
        // и гаснут ступенькой, вразнобой.
        // opacity, а не autoAlpha: autoAlpha пишет ещё и visibility, а она
        // теперь принадлежит классу (invisible при barOn=false). Плюс
        // autoAlpha не восстанавливается при reverse — проверено: transform
        // откатывался, а видимость залипала на hidden, и полотно не зажигалось.
        // Полосы декоративные (aria-hidden), кликать в них нечего — opacity
        // достаточно.
        .fromTo(
          strips,
          { opacity: 1 },
          {
            opacity: 0,
            duration: 0.08,
            ease: "steps(1)",
            stagger: { each: 0.01, from: "random" },
          },
          0.2
        )
        // линия: обрывок — и в ноль
        .fromTo(
          lineRef.current,
          { scaleX: 1 },
          {
            scaleX: 0.3,
            duration: 0.06,
            ease: "steps(1)",
            immediateRender: false,
          },
          0.1
        )
        .fromTo(
          lineRef.current,
          { opacity: 1 },
          { opacity: 0, duration: 0.05, ease: "steps(1)" },
          0.22
        );

      // Разметка пришла уже «выключенной» — ставим таймлайн в тот же конец.
      // Второй аргумент suppressEvents: onComplete не должен стрелять на
      // служебном прыжке, иначе setBarOn поедет мимо applyBar.
      tvOff.progress(1, true);

      // Единственная точка переключения полотна. animate=false — мгновенно
      // (загрузка, восстановление скролла после F5), animate=true — с глитчем.
      let barWanted = false;
      const applyBar = (next: boolean, animate: boolean) => {
        if (next === barWanted) return;
        barWanted = next;

        if (next) {
          // Текст темнеет сразу: полотно уже едет, а переход 300мс его
          // догонит. Тёмное по кремовому в худшем случае бледновато, но
          // никогда не сливается.
          setBarOn(true);
          if (animate) tvOff.reverse();
          else tvOff.progress(0, true);
        } else if (animate) {
          // barOn снимет onComplete — когда полос уже не будет
          tvOff.play();
        } else {
          tvOff.progress(1, true);
          setBarOn(false);
        }
      };

      // Стартовая синхронизация с РЕАЛЬНОЙ позицией скролла: без неё
      // перезагрузка на прокрученной странице оставляла barOn=false, то есть
      // кремовый текст поверх кремовых секций.
      // window читаем ТОЛЬКО здесь: useGSAP — layout-эффект, на сервере он не
      // выполняется (SSR всегда отдаёт barOn=false, гидрация совпадает),
      // а на клиенте отрабатывает до пейнта, так что перерисовки не видно.
      applyBar(
        (window.scrollY || document.documentElement.scrollTop || 0) > 100,
        false
      );

      // Прозрачная ТОЛЬКО на самом верху (первые 100px, момент загрузки).
      // Дальше — светлая везде, включая зону видео при скролле вверх.
      // Вниз — прячется, вверх — выезжает.
      ScrollTrigger.create({
        start: 0,
        end: "max",
        // refresh стреляет и при создании триггера, и после window load /
        // resize — то есть уже ПОСЛЕ того, как браузер восстановил позицию
        // скролла при F5. Один замер выше это не ловит: там восстановление
        // могло ещё не произойти. Повторный вызов гасит guard в applyBar.
        onRefresh: (self) => applyBar(self.scroll() > 100, false),
        onUpdate: (self) => {
          const y = self.scroll();
          applyBar(y > 100, true);
          if (y <= 120 || self.direction === -1) showAnim.play();
          else showAnim.reverse();
        },
      });

      // Страховка. gsap.from ставит стартовое состояние (autoAlpha: 0)
      // СРАЗУ при создании твина, а видимость возвращает только доиграв.
      // Значит любая заминка — ошибка в соседнем эффекте, прерванный
      // тикер, «отравленный» Fast Refresh — оставляет шапку пустой
      // навсегда: логотип успел проявиться, остальное так и висит
      // на нуле прозрачности. Через 3с принудительно снимаем инлайновые
      // стили, если таймлайн почему-то не дошёл до конца. Нормальный
      // прогон укладывается в ~1.2с, так что в штатном случае страховка
      // просто не срабатывает.
      // querySelectorAll по ref, а не строковый селектор: скоуп useGSAP
      // действует только на вызовы внутри тела колбэка, а этот код
      // выполнится позже, уже вне его — строка искала бы по всему документу.
      const safety = window.setTimeout(() => {
        if (intro.progress() < 1) {
          const items = ref.current?.querySelectorAll("[data-nav-item]");
          if (items?.length) gsap.set(items, { clearProps: "all" });
          gsap.set(barRef.current, { clearProps: "opacity,visibility" });
        }

        // Полотно застряло на полпути — роняем инлайн-стили полос и линии.
        // Базовое состояние теперь живёт в классах от barOn, а barOn — то же
        // значение, которым покрашен текст, так что после сброса они заведомо
        // согласованы. Раньше такой сброс сделал бы полосы кремовыми под
        // кремовым текстом, поэтому страховка их и не трогала.
        const p = tvOff.progress();
        if (p > 0 && p < 1) {
          const s = ref.current?.querySelectorAll("[data-tv-strip]");
          if (s?.length) gsap.set(s, { clearProps: "all" });
          gsap.set(lineRef.current, { clearProps: "all" });
        }
      }, 3000);

      return () => window.clearTimeout(safety);
    },
    { scope: ref }
  );

  // Мобильное меню: ОДИН постоянный таймлайн, вперёд на открытие и
  // реверсом на закрытие.
  //
  // Раньше твины пересоздавались на каждый тоггл внутри gsap.context, а его
  // cleanup вызывал ctx.revert() — тот срывал инлайновые стили ещё ДО старта
  // закрытия, поэтому анимации закрытия фактически не было: меню схлопывалось
  // за один кадр, а быстрые клики рвали её посередине. Реверс даёт
  // симметричное закрытие бесплатно и переживает любой темп кликов.
  useGSAP(
    () => {
      const el = menuRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const reduce = !!(ctx.conditions as { reduce: boolean }).reduce;

          const tl = gsap.timeline({
            paused: true,
            onReverseComplete: () => gsap.set(el, { visibility: "hidden" }),
          });

          tl.fromTo(
            el,
            { "--m-rx": "0%", "--m-ry": "0%" },
            {
              "--m-rx": "150%",
              "--m-ry": "150%",
              duration: reduce ? 0.12 : 0.6,
              ease: reduce ? "none" : "power2.out",
            },
            0
          )
            // amount вместо each: суммарный разбег фиксирован, сколько бы
            // пунктов ни было в локали
            .fromTo(
              "[data-menu-item]",
              { autoAlpha: 0, y: reduce ? 0 : 12 },
              {
                autoAlpha: 1,
                y: 0,
                duration: reduce ? 0.12 : 0.4,
                ease: "power2.out",
                stagger: { amount: reduce ? 0 : 0.18 },
              },
              reduce ? 0 : 0.12
            );

          menuTl.current = tl;
          return () => {
            menuTl.current = null;
          };
        }
      );

      return () => mm.revert();
    },
    { scope: menuRef }
  );

  // Прокрутка страницы под оверлеем блокируется классом lenis-stopped —
  // он описан в globals.css и останавливает именно Lenis.
  useEffect(() => {
    const el = menuRef.current;
    const tl = menuTl.current;

    if (el && tl) {
      if (menuOpen) {
        gsap.set(el, { visibility: "visible" });
        tl.timeScale(1).play();
      } else {
        // Закрытие в 1.6 раза быстрее открытия — уходить меню должно резче
        tl.timeScale(1.6).reverse();
      }
    }

    document.documentElement.classList.toggle("lenis-stopped", menuOpen);
  }, [menuOpen]);

  useEffect(
    () => () => document.documentElement.classList.remove("lenis-stopped"),
    []
  );

  // Базовое, НЕ анимационное состояние полотна и линии. Во время твина GSAP
  // пишет инлайн-стили и побеждает класс; но оба конца твина — ровно эти два
  // классовых состояния, поэтому в покое класс и инлайн всегда совпадают.
  // Если GSAP не отработал вовсе (упала гидрация, дерево пересобралось) —
  // читается класс, и шапка всё равно корректна.
  // opacity-0 И invisible вместе: autoAlpha у GSAP пишет обе величины,
  // и пара должна зеркалить его один в один.
  const canvas = barOn ? "opacity-100" : "opacity-0 invisible";

  return (
    // Сам header всегда прозрачный: светлое полотно и линия — отдельные
    // слои-«кинескопы» (bgRef/lineRef), которыми управляет tvOff-таймлайн.
    // Цвет текста переключается плавно.
    <header
      ref={ref}
      // data-site-header / data-bar — опора для правила «без JS» в globals.css
      // и одна греппаемая точка для отладки: состояние шапки видно в DOM.
      data-site-header
      data-bar={barOn ? "on" : "off"}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        // Прозрачное состояние: кремовый текст поверх тёмного видео главной,
        // но тёмный — поверх светлого фона внутренних страниц, иначе логотип
        // сливается с фоном. Сам эффект прозрачности при этом сохраняется.
        barOn || !darkHero ? "text-ink" : "text-cream"
      }`}
    >
      {/* Обёртка со всеми слоями шапки. Именно она ездит по Y и гаснет —
          transform остаётся здесь, а <header> без него, чтобы мобильный
          оверлей ниже мерил inset-0 по вьюпорту. z-index: auto —
          собственного контекста наложения не создаёт, порядок
          (полосы -z-10 → бар → оверлей z-40 → бургер z-50) сохраняется */}
      <div ref={barRef} className="relative">
      {/* Светлое полотно шапки: 7 горизонтальных полос-«пикселей»,
          при выключении они дёргаются вбок и рвутся глитчем */}
      <div ref={bgRef} aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            data-tv-strip
            // bg-cream — ТОТ ЖЕ токен, что и text-cream (#eae8e4). Написано
            // токеном, а не хексом, чтобы связь «полотно = цвет текста» была
            // видна прямо в коде: text-cream законен ровно тогда, когда полосы
            // погашены, и ни в какой другой момент.
            className={`absolute inset-x-0 bg-cream ${canvas}`}
            style={{ top: `${(i / 7) * 100}%`, height: `${100 / 7 + 0.3}%` }}
          />
        ))}
      </div>
      {/* Тонкая линия по низу: обрывается вместе с глитчем */}
      <div
        ref={lineRef}
        data-header-line
        aria-hidden
        className={`absolute inset-x-0 bottom-0 -z-10 h-px origin-left bg-black ${canvas}`}
      />

      <div className="flex h-[100px] items-center justify-between px-6 lg:px-10">
        {/* Логотип и переключатель языка — одна группа слева: раньше
            точка висела по центру всего зазора до меню и на широких
            экранах уезжала далеко от логотипа. Теперь она — следующий
            элемент сразу за .adswebai, с ровным фиксированным зазором */}
        <div className="flex min-w-0 items-center gap-4 lg:gap-6">
          {/* На внутренних страницах логотип розовый (цвет круга с
              лендинга), но только наверху: при скролле на светлой шапке
              он снова тёмно-серый, как на лендинге. На главной — цвет
              темы шапки */}
          <Link
            href={href(locale)}
            data-nav-item
            data-header-logo
            aria-label={dict.nav.home}
            className={`shrink-0 text-[32px] font-black tracking-normal transition-colors duration-300 ${
              darkHero || barOn ? "" : "text-blush"
            }`}
          >
            .adswebai
          </Link>

          {/* xl, а не lg: логотип shrink-0 не сжимается, и на 1024–1240px
              он вместе с кубом наезжал на «Solutions» — меню физически
              помещается только с ~1240px. До этого работает бургер. */}
          <div data-nav-item className="hidden xl:flex">
            <LanguageSwitcher locale={locale} dict={dict} />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-10">
          <ul
            data-header-nav
            className="fs-label hidden items-center gap-10 font-medium xl:flex"
          >
            {NAV.map((item) => (
              <li
                key={item.label}
                data-nav-item
                className="nav-item group relative flex items-center"
              >
                {/* Точка-маркер: падает слева при ховере (dot-in/dot-out) */}
                <span
                  aria-hidden
                  className="nav-dot pointer-events-none absolute -left-[15px] top-1/2 h-2 w-2 rounded-full bg-current"
                />

                <Link href={item.href} className="flex items-center gap-1.5 py-2">
                  <span className="nav-label inline-block">{item.label}</span>
                  {item.submenu && <Chevron />}
                </Link>

                {/* Выпадающая панель. Обёртка начинается от верха пункта
                    (top-0) и сдвинута на -30px влево (= padding панели),
                    панель отодвинута mt-9 — мёртвой зоны под курсором нет.
                    По аудиту: появление — ЧИСТЫЙ fade за 0.08s, без слайда
                    (visibility+opacity вместо display, иначе fade не работает);
                    тень всегда светлая rgba(255,255,255,.15).
                    group-focus-within — для клавиатуры: панель скрыта через
                    visibility, поэтому ссылки внутри неё в таб-порядок не
                    попадают. Фокус на самом пункте меню (он тоже внутри
                    .group) раскрывает панель, и дальше Tab идёт по
                    подпунктам, удерживая её открытой */}
                {item.submenu && (
                  <div className="invisible absolute -left-[30px] top-0 z-20 opacity-0 transition-opacity duration-[80ms] group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <ul className="mt-9 min-w-[155px] rounded-[4px] bg-ink px-[30px] py-[20px] text-[#E4E4E5] shadow-[0_20px_40px_-16px_rgba(255,255,255,0.15)]">
                      {item.submenu.map((sub) => (
                        <li
                          key={sub.href}
                          className="submenu-item group/sub relative"
                        >
                          {/* Точка активного подпункта */}
                          <span
                            aria-hidden
                            className="subitem-dot pointer-events-none absolute left-[2px] top-1/2 h-2 w-2 rounded-full bg-current"
                          />
                          {/* Текст уезжает вправо на 19px за 150мс */}
                          <Link
                            href={sub.href}
                            className="block whitespace-nowrap py-[6px] transition-transform duration-150 group-hover/sub:translate-x-[19px] group-focus-within/sub:translate-x-[19px]"
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Connect: та же swap-анимация, что у «Read now»;
              ховер-зона — вся ссылка (data-btn-hover) */}
          {/* На мобильном Connect живёт в баре самого меню (ниже):
              в 375px-строке пилюля 144px не помещалась рядом с логотипом
              и бургером и всё сжимала */}
          <Link
            href={href(locale, "/contact")}
            data-btn-hover
            data-nav-item
            className="hidden xl:block"
          >
            {/* На светлой шапке: область #222824, надпись и стрелка белые.
                На прозрачной поверх тёмного видео — кремовая с тёмным текстом.
                На прозрачной поверх светлой страницы кремовая кнопка утонула
                бы в фоне, поэтому там тоже тёмная. */}
            <Button
              label={dict.nav.connect}
              href={null}
              colorClass={
                barOn || !darkHero
                  ? "bg-[#222824] text-white"
                  : "bg-cream text-ink"
              }
            />
          </Link>
          </div>
        </div>
      </div>

      {/* Бургер — прямой потомок <header>, НЕ часть barRef. barRef получает
          transform от GSAP (прячет бар при скролле), а transform создаёт
          собственный контекст наложения: z-50 бургера тогда сравнивался бы
          не с z-40 оверлея на уровне <header>, а только с соседями внутри
          barRef — и оверлей рисовался поверх кнопки. Крестика не было видно
          именно поэтому. absolute вместо места в flex-строке: правый край
          и вертикальный центр 100px-бара совпадают с прежней позицией,
          а header (position: fixed, без transform) — её containing block.
          Из-за этого бургер больше не прячется вместе с шапкой при скролле
          вниз — это осознанный компромисс: кнопка открытия/закрытия меню
          должна быть доступна всегда.
          Три линии 34px, hit-area 48×48, переход .3s cubic-bezier(.455,.03,.515,.955).
          В открытом состоянии складывается в крестик. Полоски всегда
          кремовые при открытом меню: bg-current брал цвет шапки, и на
          внутренних страницах крестик выходил #2d2d2d на фоне оверлея
          #191715 — его было не разглядеть. */}
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? dict.nav.menuClose : dict.nav.menuOpen}
        aria-expanded={menuOpen}
        data-nav-item
        className={`absolute right-6 top-1/2 z-50 h-[20px] w-[40px] -translate-y-1/2 transition-colors duration-300 after:absolute after:-inset-x-[4px] after:-inset-y-[14px] after:content-[''] xl:hidden ${
          menuOpen ? "text-cream" : ""
        }`}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden
            className={`absolute left-1/2 h-[1.5px] w-[34px] -translate-x-1/2 bg-current transition-transform duration-300 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] ${
              i === 0 ? "top-0" : i === 1 ? "top-1/2 -translate-y-1/2" : "bottom-0"
            } ${
              menuOpen
                ? i === 0
                  ? "translate-y-[9px] rotate-45"
                  : i === 1
                    ? "scale-x-0"
                    : "-translate-y-[9px] -rotate-45"
                : ""
            }`}
          />
        ))}
      </button>

      {/* Мобильный оверлей: раскрывается эллиптической маской из точки
          у бургера — приём из референса. Радиус лежит в CSS-переменной,
          её анимирует GSAP. Свой бар сверху (Меню + Connect), список
          по центру: крупные строки с кружком справа — шеврон у пунктов
          с подменю, стрелка у прямых ссылок. */}
      <div
        ref={menuRef}
        className="invisible fixed inset-x-0 top-0 z-40 flex h-[100dvh] flex-col overflow-y-auto overscroll-contain bg-[#191715] px-6 text-cream xl:hidden"
        style={{
          // Центр эллипса больше не едет — только радиусы. 150% с запасом
          // накрывают дальний угол (нужно ≥128%), а прежний проезд центра
          // с back.out давал перелёт и возврат: это и «плыло»
          clipPath: "ellipse(var(--m-rx, 0%) var(--m-ry, 0%) at 88% 7.5%)",
        }}
      >
        {/* Собственный бар меню той же высоты 100px, что и шапка: подпись
            «Меню» слева, выбор языка справа. pr-[64px] — коридор под
            крестик: он лежит на z-50 поверх оверлея, его хит-зона
            начинается в 68px от правого края, контент бара кончается
            в 88px — зазор 20px на любой ширине экрана */}
        <div
          data-menu-item
          className="flex h-[100px] shrink-0 items-center justify-end gap-4 pr-[64px]"
        >
          {/* Ниже 360px подпись уходит: иначе пилюля языка не помещается */}
          <span className="fs-label mr-auto hidden font-medium min-[360px]:inline">
            {dict.nav.menu}
          </span>

          {/* variant="pill": вариант-точка меряет [data-header-nav],
              который на мобильном display:none, из-за чего пилюля
              никогда не раскрывалась. В баре места под полную ширину
              нет, поэтому compact — только текущий язык и шеврон */}
          <LanguageSwitcher
            locale={locale}
            dict={dict}
            variant="pill"
            compact
          />
        </div>

        {/* my-auto вместо justify-center на родителе: пока места хватает,
            список стоит оптически по центру, а когда контент выше экрана,
            авто-поля схлопываются в ноль и всё доскроливается.
            justify-center так не умеет — верх контента уезжал
            за scrollTop: 0 и был недостижим */}
        <div className="my-auto w-full shrink-0 py-4">
        <nav>
          <ul>
            {NAV.map((item) => {
              const expanded = openSub === item.label;

              return (
                <li
                  key={item.label}
                  data-menu-item
                  className="border-b border-cream/15"
                >
                  <div className="flex items-center justify-between gap-4 py-5">
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-[30px] font-bold leading-[1.1] tracking-normal"
                    >
                      {item.label}
                    </Link>

                    {item.submenu ? (
                      <button
                        type="button"
                        onClick={() => setOpenSub(expanded ? null : item.label)}
                        aria-expanded={expanded}
                        aria-label={item.label}
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 transition-colors duration-300 hover:bg-white/15"
                      >
                        <ChevronDown open={expanded} />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        aria-hidden
                        tabIndex={-1}
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 transition-colors duration-300 hover:bg-white/15"
                      >
                        <ArrowRight />
                      </Link>
                    )}
                  </div>

                  {/* Аккордеон на grid-rows: высота едет плавно, без замера
                      контента и без прыжка от display:none */}
                  {item.submenu && (
                    <div
                      className={`grid overflow-hidden transition-all duration-300 ease-out ${
                        expanded ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
                      }`}
                    >
                      <ul className="min-h-0">
                        {item.submenu.map((sub) => (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              onClick={() => setMenuOpen(false)}
                              className="fs-label block py-2 text-cream/60"
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}

            {/* Connect отдельной строкой списка нет — он стоит пилюлей
                под списком. Так строк на одну меньше, и на экране
                375×667 всё помещается без скролла */}
          </ul>
        </nav>

        {/* Connect — по центру под списком, крупнее остальных пунктов:
            это единственный CTA в оверлее. Фон оверлея всегда тёмный,
            поэтому цвет пилюли фиксированный и не зависит от
            scrolled/darkHero, как в шапке. size="lg" + active:scale
            в Button — тактильный отклик на тап, раньше кнопка вообще
            никак не реагировала на нажатие на тач-экране: JS-анимация
            стрелки нарочно не биндится без настоящего курсора */}
        <div data-menu-item className="mt-10 flex justify-center">
          <Link
            href={href(locale, "/contact")}
            onClick={() => setMenuOpen(false)}
            data-btn-hover
            className="block shrink-0"
          >
            <Button
              label={dict.nav.connect}
              href={null}
              size="lg"
              colorClass="bg-cream text-ink"
            />
          </Link>
        </div>
        </div>
      </div>
    </header>
  );
}

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
  const tvRef = useRef<gsap.core.Timeline | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const [scrolled, setScrolled] = useState(false);
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
      gsap
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

      // Smart header: скрытие при скролле вниз, выезд при скролле вверх —
      // твин 0.5s power2.out (как sticky-твин референса)
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

      const tvOff = gsap
        .timeline({ paused: true })
        // сбой питания: два жёстких моргания всего полотна
        .to(bgRef.current, { opacity: 0.55, duration: 0.04, ease: "steps(1)" }, 0)
        .to(bgRef.current, { opacity: 1, duration: 0.04, ease: "steps(1)" }, 0.05)
        // полосы дёргаются вбок и рвутся — смещения кратны 8px, «пиксельно»
        .to(
          strips,
          {
            x: () => gsap.utils.random(-64, 64, 8),
            scaleX: () => gsap.utils.random(0.2, 0.9, 0.1),
            transformOrigin: () =>
              gsap.utils.random(0, 1, 1) ? "left center" : "right center",
            duration: 0.12,
            ease: "steps(2)",
            stagger: { each: 0.012, from: "random" },
          },
          0.1
        )
        // и гаснут ступенькой, вразнобой
        .to(
          strips,
          {
            autoAlpha: 0,
            duration: 0.08,
            ease: "steps(1)",
            stagger: { each: 0.01, from: "random" },
          },
          0.2
        )
        // линия: обрывок — и в ноль
        .to(
          lineRef.current,
          { scaleX: 0.3, duration: 0.06, ease: "steps(1)" },
          0.1
        )
        .to(
          lineRef.current,
          { autoAlpha: 0, duration: 0.05, ease: "steps(1)" },
          0.22
        );

      // Страница грузится на самом верху — фон уже «выключен»
      tvOff.progress(1);
      tvRef.current = tvOff;

      // Прозрачная ТОЛЬКО на самом верху (первые 100px, момент загрузки).
      // Дальше — светлая везде, включая зону видео при скролле вверх.
      // Вниз — прячется, вверх — выезжает.
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          setScrolled(y > 100);
          if (y <= 120 || self.direction === -1) showAnim.play();
          else showAnim.reverse();
        },
      });
    },
    { scope: ref }
  );

  // scrolled=false → play (выключение ТВ), scrolled=true → reverse (включение)
  useEffect(() => {
    const tv = tvRef.current;
    if (!tv) return;
    if (scrolled) tv.reverse();
    else tv.play();
  }, [scrolled]);

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

  return (
    // Сам header всегда прозрачный: светлое полотно и линия — отдельные
    // слои-«кинескопы» (bgRef/lineRef), которыми управляет tvOff-таймлайн.
    // Цвет текста переключается плавно.
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        // Прозрачное состояние: кремовый текст поверх тёмного видео главной,
        // но тёмный — поверх светлого фона внутренних страниц, иначе логотип
        // сливается с фоном. Сам эффект прозрачности при этом сохраняется.
        scrolled || !darkHero ? "text-ink" : "text-cream"
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
            className="absolute inset-x-0 bg-[#EAE8E4]"
            style={{ top: `${(i / 7) * 100}%`, height: `${100 / 7 + 0.3}%` }}
          />
        ))}
      </div>
      {/* Тонкая линия по низу: обрывается вместе с глитчем */}
      <div
        ref={lineRef}
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-px origin-left bg-black"
      />

      <div className="flex h-[100px] items-center justify-between px-6 lg:px-10">
        {/* На внутренних страницах логотип розовый (цвет круга с лендинга),
            но только наверху: при скролле на светлой шапке он снова
            тёмно-серый, как на лендинге. На главной — цвет темы шапки */}
        <Link
          href={href(locale)}
          data-nav-item
          data-header-logo
          aria-label={dict.nav.home}
          className={`justify-self-start text-[32px] font-black tracking-normal transition-colors duration-300 ${
            darkHero || scrolled ? "" : "text-blush"
          }`}
        >
          .adswebai
        </Link>

        {/* Переключатель — не оверлеем, а полноценным flex-элементом:
            flex-1 забирает весь свободный зазор между логотипом и меню,
            justify-center держит точку в его середине. Когда меню шире
            (или окно уже — открытые девтулзы), зазор сжимается и точка
            уезжает вместе с ним. Наехать на «Решения» она уже не может:
            это соседние элементы одной строки, а не наложенные слои. */}
        <div
          data-nav-item
          className="hidden min-w-0 flex-1 justify-center px-4 lg:flex"
        >
          <LanguageSwitcher locale={locale} dict={dict} />
        </div>

        <div className="flex shrink-0 items-center gap-10">
          <ul
            data-header-nav
            className="fs-label hidden items-center gap-10 font-medium lg:flex"
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
            className="hidden lg:block"
          >
            {/* На светлой шапке: область #222824, надпись и стрелка белые.
                На прозрачной поверх тёмного видео — кремовая с тёмным текстом.
                На прозрачной поверх светлой страницы кремовая кнопка утонула
                бы в фоне, поэтому там тоже тёмная. */}
            <Button
              label={dict.nav.connect}
              href={null}
              colorClass={
                scrolled || !darkHero
                  ? "bg-[#222824] text-white"
                  : "bg-cream text-ink"
              }
            />
          </Link>

          {/* Бургер — только на мобильных. По референсу: три линии 34px,
              hit-area 48×48, переход .3s cubic-bezier(.455,.03,.515,.955).
              В открытом состоянии складывается в крестик.
              При открытом меню полоски всегда кремовые: bg-current брал
              цвет шапки, и на внутренних страницах крестик выходил
              #2d2d2d на фоне оверлея #191715 — его было не разглядеть. */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? dict.nav.menuClose : dict.nav.menuOpen}
            aria-expanded={menuOpen}
            data-nav-item
            className={`relative z-50 h-[20px] w-[40px] shrink-0 transition-colors duration-300 after:absolute after:-inset-x-[4px] after:-inset-y-[14px] after:content-[''] lg:hidden ${
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
          </div>
        </div>
      </div>

      {/* Мобильный оверлей: раскрывается эллиптической маской из точки
          у бургера — приём из референса. Радиус лежит в CSS-переменной,
          её анимирует GSAP. Свой бар сверху (Меню + Connect), список
          по центру: крупные строки с кружком справа — шеврон у пунктов
          с подменю, стрелка у прямых ссылок. */}
      <div
        ref={menuRef}
        className="invisible fixed inset-x-0 top-0 z-40 flex h-[100dvh] flex-col overflow-y-auto overscroll-contain bg-[#191715] px-6 text-cream lg:hidden"
        style={{
          // Центр эллипса больше не едет — только радиусы. 150% с запасом
          // накрывают дальний угол (нужно ≥128%), а прежний проезд центра
          // с back.out давал перелёт и возврат: это и «плыло»
          clipPath: "ellipse(var(--m-rx, 0%) var(--m-ry, 0%) at 88% 7.5%)",
        }}
      >
        {/* Собственный бар меню той же высоты 100px, что и шапка: подпись
            «Меню» слева, кнопка Connect справа. pr-[64px] — коридор под
            крестик: он лежит на z-50 поверх оверлея, его хит-зона
            начинается в 68px от правого края, контент бара кончается
            в 88px — зазор 20px на любой ширине экрана */}
        <div
          data-menu-item
          className="flex h-[100px] shrink-0 items-center justify-end gap-4 pr-[64px]"
        >
          {/* Ниже 360px подпись уходит: иначе «Связаться» не помещается */}
          <span className="fs-label mr-auto hidden font-medium min-[360px]:inline">
            {dict.nav.menu}
          </span>

          {/* Фон оверлея всегда тёмный, поэтому цвет пилюли фиксированный
              и не зависит от scrolled/darkHero, как в шапке */}
          <Link
            href={href(locale, "/contact")}
            onClick={() => setMenuOpen(false)}
            data-btn-hover
            className="block shrink-0"
          >
            <Button
              label={dict.nav.connect}
              href={null}
              colorClass="bg-cream text-ink"
            />
          </Link>
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

            {/* Connect отдельной строкой больше нет: он переехал в бар
                меню выше. Список короче на 85px — на экране 375×667
                шесть строк со свитчером теперь помещаются без скролла */}
          </ul>
        </nav>

        {/* Переключатель языка — по центру под списком. variant="pill":
            вариант-точка меряет [data-header-nav], который на мобильном
            display:none, из-за чего пилюля никогда не раскрывалась.
            placement="up" — панель уходит вверх, внизу экрана ей места нет */}
        <div data-menu-item className="mt-8 flex justify-center">
          <LanguageSwitcher
            locale={locale}
            dict={dict}
            variant="pill"
            placement="up"
          />
        </div>
        </div>
      </div>
    </header>
  );
}

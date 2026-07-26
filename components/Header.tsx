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
  const bgRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const tvRef = useRef<gsap.core.Timeline | null>(null);
  const [scrolled, setScrolled] = useState(false);
  // Тёмный видео-герой есть только на главной. Определяем ПО МАРШРУТУ:
  // шапка живёт в layout и не перемонтируется при клиентских переходах,
  // поэтому разовая проверка DOM при маунте «залипала» на первом значении —
  // из-за этого на внутренних страницах логотип не розовел.
  const pathname = usePathname();
  // Тёмный видео-герой есть только на главной каждой локали
  const darkHero = pathname === href(locale);

  useGSAP(
    () => {
      // Intro: контейнер 0.3s, пункты всплывают y:+30 за 0.5s, stagger 0.05
      gsap
        .timeline()
        .from(ref.current, { autoAlpha: 0, duration: 0.3 })
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
        .from(ref.current, {
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

      {/* Грид auto|1fr|auto: логотип и меню занимают ровно свою ширину,
          средняя колонка забирает остаток и центрирует в нём переключатель.
          При нехватке места (открытые девтулзы, узкое окно) сжимается
          именно средняя колонка — грид-дорожки не пересекаются, и элементы
          физически не могут налезть друг на друга. min-w-0 разрешает
          средней колонке сжиматься меньше содержимого. */}
      <div className="grid h-[100px] grid-cols-[auto_1fr_auto] items-center gap-4 px-6 lg:px-10">
        {/* На внутренних страницах логотип розовый (цвет круга с лендинга),
            но только наверху: при скролле на светлой шапке он снова
            тёмно-серый, как на лендинге. На главной — цвет темы шапки */}
        <Link
          href={href(locale)}
          data-nav-item
          aria-label={dict.nav.home}
          className={`justify-self-start text-[32px] font-black tracking-normal transition-colors duration-300 ${
            darkHero || scrolled ? "" : "text-blush"
          }`}
        >
          .adswebai
        </Link>

        {/* Средняя колонка отдана переключателю целиком: он центрируется
            внутри неё, а её ширину меряет сам компонент, чтобы раскрытая
            пилюля не вылезла за пределы своей грид-дорожки */}
        <div data-nav-item className="relative h-[44px] min-w-0">
          <LanguageSwitcher locale={locale} dict={dict} />
        </div>

        <div className="flex items-center justify-end gap-10">
          <ul className="fs-label hidden items-center gap-10 font-medium lg:flex">
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
                    тень всегда светлая rgba(255,255,255,.15) */}
                {item.submenu && (
                  <div className="invisible absolute -left-[30px] top-0 z-20 opacity-0 transition-opacity duration-[80ms] group-hover:visible group-hover:opacity-100">
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
                            className="block whitespace-nowrap py-[6px] transition-transform duration-150 group-hover/sub:translate-x-[19px]"
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
          <Link
            href={href(locale, "/contact")}
            data-btn-hover
            data-nav-item
            className="block"
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
        </div>
      </div>
    </header>
  );
}

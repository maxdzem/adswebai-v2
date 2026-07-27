"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

import SwapLink from "./SwapLink";
import type { Dict } from "@/content/dict";
import { href, type Locale } from "@/content/i18n";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Услуги горизонтальной лентой: секция прилипает, карточки едут вбок
 * ровно на столько, на сколько крутится колесо.
 *
 * Пока НЕ подключён в app/[lang]/page.tsx — там по-прежнему ServicesGrid.tsx.
 *
 * Три решения, которые стоит объяснить:
 *
 *  1. Лента двигается на СВОЮ ширину (scrollWidth - clientWidth), а не на
 *     xPercent: -100 * (n - 1). Второй вариант из всех примеров работает
 *     только если каждая панель ровно 100vw. У нас карточки разной
 *     пропорции — 4/5, 3/4, 4/3, 4/3.4 — и при xPercent лента уехала бы
 *     мимо: последняя карточка не дошла бы до края или проскочила его.
 *
 *  2. Дистанция считается в функции и обновляется на invalidateOnRefresh.
 *     Ширина ленты зависит от вьюпорта; посчитанная один раз при монтаже,
 *     она разъезжается после поворота экрана.
 *
 *  3. Прилипание — только на десктопе и только если человек не просил
 *     меньше движения. Пин на телефоне отбирает у страницы вертикальный
 *     свайп, а reduced-motion — прямая просьба этого не делать. И в том,
 *     и в другом случае лента остаётся обычным горизонтальным скроллом,
 *     который листается пальцем.
 */

const SERVICES = [
  {
    n: "01",
    slug: "real-time-brands",
    gradient: "linear-gradient(150deg, #1c130b 0%, #4a3014 55%, #0d0a07 100%)",
  },
  {
    n: "02",
    slug: "media-acceleration",
    gradient: "linear-gradient(150deg, #23262c 0%, #14171b 60%, #0b0d10 100%)",
  },
  {
    n: "03",
    slug: "marketing-orchestration",
    gradient: "linear-gradient(150deg, #101623 0%, #1d2b47 55%, #0a0e17 100%)",
  },
  {
    n: "04",
    slug: "ai-transformation",
    gradient: "linear-gradient(150deg, #171b1e 0%, #2c3a42 55%, #0e1113 100%)",
  },
];

export default function ServicesHorizontal_V2({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  const cards = SERVICES.map((s, i) => ({ ...s, ...dict.services.cards[i] }));

  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Заголовок проявляется одинаково при любых настройках — это фейд,
      // а не движение страницы.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-sh-heading]", {
          y: 60,
          autoAlpha: 0,
          filter: "blur(10px)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });
      });

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const el = track.current;
          const section = root.current;
          if (!el || !section) return;

          const distance = () => Math.max(0, el.scrollWidth - section.clientWidth);

          const tween = gsap.to(el, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              // Ход скролла равен ширине, которую надо проехать: лента
              // доезжает ровно в тот момент, когда секция отлипает.
              end: () => "+=" + distance(),
              pin: true,
              scrub: 1,
              // Пересчитать при ресайзе и после подгрузки медиа. Без этого
              // позиции, снятые до загрузки картинок, врут на всю их высоту —
              // ровно та беда, что была на соседнем проекте.
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          // Полоса прогресса живёт от того же скролла, а не от своего таймера:
          // она не может разойтись с лентой.
          gsap.to("[data-sh-progress]", {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => "+=" + distance(),
              scrub: true,
            },
          });

          return () => tween.kill();
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-cream py-28 lg:py-0">
      <div className="px-6 lg:px-10 lg:pt-28">
        <h2 data-sh-heading className="type-display fs-display-m max-w-[62ch]">
          {dict.services.heading}
        </h2>
      </div>

      {/* Обёртка ленты. overflow-x-auto оставлен намеренно: когда пин не
          строится (телефон, reduced-motion), это обычная листаемая лента,
          а не обрезанный кусок. На десктопе GSAP двигает её сам, и родной
          скролл до неё просто не доходит. */}
      <div className="mt-14 overflow-x-auto lg:mt-20 lg:overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          ref={track}
          className="flex w-max gap-6 px-6 pb-4 lg:gap-10 lg:px-10 lg:pb-0"
        >
          {cards.map((s) => (
            <Link
              key={s.n}
              href={href(locale, `/solutions/${s.slug}`)}
              data-panel
              data-btn-hover
              className="group block w-[78vw] shrink-0 sm:w-[52vw] lg:w-[30vw]"
            >
              <div className="relative overflow-hidden">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-[0.45em] right-1 z-10 text-[clamp(3.4rem,7.8vw,8.4rem)] font-black leading-none text-white/90"
                >
                  {s.n}
                </span>
                {/* Плитка чуть наезжает при наведении — трансформ, не размер:
                    layout не пересчитывается, лента не дёргается. */}
                <div
                  className="aspect-[4/5] w-full transition-transform duration-700 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.04]"
                  style={{ background: s.gradient }}
                />
              </div>

              <p className="fs-label mt-6 font-medium text-ink/80">
                {dict.services.label}
              </p>

              <h3 className="fs-body-m mt-2 font-bold leading-[1.15] tracking-normal">
                <SwapLink label={s.title} href={null} size={32} iconSize={12} />
              </h3>

              <p className="fs-label mt-3 max-w-[38ch] leading-relaxed text-ink/70">
                {s.copy}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Полоса прогресса — только там, где есть пин. */}
      <div className="mt-10 hidden px-10 pb-28 lg:block">
        <div className="h-px w-full bg-ink/15">
          <div
            data-sh-progress
            className="h-px origin-left scale-x-0 bg-ink"
          />
        </div>
      </div>
    </section>
  );
}

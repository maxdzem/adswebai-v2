"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { WORK, WORK_SECTION } from "./data";
import { SquareButton } from "./CubeButton";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Высота строки счётчика в px — та же, что h-[24px] у Huge. */
const DIGIT_HEIGHT = 24;

/**
 * «Our work» — колода карточек клиентов.
 *
 * Механика оригинала: `js-cards-list` высотой в экран, карточки внутри
 * лежат друг на друге (absolute left-0 top-0), а прокрутка подменяет
 * верхнюю. В углу — счётчик «W — 00N», где последняя цифра не
 * перерисовывается, а прокручивается: десять цифр стоят столбиком в
 * блоке с overflow-hidden, и столбик едет на -N × высоту строки.
 *
 * Смена карточек привязана к колесу (scrub), а не к своему таймеру:
 * счётчик физически не может разойтись с картинкой.
 *
 * Клик по карточке открывает кейс — как у Huge (там на десктопе за
 * курсором даже ездит плашка «View», её роль здесь играет курсор-pointer
 * и кнопка на самой карточке).
 */
export default function SectionWork({
  onOpenCase,
}: {
  onOpenCase: (slug: string) => void;
}) {
  const root = useRef<HTMLElement>(null);
  const deck = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-work-title]", {
          y: 90,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        });
        gsap.from("[data-work-lede]", {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        });

        const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
        const strip = deck.current?.querySelector<HTMLElement>("[data-digits]");
        if (!cards.length || !deck.current) return;

        // Колода: карточки непрозрачные и лежат друг на друге, каждая
        // следующая выше по z-index. Первая на месте, остальные
        // спрятаны под нижней кромкой.
        //
        // Раньше здесь был кроссфейд по прозрачности, и на середине
        // перехода сквозь новую карточку просвечивали заголовок и текст
        // предыдущей. Выезд накрывает предыдущую полностью — и это
        // ближе к оригиналу, где карточки лежат в общем
        // overflow-hidden блоке высотой в экран.
        cards.forEach((card, i) => gsap.set(card, { zIndex: i }));
        gsap.set(cards.slice(1), { yPercent: 100 });
        gsap.set(cards[0], { yPercent: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: deck.current,
            start: "top top",
            // По экрану прокрутки на каждую смену карточки
            end: () => "+=" + window.innerHeight * (cards.length - 1),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        cards.forEach((card, i) => {
          if (i === 0) return;
          const step = `card-${i}`;
          tl.addLabel(step);
          // Новая карточка выезжает снизу и накрывает предыдущую
          tl.to(card, { yPercent: 0, duration: 1 }, step);
          if (strip) {
            // Цифра докручивается к середине выезда — к моменту, когда
            // новое название уже читается
            tl.to(strip, { y: -i * DIGIT_HEIGHT, duration: 0.5 }, step + "+=0.3");
          }
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="work" className="relative overflow-hidden bg-huge-black text-huge-white">
      <div className="v2__grid my-[176px] md:my-[248px]">
        <h2 data-work-title className="t__mega col-span-full row-start-1">
          {WORK_SECTION.heading}
          <span className="hidden md:inline-block"> —</span>
        </h2>
        <p
          data-work-lede
          className="t__l col-span-full mt-[112px] md:col-span-5 md:col-start-4 xl:col-span-8 xl:col-start-13 xl:row-start-2"
        >
          {WORK_SECTION.lede}
        </p>
      </div>

      <div ref={deck} className="relative">
        <ul className="relative h-screen w-full overflow-hidden">
          {WORK.map((card) => (
            <li
              key={card.slug}
              data-card
              onClick={() => onOpenCase(card.slug)}
              className="absolute left-0 top-0 w-full cursor-pointer"
              style={{ background: card.theme }}
            >
              <div className="v2__grid relative h-screen w-full grid-rows-2 xl:grid-rows-[5.7fr_4.3fr]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt=""
                  width={1280}
                  height={720}
                  loading="lazy"
                  className="absolute col-span-full mb-[23%] aspect-square w-full max-w-[510px] self-center justify-self-center object-contain md:mb-[7%] xl:mb-0 xl:max-w-[812px]"
                />

                {/* left-[-0.03em] — оптическая компенсация трекинга: у
                    t__mega он -0.03em, и без сдвига первая буква
                    отходит от края сетки */}
                <h3 className="t__mega relative left-[-0.03em] col-span-full mt-[152px] w-full xl:left-[-0.05em] xl:col-span-14 xl:mt-0 xl:self-end">
                  {card.client}
                </h3>

                <div className="relative col-span-full mb-[100px] w-full self-end md:col-span-5 md:col-start-4 md:mb-[124px] xl:col-span-6 xl:col-start-15 xl:row-start-2 xl:mb-0 xl:mt-[160px] xl:self-start">
                  <p className="t__solid">{card.copy}</p>
                  <SquareButton
                    label={WORK_SECTION.cta}
                    onClick={() => onOpenCase(card.slug)}
                    className="mt-[24px] xl:hidden"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Счётчик «W — 00N». Последняя цифра прокручивается столбиком.
            z-[20] обязателен: карточкам колоды раздаётся z-index по
            порядку, и без своего слоя счётчик уходил под них. */}
        <div className="v2__grid pointer-events-none absolute inset-0 z-[20] w-full grid-rows-2 overflow-hidden xl:grid-rows-[5.7fr_4.3fr]">
          {/* Строка набрана обычным строчным потоком с фиксированным
              line-height: окошко с цифрами выключено по align-top.
              Инлайн-блок с overflow: hidden берёт базовую линию по
              своей нижней кромке — без align-top цифра съезжала вниз
              и читалась как нижний индекс. */}
          <div
            className="t__body col-span-full mt-[120px] xl:mb-[168px] xl:mt-auto"
            style={{ lineHeight: `${DIGIT_HEIGHT}px` }}
          >
            <span>{WORK_SECTION.counterPrefix}&nbsp;—&nbsp;00</span>
            <span
              className="inline-block overflow-hidden align-top"
              style={{ height: DIGIT_HEIGHT }}
            >
              <span data-digits className="block">
                {Array.from({ length: 10 }, (_, d) => (
                  <span
                    key={d}
                    className="block"
                    style={{ height: DIGIT_HEIGHT, lineHeight: `${DIGIT_HEIGHT}px` }}
                  >
                    {d}
                  </span>
                ))}
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

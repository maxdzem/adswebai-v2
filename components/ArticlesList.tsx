"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "./Button";
import type { Dict } from "@/content/dict";
import { href, type Locale } from "@/content/i18n";

gsap.registerPlugin(ScrollTrigger);

const POSTS = [
  {
    kind: "Report",
    bold: "Unlocking High-Value Users",
    serif: "with Machine Learning",
    read: "2 min",
    thumb: "linear-gradient(140deg, #1a0b24 0%, #3d1160 55%, #0d0512 100%)",
  },
  {
    kind: "Blog Post",
    bold: "Why Your Customer Lifetime Value Strategy",
    serif: "Hinges on a High-Performance Email Engine",
    read: "5 min",
    thumb: "linear-gradient(140deg, #101623 0%, #24406e 55%, #0a0e17 100%)",
  },
  {
    kind: "Blog Post",
    bold: "Inside Salesforce Connections 2025",
    serif: "and the Conversational Potential of Agentic AI",
    read: "5 min",
    thumb: "linear-gradient(140deg, #0e1a14 0%, #1e5c3a 55%, #081109 100%)",
  },
  {
    kind: "Blog Post",
    bold: "Driving Experimentation and AI Innovation",
    serif: "with Amplitude",
    read: "5 min",
    thumb: "linear-gradient(140deg, #231017 0%, #6e2440 55%, #170a0e 100%)",
  },
  {
    kind: "Blog Post",
    bold: "Experience Centers:",
    serif: "Where Brands Come to Life",
    read: "6 min",
    thumb: "linear-gradient(140deg, #1c1608 0%, #7a5a16 55%, #120e05 100%)",
  },
  {
    kind: "Blog Post",
    bold: "Smarter Investments for an Evolving Marketing Landscape:",
    serif: "MMM Meta-Analysis with adswebai and TikTok",
    read: "7 min",
    thumb: "linear-gradient(140deg, #0b0b24 0%, #2d2d8f 55%, #07071a 100%)",
  },
];

// Сдвиг фолловера относительно курсора
const OFFSET_X = 30;
const OFFSET_Y = -110;

type Setter = (value: number) => void;

export default function ArticlesList({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  // Текст постов из словаря, градиенты превью остаются в POSTS
  const posts = POSTS.map((p, i) => ({ ...p, ...dict.articles.posts[i] }));
  const sectionRef = useRef<HTMLElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const imgX = useRef<Setter | null>(null);
  const imgY = useRef<Setter | null>(null);
  const frames = useRef<{ x: Setter; y: Setter }[]>([]);
  const hideTimer = useRef<number | null>(null);
  const [thumbBg, setThumbBg] = useState(POSTS[0].thumb);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(followerRef.current, { autoAlpha: 0 });

      // Мягкое «айфоновское» появление при скролле: фейд + растворение
      // blur, заголовок затем строки каскадом. Один раз, без вычурности.
      gsap.from("[data-list-heading]", {
        y: 40,
        autoAlpha: 0,
        filter: "blur(10px)",
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-list-heading]",
          start: "top 85%",
          once: true,
        },
      });
      gsap.from("[data-list-row]", {
        y: 28,
        autoAlpha: 0,
        filter: "blur(8px)",
        duration: 0.7,
        stagger: 0.07,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-list-rows]",
          start: "top 85%",
          once: true,
        },
      });

      // Картинка: мгновенный quickSetter — без сглаживания
      imgX.current = gsap.quickSetter("[data-follow-img]", "x", "px") as Setter;
      imgY.current = gsap.quickSetter("[data-follow-img]", "y", "px") as Setter;

      // Рамки шлейфа: quickTo с нарастающей длительностью — микро-задержка
      frames.current = gsap.utils
        .toArray<HTMLElement>("[data-follow-frame]")
        .map((el, i) => ({
          x: gsap.quickTo(el, "x", {
            duration: 0.18 + i * 0.08,
            ease: "power3.out",
          }) as Setter,
          y: gsap.quickTo(el, "y", {
            duration: 0.18 + i * 0.08,
            ease: "power3.out",
          }) as Setter,
        }));
    }, sectionRef);

    return () => {
      if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
      ctx.revert();
    };
  }, []);

  const moveAll = (clientX: number, clientY: number) => {
    const x = clientX + OFFSET_X;
    const y = clientY + OFFSET_Y;
    imgX.current?.(x);
    imgY.current?.(y);
    frames.current.forEach((f) => {
      f.x(x);
      f.y(y);
    });
  };

  /** Есть ли настоящий курсор. На тач-экранах браузер синтезирует
   *  mouseover/mousemove при тапе, и картинка-follower зависала посреди
   *  экрана: mouseleave не приходил, пока не тапнешь в другое место. */
  const hasHover = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches;

  const handleEnter = (e: MouseEvent, bg: string) => {
    if (!hasHover()) return;
    setThumbBg(bg);
    // debounce: отменяем отложенное скрытие — при переходе между строками не мигает
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    moveAll(e.clientX, e.clientY);
    // Появление мгновенное — без fade-in и scale
    gsap.set(followerRef.current, { autoAlpha: 1 });
  };

  const handleMove = (e: MouseEvent) => {
    if (!hasHover()) return;
    moveAll(e.clientX, e.clientY);
  };

  const handleLeave = () => {
    hideTimer.current = window.setTimeout(() => {
      gsap.to(followerRef.current, { autoAlpha: 0, duration: 0.15 });
    }, 150);
  };

  return (
    <section
      ref={sectionRef}
      // Отрицательный отступ вырезает пустой хвост секции с кругом — к
      // этому моменту круг уже схлопнулся в ничто, и там оставался мёртвый
      // экран. Вместе с секцией едет и всё, что ниже (форма, футер).
      // -75svh вместо прежних -21.5cm: сантиметры не зависят от экрана, и
      // на телефоне те же 813px съедали 76% секции с кругом вместо 47%,
      // как задумано на десктопе. 75svh даёт −810px на 1080p (разница
      // 2.6px) и ту же пропорцию на любой высоте вьюпорта
      className="-mt-[75svh] bg-cream px-6 pb-40 pt-28 text-ink lg:px-10"
    >
      <h2 data-list-heading className="type-display fs-display-m">
        {dict.articles.heading}
      </h2>

      {/* Разделитель 1px currentColor только МЕЖДУ статьями (divide-y):
          у последней строки линии нет. Текст на ховер не анимируется. */}
      <div data-list-rows className="mt-16 divide-y divide-current">
        {posts.map((p) => (
          <article
            key={p.bold}
            // data-btn-hover: ховер на ЛЮБОЙ части строки запускает
            // swap-анимацию кнопки «Read now» (см. Button.tsx)
            data-btn-hover
            data-list-row
            className="flex flex-col gap-3 py-6 md:flex-row md:items-center md:gap-6"
            onMouseEnter={(e) => handleEnter(e, p.thumb)}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
          >
            <p className="fs-label font-medium md:w-44 md:shrink-0">{p.kind}</p>

            {/* truncate только с md: на мобильном заголовок переносится,
                а не обрезается — иначе от него не оставалось ничего */}
            <h3 className="fs-body-m min-w-0 font-medium leading-[1.15] md:flex-1 md:truncate">
              {p.bold}{" "}
              {/* По реверсу: em — антиква 400, font-style: normal (не курсив) */}
              <em className="fs-body-m font-serif font-normal not-italic">
                {p.serif}
              </em>
            </h3>

            <p className="fs-label font-normal md:w-32 md:shrink-0">
              {p.read} {dict.common.minRead}
            </p>

            <Button label={dict.common.readNow} href={href(locale, "/thinking")} />
          </article>
        ))}
      </div>

      {/* Mouse follower: фиксированный, кликам не мешает.
          Рамки идут под картинкой и догоняют её с задержкой — эффект шлейфа */}
      <div
        ref={followerRef}
        className="pointer-events-none fixed left-0 top-0 z-[70] opacity-0"
        aria-hidden
      >
        <div
          data-follow-frame
          className="absolute left-0 top-0 h-[80px] w-[140px] rounded-[4px] border border-ink opacity-30"
        />
        <div
          data-follow-frame
          className="absolute left-0 top-0 h-[80px] w-[140px] rounded-[4px] border border-ink opacity-30"
        />
        <div
          data-follow-frame
          className="absolute left-0 top-0 h-[80px] w-[140px] rounded-[4px] border border-ink opacity-30"
        />
        <div
          data-follow-img
          className="absolute left-0 top-0 h-[80px] w-[140px] rounded-[4px]"
          style={{ background: thumbBg }}
        />
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import type { Dict } from "@/content/dict";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AnimatedCircle({ dict }: { dict: Dict }) {
  const wrapperRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoCircleRef = useRef<HTMLDivElement>(null);

  // useGSAP вместо useEffect: сам делает revert при размонтировании
  // и корректно переживает двойной вызов эффектов в StrictMode —
  // именно этого требует PROMPT.md.
  useGSAP(
    () => {
      const circle = circleRef.current!;

      // Длительности — в «процентах» таймлайна (сумма фаз = 100)
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrapperRef.current,
          // Круг растёт уже пока секция въезжает в кадр — пустого экрана
          // между заголовком и началом анимации не остаётся
          start: "top 90%",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      tl
        // ФАЗА 1 (0→38%) — круг появляется ИЗ НИЧЕГО (scale: 0)
        // и растёт до полного покрытия экрана.
        // power1.out вместо power2.inOut: рост виден с первого пикселя
        // скролла, без «мёртвого» начала
        .fromTo(
          circle,
          { scale: 0 },
          { scale: 1, duration: 38, ease: "power1.out" },
          0
        )
        .fromTo(contentRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 10 }, 10)
        // Видео-круг по аудиту: непрерывный scroll-linked scale — растёт
        // к центру прохода (~0.32→1) и сжимается после, форма всегда круг
        .fromTo(
          videoCircleRef.current,
          { scale: 0.32 },
          { scale: 1, duration: 28, ease: "power1.out" },
          10
        )

        // ФАЗА 2 (38→70%) — длинный холд: продолжаем ехать по розовому,
        // экран целиком залит, контент читается

        // ФАЗА 3 (70→100%) — контент гаснет, круг схлопывается
        // до точки и исчезает В НИЧТО (scale: 0) ещё до открепления секции
        .to(contentRef.current, { autoAlpha: 0, duration: 6 }, 66)
        .to(videoCircleRef.current, { scale: 0.32, duration: 26, ease: "power2.inOut" }, 70)
        .to(circle, { scale: 0, duration: 30, ease: "power2.inOut" }, 70);
    },
    { scope: wrapperRef }
  );

  return (
    <>
      {/* Статичный интро-блок: виден сразу, скроллится как обычный контент.
          Формат как в референсе: маленький лейбл + крупный жирный заголовок */}
      <div className="bg-cream px-6 pb-0 pt-36 lg:px-10">
        <div className="lg:ml-[12%]">
          <p className="fs-label font-medium">{dict.circle.watch}</p>
          {/* Эталон типографики проекта: fs-display-m + type-display
              (900 / lh 1.15 / letter-spacing normal / цвет --color-ink) */}
          <h2 className="type-display fs-display-m mt-5 max-w-[42ch]">
            {dict.circle.heading}
          </h2>
        </div>
      </div>

      {/* БЕЗ relative: позиционированная секция рисовалась ПОВЕРХ статичного
          списка статей и её фон закрывал текст. Теперь фон секции уходит вниз,
          а розовый круг (sticky = позиционированный) по-прежнему сверху —
          ложится на список аркой, как в оригинале.
          Высота 160vh: лишний ход скролла вырезан, пустых экранов нет */}
      <section ref={wrapperRef} className="h-[160vh] bg-cream">
        {/* overflow-hidden на самом sticky-элементе безопасен и запирает круг
            внутри секции. Углов нет: диагональ вьюпорта (≈1.41vmax) меньше
            диаметра круга (1.5vmax) — при scale:1 экран накрыт целиком */}
        {/* pointer-events-none: снизу секция теперь перекрыта списком статей,
            и прозрачный sticky-слой не должен перехватывать у него ховеры */}
        <div className="pointer-events-none sticky top-0 h-screen overflow-hidden">
          {/* Круг свёрстан в полном размере (резкие края), появляется из
              scale:0 — класс scale-0 держит его невидимым до гидрации */}
          {/* Точка рождения/схлопывания — 24% от верха экрана, сразу под
              заголовком. В сантиметрах центр уезжал ВЫШЕ вьюпорта, поэтому
              маленький круг был не виден и казалось, что там пустота.
              На полное покрытие не влияет: 150vmax перекрывает экран
              с любым центром */}
          <div
            ref={circleRef}
            className="absolute left-1/2 top-[24%] aspect-square w-[150vmax] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-blush"
          />

          {/* Контент поверх круга — не масштабируется вместе с ним */}
          <div ref={contentRef} className="absolute inset-0 opacity-0">
            <div className="type-display absolute inset-0 flex select-none items-center justify-center whitespace-nowrap text-[16vw] text-ink">
              <span className="ghost-letters" aria-hidden>
                web
              </span>
              <span className="ml-[1.5vw]">ads</span>
              <span className="w-[34vw] shrink-0" aria-hidden />
              <span>ai</span>
              <span className="ghost-letters ml-[1.5vw]" aria-hidden>
                ads
              </span>
            </div>

            <div className="absolute left-[8vw] top-[63%] lg:left-[14vw]">
              <span className="fs-label inline-block rounded-[50%] border border-ink/70 px-5 py-2 font-medium">
                {dict.circle.meet}
              </span>
              <p className="fs-body-m mt-4 font-semibold">{dict.circle.flow}</p>
              <p className="fs-body-m text-ink/50">{dict.circle.agents}</p>
            </div>

            {/* video-mask из аудита: круг с overflow-hidden, масштабируется
                отдельно от розового полотна; play-кнопка 70×70 по центру */}
            <div
              ref={videoCircleRef}
              className="absolute left-1/2 top-1/2 aspect-square w-[32vw] max-w-[66vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full"
            >
              <video
                className="h-full w-full object-cover"
                src="/face-video.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
              <button
                aria-label={dict.circle.play}
                className="absolute left-1/2 top-1/2 grid h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm"
              >
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden>
                  <path d="M1 1.5v13L13 8 1 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import LazyVideo from "./LazyVideo";
import type { Dict } from "@/content/dict";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AnimatedCircle({ dict }: { dict: Dict }) {
  const wrapperRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoCircleRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

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
      <div className="bg-cream px-6 pb-[2cm] pt-36 lg:px-10">
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
      {/* svh вместо vh: vh в мобильных браузерах равен БОЛЬШОМУ вьюпорту
          (адресная строка спрятана), поэтому низ липкого блока уезжал под
          хром браузера. svh — маленький вьюпорт, он одинаков в обоих
          состояниях. На десктопе svh == vh, пропорция 160:100 сохранена */}
      <section ref={wrapperRef} className="h-[160svh] bg-cream">
        {/* overflow-hidden на самом sticky-элементе безопасен и запирает круг
            внутри секции. Углов нет: диагональ вьюпорта (≈1.41vmax) меньше
            диаметра круга (1.5vmax) — при scale:1 экран накрыт целиком */}
        {/* БЕЗ overflow-hidden: он обрезал круг по верхней границе секции —
            пока секция не прилипла, эта граница проходит посреди экрана,
            и сверху был виден прямой срез. Теперь круг остаётся кругом
            и, разрастаясь, накрывает заголовок, а затем и весь экран.
            pointer-events-none: прозрачный слой не перехватывает ховеры
            у списка статей, который подтянут под секцию. */}
        <div className="pointer-events-none sticky top-0 h-svh">
          {/* Круг свёрстан в полном размере (резкие края), появляется из
              scale:0 — класс scale-0 держит его невидимым до гидрации */}
          {/* Точка рождения/схлопывания — 24% от верха экрана, сразу под
              заголовком. В сантиметрах центр уезжал ВЫШЕ вьюпорта, поэтому
              маленький круг был не виден и казалось, что там пустота.
              На полное покрытие не влияет: 150vmax перекрывает экран
              с любым центром */}
          {/* На телефоне центр опущен до 44%: при top-[24%] радиус
              150vmax (на портретном экране vmax = высота) не дотягивался
              до нижних углов и в них оставались кремовые клинья */}
          <div
            ref={circleRef}
            className="absolute left-1/2 top-[44%] aspect-square w-[150vmax] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-blush lg:top-[24%]"
          />

          {/* Контент поверх круга — не масштабируется вместе с ним */}
          <div ref={contentRef} className="absolute inset-0 opacity-0">
            {/* На мобильном — колонка: «ads», круг с видео, «ai». Кружок
                стоит обычным потоком МЕЖДУ строками, поэтому его позиция
                считается флексом, а не подгоняется руками под каждый экран.
                Гост-буквы и дырка 34vw только с lg: в строку они не влезают
                (≈554px содержимого при 390px экрана — надпись обрезалась
                с обеих сторон, её спасал только overflow-x: clip) */}
            <div className="type-display absolute inset-0 flex select-none flex-col items-center justify-start gap-[2vw] whitespace-nowrap pt-[7svh] text-[20vw] text-ink lg:flex-row lg:items-center lg:justify-center lg:gap-0 lg:pt-0 lg:text-[16vw]">
              <span className="ghost-letters hidden lg:inline" aria-hidden>
                web
              </span>
              <span className="lg:ml-[1.5vw]">ads</span>

              {/* Обёртка позиционирования — GSAP её НЕ трогает.
                  Масштабируется только вложенный videoCircleRef, поэтому
                  кнопка play остаётся постоянного размера. С lg обёртка
                  уходит в absolute по центру экрана, а её место в строке
                  занимает спейсер 34vw ниже */}
              <div className="relative aspect-square w-[64vw] max-w-[34svh] shrink-0 lg:absolute lg:left-1/2 lg:top-1/2 lg:w-[32vw] lg:max-w-[66vh] lg:-translate-x-1/2 lg:-translate-y-1/2">
                <div
                  ref={videoCircleRef}
                  className="absolute inset-0 overflow-hidden rounded-full"
                >
                  <LazyVideo
                    ref={videoRef}
                    src="/face-video.mp4"
                    className="h-full w-full object-cover"
                    onPlayingChange={setPlaying}
                  />
                </div>

                {/* Сестра масштабируемого круга, а не его потомок: раньше
                    кнопка ехала вместе со scale 0.32→1 и в начале прохода
                    была ~22px. pointer-events-auto — родительский
                    липкий слой гасит клики */}
                <button
                  type="button"
                  onClick={() => {
                    const v = videoRef.current;
                    if (!v) return;
                    if (v.paused) v.play().catch(() => {});
                    else v.pause();
                  }}
                  aria-label={playing ? dict.circle.pause : dict.circle.play}
                  className="pointer-events-auto absolute left-1/2 top-1/2 grid h-[56px] w-[56px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-transform duration-300 hover:scale-105 lg:h-[70px] lg:w-[70px]"
                >
                  {playing ? (
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" aria-hidden>
                      <rect x="1" y="1.5" width="4" height="13" />
                      <rect x="9" y="1.5" width="4" height="13" />
                    </svg>
                  ) : (
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden>
                      <path d="M1 1.5v13L13 8 1 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Дырка под круг — только с lg, где круг ушёл в absolute */}
              <span className="hidden shrink-0 lg:block lg:w-[34vw]" aria-hidden />

              <span>ai</span>
              <span className="ghost-letters hidden lg:ml-[1.5vw] lg:inline" aria-hidden>
                ads
              </span>
            </div>

            {/* На мобильном блок центрирован под колонкой, на десктопе —
                прежняя левая полка */}
            <div className="absolute left-1/2 top-[74%] -translate-x-1/2 text-center lg:left-[14vw] lg:top-[63%] lg:translate-x-0 lg:text-left">
              <span className="fs-label inline-block rounded-[50%] border border-ink/70 px-5 py-2 font-medium">
                {dict.circle.meet}
              </span>
              <p className="fs-body-m mt-4 font-semibold">{dict.circle.flow}</p>
              <p className="fs-body-m text-ink/50">{dict.circle.agents}</p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

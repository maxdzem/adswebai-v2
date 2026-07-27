"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import type { Dict } from "@/content/dict";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Форма заказа, вторая версия. App Mode: только микро-взаимодействия,
 * никакого скролл-джекинга — здесь важна отправка, а не впечатление.
 *
 * Пока НЕ подключена в разметку — Contact.tsx продолжает работать.
 *
 * ЧТО СОХРАНЕНО ДОСЛОВНО (это условие задачи):
 *   состояние step / busy / values / sent / error, сборка STEPS из словаря,
 *   правила валидации, блокировка по busy, фокус на поле со второго шага,
 *   aria-invalid / aria-describedby / role="alert", подпись кнопки.
 * Ни один обработчик не переписан — onSubmit тот же, что был.
 *
 * ЧТО ИСПРАВЛЕНО ПО ЧАСТИ GSAP:
 *
 *  1. contextSafe(). В Contact.tsx твины из leaveTo() и shake() создаются
 *     внутри обработчика submit — то есть ПОСЛЕ того, как отработал
 *     gsap.context(). В контекст они не попадают, и revert() при
 *     размонтировании их не снимает. Здесь обе обёрнуты в contextSafe,
 *     который возвращает useGSAP.
 *
 *  2. useGSAP вместо ручного useEffect + gsap.context + ctx.revert().
 *     Тот же результат меньшим кодом, плюс правильное поведение в
 *     StrictMode, где эффекты вызываются дважды.
 *
 *  3. Высота карточки анимируется в 'auto' средствами GSAP, а не через
 *     снятый заранее offsetHeight. Замер до анимации ловит высоту ДО
 *     смены контента, поэтому на шаге с радиокнопками карточка
 *     доезжала не до той высоты и в конце прыгала.
 *
 *  4. Липкая сводка — это position: sticky, без JS и без ScrollTrigger.
 *     Ответы видно, пока листаешь; страницу при этом никто не держит.
 */

type Step =
  | { name: string; label: string; type: "text" | "email"; required: boolean }
  | { name: string; label: string; type: "textarea"; required: boolean }
  | {
      name: string;
      label: string;
      type: "radio";
      required: boolean;
      options: string[];
    };

function buildSteps(dict: Dict): Step[] {
  return [
    { name: "firstName", label: dict.contact.steps.firstName, type: "text", required: true },
    { name: "lastName", label: dict.contact.steps.lastName, type: "text", required: true },
    { name: "company", label: dict.contact.steps.company, type: "text", required: true },
    { name: "jobTitle", label: dict.contact.steps.jobTitle, type: "text", required: true },
    { name: "email", label: dict.contact.steps.email, type: "email", required: true },
    { name: "message", label: dict.contact.steps.message, type: "textarea", required: false },
    {
      name: "region",
      label: dict.contact.steps.region,
      type: "radio",
      required: true,
      options: [...dict.contact.regions],
    },
    { name: "discover", label: dict.contact.steps.discover, type: "textarea", required: true },
  ];
}

function ArrowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M1 7h11m0 0L7.5 2.5M12 7l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2.5 21.5L23 12 2.5 2.5 2.5 10l14 2-14 2z" />
    </svg>
  );
}

export default function OrderForm_V2({ dict }: { dict: Dict }) {
  const STEPS = buildSteps(dict);

  const root = useRef<HTMLElement>(null);
  // Карточка и поле адресуются data-атрибутами, а не ref — см. блок
  // комментария перед enterStep. Ref остаётся только у поля ввода: фокус
  // ставится из эффекта и из обработчика, где читать ref разрешено.
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const value = values[current?.name] ?? "";

  // Фокус живёт в эффекте, а не в анимации: со второго шага поле должно
  // принять ввод сразу. На первом рендере не фокусируем — это увело бы
  // страницу к форме, мимо всего, что выше.
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) inputRef.current?.focus({ preventScroll: true });
    else mounted.current = true;
  }, [step, sent]);

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-of-el]", {
          y: 60,
          autoAlpha: 0,
          filter: "blur(10px)",
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
        });

        gsap.from("[data-of-avatar]", {
          rotationY: -100,
          autoAlpha: 0,
          transformPerspective: 700,
          duration: 0.9,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
        });

        gsap.from("[data-of-bubble]", {
          scale: 0.7,
          autoAlpha: 0,
          transformOrigin: "0% 100%",
          duration: 0.6,
          delay: 0.45,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
        });
      });
    },
    { scope: root }
  );

  /**
   * Все три функции ниже адресуют элементы СТРОКОВЫМИ СЕЛЕКТОРАМИ, а не
   * через ref. Причина не стилистическая: функция передаётся в contextSafe()
   * во время рендера, и правило react-hooks/refs запрещает замыкать в такой
   * функции ref — компилятор React не может доказать, что её не вызовут
   * прямо в рендере. Селекторы при этом не глобальные: useGSAP получил
   * { scope: root }, и поиск идёт только внутри этой секции.
   */

  /**
   * Вход шага: карточка тянется к новой высоте, поле выезжает снизу.
   *
   * Высоту конечного состояния заранее не замерить — контента ещё нет,
   * поэтому анимируем в 'auto' средствами GSAP и сбрасываем свойство
   * в конце, чтобы карточка снова стала резиновой.
   */
  const enterStep = contextSafe(() => {
    gsap
      .timeline()
      .to(
        "[data-of-card]",
        { height: "auto", duration: 0.45, ease: "power3.out", clearProps: "height" },
        0
      )
      .fromTo(
        "[data-of-field]",
        { y: 26, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" },
        0.08
      );
  });

  /** Уход шага. Новый ставится в onComplete — DOM не дёргается на полпути. */
  const leaveTo = contextSafe((fn: () => void) => {
    // Флаг ставится синхронно, до старта анимации: иначе быстрый двойной
    // клик успевает проскочить шаг и выйти за границы массива STEPS.
    setBusy(true);

    // Высота замораживается на текущем значении, чтобы карточка не
    // схлопнулась в момент подмены контента. Функция-значение получает
    // сам элемент — замер без обращения к ref.
    gsap.set("[data-of-card]", {
      height: (_i: number, el: Element) => (el as HTMLElement).offsetHeight,
    });

    gsap.to("[data-of-field]", {
      y: -26,
      autoAlpha: 0,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => {
        fn();
        setBusy(false);
        // Следующий кадр: React уже отрисовал новый шаг, высоту можно отпускать.
        requestAnimationFrame(enterStep);
      },
    });
  });

  const shake = contextSafe(() => {
    gsap.fromTo("[data-of-card]", { x: -8 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.35)" });
  });

  // Ровно та же логика, что в Contact.tsx.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!current || busy) return;

    const filled = value.trim().length > 0;
    const emailOk = current.type !== "email" || /^\S+@\S+\.\S+$/.test(value);
    if ((current.required && !filled) || !emailOk) {
      setError(!filled ? dict.contact.errRequired : dict.contact.errEmail);
      shake();
      inputRef.current?.focus({ preventScroll: true });
      return;
    }
    setError(null);

    if (isLast) leaveTo(() => setSent(true));
    else leaveTo(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)));
  };

  const setValue = (v: string) => {
    if (error) setError(null);
    setValues((prev) => ({ ...prev, [current.name]: v }));
  };

  // Сводка: только те шаги, на которые уже ответили.
  const answered = STEPS.filter((s) => (values[s.name] ?? "").trim().length > 0);

  return (
    <section id="connect" ref={root} className="bg-cream px-6 pb-[2cm] pt-20 lg:px-10 lg:pt-36">
      <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
        <div>
          <h2 data-of-el className="type-display fs-display-m lg:max-w-[14ch]">
            {dict.contact.heading}
          </h2>

          {/* Липкая сводка: position: sticky, никакого ScrollTrigger.
              Ответы остаются на виду, пока человек листает форму. */}
          {answered.length > 0 && !sent && (
            <dl className="mt-12 hidden lg:sticky lg:top-32 lg:block">
              {answered.map((s) => (
                <div key={s.name} className="border-t border-ink/15 py-3">
                  <dt className="fs-label text-ink/50">{s.label}</dt>
                  <dd className="fs-body-m mt-1 text-ink">{values[s.name]}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="relative">
          <div data-of-el className="flex flex-col items-start gap-6 sm:flex-row sm:gap-8">
            <div
              data-of-avatar
              className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-blush shadow-lg sm:h-24 sm:w-24"
            >
              <span className="fs-label font-bold text-ink">.adswebai</span>
            </div>
            <div data-of-bubble className="relative w-full sm:mt-10">
              <div className="fs-body-m max-w-md rounded-2xl bg-grape p-5 leading-relaxed text-white">
                {dict.contact.greeting}
                <br />
                {sent ? dict.contact.thanks : dict.contact.intro}
              </div>
              <span className="absolute -bottom-4 -left-3 h-3.5 w-3.5 rounded-full bg-grape sm:-left-6" />
            </div>
          </div>

          <form data-of-el onSubmit={onSubmit} className="mt-10 lg:mt-16 lg:pl-32">
            <div
              data-of-card
              onClick={() => inputRef.current?.focus({ preventScroll: true })}
              className="w-full max-w-xl cursor-text overflow-hidden rounded-[32px] border border-ink/80 bg-white px-5 py-6 shadow-[0_18px_40px_-24px_rgba(45,45,45,0.45)] sm:px-8 sm:py-7"
            >
              <div data-of-field>
                {sent ? (
                  <p className="fs-body-m py-6 text-ink">{dict.contact.sent}</p>
                ) : current.type === "radio" ? (
                  <fieldset>
                    <legend className="fs-body-m text-ink/60">{current.label}</legend>
                    <div className="mt-5 space-y-3">
                      {current.options.map((opt) => {
                        const active = value === opt;
                        return (
                          <label
                            key={opt}
                            className="group flex cursor-pointer items-center gap-4 py-2"
                          >
                            <input
                              type="radio"
                              name={current.name}
                              checked={active}
                              onChange={() => setValue(opt)}
                              className="sr-only"
                            />
                            {/* Точка внутри кольца вместо заливки: заметнее,
                                чем смена цвета, и работает без цвета вообще. */}
                            <span
                              className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border-2 transition-colors duration-200 ${
                                active ? "border-ink" : "border-ink/35 group-hover:border-ink"
                              }`}
                            >
                              <span
                                className={`h-[10px] w-[10px] rounded-full bg-ink transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
                                  active ? "scale-100" : "scale-0"
                                }`}
                              />
                            </span>
                            <span
                              className={`fs-body-m leading-tight ${
                                active ? "font-medium text-ink" : "text-ink/80"
                              }`}
                            >
                              {opt}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                ) : current.type === "textarea" ? (
                  <>
                    <label htmlFor={current.name} className="fs-body-m block text-ink/60">
                      {current.label}
                    </label>
                    <textarea
                      id={current.name}
                      ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      rows={4}
                      aria-invalid={!!error}
                      aria-describedby={error ? "order-error" : undefined}
                      className="fs-body-m mt-4 w-full resize-none bg-transparent text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                    />
                  </>
                ) : (
                  <>
                    <label htmlFor={current.name} className="fs-body-m block text-ink/60">
                      {current.label}
                    </label>
                    <input
                      id={current.name}
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      type={current.type}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      autoComplete="off"
                      aria-invalid={!!error}
                      aria-describedby={error ? "order-error" : undefined}
                      className="fs-body-m mt-1 w-full bg-transparent text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                    />
                  </>
                )}

                {error && (
                  <p id="order-error" role="alert" className="fs-label mt-3 text-[#b3261e]">
                    {error}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-10 flex w-full max-w-xl items-center justify-between">
              <div className="flex items-center gap-2.5">
                {STEPS.map((s, i) => (
                  <span
                    key={s.name}
                    className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                      sent || i < step
                        ? "bg-ink/35"
                        : i === step
                          ? "bg-ink"
                          : "border border-ink/25"
                    }`}
                  />
                ))}
              </div>

              {!sent && (
                <button
                  type="submit"
                  disabled={busy}
                  aria-label={isLast ? dict.contact.send : dict.contact.next}
                  className={`grid h-[72px] w-[72px] place-items-center rounded-full shadow-[0_10px_30px_-16px_rgba(45,45,45,0.6)] transition-all duration-300 disabled:pointer-events-none disabled:opacity-60 ${
                    isLast ? "bg-ink text-white hover:scale-105" : "bg-white text-ink hover:scale-105"
                  }`}
                >
                  {isLast ? <SendIcon /> : <ArrowIcon />}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

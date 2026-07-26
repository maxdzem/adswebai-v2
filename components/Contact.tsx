"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { Dict } from "@/content/dict";

gsap.registerPlugin(ScrollTrigger);

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

// Порядок шагов — как в раскадровке
function buildSteps(dict: Dict): Step[] {
  return [
  { name: "firstName", label: dict.contact.steps.firstName, type: "text", required: true },
  { name: "lastName", label: dict.contact.steps.lastName, type: "text", required: true },
  { name: "company", label: dict.contact.steps.company, type: "text", required: true },
  { name: "jobTitle", label: dict.contact.steps.jobTitle, type: "text", required: true },
  { name: "email", label: dict.contact.steps.email, type: "email", required: true },
  {
    name: "message",
    label: dict.contact.steps.message,
    type: "textarea",
    required: false,
  },
  {
    name: "region",
    label: dict.contact.steps.region,
    type: "radio",
    required: true,
    options: [...dict.contact.regions],
  },
  {
    name: "discover",
    label: dict.contact.steps.discover,
    type: "textarea",
    required: true,
  },
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

export default function Contact({ dict }: { dict: Dict }) {
  // Шаги формы собираются из словаря: подписи и варианты регионов
  const STEPS = buildSteps(dict);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const prevHeight = useRef(0);

  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const value = values[current?.name] ?? "";

  // Появление секции при скролле
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-contact-el]", {
        y: 60,
        autoAlpha: 0,
        filter: "blur(10px)",
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%", once: true },
      });

      // Аватар: 3D-вход — разворачивается из профиля с перспективой,
      // пузырь следом мягко «надувается» из своего хвостика
      gsap.from("[data-contact-avatar]", {
        rotationY: -100,
        autoAlpha: 0,
        transformPerspective: 700,
        duration: 0.9,
        delay: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%", once: true },
      });
      gsap.from("[data-contact-bubble]", {
        scale: 0.7,
        autoAlpha: 0,
        transformOrigin: "0% 100%",
        duration: 0.6,
        delay: 0.45,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%", once: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Вход нового шага: карточка тянется к новой высоте, контент выезжает снизу
  useEffect(() => {
    const card = cardRef.current;
    const field = fieldRef.current;
    if (!card || !field) return;

    const tl = gsap.timeline();

    if (prevHeight.current) {
      tl.fromTo(
        card,
        { height: prevHeight.current },
        {
          height: card.offsetHeight,
          duration: 0.45,
          ease: "power3.out",
          clearProps: "height",
        },
        0
      );
    }

    tl.fromTo(
      field,
      { y: 26, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" },
      prevHeight.current ? 0.08 : 0
    );

    return () => {
      tl.kill();
    };
  }, [step, sent]);

  // Уход текущего шага — новый ставится в onComplete, DOM не дёргается
  const leaveTo = (fn: () => void) => {
    prevHeight.current = cardRef.current?.offsetHeight ?? 0;
    gsap.to(fieldRef.current, {
      y: -26,
      autoAlpha: 0,
      duration: 0.28,
      ease: "power2.in",
      onComplete: fn,
    });
  };

  const shake = () => {
    gsap.fromTo(
      cardRef.current,
      { x: -8 },
      { x: 0, duration: 0.5, ease: "elastic.out(1, 0.35)" }
    );
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!current) return;

    const filled = value.trim().length > 0;
    const emailOk = current.type !== "email" || /^\S+@\S+\.\S+$/.test(value);
    if ((current.required && !filled) || !emailOk) {
      shake();
      return;
    }

    if (isLast) leaveTo(() => setSent(true));
    else leaveTo(() => setStep((s) => s + 1));
  };

  const setValue = (v: string) =>
    setValues((prev) => ({ ...prev, [current.name]: v }));

  return (
    <section
      id="connect"
      ref={sectionRef}
      // pb-[2cm]: светлая зона под формой. Раньше здесь было pb-44 (≈4.6см),
      // футер подняли до нуля, теперь 2 см возвращены светлому фону —
      // ровно на столько же опускается граница с тёмным футером
      className="bg-cream px-6 pb-[2cm] pt-36 lg:px-10"
    >
      <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
        <h2
          data-contact-el
          className="type-display fs-display-m max-w-[14ch]"
        >
          {dict.contact.heading}
        </h2>

        <div className="relative">
          {/* Аватар + фиолетовый пузырь */}
          <div data-contact-el className="flex items-start gap-8">
            {/* Розовый круг-аватар (цвет круга с лендинга), 3D-вход при скролле */}
            <div
              data-contact-avatar
              className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-blush shadow-lg"
            >
              <span className="fs-label font-bold text-ink">.adswebai</span>
            </div>
            <div data-contact-bubble className="relative mt-10">
              <div className="fs-body-m max-w-md rounded-2xl bg-grape p-5 leading-relaxed text-white">
                {dict.contact.greeting}
                <br />
                {sent
                  ? dict.contact.thanks
                  : dict.contact.intro}
              </div>
              <span className="absolute -bottom-4 -left-6 h-3.5 w-3.5 rounded-full bg-grape" />
            </div>
          </div>

          <form data-contact-el onSubmit={onSubmit} className="mt-16 lg:pl-32">
            {/* Карточка шага */}
            <div
              ref={cardRef}
              className="w-full max-w-xl overflow-hidden rounded-[32px] border border-ink/80 bg-white px-8 py-7 shadow-[0_18px_40px_-24px_rgba(45,45,45,0.45)]"
            >
              <div ref={fieldRef}>
                {sent ? (
                  <p className="fs-body-m py-6 text-ink">
                    {dict.contact.sent}
                  </p>
                ) : current.type === "radio" ? (
                  <>
                    <p className="fs-body-m text-ink/60">{current.label}</p>
                    <div className="mt-5 space-y-3">
                      {current.options.map((opt) => {
                        const active = value === opt;
                        return (
                          <label
                            key={opt}
                            className="group flex cursor-pointer items-center gap-4"
                          >
                            <input
                              type="radio"
                              name={current.name}
                              checked={active}
                              onChange={() => setValue(opt)}
                              className="sr-only"
                            />
                            <span
                              className={`h-[22px] w-[22px] shrink-0 rounded-full border-2 transition-all duration-200 ${
                                active
                                  ? "border-ink bg-ink"
                                  : "border-ink/35 group-hover:border-ink"
                              }`}
                            />
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
                  </>
                ) : current.type === "textarea" ? (
                  <>
                    <p className="fs-body-m text-ink/60">{current.label}</p>
                    <textarea
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      rows={4}
                      className="fs-body-m mt-4 w-full resize-none bg-transparent text-ink focus:outline-none"
                    />
                  </>
                ) : (
                  <>
                    <p className="fs-body-m text-ink/60">{current.label}</p>
                    <input
                      type={current.type}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      autoComplete="off"
                      className="fs-body-m mt-1 w-full bg-transparent text-ink focus:outline-none"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Точки прогресса + круглая кнопка */}
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
                  aria-label={isLast ? dict.contact.send : dict.contact.next}
                  className={`grid h-[72px] w-[72px] place-items-center rounded-full shadow-[0_10px_30px_-16px_rgba(45,45,45,0.6)] transition-all duration-300 ${
                    isLast
                      ? "bg-ink text-white hover:scale-105"
                      : "bg-white text-ink hover:scale-105"
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

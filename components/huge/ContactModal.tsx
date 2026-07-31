"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CONTACT_MODAL } from "./data";
import { Cross } from "./icons";

gsap.registerPlugin(useGSAP);

/**
 * Панель «Become a client» — выезжает справа поверх страницы. У Huge это
 * <dialog> с размытым фоном (backdrop-blur-[40px]) и панелью на 40%
 * ширины экрана; внутри форма из встроенного CRM.
 *
 * Форма здесь своя, размётка по их же сетке: своего эндпоинта у нас нет,
 * поэтому submit только гасит отправку. Поля описаны в data.ts.
 *
 * Фон под панелью — размытие, а не затемнение: так у Huge.
 */
export default function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current || !panel.current) return;

      if (open) {
        gsap.set(root.current, { autoAlpha: 1 });
        gsap.fromTo(
          panel.current,
          { xPercent: 100 },
          { xPercent: 0, duration: 0.6, ease: "power3.out" }
        );
        gsap.fromTo(
          "[data-modal-item]",
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05, delay: 0.2, ease: "power2.out" }
        );
      } else {
        gsap.to(panel.current, {
          xPercent: 100,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => gsap.set(root.current, { autoAlpha: 0 }),
        });
      }
    },
    { dependencies: [open], scope: root }
  );

  // Esc закрывает — обычное ожидание от модального окна.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // Пока панель открыта, фон не крутится
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <div
      ref={root}
      className="invisible fixed inset-0 z-[90] flex justify-end opacity-0"
      role="dialog"
      aria-modal="true"
      aria-label={CONTACT_MODAL.heading}
    >
      {/* Клик по размытому фону закрывает */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-transparent backdrop-blur-[40px]"
      />

      <button
        type="button"
        onClick={onClose}
        className="fixed right-[24px] top-[24px] z-10 flex w-[112px] xl:right-[40px] xl:top-[40px] xl:w-[128px]"
      >
        <span className="t__body flex size-[56px] items-center justify-center bg-[#1B1E23] text-huge-white md:size-[64px]">
          Close
        </span>
        <span className="flex size-[56px] items-center justify-center bg-huge-white text-huge-black md:size-[64px]">
          <Cross />
        </span>
      </button>

      <section
        ref={panel}
        className="relative ml-auto flex min-h-full w-full flex-col bg-huge-black pb-[40px] pt-[80px] text-huge-white md:min-w-[685px] md:max-w-[768px] md:pt-[96px] xl:w-[40%]"
      >
        <div className="v2__grid grow content-start">
          <header
            data-modal-item
            className="t__l col-span-3 mb-[40px] md:col-span-2 md:mb-[56px] xl:col-span-full xl:max-w-[437px]"
          >
            <h2 className="t__l">
              {CONTACT_MODAL.heading}
              <span className="text-huge-magenta"> —</span>
            </h2>
          </header>

          <form
            data-modal-item
            className="col-span-full flex flex-col gap-y-[24px] xl:max-w-[560px]"
            onSubmit={(e) => e.preventDefault()}
          >
            {CONTACT_MODAL.fields.map((f) => (
              <label key={f.name} className="flex flex-col gap-y-[8px]">
                <span className="t__caption text-huge-footnote">{f.label}</span>
                <input
                  name={f.name}
                  type={f.type}
                  className="t__body border-b border-huge-border bg-transparent py-[12px] outline-none transition-colors focus:border-huge-magenta"
                />
              </label>
            ))}

            <label className="flex flex-col gap-y-[8px]">
              <span className="t__caption text-huge-footnote">
                {CONTACT_MODAL.message.label}
              </span>
              <textarea
                name={CONTACT_MODAL.message.name}
                rows={3}
                className="t__body resize-none border-b border-huge-border bg-transparent py-[12px] outline-none transition-colors focus:border-huge-magenta"
              />
            </label>

            <button
              type="submit"
              className="t__body mt-[16px] self-start bg-huge-white px-[40px] py-[20px] text-huge-black transition-colors hover:bg-huge-green"
            >
              {CONTACT_MODAL.submit}
            </button>
          </form>

          <footer data-modal-item className="col-span-full mt-[64px] self-end">
            <h3 className="t__regular mb-[24px] text-[#AFB8C1]">
              {CONTACT_MODAL.footerHeading}
            </h3>
            <ul className="t__body flex flex-col gap-y-[12px]">
              {CONTACT_MODAL.contacts.map((c) => (
                <li key={c.email} className="flex flex-wrap gap-x-[8px]">
                  <span className="text-huge-footnote">{c.label}</span>
                  <a href={`mailto:${c.email}`} className="v2__link v2__link--reveal">
                    {c.email}
                  </a>
                </li>
              ))}
            </ul>
          </footer>
        </div>
      </section>
    </div>
  );
}

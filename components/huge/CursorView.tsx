"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowOut } from "./icons";

/**
 * Плашка «View», которая ездит за курсором над карточками работ —
 * js-cursor из разметки Huge. Появляется только на десктопе (у них
 * `hidden xl:block`) и только когда курсор внутри [data-card].
 *
 * Позиция ставится через gsap.quickTo: он пишет в transform напрямую,
 * без пересчёта React на каждое движение мыши, и сам сглаживает
 * догоняющее движение.
 */
export default function CursorView({ label = "View" }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(min-width: 1280px) and (hover: hover)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });

    let visible = false;
    const setVisible = (v: boolean) => {
      if (v === visible) return;
      visible = v;
      gsap.to(el, { autoAlpha: v ? 1 : 0, duration: 0.3 });
    };

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const overCard = (e.target as Element | null)?.closest?.("[data-card]");
      setVisible(Boolean(overCard));
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none invisible fixed left-0 top-0 z-[60] hidden opacity-0 xl:block"
    >
      <div className="-translate-x-1/2 -translate-y-full">
        <div className="flex">
          <div className="t__body flex aspect-square size-[64px] items-center justify-center bg-huge-white text-center text-huge-black">
            {label}
          </div>
          <div className="flex aspect-square size-[64px] items-center justify-center bg-huge-black text-huge-white">
            <ArrowOut className="size-[32px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

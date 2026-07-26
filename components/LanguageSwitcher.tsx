"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Пока без локалей — только выбор языка в UI
const LANGS = [
  { code: "en", name: "English", Flag: FlagUS },
  { code: "ru", name: "Русский", Flag: FlagRU },
  { code: "pl", name: "Polski", Flag: FlagPL },
  { code: "uk", name: "Українська", Flag: FlagUA },
];

const COLLAPSED = 44;
const PANEL_W = 236;

function FlagUS() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <rect width="24" height="24" fill="#f7f7f7" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={i * 1.846} width="24" height="1.846" fill="#c9243f" />
      ))}
      <rect width="11" height="9.23" fill="#2a3560" />
      {[1.6, 4.2, 6.8].map((y) =>
        [1.4, 3.6, 5.8, 8, 9.6].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.5" fill="#f7f7f7" />
        ))
      )}
    </svg>
  );
}

function FlagRU() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <rect width="24" height="8" fill="#f7f7f7" />
      <rect y="8" width="24" height="8" fill="#1c3b8b" />
      <rect y="16" width="24" height="8" fill="#c9243f" />
    </svg>
  );
}

function FlagPL() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <rect width="24" height="12" fill="#f7f7f7" />
      <rect y="12" width="24" height="12" fill="#d4213d" />
    </svg>
  );
}

function FlagUA() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <rect width="24" height="12" fill="#2b6cd4" />
      <rect y="12" width="24" height="12" fill="#f5c542" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.4 2.4 3.6 5.4 3.6 9s-1.2 6.6-3.6 9c-2.4-2.4-3.6-5.4-3.6-9S9.6 5.4 12 3z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default function LanguageSwitcher() {
  const rootRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("en");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(shellRef.current, {
        width: COLLAPSED,
        height: COLLAPSED,
        borderRadius: 100,
      });
      gsap.set("[data-lang-item]", { autoAlpha: 0, y: 12 });

      // Морфинг «шторки»: круглая точка разворачивается в панель
      const tl = gsap.timeline({ paused: true });

      tl.to(
        shellRef.current,
        {
          width: PANEL_W,
          height: () => panelRef.current?.offsetHeight ?? 220,
          borderRadius: 22,
          // Свёрнутая точка чёрная, раскрытая шторка перекрашивается
          // в тот же серый, что у выпадающих меню (Solutions и др.) — #2D2D2D
          backgroundColor: "#2d2d2d",
          duration: 0.55,
          ease: "expo.out",
        },
        0
      )
        .to(
          globeRef.current,
          { autoAlpha: 0, scale: 0.5, duration: 0.15, ease: "power2.in" },
          0
        )
        .to(
          "[data-lang-item]",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.045,
            ease: "power3.out",
          },
          0.12
        );

      tlRef.current = tl;
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (open) tl.play();
    else tl.reverse();
  }, [open]);

  // Закрытие по клику снаружи и по Escape
  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <div
        ref={shellRef}
        className="relative overflow-hidden bg-black text-white shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)]"
      >
        {/* Свёрнутое состояние — точка с глобусом */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Change language"
          aria-expanded={open}
          className={`absolute left-0 top-0 z-10 grid h-[44px] w-[44px] place-items-center ${
            open ? "pointer-events-none" : ""
          }`}
        >
          <span ref={globeRef} className="grid place-items-center text-white/90">
            <GlobeIcon />
          </span>
        </button>

        {/* Развёрнутая панель */}
        <div
          ref={panelRef}
          className="absolute left-1/2 top-0 w-[236px] -translate-x-1/2 p-2"
        >
          {LANGS.map((l) => {
            const isActive = l.code === active;
            return (
              <button
                key={l.code}
                data-lang-item
                type="button"
                onClick={() => {
                  setActive(l.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left transition-colors duration-200 ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/55 hover:bg-white/5 hover:text-white/85"
                }`}
              >
                <span className="h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15">
                  <l.Flag />
                </span>
                <span className="fs-label font-medium">{l.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

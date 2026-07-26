"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import SwapLink from "./SwapLink";
import LanguageSwitcher from "./LanguageSwitcher";
import { LEGAL_DOCS } from "@/content/legal";

const BIG_LINKS = [
  { label: "What We Do", href: "/what-we-do" },
  { label: "Partners", href: "/partners" },
  { label: "Work", href: "/work" },
  { label: "Careers", href: "/about/careers" },
  { label: "Thinking", href: "/thinking" },
  { label: "Connect", href: "/contact" },
];

// Мелкие ссылки: «An adswebai Company» ведёт на About, остальные —
// на реальные документы из content/legal.ts (порядок задаётся там же)
const SMALL_LINKS: { label: string; href: string }[] = [
  { label: "An adswebai Company", href: "/about" },
  ...LEGAL_DOCS.map((d) => ({ label: d.title, href: `/legal/${d.slug}` })),
];

function Arrow({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
    >
      <path
        d="M1 7h11m0 0L7.5 2.5M12 7l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ИЗМЕНЕНО: соцпиктограммы для нижнего ряда (TikTok, X, LinkedIn, Instagram)
const SOCIALS: { label: string; icon: React.ReactNode }[] = [
  {
    label: "TikTok",
    icon: (
      <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
        <path d="M9.2 1c.3 1.6 1.3 2.6 2.9 2.9v1.9c-1.1-.05-2.1-.4-2.9-1v4.1a3.6 3.6 0 1 1-3.6-3.6c.17 0 .34.01.5.04v2a1.6 1.6 0 1 0 1.1 1.55V1h2z" />
      </svg>
    ),
  },
  {
    label: "X",
    icon: (
      <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path d="M1.5 1.5l11 11m0-11l-11 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    icon: (
      <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
        <circle cx="2.6" cy="2.6" r="1.4" />
        <rect x="1.5" y="5.2" width="2.2" height="7.3" />
        <path d="M5.6 5.2h2.1v1c.4-.7 1.2-1.2 2.3-1.2 1.7 0 2.5 1.1 2.5 3v4.5h-2.2V8.4c0-1-.4-1.6-1.2-1.6-.9 0-1.4.6-1.4 1.6v4.1H5.6V5.2z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    icon: (
      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
        <rect x="1.5" y="1.5" width="11" height="11" rx="3" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="10.4" cy="3.6" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const onSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    // Фон футера — #191715 (глубже основного ink, как в референсе)
    <footer className="bg-[#191715] px-6 pb-10 pt-20 text-cream lg:px-10">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        <p className="fs-label text-white/60 lg:col-span-2">Keep Exploring...</p>

        <nav className="lg:col-span-3">
          {BIG_LINKS.map((l) => (
            // Как пункты шапки: точка «падает» слева, слово подпрыгивает
            // (те же кейфреймы dot-in/dot-out/label-bounce из globals.css)
            <Link
              key={l.href}
              href={l.href}
              className="nav-item relative block w-max py-1.5 text-[clamp(32px,26px+1.4vw,52px)] font-medium leading-[1.15] tracking-normal"
            >
              <span
                aria-hidden
                className="nav-dot pointer-events-none absolute -left-6 top-1/2 h-2.5 w-2.5 rounded-full bg-current"
              />
              <span className="nav-label inline-block">{l.label}</span>
            </Link>
          ))}
        </nav>

        <div className="lg:col-span-4">
          {SMALL_LINKS.map((l) => (
            // Механика Connect: слово уезжает вправо, стрелка гаснет сзади
            // и её круг-дубль появляется ПЕРЕД словом
            <div key={l.href} data-btn-hover className="py-1">
              <SwapLink
                label={l.label}
                href={l.href}
                size={30}
                gap={14}
                iconSize={12}
                circleClass="border border-white/25 text-current"
                className="text-[19px] font-medium leading-[1.35]"
              />
            </div>
          ))}
        </div>

        <div className="lg:col-span-3 lg:justify-self-end">
          {/* Рабочий выбор языка: меню выпадает вверх, EN/RU */}
          <LanguageSwitcher variant="pill" />
        </div>
      </div>

      {/* ИЗМЕНЕНО: нижний ряд по скриншоту — соцсети + Follow Us | Newsletter | копирайт */}
      <div className="mt-24 flex flex-col gap-10 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/25 transition-all duration-300 hover:border-cream hover:bg-cream hover:text-ink"
              >
                {s.icon}
              </a>
            ))}
          </div>
          <span className="fs-label text-white/80">Follow Us</span>
        </div>

        {subscribed ? (
          <p className="fs-label text-white/60">You’re on the list. 👋</p>
        ) : (
          <form onSubmit={onSubscribe} className="group flex items-center gap-3">
            <span className="fs-label font-medium">Newsletter</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="fs-label w-60 border-b border-white/40 bg-transparent py-2 placeholder:text-white/50 focus:border-white focus:outline-none"
            />
            {/* ИЗМЕНЕНО: hover — стрелка подписки уезжает вправо, фон меняет оттенок */}
            <button
              type="submit"
              aria-label="Subscribe"
              className="grid h-10 w-10 place-items-center rounded-full bg-cream text-ink transition-all duration-300 hover:translate-x-1 hover:bg-white"
            >
              <Arrow />
            </button>
          </form>
        )}

        <p className="fs-label text-white/50">
          Copyright 2026 <span className="font-bold text-white/80">adswebai</span>
        </p>
      </div>
    </footer>
  );
}

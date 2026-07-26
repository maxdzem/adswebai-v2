import type { Metadata } from "next";
import Link from "next/link";
import MediaSlot from "@/components/MediaSlot";
import Button from "@/components/Button";
import SwapLink from "@/components/SwapLink";
import { FxUp, FxSide, FxDrift } from "@/components/Fx";
import { SOLUTIONS, SERVICES } from "@/content/site";

const LEDE =
  "Four ways in, eleven disciplines behind them, and the engineering to keep the whole thing running. Start wherever the bottleneck actually is.";

export const metadata: Metadata = {
  title: "What We Do",
  description: LEDE,
  alternates: { canonical: "/what-we-do" },
  openGraph: {
    title: "What We Do — adswebai",
    description: LEDE,
    url: "/what-we-do",
  },
};

/**
 * Обзорная страница-развилка: собирает три ветки предложения
 * (решения, услуги, технологии) и ведёт в соответствующие разделы.
 * Контент не дублируется — тянется из content/site.ts.
 */
export default function WhatWeDoPage() {
  return (
    <main className="bg-cream pt-[100px]">
      <div className="pb-32 pt-24">
        <div className="px-6 lg:px-10">
          <div className="lg:ml-[12%]">
            <FxUp>
              <p className="fs-label font-medium text-ink/60">Overview</p>
            </FxUp>
            <FxUp delay={0.08}>
              <h1 className="type-display fs-display-m mt-5 max-w-[20ch]">
                What we do
              </h1>
            </FxUp>
            <FxUp delay={0.16}>
              <p className="fs-body-l mt-8 max-w-[54ch] text-ink/70">{LEDE}</p>
            </FxUp>
          </div>
        </div>

        <FxDrift to="left" amount={5}>
          <MediaSlot ratio="21/9" className="mt-16" />
        </FxDrift>

        {/* Ветка 1 — решения, крупными карточками */}
        <div className="px-6 lg:px-10">
          <section className="mt-28 lg:ml-[12%]">
            <FxUp>
              <span className="fs-label font-medium text-ink/40">01</span>
              <h2 className="type-display fs-display-s mt-3">Solutions</h2>
              <p className="fs-body-m mt-5 max-w-[54ch] text-ink/70">
                Joined-up programmes when the problem spans more than one
                discipline. Each one is a way of working, not a package.
              </p>
            </FxUp>

            <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-2">
              {SOLUTIONS.map((p, i) => (
                <li key={p.slug}>
                  <FxSide side={i % 2 === 0 ? "left" : "right"}>
                    <Link
                      href={`/solutions/${p.slug}`}
                      data-btn-hover
                      className="group block"
                    >
                      <MediaSlot ratio="4/3" />
                      <h3 className="fs-body-m mt-6 font-bold leading-[1.15]">
                        <SwapLink label={p.title} href={null} size={32} iconSize={12} />
                      </h3>
                      <p className="fs-body-m mt-3 max-w-[46ch] text-ink/70">
                        {p.lede}
                      </p>
                    </Link>
                  </FxSide>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Ветка 2 — услуги: тёмная полоса, плотный список */}
        <div className="mt-28 bg-ink py-24 text-cream">
          <div className="px-6 lg:px-10">
            <FxUp className="lg:ml-[12%]">
              <span className="fs-label font-medium text-cream/40">02</span>
              <h2 className="type-display fs-display-s mt-3">
                Marketing Services
              </h2>
              <p className="fs-body-m mt-5 max-w-[54ch] text-cream/70">
                The individual disciplines, available on their own or joined
                into one of the solutions above. Most engagements start with two
                or three.
              </p>
            </FxUp>

            <ul className="mt-14 grid grid-cols-1 gap-x-10 border-t border-cream/25 sm:grid-cols-2 lg:ml-[12%] lg:grid-cols-3">
              {SERVICES.map((p, i) => (
                <li key={p.slug} className="border-b border-cream/20">
                  <FxUp delay={(i % 3) * 0.05}>
                    <Link
                      href={`/services/${p.slug}`}
                      className="flex items-baseline gap-4 py-5 transition-opacity hover:opacity-60"
                    >
                      <span className="fs-label shrink-0 font-medium text-cream/40">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="fs-body-m font-medium">{p.title}</span>
                    </Link>
                  </FxUp>
                </li>
              ))}
            </ul>

            <FxUp className="mt-12 lg:ml-[12%]">
              <Link href="/services" data-btn-hover className="inline-block">
                <Button
                  label="All services"
                  href={null}
                  colorClass="bg-cream text-ink"
                />
              </Link>
            </FxUp>
          </div>
        </div>

        {/* Ветка 3 — технологии */}
        <div className="px-6 lg:px-10">
          <section className="mt-28 lg:ml-[12%] lg:flex lg:items-start lg:gap-16">
            <FxUp className="max-w-[54ch] lg:flex-1">
              <span className="fs-label font-medium text-ink/40">03</span>
              <h2 className="type-display fs-display-s mt-3">
                Technology Services
              </h2>
              <p className="fs-body-m mt-5 text-ink/70">
                The engineering underneath the marketing: platforms,
                integrations and data plumbing built to be handed over. Most
                problems that look strategic turn out to live here.
              </p>
              <div className="mt-10">
                <Link
                  href="/technology-services"
                  data-btn-hover
                  className="inline-block"
                >
                  <Button label="How that works" href={null} />
                </Link>
              </div>
            </FxUp>

            <FxSide side="right" className="mt-12 lg:mt-0 lg:w-[38%] lg:shrink-0">
              <MediaSlot ratio="1/1" />
            </FxSide>
          </section>
        </div>
      </div>

      <div className="bg-mist px-6 py-20 lg:px-10">
        <FxUp className="lg:ml-[12%]">
          <h2 className="fs-label font-medium text-ink/60">Also in this area</h2>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { label: "Work", href: "/work" },
              { label: "Partners", href: "/partners" },
              { label: "Thinking", href: "/thinking" },
              { label: "About Us", href: "/about" },
            ].map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="fs-body-m underline-offset-4 transition-colors hover:text-ink/60 hover:underline"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </FxUp>
      </div>
    </main>
  );
}

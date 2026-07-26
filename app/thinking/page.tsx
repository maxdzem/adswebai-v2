import type { Metadata } from "next";
import Link from "next/link";
import MediaSlot from "@/components/MediaSlot";
import Button from "@/components/Button";
import { FxUp, FxSide, FxDrift } from "@/components/Fx";

const LEDE =
  "Reports, notes and post-mortems. We publish when we have run something enough times to know whether it holds.";

export const metadata: Metadata = {
  title: "Thinking",
  description: LEDE,
  alternates: { canonical: "/thinking" },
  openGraph: { title: "Thinking — adswebai", description: LEDE, url: "/thinking" },
};

/**
 * Индекс материалов. Реальные статьи подставляются сюда (или из CMS)
 * в POSTS — выдуманных заголовков с датами здесь намеренно нет.
 * Пока пусто: крупный слот-открывашка + сетка слотов под будущие материалы.
 */
const POSTS: {
  title: string;
  kind: string;
  read: string;
  href: string;
}[] = [];

/** Темы, о которых пишем — навигация по будущему архиву. */
const TOPICS = [
  "AI in production",
  "Measurement",
  "Content supply chain",
  "Search & answer engines",
  "Platform economics",
  "Ways of working",
];

export default function ThinkingPage() {
  return (
    <main className="bg-cream pt-[100px]">
      <div className="pb-32 pt-24">
        <div className="px-6 lg:px-10">
          <div className="lg:ml-[12%]">
            <FxUp>
              <p className="fs-label font-medium text-ink/60">Thinking</p>
            </FxUp>
            <FxUp delay={0.08}>
              <h1 className="type-display fs-display-m mt-5 max-w-[18ch]">
                Thinking
              </h1>
            </FxUp>
            <FxUp delay={0.16}>
              <p className="fs-body-l mt-8 max-w-[54ch] text-ink/70">{LEDE}</p>
            </FxUp>
          </div>
        </div>

        {/* Слот под ведущий материал */}
        <FxDrift to="left" amount={5}>
          <MediaSlot ratio="21/9" className="mt-16" />
        </FxDrift>

        <div className="px-6 lg:px-10">
          {/* Темы */}
          <FxUp className="mt-20 lg:ml-[12%]">
            <h2 className="fs-label font-medium text-ink/60">Topics</h2>
            <ul className="mt-5 flex flex-wrap gap-3">
              {TOPICS.map((t) => (
                <li
                  key={t}
                  className="fs-label rounded-full border border-ink/25 px-4 py-2 font-medium text-ink/70"
                >
                  {t}
                </li>
              ))}
            </ul>
          </FxUp>

          {POSTS.length === 0 ? (
            <>
              <FxUp className="mt-20 max-w-[62ch] lg:ml-[12%]">
                <p className="fs-body-m text-ink/70">
                  Nothing published here yet. If there is a topic above you want
                  our read on before we write it up,{" "}
                  <Link href="/contact" className="underline underline-offset-4">
                    ask directly
                  </Link>{" "}
                  — we would rather answer the specific question than publish a
                  general one.
                </p>
              </FxUp>

              {/* Сетка слотов под будущие материалы */}
              <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:ml-[12%] lg:grid-cols-3">
                {["16/9", "4/3", "16/9", "1/1", "16/9", "4/3"].map((r, i) => (
                  <FxSide
                    key={i}
                    side={i % 2 === 0 ? "left" : "right"}
                    delay={(i % 3) * 0.06}
                    className={i % 3 === 1 ? "lg:mt-12" : ""}
                  >
                    <MediaSlot ratio={r} />
                  </FxSide>
                ))}
              </div>
            </>
          ) : (
            <ul className="mt-20 border-t border-ink/15 lg:ml-[12%]">
              {POSTS.map((p) => (
                <li key={p.href} className="border-b border-ink/15">
                  <Link
                    href={p.href}
                    className="flex flex-col gap-2 py-7 transition-opacity hover:opacity-60 lg:flex-row lg:items-center lg:gap-10"
                  >
                    <span className="fs-label shrink-0 text-ink/60 lg:w-40">
                      {p.kind}
                    </span>
                    <span className="fs-body-m flex-1 font-medium">
                      {p.title}
                    </span>
                    <span className="fs-label shrink-0 text-ink/60">
                      {p.read} read
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-mist px-6 py-20 lg:px-10">
        <FxUp className="lg:ml-[12%]">
          <h2 className="fs-label font-medium text-ink/60">Also in this area</h2>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { label: "Newsroom", href: "/about/newsroom" },
              { label: "Work", href: "/work" },
              { label: "What We Do", href: "/what-we-do" },
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
          <div className="mt-12">
            <Link href="/contact" data-btn-hover className="inline-block">
              <Button label="Start a conversation" href={null} />
            </Link>
          </div>
        </FxUp>
      </div>
    </main>
  );
}

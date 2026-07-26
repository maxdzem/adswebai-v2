import type { Metadata } from "next";
import Link from "next/link";
import MediaSlot from "@/components/MediaSlot";
import Button from "@/components/Button";
import { FxUp, FxSide } from "@/components/Fx";

const LEDE =
  "The platforms we build on and the vendors we hold to account. We name a partnership only where we hold the certification and do the work ourselves.";

export const metadata: Metadata = {
  title: "Partners",
  description: LEDE,
  alternates: { canonical: "/partners" },
  openGraph: { title: "Partners — adswebai", description: LEDE, url: "/partners" },
};

/**
 * Категории партнёрского стека. Конкретные вендоры и уровни сертификации
 * намеренно не перечислены: заявлять партнёрский статус, которого нет —
 * ложное утверждение о компании. Слоты под логотипы стоят и ждут реальных.
 */
const AREAS = [
  {
    n: "01",
    title: "Advertising platforms",
    body: "Where media is bought and measured. We work inside the platform's own tooling rather than a layer on top of it, so nothing is lost in translation at reporting time.",
  },
  {
    n: "02",
    title: "Cloud & data",
    body: "Warehousing, pipelines and identity. The choice here decides what measurement is possible two years out, so it gets made deliberately.",
  },
  {
    n: "03",
    title: "Content & experience platforms",
    body: "CMS, DAM and the front-end stack. Chosen for what your team can actually operate after handover, not for the feature matrix.",
  },
  {
    n: "04",
    title: "AI & automation vendors",
    body: "Model providers, orchestration and agent tooling. We stay deliberately portable here — the space moves too quickly to be locked to one supplier.",
  },
];

export default function PartnersPage() {
  return (
    <main className="bg-mist pt-[100px]">
      <div className="px-6 pb-32 pt-24 lg:px-10">
        <div className="lg:ml-[12%]">
          <FxUp>
            <p className="fs-label font-medium text-ink/60">Company</p>
          </FxUp>
          <FxUp delay={0.08}>
            <h1 className="type-display fs-display-m mt-5 max-w-[18ch]">
              Partners
            </h1>
          </FxUp>
          <FxUp delay={0.16}>
            <p className="fs-body-l mt-8 max-w-[54ch] text-ink/70">{LEDE}</p>
          </FxUp>
        </div>

        {/* Сетка слотов под логотипы партнёров */}
        <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:ml-[12%] lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <FxUp key={i} delay={(i % 6) * 0.05}>
              <MediaSlot ratio="4/3" note="Logo" />
            </FxUp>
          ))}
        </div>

        {/* Категории стека */}
        <div className="mt-24 lg:ml-[12%]">
          {AREAS.map((a, i) => (
            <section
              key={a.n}
              className="mb-14 border-t border-ink/15 pt-8 lg:flex lg:gap-16"
            >
              <FxUp className="lg:w-[32%] lg:shrink-0">
                <span className="fs-label font-medium text-ink/40">{a.n}</span>
                <h2 className="type-display fs-display-s mt-3">{a.title}</h2>
              </FxUp>
              <FxUp delay={0.08} className="mt-4 max-w-[56ch] lg:mt-0 lg:flex-1">
                <p className="fs-body-m text-ink/70">{a.body}</p>
              </FxUp>
            </section>
          ))}
        </div>

        {/* Условия партнёрства */}
        <section className="mt-16 lg:ml-[12%] lg:flex lg:items-start lg:gap-16">
          <FxUp className="max-w-[54ch] lg:flex-1">
            <h2 className="type-display fs-display-s">
              How we pick a partner
            </h2>
            <p className="fs-body-m mt-5 text-ink/70">
              A partnership has to survive one test: would we still recommend
              this platform to a client if the commercial arrangement disappeared
              tomorrow? Where the answer is no, we do not sign.
            </p>
            <ul className="mt-8 border-t border-ink/15">
              {[
                "No recommendation is influenced by a rebate or margin",
                "Certified people on the account, not certified logos on a slide",
                "Exit path documented before implementation starts",
                "We say when the cheaper tool is the right one",
              ].map((b) => (
                <li
                  key={b}
                  className="fs-body-m border-b border-ink/15 py-4 text-ink/80"
                >
                  {b}
                </li>
              ))}
            </ul>
          </FxUp>

          <FxSide side="right" className="mt-12 lg:mt-0 lg:w-[34%] lg:shrink-0">
            <MediaSlot ratio="3/4" />
          </FxSide>
        </section>
      </div>

      <div className="bg-cream px-6 py-20 lg:px-10">
        <FxUp className="lg:ml-[12%]">
          <p className="fs-body-m max-w-[52ch] text-ink/70">
            Building on a platform we have not listed? Ask — we will tell you
            straight whether we are the right team for it.
          </p>
          <div className="mt-10">
            <Link href="/contact" data-btn-hover className="inline-block">
              <Button label="Start a conversation" href={null} />
            </Link>
          </div>
        </FxUp>
      </div>
    </main>
  );
}

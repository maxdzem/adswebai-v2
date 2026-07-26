import type { Metadata } from "next";
import Link from "next/link";
import { FxUp } from "@/components/Fx";
import { LEGAL_DOCS, LEGAL_GROUPS } from "@/content/legal";

const LEDE =
  "Corporate documents, policies and public commitments, grouped by what they cover.";

export const metadata: Metadata = {
  title: "Legal & policies",
  description: LEDE,
  alternates: { canonical: "/legal" },
  openGraph: {
    title: "Legal & policies — adswebai",
    description: LEDE,
    url: "/legal",
  },
};

export default function LegalIndex() {
  return (
    <main className="bg-mist pt-[100px]">
      <div className="px-6 pb-32 pt-24 lg:px-10">
        <div className="lg:ml-[12%]">
          <FxUp>
            <p className="fs-label font-medium text-ink/60">Company</p>
          </FxUp>
          <FxUp delay={0.08}>
            <h1 className="type-display fs-display-m mt-5 max-w-[20ch]">
              Legal &amp; policies
            </h1>
          </FxUp>
          <FxUp delay={0.16}>
            <p className="fs-body-l mt-8 max-w-[52ch] text-ink/70">{LEDE}</p>
          </FxUp>
        </div>

        <div className="mt-20 lg:ml-[12%]">
          {LEGAL_GROUPS.map((group, gi) => {
            const docs = LEGAL_DOCS.filter((d) => d.group === group);
            if (docs.length === 0) return null;

            return (
              <FxUp key={group} delay={gi * 0.06}>
                <section className="mb-14 border-t border-ink/15 pt-8 lg:flex lg:gap-16">
                  <h2 className="type-display fs-display-s lg:w-[28%] lg:shrink-0">
                    {group}
                  </h2>
                  <ul className="mt-5 lg:mt-0 lg:flex-1">
                    {docs.map((d) => (
                      <li key={d.slug} className="border-b border-ink/15">
                        <Link
                          href={`/legal/${d.slug}`}
                          className="block py-5 transition-opacity hover:opacity-60"
                        >
                          <span className="fs-body-m block font-medium">
                            {d.title}
                          </span>
                          <span className="fs-label mt-1 block max-w-[62ch] text-ink/60">
                            {d.purpose}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </FxUp>
            );
          })}
        </div>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import MediaSlot from "@/components/MediaSlot";
import { FxUp, FxSide } from "@/components/Fx";

const LEDE =
  "We hire senior and we hire slowly. Fewer people, given real ownership, with the time to do the work properly.";

export const metadata: Metadata = {
  title: "Careers",
  description: LEDE,
  alternates: { canonical: "/about/careers" },
  openGraph: {
    title: "Careers — adswebai",
    description: LEDE,
    url: "/about/careers",
  },
};

/** Реальные вакансии подставляются сюда (или из ATS) перед публикацией. */
const OPENINGS: { title: string; team: string; location: string }[] = [];

export default function CareersPage() {
  return (
    <main className="bg-mist pt-[100px]">
      <div className="px-6 pb-32 pt-24 lg:px-10">
        <div className="lg:ml-[12%]">
          <FxUp>
            <p className="fs-label font-medium text-ink/60">About Us</p>
          </FxUp>
          <FxUp delay={0.08}>
            <h1 className="type-display fs-display-m mt-5 max-w-[18ch]">
              Careers
            </h1>
          </FxUp>
          <FxUp delay={0.16}>
            <p className="fs-body-l mt-8 max-w-[52ch] text-ink/70">{LEDE}</p>
          </FxUp>
        </div>

        {/* Двухколоночник: текст слева, пара слотов «жизнь команды» справа */}
        <section className="mt-20 lg:ml-[12%] lg:flex lg:items-start lg:gap-16">
          <FxUp className="max-w-[56ch] lg:flex-1">
            <h2 className="type-display fs-display-s">How we work</h2>
            <p className="fs-body-m mt-5 text-ink/70">
              Small teams with end-to-end ownership. The person who scopes a
              piece of work is the person who delivers it, which means fewer
              handovers and no writing briefs for someone else to interpret.
            </p>
            <ul className="mt-8 border-t border-ink/15">
              {[
                "Senior-weighted teams — no pyramid staffing",
                "Remote-friendly, with deliberate time together",
                "Budget and time set aside for learning",
                "Honest about workload; we do not sell hours we do not have",
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
            <MediaSlot ratio="4/3" />
            <MediaSlot ratio="1/1" className="mt-6" />
          </FxSide>
        </section>

        <section className="mt-24 max-w-[62ch] lg:ml-[12%]">
          <h2 className="type-display fs-display-s">Open roles</h2>

          {OPENINGS.length === 0 ? (
            <p className="fs-body-m mt-5 text-ink/70">
              Nothing open right now. If you think you should be here anyway,{" "}
              <Link href="/contact" className="underline underline-offset-4">
                write to us
              </Link>{" "}
              — tell us what you would want to own and why. We read all of them.
            </p>
          ) : (
            <ul className="mt-8 border-t border-ink/15">
              {OPENINGS.map((o) => (
                <li
                  key={o.title}
                  className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-ink/15 py-5"
                >
                  <span className="fs-body-m font-medium">{o.title}</span>
                  <span className="fs-label text-ink/50">{o.team}</span>
                  <span className="fs-label text-ink/50">{o.location}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

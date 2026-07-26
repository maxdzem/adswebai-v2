import type { Metadata } from "next";
import Link from "next/link";
import MediaSlot from "@/components/MediaSlot";
import { FxUp, FxSide } from "@/components/Fx";

const LEDE =
  "The people accountable for the work. Small senior team — the names on the pitch are the names on the project.";

export const metadata: Metadata = {
  title: "Leadership",
  description: LEDE,
  alternates: { canonical: "/about/leadership" },
  openGraph: {
    title: "Leadership — adswebai",
    description: LEDE,
    url: "/about/leadership",
  },
};

/**
 * Заглушки под реальных людей. Имена и биографии подставляются
 * из реальных данных перед публикацией — выдуманных людей здесь
 * намеренно нет, чтобы никто случайно не ушёл в прод.
 */
const ROLES = [
  {
    role: "Managing Director",
    remit: "Overall accountability for client outcomes and the shape of the practice.",
  },
  {
    role: "Executive Creative Director",
    remit: "Brand systems, creative standards and the quality bar across output.",
  },
  {
    role: "Head of Media",
    remit: "Planning, buying and the measurement standards behind spend decisions.",
  },
  {
    role: "Head of Technology",
    remit: "Platform architecture, integrations and engineering delivery.",
  },
  {
    role: "Head of Strategy",
    remit: "Positioning, research and the thinking that briefs the work.",
  },
];

export default function LeadershipPage() {
  return (
    // Портретная сетка: у каждой роли свой слот под фото — раздел
    // отличается от списочных страниц и сразу готов под реальные портреты
    <main className="bg-cream pt-[100px]">
      <div className="px-6 pb-32 pt-24 lg:px-10">
        <div className="lg:ml-[12%]">
          <FxUp>
            <p className="fs-label font-medium text-ink/60">About Us</p>
          </FxUp>
          <FxUp delay={0.08}>
            <h1 className="type-display fs-display-m mt-5 max-w-[18ch]">
              Leadership
            </h1>
          </FxUp>
          <FxUp delay={0.16}>
            <p className="fs-body-l mt-8 max-w-[52ch] text-ink/70">{LEDE}</p>
          </FxUp>
        </div>

        <ul className="mt-20 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:ml-[12%] lg:grid-cols-3">
          {ROLES.map((r, i) => (
            <li key={r.role}>
              <FxSide
                side={i % 2 === 0 ? "left" : "right"}
                delay={(i % 3) * 0.06}
              >
                <MediaSlot ratio="3/4" note="Portrait" />
                <h2 className="type-display fs-display-s mt-6">{r.role}</h2>
                <p className="fs-body-m mt-3 text-ink/70">{r.remit}</p>
              </FxSide>
            </li>
          ))}
        </ul>

        <FxUp className="mt-20 lg:ml-[12%]">
          <p className="fs-body-m max-w-[52ch] text-ink/60">
            Want to know who you would actually be working with?{" "}
            <Link href="/contact" className="underline underline-offset-4">
              Ask us
            </Link>{" "}
            — we will tell you before you commit to anything.
          </p>
        </FxUp>
      </div>
    </main>
  );
}

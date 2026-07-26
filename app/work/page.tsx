import type { Metadata } from "next";
import Link from "next/link";
import MediaSlot from "@/components/MediaSlot";
import { FxUp, FxSide, FxDrift } from "@/components/Fx";

const LEDE =
  "Selected engagements. We publish a case only once the client has approved the numbers in it.";

export const metadata: Metadata = {
  title: "Work",
  description: LEDE,
  alternates: { canonical: "/work" },
  openGraph: { title: "Work — adswebai", description: LEDE, url: "/work" },
};

/**
 * Галерея кейсов. Реальных кейсов пока нет — вместо выдуманных клиентов
 * и метрик стоит сетка пустых слотов разных пропорций: ролик кладётся
 * в /public и передаётся в src нужного слота, вёрстка при этом не меняется.
 *
 * Сетка нарочно разноразмерная и со сдвигами по вертикали — раздел
 * читается как галерея, а не как таблица.
 */
const SLOTS: { ratio: string; span: string; offset?: string }[] = [
  { ratio: "16/9", span: "lg:col-span-7" },
  { ratio: "3/4", span: "lg:col-span-5", offset: "lg:mt-24" },
  { ratio: "1/1", span: "lg:col-span-5" },
  { ratio: "16/9", span: "lg:col-span-7", offset: "lg:mt-16" },
  { ratio: "21/9", span: "lg:col-span-12", offset: "lg:mt-8" },
  { ratio: "4/3", span: "lg:col-span-6" },
  { ratio: "4/3", span: "lg:col-span-6", offset: "lg:mt-20" },
];

export default function WorkPage() {
  return (
    <main className="bg-mist pt-[100px]">
      <div className="pb-32 pt-24">
        <div className="px-6 lg:px-10">
          <div className="lg:ml-[12%]">
            <FxUp>
              <p className="fs-label font-medium text-ink/60">Work</p>
            </FxUp>
            <FxUp delay={0.08}>
              <h1 className="type-display fs-display-m mt-5 max-w-[18ch]">
                Selected work
              </h1>
            </FxUp>
            <FxUp delay={0.16}>
              <p className="fs-body-l mt-8 max-w-[52ch] text-ink/70">{LEDE}</p>
            </FxUp>
          </div>
        </div>

        {/* Широкий слот-открывашка на всю ширину */}
        <FxDrift to="left" amount={5}>
          <MediaSlot ratio="21/9" className="mt-16" />
        </FxDrift>

        <div className="px-6 lg:px-10">
          <FxUp className="mt-24 max-w-[62ch] lg:ml-[12%]">
            <p className="fs-body-m text-ink/70">
              Case studies are being written up. In the meantime we are happy to
              walk through relevant work directly —{" "}
              <Link href="/contact" className="underline underline-offset-4">
                ask for a walkthrough
              </Link>{" "}
              and tell us your category.
            </p>
          </FxUp>

          {/* Разноразмерная сетка пустых слотов под будущие ролики */}
          <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:ml-[12%] lg:grid-cols-12">
            {SLOTS.map((s, i) => (
              <FxSide
                key={i}
                side={i % 2 === 0 ? "left" : "right"}
                className={`${s.span} ${s.offset ?? ""}`}
              >
                <MediaSlot ratio={s.ratio} />
              </FxSide>
            ))}
          </div>
        </div>
      </div>

      {/* Кремовый финал — тот же приём, что у остальных внутренних страниц */}
      <div className="bg-cream px-6 py-20 lg:px-10">
        <FxUp className="lg:ml-[12%]">
          <h2 className="fs-label font-medium text-ink/60">Also in this area</h2>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { label: "Solutions", href: "/solutions" },
              { label: "Marketing Services", href: "/services" },
              { label: "Technology Services", href: "/technology-services" },
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

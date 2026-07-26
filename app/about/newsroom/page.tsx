import type { Metadata } from "next";
import Link from "next/link";
import MediaSlot from "@/components/MediaSlot";
import { FxUp } from "@/components/Fx";

const LEDE =
  "Announcements, writing and the occasional post-mortem. We publish when we have something worth saying.";

export const metadata: Metadata = {
  title: "Newsroom",
  description: LEDE,
  alternates: { canonical: "/about/newsroom" },
  openGraph: {
    title: "Newsroom — adswebai",
    description: LEDE,
    url: "/about/newsroom",
  },
};

/**
 * Реальные материалы подставляются сюда (или из CMS).
 * Пусто по умолчанию: выдуманные новости с датами — последнее,
 * что должно случайно уехать в прод и попасть в индекс.
 */
const POSTS: { title: string; date: string; href: string }[] = [];

export default function NewsroomPage() {
  return (
    <main className="bg-mist pt-[100px]">
      <div className="px-6 pb-32 pt-24 lg:px-10">
        <div className="lg:ml-[12%]">
          <FxUp>
            <p className="fs-label font-medium text-ink/60">About Us</p>
          </FxUp>
          <FxUp delay={0.08}>
            <h1 className="type-display fs-display-m mt-5 max-w-[18ch]">
              Newsroom
            </h1>
          </FxUp>
          <FxUp delay={0.16}>
            <p className="fs-body-l mt-8 max-w-[52ch] text-ink/70">{LEDE}</p>
          </FxUp>
        </div>

        <div className="mt-20 lg:ml-[12%]">
          {POSTS.length === 0 ? (
            <>
              <FxUp>
                <p className="fs-body-m max-w-[62ch] text-ink/70">
                  Nothing published yet. For press enquiries,{" "}
                  <Link href="/contact" className="underline underline-offset-4">
                    get in touch
                  </Link>
                  .
                </p>
              </FxUp>

              {/* Слоты под будущие материалы: первый крупный, дальше сетка */}
              <FxUp delay={0.08} className="mt-12">
                <MediaSlot ratio="21/9" />
              </FxUp>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {["16/9", "16/9", "16/9"].map((r, i) => (
                  <FxUp key={i} delay={i * 0.06}>
                    <MediaSlot ratio={r} />
                  </FxUp>
                ))}
              </div>
            </>
          ) : (
            <ul className="border-t border-ink/15">
              {POSTS.map((p) => (
                <li key={p.href} className="border-b border-ink/15">
                  <Link
                    href={p.href}
                    className="flex flex-col gap-1 py-6 transition-opacity hover:opacity-60"
                  >
                    <time className="fs-label text-ink/50">{p.date}</time>
                    <span className="fs-body-m font-medium">{p.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

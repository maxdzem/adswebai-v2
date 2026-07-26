import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FxUp } from "@/components/Fx";
import Button from "@/components/Button";
import { LEGAL_DOCS, findLegal } from "@/content/legal";
import { SITE_NAME } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = findLegal(slug);
  if (!doc) return {};

  return {
    title: doc.title,
    description: doc.purpose,
    alternates: { canonical: `/legal/${doc.slug}` },
    // Документ ещё не опубликован — в индекс он попасть не должен,
    // иначе в выдаче окажется пустая юридическая страница.
    robots: { index: false, follow: true },
    openGraph: {
      title: `${doc.title} — ${SITE_NAME}`,
      description: doc.purpose,
      url: `/legal/${doc.slug}`,
    },
  };
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const doc = findLegal(slug);
  if (!doc) notFound();

  const others = LEGAL_DOCS.filter((d) => d.slug !== doc.slug).slice(0, 6);

  return (
    <main className="bg-cream pt-[100px]">
      <article className="px-6 pb-32 pt-24 lg:px-10">
        <div className="lg:ml-[12%]">
          <nav aria-label="Breadcrumb" className="fs-label mb-10 font-medium">
            <ol className="flex flex-wrap items-center gap-2 text-ink/50">
              <li>
                <Link href="/" className="transition-colors hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/legal" className="transition-colors hover:text-ink">
                  Legal
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink" aria-current="page">
                {doc.title}
              </li>
            </ol>
          </nav>

          <FxUp>
            <p className="fs-label font-medium text-ink/60">{doc.group}</p>
          </FxUp>
          <FxUp delay={0.08}>
            <h1 className="type-display fs-display-m mt-5 max-w-[24ch]">
              {doc.title}
            </h1>
          </FxUp>
          <FxUp delay={0.16}>
            <p className="fs-body-l mt-8 max-w-[56ch] text-ink/70">
              {doc.purpose}
            </p>
          </FxUp>

          {/* Честный статус вместо выдуманного юридического текста */}
          <FxUp delay={0.24}>
            <div className="mt-16 max-w-[56ch] border-t border-ink/15 pt-10">
              <h2 className="type-display fs-display-s">Status</h2>
              <p className="fs-body-m mt-5 text-ink/70">
                This document is being prepared for publication and reviewed
                before it goes live. We would rather leave it blank than publish
                a version that misstates what we actually do.
              </p>
              <p className="fs-body-m mt-4 text-ink/70">
                If you need the current position on this in writing —
                for a procurement review, a security questionnaire or a data
                request — ask us and we will send what we have today.
              </p>

              <div className="mt-10">
                <Link href="/contact" data-btn-hover className="inline-block">
                  <Button label="Request this document" href={null} />
                </Link>
              </div>
            </div>
          </FxUp>
        </div>
      </article>

      <div className="bg-mist px-6 py-20 lg:px-10">
        <FxUp className="lg:ml-[12%]">
          <h2 className="fs-label font-medium text-ink/60">
            Other documents
          </h2>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {others.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/legal/${d.slug}`}
                  className="fs-body-m underline-offset-4 transition-colors hover:text-ink/60 hover:underline"
                >
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </FxUp>
      </div>
    </main>
  );
}

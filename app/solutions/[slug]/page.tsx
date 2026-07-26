import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { SOLUTIONS, findSolution, SITE_NAME } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

/** Все 4 решения известны на этапе сборки — рендерим статически. */
export function generateStaticParams() {
  return SOLUTIONS.map((p) => ({ slug: p.slug }));
}

/** Неизвестный slug → 404, а не пустая страница. */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = findSolution(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.lede,
    keywords: page.keywords,
    alternates: { canonical: `/solutions/${page.slug}` },
    openGraph: {
      title: `${page.title} — ${SITE_NAME}`,
      description: page.lede,
      url: `/solutions/${page.slug}`,
      type: "article",
    },
  };
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  const page = findSolution(slug);
  if (!page) notFound();

  return (
    <PageShell
      page={page}
      trail={[
        { label: "Home", href: "/" },
        { label: "Solutions", href: "/solutions" },
        { label: page.title, href: `/solutions/${page.slug}` },
      ]}
      related={SOLUTIONS.filter((p) => p.slug !== page.slug).map((p) => ({
        label: p.title,
        href: `/solutions/${p.slug}`,
      }))}
    />
  );
}

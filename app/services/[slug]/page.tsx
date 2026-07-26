import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { SERVICES, findService, SITE_NAME } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICES.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = findService(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.lede,
    keywords: page.keywords,
    alternates: { canonical: `/services/${page.slug}` },
    openGraph: {
      title: `${page.title} — ${SITE_NAME}`,
      description: page.lede,
      url: `/services/${page.slug}`,
      type: "article",
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const page = findService(slug);
  if (!page) notFound();

  return (
    <PageShell
      page={page}
      layout="compact"
      trail={[
        { label: "Home", href: "/" },
        { label: "Marketing Services", href: "/services" },
        { label: page.title, href: `/services/${page.slug}` },
      ]}
      related={SERVICES.filter((p) => p.slug !== page.slug)
        .slice(0, 6)
        .map((p) => ({ label: p.title, href: `/services/${p.slug}` }))}
    />
  );
}

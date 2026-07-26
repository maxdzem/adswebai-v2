import type { Metadata } from "next";
import IndexList from "@/components/IndexList";
import { SOLUTIONS } from "@/content/site";

const LEDE =
  "Four ways we take on the work. Each one is an operating model we run with your team, not a project we hand over at the end.";

export const metadata: Metadata = {
  title: "Solutions",
  description: LEDE,
  alternates: { canonical: "/solutions" },
  openGraph: { title: "Solutions — adswebai", description: LEDE, url: "/solutions" },
};

export default function SolutionsIndex() {
  return (
    <IndexList
      eyebrow="Solutions"
      title="Operating models, not deliverables"
      lede={LEDE}
      base="/solutions"
      items={SOLUTIONS}
    />
  );
}

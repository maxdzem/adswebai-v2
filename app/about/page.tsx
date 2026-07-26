import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import type { ContentPage } from "@/content/site";

const PAGE: ContentPage = {
  slug: "about",
  title: "About adswebai",
  eyebrow: "About Us",
  lede: "A marketing and technology practice built around one idea: the bottleneck is almost never ideas, it is the machinery for getting them out.",
  keywords: ["about", "agency", "marketing technology", "team"],
  sections: [
    {
      heading: "Why we exist",
      body: "Marketing teams are not short of good thinking. They are short of a way to act on it quickly, repeatedly and without the quality drifting. We build that machinery — and then we run it with you until your team can run it alone.",
    },
    {
      heading: "How we work",
      body: "Small senior teams, embedded rather than arm's length. The people who scope the work are the people who do it. We prefer a narrow engagement that ships to a broad one that produces a roadmap.",
      bullets: [
        "Senior practitioners, not layered account teams",
        "Working software and live campaigns over decks",
        "Everything documented and handed over as we go",
        "Clear about what we will not take on",
      ],
    },
    {
      heading: "What we are careful about",
      body: "We will say when a piece of work is not worth doing, when a metric is being read too generously, or when automation would make something worse. That is occasionally an awkward conversation, and it is the main reason clients keep us.",
    },
  ],
};

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.lede,
  keywords: PAGE.keywords,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${PAGE.title} — adswebai`,
    description: PAGE.lede,
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <PageShell
      page={PAGE}
      // Макет-статья: колонка текста + портретный слот на выносе
      layout="editorial"
      trail={[
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
      ]}
      related={[
        { label: "Leadership", href: "/about/leadership" },
        { label: "Careers", href: "/about/careers" },
        { label: "Newsroom", href: "/about/newsroom" },
      ]}
    />
  );
}

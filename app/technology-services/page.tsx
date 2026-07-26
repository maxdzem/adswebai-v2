import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import type { ContentPage } from "@/content/site";

const PAGE: ContentPage = {
  slug: "technology-services",
  title: "Technology Services",
  eyebrow: "Capability",
  lede: "The engineering underneath the marketing: platforms, integrations and data plumbing built to be handed over and maintained by your team.",
  keywords: [
    "marketing technology",
    "martech",
    "systems integration",
    "data engineering",
  ],
  sections: [
    {
      heading: "What we take on",
      body: "Most marketing problems that look strategic turn out to be plumbing. The data does not reach the platform, the CMS cannot express the design system, two tools disagree about who the customer is. We fix that layer.",
      bullets: [
        "Composable CMS and front-end builds",
        "CDP, CRM and marketing platform integration",
        "Data pipelines, warehousing and identity resolution",
        "Consent, privacy and regional compliance",
      ],
    },
    {
      heading: "Built to be handed over",
      body: "We write the documentation as we go and run the handover as a scheduled piece of work, not a final email. If your team cannot operate it without us, we have not finished.",
    },
    {
      heading: "On replatforming",
      body: "We will often argue against it. Replatforming is expensive, slow and rarely the actual cause of the problem. When the honest answer is to fix three integrations rather than replace the stack, that is what we will recommend.",
    },
  ],
};

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.lede,
  keywords: PAGE.keywords,
  alternates: { canonical: "/technology-services" },
  openGraph: {
    title: `${PAGE.title} — adswebai`,
    description: PAGE.lede,
    url: "/technology-services",
  },
};

export default function TechnologyServicesPage() {
  return (
    <PageShell
      page={PAGE}
      // Технический макет: пронумерованные плиты на тёмной полосе
      layout="technical"
      trail={[
        { label: "Home", href: "/" },
        { label: "Technology Services", href: "/technology-services" },
      ]}
    />
  );
}

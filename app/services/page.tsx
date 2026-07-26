import type { Metadata } from "next";
import IndexList from "@/components/IndexList";
import { SERVICES } from "@/content/site";

const LEDE =
  "The individual disciplines, available on their own or joined into one of our solutions. Most engagements start with two or three.";

export const metadata: Metadata = {
  title: "Marketing Services",
  description: LEDE,
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Marketing Services — adswebai",
    description: LEDE,
    url: "/services",
  },
};

export default function ServicesIndex() {
  return (
    <IndexList
      eyebrow="Marketing Services"
      title="Nine disciplines, one team"
      lede={LEDE}
      base="/services"
      items={SERVICES}
      display="rows"
    />
  );
}

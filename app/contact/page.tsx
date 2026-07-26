import type { Metadata } from "next";
import Contact from "@/components/Contact";

const LEDE =
  "Tell us what you are trying to move and we will tell you honestly whether we are the right people for it.";

export const metadata: Metadata = {
  title: "Contact",
  description: LEDE,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact — adswebai", description: LEDE, url: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="pt-[100px]">
      {/* Переиспользуем ту же пошаговую форму, что и на главной,
          чтобы у /contact и якоря #connect не разъезжались поля. */}
      <Contact />
    </main>
  );
}

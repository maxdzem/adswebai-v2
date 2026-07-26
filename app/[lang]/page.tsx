import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import AiIntro from "@/components/AiIntro";
import Expertise from "@/components/Expertise";
import AnimatedCircle from "@/components/AnimatedCircle";
import ArticlesList from "@/components/ArticlesList";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { isLocale } from "@/content/i18n";
import { getDict } from "@/content/dict";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDict(lang);

  return (
    <main>
      <Hero dict={dict} />
      <ServicesGrid dict={dict} />
      <AiIntro dict={dict} />
      <Expertise dict={dict} />
      <AnimatedCircle dict={dict} />
      <ArticlesList dict={dict} />
      <Contact dict={dict} />
      <Footer locale={lang} dict={dict} />
    </main>
  );
}

import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import AiIntro from "@/components/AiIntro";
import Expertise from "@/components/Expertise";
import AnimatedCircle from "@/components/AnimatedCircle";
import ArticlesList from "@/components/ArticlesList";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <ServicesGrid />
      <AiIntro />
      <Expertise />
      <AnimatedCircle />
      <ArticlesList />
      <Contact />
      <Footer />
    </main>
  );
}

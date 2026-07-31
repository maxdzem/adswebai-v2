"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import Preloader from "./Preloader";
import HugeNav from "./HugeNav";
import SectionServices from "./SectionServices";
import SectionWeBelieve from "./SectionWeBelieve";
import SectionPlatform from "./SectionPlatform";
import SectionWork from "./SectionWork";
import SectionCareers from "./SectionCareers";
import SectionIdeas from "./SectionIdeas";
import HugeFooter from "./HugeFooter";
import ContactModal from "./ContactModal";
import CaseStudyModal from "./CaseStudyModal";
import CursorView from "./CursorView";
import { HERO_BACKGROUNDS, WORK_SECTION } from "./data";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Порт главной hugeinc.com. Собран по зеркалу
 * C:\Hugenic2\https___www.hugeinc.com_ — по разметке (классы js-* там
 * служат крючками для GSAP) и по их CSS (типографика, 20-колоночная
 * сетка — вынесены в app/huge.css).
 *
 * Порядок секций — как в оригинале:
 *   заставка → фон-интро → What we do → We believe → Powered by LIVE +
 *   партнёры → Our work (колода карточек + кейс) → Careers → Ideas
 *   (лента над кубом) → футер.
 *
 * Тексты и картинки — в data.ts, разметка их не держит.
 *
 * Чего в порте нет и почему:
 *   - логотипы партнёров: у Huge приходят из CMS, в зеркале клетки
 *     пустые — вместо них имена текстом;
 *   - куб в Ideas: у них three.js, здесь CSS-трансформы с теми же
 *     шестью текстурами;
 *   - формы: свои поля по их сетке, эндпоинта у нас нет — submit гасится.
 */
export default function HugeHome() {
  const root = useRef<HTMLDivElement>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [caseOpen, setCaseOpen] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Фон-интро: шесть кадров сменяют друг друга по кругу. У Huge
        // ими управляет переменная --opacity на обёртке; здесь тот же
        // перебор, только таймлайном.
        const slides = gsap.utils.toArray<HTMLElement>("[data-hero-slide]");
        if (slides.length) {
          gsap.set(slides, { autoAlpha: 0 });
          gsap.set(slides[0], { autoAlpha: 1 });

          const tl = gsap.timeline({ repeat: -1 });
          slides.forEach((_, i) => {
            const next = slides[(i + 1) % slides.length];
            tl.to(slides[i], { autoAlpha: 0, duration: 1.2 }, `+=2`)
              .to(next, { autoAlpha: 1, duration: 1.2 }, "<");
          });
        }

        // Первый экран уезжает медленнее страницы — обычный параллакс
        gsap.to("[data-hero]", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-hero]",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="huge-root relative bg-huge-black text-huge-white">
      <Preloader />

      <HugeNav onOpenContact={() => setContactOpen(true)} />

      {/* Фон-интро: у Huge эти шесть кадров лежат под всей верхней
          частью страницы и видны, когда заставка расходится полосами.
          Здесь им отдан честный первый экран. */}
      <div data-hero className="relative h-screen w-full overflow-hidden">
        {HERO_BACKGROUNDS.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            data-hero-slide
            src={src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ))}
        {/* Затемнение к низу — под ним читается белая секция ниже */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-huge-black" />
      </div>

      <SectionServices />
      <SectionWeBelieve />
      <SectionPlatform />
      <SectionWork onOpenCase={() => setCaseOpen(true)} />
      <SectionCareers />
      <SectionIdeas />
      <HugeFooter />

      <CursorView label={WORK_SECTION.cta} />

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <CaseStudyModal open={caseOpen} onClose={() => setCaseOpen(false)} />
    </div>
  );
}

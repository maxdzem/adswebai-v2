"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Адресная строка мобильного браузера при скролле то появляется, то
    // прячется, меняет высоту вьюпорта и шлёт resize. ScrollTrigger по
    // умолчанию делает на каждый такой resize refresh() — пересчёт пинов
    // прямо посреди прокрутки, отсюда рывки на телефоне. Высоты секций
    // переведены в svh и от адресной строки не зависят, так что
    // пересчитывать нечего.
    // Стоит ДО выхода по reduced-motion: Lenis там не создаётся,
    // но ScrollTrigger всё равно работает.
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Пользователь просил меньше движения — оставляем нативную прокрутку
    // и глушим scrub-анимации: их считает ScrollTrigger, а не мы
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

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

    // Пересчёт триггеров при изменении высоты документа. ScrollTrigger сам
    // пересчитывается только на load и resize окна, а высота страницы
    // меняется и без них: догружаются шрифты и медиа, встроенный
    // переводчик браузера подменяет текст (на /ru перевод в английский
    // укорачивал страницу на ~330px), меняется шаг формы. Координаты
    // start/end оставались старыми — анимации срабатывали на сотни
    // пикселей не там: контент круга не успевал погаснуть и список статей
    // наезжал на него. Сравниваем с высотой на момент последнего refresh:
    // пины сами меняют высоту при пересчёте, и без этого вышел бы цикл.
    const doc = document.documentElement;
    let refreshedHeight = doc.scrollHeight;
    const onRefresh = () => {
      refreshedHeight = doc.scrollHeight;
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);
    let refreshTimer: number | undefined;
    const ro = new ResizeObserver(() => {
      if (Math.abs(doc.scrollHeight - refreshedHeight) < 2) return;
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    ro.observe(document.body);

    const stopHeightWatch = () => {
      ro.disconnect();
      window.clearTimeout(refreshTimer);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
    };

    // Пользователь просил меньше движения — оставляем нативную прокрутку
    // и глушим scrub-анимации: их считает ScrollTrigger, а не мы
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return stopHeightWatch;
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
      stopHeightWatch();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

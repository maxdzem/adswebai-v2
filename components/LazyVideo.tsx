"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

/**
 * Видео, которое грузится и играет только когда попадает в кадр.
 *
 * Раньше три ролика на главной стояли с autoPlay и preload по умолчанию:
 * браузер начинал тянуть все 72 МБ сразу при открытии страницы, включая
 * два, которые лежат ниже первого экрана. Здесь src подставляется только
 * при пересечении с вьюпортом, а за его пределами воспроизведение
 * останавливается — не тратим ни трафик, ни декодирование.
 *
 * hero-ролик пропускает отложенную загрузку (eager): он и есть первый
 * экран, откладывать его нечего.
 */
const LazyVideo = forwardRef<
  HTMLVideoElement,
  {
    src: string;
    poster?: string;
    className?: string;
    /** Видео на первом экране — грузим сразу. */
    eager?: boolean;
    /** Сообщает наружу, играет ли ролик — для кнопки play/pause. */
    onPlayingChange?: (playing: boolean) => void;
  }
>(function LazyVideo(
  { src, poster, className = "", eager = false, onPlayingChange },
  forwardedRef
) {
  const ref = useRef<HTMLVideoElement>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLVideoElement, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const load = () => {
      if (!el.dataset.loaded) {
        el.src = src;
        el.dataset.loaded = "1";
      }
    };

    if (eager) load();

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          load();
          // Кадр можно показать, но не крутить, если просили меньше движения
          if (!reduced.matches) el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px" }
    );

    io.observe(el);

    const onPlay = () => onPlayingChange?.(true);
    const onPause = () => onPlayingChange?.(false);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);

    return () => {
      io.disconnect();
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, [src, eager, onPlayingChange]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload={eager ? "metadata" : "none"}
      aria-hidden
    />
  );
});

export default LazyVideo;

"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * Свободно летающие частицы с линиями связи.
 *
 * 50 частиц отскакивают от краёв канваса; пары ближе 100px соединяются
 * тонкой линией, прозрачность которой падает с расстоянием.
 *
 * Канвас рисуется с учётом devicePixelRatio — на retina без этого
 * получилась бы мыльная картинка.
 */

const COUNT = 50;
const LINK_DIST = 100;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
};

export default function HeroAnimation({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;

    const spawn = () => {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: 1 + Math.random() * 5, // 1–6px
        // сине-фиолетовый диапазон
        color: `hsl(${200 + Math.random() * 60}, 70%, 60%)`,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      // Рисуем в CSS-пикселях, масштаб под плотность экрана берёт на себя ctx
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particles.length === 0) spawn();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Отскок от краёв
        if (p.x < p.r || p.x > width - p.r) p.vx *= -1;
        if (p.y < p.r || p.y > height - p.r) p.vy *= -1;
        p.x = Math.min(Math.max(p.x, p.r), width - p.r);
        p.y = Math.min(Math.max(p.y, p.r), height - p.r);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      // Линии связи: чем ближе пара, тем заметнее линия
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist >= LINK_DIST) continue;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(120, 180, 255, ${
            0.1 * (1 - dist / LINK_DIST)
          })`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className={`h-full w-full ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
    </motion.div>
  );
}

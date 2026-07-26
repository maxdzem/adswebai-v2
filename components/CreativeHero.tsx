"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * Сетка частиц, разбегающихся от курсора.
 *
 * Частицы стоят решёткой с шагом 30px. В радиусе 100px от курсора они
 * отталкиваются тем сильнее, чем ближе, и плавно возвращаются на своё
 * место. Позиция курсора сглаживается лерпом (0.1) — иначе рывок мыши
 * дёргал бы всю сетку.
 *
 * devicePixelRatio учитывается при отрисовке, ресайз пересобирает сетку.
 */

const SPACING = 30;
const REPEL_RADIUS = 100;
const LINK_DIST = 30;
const LERP = 0.1;

type Particle = {
  /** Узел решётки — точка покоя */
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
};

export default function CreativeHero({
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

    // Цель курсора и его сглаженная позиция
    const target = { x: -9999, y: -9999 };
    const mouse = { x: -9999, y: -9999 };

    const buildGrid = () => {
      particles = [];
      for (let x = SPACING / 2; x < width; x += SPACING) {
        for (let y = SPACING / 2; y < height; y += SPACING) {
          particles.push({
            ox: x,
            oy: y,
            x,
            y,
            vx: 0,
            vy: 0,
            r: 2 + Math.random() * 5, // 2–7px
            // фиолетово-розовый диапазон
            color: `hsl(${270 + Math.random() * 60}, 70%, 60%)`,
          });
        }
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Сетка пересобирается: при других размерах узлы другие
      buildGrid();
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
    };

    const onLeave = () => {
      target.x = -9999;
      target.y = -9999;
    };

    const draw = () => {
      // Сглаживание курсора
      mouse.x += (target.x - mouse.x) * LERP;
      mouse.y += (target.y - mouse.y) * LERP;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < REPEL_RADIUS && dist > 0.01) {
          // Сила тем больше, чем ближе частица к курсору
          const force = (1 - dist / REPEL_RADIUS) * 2.2;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Возврат в узел решётки + затухание — «пружинка»
        p.vx += (p.ox - p.x) * 0.06;
        p.vy += (p.oy - p.y) * 0.06;
        p.vx *= 0.86;
        p.vy *= 0.86;

        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      // Связи между соседями. Сравниваем только близкие по индексу пары:
      // сетка построена по столбцам, поэтому соседи лежат рядом в массиве —
      // полный перебор O(n²) на такой плотности стоил бы кадров.
      const perCol = Math.ceil(height / SPACING);
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (const j of [i + 1, i + perCol]) {
          const b = particles[j];
          if (!b) continue;
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist >= LINK_DIST) continue;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = "rgba(180, 120, 255, 0.2)";
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
    window.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
      className={`h-full w-full ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
    </motion.div>
  );
}

import { ImageResponse } from "next/og";

/**
 * Фавиконка генерируется в PNG на сборке.
 *
 * Раньше здесь лежал icon.svg, но у него был только viewBox без явных
 * width/height — растеризаторы (в частности превью на Vercel) не могли
 * определить размер и падали с ошибкой рендера. PNG понимают все
 * без исключений.
 *
 * Рисунок тот же: розовый круг бренда (--color-blush) и тёмный
 * треугольник (--color-ink) — на светло-розовом белый был бы нечитаем.
 */

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#feafe6",
          borderRadius: "50%",
        }}
      >
        {/* Треугольник вершиной вверх — через CSS-бордеры:
            ImageResponse не поддерживает clip-path */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "17px solid transparent",
            borderRight: "17px solid transparent",
            borderBottom: "30px solid #2d2d2d",
          }}
        />
      </div>
    ),
    { ...size }
  );
}

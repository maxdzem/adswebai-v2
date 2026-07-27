import { ImageResponse } from "next/og";

/**
 * Фавиконка генерируется в PNG на сборке.
 *
 * Раньше здесь лежал icon.svg, но у него был только viewBox без явных
 * width/height — растеризаторы (в частности превью на Vercel) не могли
 * определить размер и падали с ошибкой рендера. PNG понимают все
 * без исключений.
 *
 * Рисунок: фирменный розовый квадрат #FF0091 (острые углы, без
 * borderRadius — тот же язык формы, что у кубика-переключателя в шапке)
 * с чёрным #000000 треугольником вершиной вниз поверх.
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
          background: "#FF0091",
        }}
      >
        {/* Треугольник вершиной вниз — через CSS-бордеры: border-top
            вместо border-bottom переворачивает его.
            ImageResponse не поддерживает clip-path */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "17px solid transparent",
            borderRight: "17px solid transparent",
            borderTop: "30px solid #000000",
          }}
        />
      </div>
    ),
    { ...size }
  );
}

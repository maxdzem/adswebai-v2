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
 *
 * Треугольник — через clip-path: polygon(...) на залитом чёрном блоке.
 * Раньше был приём border-top/left/right (width:0;height:0), но в Satori
 * (движок ImageResponse) он рендерится сплошным прямоугольником — вместо
 * треугольника вершиной вниз получался просто чёрный квадрат.
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
        {/* Треугольник вершиной вниз: три точки полигона, нижняя — по центру */}
        <div
          style={{
            width: 34,
            height: 30,
            background: "#000000",
            clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}

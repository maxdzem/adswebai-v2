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
 * со строчной чёрной «a» поверх, в духе фавиконок-букв у Google.
 *
 * Буква рисуется текстовым узлом, а не <path> — растеризатор Satori
 * умеет шрифты, и с одной буквой не нужна ручная геометрия, как у
 * прежнего треугольника.
 *
 * Фирменный Monument Grotesk сюда подключить нельзя: в public/fonts
 * лежит только .woff2, а Satori такой формат не открывает (нужен
 * ttf/otf/woff). Поэтому берётся встроенный гротеск движка.
 *
 * marginTop сдвигает букву вверх: у строчной «a» нет выносных
 * элементов, поэтому по em-боксу flex центрирует её визуально низковато
 * — компенсируем вручную.
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
        <span
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#000000",
            lineHeight: 1,
            marginTop: -6,
            letterSpacing: -1,
          }}
        >
          a
        </span>
      </div>
    ),
    { ...size }
  );
}

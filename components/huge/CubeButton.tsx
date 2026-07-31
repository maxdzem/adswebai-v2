import type { ReactNode } from "react";
import { ArrowOut, ArrowOutSmall } from "./icons";

/**
 * Кнопка-куб Huge. Четыре грани на стенках куба высотой в саму кнопку;
 * под курсором куб провёртывается на 90° вокруг X и вперёд выходит грань
 * `bottom` — у Huge она салатовая (#48FF65).
 *
 * Геометрия — в .huge-btn* в app/huge.css. Здесь только грани и текст.
 *
 * `back` и `top` в оригинале почти всегда повторяют `front`; исключение —
 * кнопка в шапке, где на них написано «With» / «Us». Поэтому они
 * необязательные и по умолчанию берут текст лицевой грани.
 */

type Props = {
  label: string;
  /** Текст салатовой грани, если он отличается от label. */
  hoverLabel?: string;
  back?: string;
  top?: string;
  href?: string;
  onClick?: () => void;
  /** Иконка справа от текста. "none" — для кнопок без стрелки. */
  icon?: "out" | "out-small" | "none";
  /** Классы самой кнопки: ширина и отступы у Huge везде разные. */
  className?: string;
  /** Цвета лицевой грани. По умолчанию чёрная с белым текстом. */
  frontClassName?: string;
  /** Цвета грани, которая выезжает под курсором. */
  hoverClassName?: string;
  /** Своё содержимое вместо текста — например «Chat» на телефоне. */
  children?: ReactNode;
  /** Классы подписи. Кнопка в шапке на телефоне сжата до 56px — там
      подпись скрывают через `hidden md:inline-block`, остаётся стрелка. */
  labelClassName?: string;
};

const FACE =
  "absolute left-0 top-0 flex h-full w-full items-center justify-center p-[12px] text-center md:px-[24px]";

export default function CubeButton({
  label,
  hoverLabel,
  back,
  top,
  href,
  onClick,
  icon = "out-small",
  className = "",
  frontClassName = "bg-huge-black text-huge-white",
  hoverClassName = "bg-huge-green text-huge-black",
  children,
  labelClassName = "",
}: Props) {
  const Icon =
    icon === "none" ? null : icon === "out" ? (
      <ArrowOut className="size-[24px]" />
    ) : (
      <ArrowOutSmall className="size-[24px]" />
    );

  const face = (text: string, extra: string, slot?: ReactNode) => (
    <div className={`${FACE} ${extra}`}>
      <span className={`mr-[8px] ${labelClassName}`}>{slot ?? text}</span>
      {Icon}
    </div>
  );

  const body = (
    <div className="huge-btn__faces h-full w-full">
      {face(label, `huge-btn__front ${frontClassName}`, children)}
      {face(hoverLabel ?? label, `huge-btn__bottom ${hoverClassName}`, children)}
      {face(back ?? label, `huge-btn__back ${frontClassName}`)}
      {face(top ?? label, `huge-btn__top ${frontClassName}`)}
    </div>
  );

  // inline-block обязателен: у <a> по умолчанию display: inline, а
  // на строчных элементах не работают ни min-width, ни height — кнопка
  // сплющивалась в нуль, а её абсолютные грани растягивались по
  // родителю в широкую полосу. У <button> inline-block свой, но класс
  // ставим обоим, чтобы вариант-ссылка и вариант-кнопка вели себя
  // одинаково.
  const shell = `huge-btn t__body relative inline-block h-[var(--button-height)] min-h-[var(--button-height)] cursor-pointer ${className}`;

  if (href) {
    return (
      <a href={href} className={shell} aria-label={label}>
        {body}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={shell} aria-label={label}>
      {body}
    </button>
  );
}

/**
 * Плоская парная кнопка «View / ↗» — квадрат с подписью плюс квадрат со
 * стрелкой. Huge ставит её на карточки работ и в кастомный курсор.
 */
export function SquareButton({
  label,
  onClick,
  className = "",
}: {
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button type="button" onClick={onClick} className={`relative flex ${className}`}>
      <span className="t__body flex aspect-square size-[56px] items-center justify-center bg-huge-white text-center text-huge-black md:size-[64px]">
        {label}
      </span>
      <span className="flex aspect-square size-[56px] items-center justify-center bg-huge-black text-huge-white md:size-[64px]">
        <ArrowOut className="size-[32px]" />
      </span>
    </button>
  );
}

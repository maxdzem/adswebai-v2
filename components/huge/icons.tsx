/**
 * Иконки порта — контуры скопированы 1:1 из разметки hugeinc.com.
 * Все нарисованы обводкой в 1.5px в исходной сетке, поэтому масштаб
 * задаётся классом, а не пересчётом path.
 */

/** Стрелка «наружу» по диагонали вправо-вверх. Сетка 32. */
export function ArrowOut({ className = "size-[24px]" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      aria-hidden
      className={`${className} fill-current`}
    >
      <path
        fillRule="evenodd"
        d="M11.648 6.321h14.893v14.892h-1.5V8.823L8.724 24.394h12.49v1.5H6.322V11h1.5v12.18L23.918 7.82h-12.27v-1.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/** Та же стрелка в сетке 24 — Huge ставит её в кнопки поменьше. */
export function ArrowOutSmall({ className = "size-[24px]" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden
      className={`${className} fill-current`}
    >
      <path
        fillRule="evenodd"
        d="M6.75 6.1h11.257v11.256h-1.3V8.268L8.039 16.54l-.898-.94 8.593-8.2H6.75V6.1Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/** Стрелка вверх. С rotate-180 — она же «вниз» в подсказке «Scroll to explore». */
export function ArrowUp({ className = "size-[24px]" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden
      className={`${className} fill-current`}
    >
      <path
        fillRule="evenodd"
        d="m12 4.33 7.96 7.96-.919.919-6.39-6.39v12.305h-1.3V6.82l-6.39 6.39-.92-.92 7.96-7.959Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/** Крестик. */
export function Cross({ className = "size-[32px]" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      aria-hidden
      className={`${className} fill-current`}
    >
      <path
        fillRule="evenodd"
        d="m14.938 16-8.47-8.47L7.53 6.47 16 14.94l8.47-8.47 1.06 1.06L17.06 16l8.47 8.47-1.06 1.06-8.47-8.47-8.47 8.47-1.06-1.06 8.47-8.47Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

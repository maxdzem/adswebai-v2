/**
 * Пустой слот под медиа — серая зона, куда потом кладётся ролик.
 *
 * Пока ролика нет, рендерится ровно то, что нужно: чистый серый блок
 * нужных пропорций, держащий вёрстку. Реального контента не имитирует.
 *
 * Как вставить медиа: положить файл в /public и передать `src`:
 *     <MediaSlot ratio="21/9" src="/media/my-clip.mp4" />
 *     <MediaSlot ratio="4/3" src="/media/photo.jpg" alt="Съёмка студии" />
 * Тот же слот сразу станет видео или фото — трогать вёрстку не нужно.
 * Что именно рисовать, определяется по расширению файла в `src`.
 *
 * Серверный компонент: без анимаций и стейта, уезжает в HTML целиком.
 */

/** Пресеты пропорций под места, где слоты стоят на страницах. */
const RATIO: Record<string, string> = {
  "21/9": "aspect-[21/9]",
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "3/4": "aspect-[3/4]",
  "1/1": "aspect-square",
};

/** Расширения, которые кладём в <img>; всё остальное считаем видео. */
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif|svg)(\?|#|$)/i;

export default function MediaSlot({
  ratio = "16/9",
  src,
  className = "",
  /** Мелкая пометка в углу: видно, какой формат ждёт слот. */
  note,
  /** Подпись для фото. Пустая строка = картинка декоративная. */
  alt = "",
}: {
  ratio?: keyof typeof RATIO | (string & {});
  src?: string;
  className?: string;
  note?: string;
  alt?: string;
}) {
  const aspect = RATIO[ratio] ?? RATIO["16/9"];
  const isImage = !!src && IMAGE_EXT.test(src);

  return (
    <div
      className={`relative overflow-hidden rounded-[4px] bg-ink/[0.09] ${aspect} ${className}`}
    >
      {src ? (
        isImage ? (
          // Обычный <img>, а не next/image: слот уже задаёт размер через
          // aspect-ratio, а часть картинок лежит на чужом CDN.
          <img
            className="h-full w-full object-cover"
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <video
            className="h-full w-full object-cover"
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
        )
      ) : (
        // Пустой слот: тонкая внутренняя рамка + едва заметная пометка
        // формата. Ничего лишнего — просто серая зона.
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[4px] ring-1 ring-inset ring-ink/10"
          />
          <span className="fs-label absolute bottom-3 left-4 font-medium text-ink/25">
            {note ?? ratio}
          </span>
        </>
      )}
    </div>
  );
}

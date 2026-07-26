# adswebai

Сайт adswebai: Next.js 16 (App Router) + Tailwind v4, плавный скролл на Lenis,
анимации на GSAP/ScrollTrigger. Две локали — `en` и `ru`.

## Запуск

```bash
npm ci
npm run dev      # http://localhost:3000 → редирект на /en или /ru
```

Проверки перед пушем:

```bash
npm run typecheck   # tsc --noEmit
npm run lint
npm run build       # статическая генерация всех страниц обеих локалей
```

## Структура

| Путь | Что внутри |
| --- | --- |
| `app/[lang]/` | Все страницы. `lang` — `en` \| `ru`, список из `content/i18n.ts`, `dynamicParams = false` |
| `app/[lang]/page.tsx` | Главная (серверный компонент, собирает клиентские секции) |
| `app/icon.tsx` | Фавикон, генерируется через `ImageResponse` |
| `app/sitemap.ts`, `app/robots.ts` | Карта сайта с `hreflang` для обеих локалей |
| `proxy.ts` | Бывший middleware (в Next 16 переименован): определяет локаль по `Accept-Language` и редиректит с `/` |
| `components/` | Клиентские секции и анимации |
| `content/` | Контент и словари: `dict.ts` (UI-строки), `site.*.ts`, `pages.ts`, `legal.*.ts`, `resolve.ts` (выбор версии по локали), `socials.ts` |
| `public/` | Видео и статика |

## Локализация

`content/dict.ts` держит английский словарь как источник истины, а тип `Dict`
выводится из него — русская версия обязана иметь ровно тот же набор ключей,
иначе сборка падает на типах. Ссылки строятся через `href(locale, path)`
из `content/i18n.ts`, переключение языка — `swapLocale`.

## Анимации

Lenis и GSAP инициализируются только в клиентских компонентах:
`components/SmoothScroll.tsx` оборачивает дерево, остальные анимации живут
внутри своих секций через `useGSAP`. В серверных `layout.tsx`/`page.tsx`
ничего анимационного нет.

Везде учитывается `prefers-reduced-motion`: Lenis отключается, canvas-сцены
не запускают RAF, видео не автоплеится.

## Что ещё не подключено

- Формы (контактная и newsletter) валидируются на клиенте и показывают
  успех, но никуда не отправляются — нужен эндпоинт/CRM.
- `content/socials.ts` пустой: иконки соцсетей в футере появятся, когда в
  нём будут реальные адреса профилей.
- Юридические документы в `/legal/*` — заглушки под `noindex`.

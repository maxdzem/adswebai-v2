# Идеальный промт (Next.js + GSAP + Lenis)

> Как использовать: открой Claude → **прикрепи 3 картинки** из `storyboard/` (01-start, 02-middle, 03-end) → вставь весь текст ниже (от «Действуй…» до конца).

---

Действуй как **Senior Frontend Developer** (Next.js + GSAP).

**Контекст.** Прикреплены 3 скриншота (`01-start`, `02-middle`, `03-end`) — референс анимации «circle reveal» с monks.com. Круглое видео с лицом по центру на розовом фоне (#FEAFE6); при скролле круг **увеличивается** (маска `clip-path`), а буквы «monks» **разъезжаются** в стороны. В моём референсе круг растёт до крупного (не на весь экран), но код сделай так, чтобы финальный размер легко менялся.

**Задача.** Собери этот эффект как отдельную секцию в проекте **Next.js (App Router)**.

## Стек (обязательно)
- **Next.js** (App Router) + **TypeScript**.
- Анимации — **GSAP + ScrollTrigger** через официальный пакет **`@gsap/react`** и хук **`useGSAP()`**. Обычный `useEffect` для таймлайнов НЕ использовать.
- Компонент с анимацией — **клиентский**: первая строка `"use client"`.
- `gsap.registerPlugin(ScrollTrigger)` — только на клиенте.
- Все анимируемые узлы (обёртка, sticky-контейнер, видео, буквы) — через **`useRef`**. **Никаких строковых селекторов** (`".class"`) внутри GSAP.
- Плавный скролл — **Lenis** (`lenis`/studio-freight) на **верхнем уровне приложения** (провайдер в `layout`), синхронизированный со ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`).
- Стили — **Tailwind CSS**. Кастомный CSS допускается **только** для динамического `clip-path`.
- Видео — нативный `<video>` из `/public/face-video.mp4`, атрибуты `playsInline autoPlay muted loop`, `object-cover`.

## Механика (техзадание)
1. Секция-обёртка высотой **300vh** (задаёт «длину» скролл-анимации).
2. Внутри — **sticky-контейнер**: `position: sticky; top: 0; height: 100vh; overflow: hidden;` фон `#FEAFE6`.
3. По центру — слой `.reveal` с маской `clip-path: circle(12% at 50% 50%)` (стартовый маленький круг). Внутри — `<video>` на весь контейнер (`object-cover`).
4. **GSAP + ScrollTrigger** (trigger = обёртка, `start: 'top top'`, `end: 'bottom bottom'`, `scrub: true`):
   - `clip-path` круга: `circle(12%…)` → `circle(75% at 50% 50%)` *(вынеси финальные 75% в константу — чтобы я мог поставить 100% для фуллскрина).*
   - Буквы «mo» и «nks» разъезжаются: `transform: translate3d(-40vw…)` и `translate3d(40vw…)` + `opacity`.
5. Лёгкие fade-in соседних секций — через **Intersection Observer** (или `ScrollTrigger.batch`), без ручных scroll-листенеров.
6. *(Опционально)* если понадобится 3D-искажение — **Three.js + React Three Fiber**, но только если CSS-маски мало.

## Жёсткие правила рендера (GPU)
- Анимируем **только** `transform`, `opacity`, `clip-path`.
- **ЗАПРЕЩЕНО** анимировать `width` / `height` / `top` / `left` (вызывает reflow).
- На движущихся элементах — `will-change: transform`.

## Дизайн-система
- Фон страницы: `#000000`. Секция reveal: `#FEAFE6`. Текст: `#FFFFFF` (на чёрном) / `#111111` (на розовом).
- Шрифт: **Inter**, веса 400 / 700 / 800.

## Что выдать
Полный **рабочий** код без заглушек и без `// TODO`, разбитый по файлам:
- `app/layout.tsx` (подключение Lenis-провайдера),
- `components/SmoothScroll.tsx` (Lenis),
- `components/CircleReveal.tsx` (секция с эффектом),
- `app/page.tsx` (использование секции),
- нужные строки в `app/globals.css` и `tailwind.config.ts`.

В начале — команда установки: `npm i gsap @gsap/react lenis`.
Всё должно запускаться сразу после того, как я положу `face-video.mp4` в `/public`.

---

### Как дорабатывать
Если круг раскрывается слишком быстро/медленно — пиши: «поправь `start`/`end` у ScrollTrigger» или «поменяй финальный радиус круга». Если хочешь фуллскрин — «поставь финал `circle(100% at 50% 50%)`».

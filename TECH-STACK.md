# Технологии — разбор стека monks.com и стек для аналога

## 1. Что РЕАЛЬНО создаёт эффект (это и берём) 🎯
Из всего дампа BuiltWith для эффекта «circle reveal» нужны буквально три вещи:

| Технология | Роль | monks реально юзает? |
|---|---|---|
| **GSAP** | движок анимаций и таймлайнов | ✅ да (подтверждено BuiltWith) |
| **Intersection Observer** | запуск лёгких fade-in без scroll-листенеров | ✅ да (подтверждено BuiltWith) |
| **clip-path + `position: sticky`** | маска круга + пиннинг экрана | нативный CSS |

> Вывод: сам «вау-эффект» — это **GSAP ScrollTrigger + clip-path + sticky**. Всё остальное ниже к анимации отношения не имеет.

## 2. Фронтенд-стек самого monks.com (для справки)
- **Vue** (instantiated) — да, monks на **Vue**, не на React/Next.
- **jQuery 3.7.1**, **lazySizes** (ленивая загрузка), **core-js** (полифилы).
- **Drupal** (CMS) + **Java EE** (бэкенд).
- CDN: **CloudFront + Cloudflare** (двойной), **jsDelivr**, **GStatic**.

## 3. Шум — для клона НЕ нужно ❌
- **Аналитика/теги:** GA4, Google Tag Manager, Global Site Tag, DoubleClick, Google Remarketing, AdWords.
- **Маркетинг/CRM/CDP:** HubSpot, Salesforce, Optimizely, **Zaius** (CDP), Mediaocean, LinkedIn Insights/Ads.
- **Мониторинг:** New Relic, Microsoft Clarity.
- **AI:** OpenAI (custom GPT / SSO).
- **Согласие/приватность:** OneTrust / Optanon, US Privacy, Global Privacy Control.
- **Безопасность:** reCAPTCHA (+ Enterprise) / Google Fraud Defence, KnowBe4, HSTS, Amazon SSL, DMARC.
- **Виджеты/инструменты:** Airtable, Box, Canva, Figma, Miro, Atlassian, DocuSign, Dropbox, Slack.

## 4. Наш стек для аналога (рекомендация, современный) ⭐
| Слой | Технология |
|---|---|
| Framework | **Next.js** (App Router) + React + TypeScript |
| Анимации | **GSAP + ScrollTrigger** через **`@gsap/react`** (`useGSAP`) |
| Плавный скролл | **Lenis** (studio-freight) — на верхнем уровне приложения |
| Стили | **Tailwind CSS** (+ кастомный CSS только для `clip-path`) |
| Видео | нативный `<video>` из `/public` (`playsInline autoPlay muted loop`) |
| 3D (опц.) | **Three.js + React Three Fiber** — только если CSS-масок не хватит |
| Деплой | Vercel |

> Инсайт: monks сам на устаревшем Vue+jQuery+Drupal. Мы делаем **более чистый современный аналог** на Next.js — визуальный эффект от этого не страдает, ему нужны только GSAP + ScrollTrigger + clip-path + Lenis.

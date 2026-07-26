import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "@/content/i18n";

/**
 * Локаль в URL. Запрос без префикса («/», «/services») редиректится
 * на языковую версию, выбранную по заголовку Accept-Language.
 *
 * Без внешних зависимостей: разбираем заголовок сами — правил
 * ровно две локали, полноценный матчер тут был бы избыточен.
 */

function pickLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language");
  if (!header) return DEFAULT_LOCALE;

  // "ru-RU,ru;q=0.9,en;q=0.8" → [{tag:'ru-ru', q:1}, ...] по убыванию q
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="))
        ?.slice(2);
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .filter((x) => x.tag && !Number.isNaN(x.q))
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    // Сначала точное совпадение, затем базовый язык: ru-RU → ru
    const base = tag.split("-")[0];
    const hit = LOCALES.find((l) => l === tag || l === base);
    if (hit) return hit;
  }

  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return;

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Пропускаем внутренние пути, статику и метаданные-роуты
  matcher: [
    "/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:mp4|webm|jpg|jpeg|png|gif|svg|webp|avif|ico|txt|xml)).*)",
  ],
};

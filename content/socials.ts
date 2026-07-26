/**
 * Ссылки на соцсети adswebai.
 *
 * Пустая строка = профиля пока нет: иконка просто не рендерится, а если
 * не заполнено ни одно поле — из футера уходит весь блок «Follow Us».
 * Придумывать URL нельзя: ссылка на чужой или несуществующий аккаунт
 * хуже отсутствующей иконки.
 *
 * Чтобы иконка появилась — впишите сюда полный адрес профиля,
 * например: tiktok: "https://www.tiktok.com/@adswebai".
 */
export type SocialKey = "tiktok" | "x" | "linkedin" | "instagram";

export const SOCIAL_URLS: Record<SocialKey, string> = {
  tiktok: "",
  x: "",
  linkedin: "",
  instagram: "",
};

/**
 * Пул фотографий для слотов MediaSlot.
 *
 * Файлы лежат в /public/huge — те же кадры, что использует страница
 * technology-services (см. components/huge/data.ts). Здесь они собраны
 * плоским списком, чтобы разделы сайта могли заполнять слоты по индексу,
 * не заводя картинку для каждого места руками.
 *
 * Порядок подобран так, чтобы соседние слоты не оказались похожими: тёмные
 * и светлые кадры чередуются, крупные планы перемежаются общими.
 *
 * Логотипы клиентов из /public/huge (client_*.webp, cube_1) в пул намеренно
 * не включены: это чужие товарные знаки, и в сетке партнёров они читались бы
 * как заявление о партнёрстве. Слоты под логотипы ждут собственных файлов.
 *
 * Когда появятся свои съёмки — замените пути в PHOTOS, разметку трогать
 * не нужно.
 */

export const PHOTOS = [
  "/huge/bg-3_afzkhj_lnnajm.webp",
  "/huge/highlight_google_v5_bkxzrc.webp",
  "/huge/Darling_many_screens_16x9_vg8iqj.webp",
  "/huge/Image_1_1_UNC_Health_h19yg8.webp",
  "/huge/cs_google_03_iar3kd.webp",
  "/huge/highlight_hublot-v4_wm2hdc.webp",
  "/huge/bg-1_amis9x_bhv9zt.webp",
  "/huge/MLB_2025_wxa2kn.webp",
  "/huge/highlight_android-v3_cbmv8i.webp",
  "/huge/Studio_Rotate_Commerce_v2_od3ptu.webp",
  "/huge/cs_google_01_sskzye.webp",
  "/huge/Image_1_1_LPGA_eanliv.webp",
  "/huge/bg-5_ujbbtg_fep5bo.webp",
  "/huge/HP_Oli_Banner_qvihxx.webp",
  "/huge/highlight_planet-fitness-v3_wlofn7.webp",
  "/huge/cs_google_04_uuashk.webp",
  "/huge/bg-2_ioqqln_vahcab.webp",
  "/huge/highlight_oli-v3_u6lp8x.webp",
  "/huge/google_hero_poster_tnubnr.webp",
  "/huge/cs_google_02_emqlab.webp",
  "/huge/bg-6_fjlyrx_jhazw7.webp",
  "/huge/highlight_mc-donalds-v3_psj7ge.webp",
  "/huge/Ez_and_Allen_-_Careers_v2_lnpszk.webp",
  "/huge/bg-4_i4r81c_rku4fk.webp",
  "/huge/mcdonalds_hero_poster_bukwze.webp",
];

/**
 * Кадр по номеру слота. Индекс закольцован, поэтому в цикл любой длины
 * можно отдавать просто счётчик — картинки пойдут по кругу без повторов
 * подряд.
 */
export const photo = (i: number) => PHOTOS[((i % PHOTOS.length) + PHOTOS.length) % PHOTOS.length];

/**
 * Кадр по номеру слота со сдвигом. Нужен, когда на одной странице несколько
 * независимых групп слотов и не хочется, чтобы каждая начиналась с одного
 * и того же кадра.
 */
export const photoFrom = (offset: number) => (i: number) => photo(offset + i);

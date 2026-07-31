/**
 * Контент порта главной hugeinc.com. ВСЁ, что видно на странице, лежит
 * здесь — названия, подписи, ссылки, картинки. Компоненты рядом только
 * рисуют и анимируют, своих текстов у них нет.
 *
 * Менять названия нужно тут: правки в одном месте, разметку трогать не
 * надо.
 *
 * Картинки — ссылки на Cloudinary самого Huge. В зеркале
 * C:\Hugenic2\https___www.hugeinc.com_ файлов картинок нет, HTTrack сохранил
 * только ссылки, поэтому медиа тянется с их CDN. Когда появятся свои
 * картинки — подставьте пути в CLD-строки ниже (или замените вызов cld()
 * на обычный путь из /public).
 */

/** Собирает URL картинки на Cloudinary Huge из версии и имени файла. */
const cld = (path: string, width = 1920) =>
  `https://res.cloudinary.com/hugeinc-web/image/upload/f_auto,c_limit,w_${width},q_auto/${path}`;

/* ── Прелоадер ───────────────────────────────────────────────────────── */

export const PRELOADER = {
  /** Слово, которое проявляется под счётчиком процентов. */
  hello: "Hello",
  /** «We are …» — две подписи у розового квадрата, сменяют друг друга. */
  weAre: ["We", "are"],
  tags: ["AI-native.", "HATs."],
};

/* ── Фон первого экрана: шесть кадров, которые перебираются ──────────── */

export const HERO_BACKGROUNDS = [
  cld("v1740797587/hugeinc-website/production/intro-fast-images/bg-4_i4r81c_rku4fk"),
  cld("v1740797597/hugeinc-website/production/intro-fast-images/bg-1_amis9x_bhv9zt"),
  cld("v1740797591/hugeinc-website/production/intro-fast-images/bg-6_fjlyrx_jhazw7"),
  cld("v1740797583/hugeinc-website/production/intro-fast-images/bg-5_ujbbtg_fep5bo"),
  cld("v1740797571/hugeinc-website/production/intro-fast-images/bg-3_afzkhj_lnnajm"),
  cld("v1740797570/hugeinc-website/production/intro-fast-images/bg-2_ioqqln_vahcab"),
];

/* ── Навигация ───────────────────────────────────────────────────────── */

export const NAV = {
  brand: "Huge",
  items: [
    { label: "About", href: "#about" },
    { label: "What we do", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Ideas", href: "#ideas" },
    { label: "Careers", href: "#careers" },
  ],
  /** Четыре грани кнопки-куба в правом верхнем углу. */
  cta: { front: "Let's talk", bottom: "Let's talk", back: "With", top: "Us" },
};

/* ── «What we do» — шесть услуг, горизонтальная лента ────────────────── */

export type Service = {
  n: string;
  title: string;
  copy: string;
  image: string;
  href: string;
};

export const SERVICES_SECTION = {
  heading: "What we do",
  lede: "We make things that matter to businesses, to brands, and to the people they serve.",
  cta: "Explore",
};

export const SERVICES: Service[] = [
  {
    n: "01",
    title: "Brand strategy & design",
    copy: "We build living brand systems that create long-term differentiation.",
    image: cld("v1759337972/hugeinc-website/Darling_many_screens_16x9_vg8iqj"),
    href: "/what-we-do/brand-strategy-and-design",
  },
  {
    n: "02",
    title: "Marketing & content",
    copy: "We build brand-to-demand engines that push the boundaries of your brand.",
    image: cld("v1743777978/hugeinc-website/MLB_2025_wxa2kn"),
    href: "/what-we-do/marketing-and-content",
  },
  {
    n: "03",
    title: "Products & platforms",
    copy: "We build user-centric, adaptive digital products that are designed for adoption and growth.",
    image: cld(
      "v1687984288/hugeinc-website/production/case-studies/google/google_hero_poster_tnubnr"
    ),
    href: "/what-we-do/products-and-platforms",
  },
  {
    n: "04",
    title: "Composable commerce",
    copy: "We build ecommerce solutions thinking around your business, not your platform.",
    image: cld("v1780519006/hugeinc-website/Studio_Rotate_Commerce_v2_od3ptu"),
    href: "/what-we-do/composable-commerce",
  },
  {
    n: "05",
    title: "Customer experience",
    copy: "We deliver exceptional experiences for businesses and customers that optimize channels, sales and loyalty.",
    image: cld(
      "v1687984438/hugeinc-website/production/case-studies/mdonalds/mcdonalds_hero_poster_bukwze"
    ),
    href: "/what-we-do/customer-experience",
  },
  {
    n: "06",
    title: "AI activation",
    copy: "We amplify AI adoption and transform operations through action. No theory, all results.",
    image: cld(
      "v1721749335/hugeinc-website/production/articles/introducing-oli/HP_Oli_Banner_qvihxx"
    ),
    href: "/what-we-do/ai-activation",
  },
];

/* ── «We believe» — манифест на весь экран ──────────────────────────── */

export const BELIEVE = {
  heading: "We believe",
  paragraphs: [
    "The future will be defined by intelligent interactions between brands and users.",
    "This next wave of experiences will be anticipatory, personalized and conversational.",
  ],
  hint: "Scroll to explore",
};

/* ── «Powered by LIVE» ──────────────────────────────────────────────── */

export const LIVE = {
  heading: "Powered by LIVE",
  logo: cld("v1730126015/huge-live_xcok5j", 256),
  paragraphs: [
    "Living Intelligence Value Engine.",
    "LIVE uses AI to analyze billions of data points to uncover the cultural signals that matter and the insights to act.",
  ],
};

/* ── Партнёрства ─────────────────────────────────────────────────────
   У Huge логотипы приходят из CMS — в зеркале клетки пустые. Здесь
   вместо них имена партнёров текстом: клетки те же, менять проще. */

export const PARTNERS = {
  heading: "And industry-leading alliances.",
  lede: "Together with our trusted partners, we push the limits of AI to create groundbreaking solutions for our clients.",
  hint: "Scroll to explore",
  items: [
    "AWS",
    "Google Cloud",
    "Adobe",
    "Salesforce",
    "Microsoft",
    "NVIDIA",
    "OpenAI",
    "Sitecore",
    "Contentful",
    "Databricks",
  ],
};

/* ── «Our work» — колода карточек клиентов ──────────────────────────── */

export type WorkCard = {
  slug: string;
  client: string;
  copy: string;
  image: string;
  /** Фон под карточкой, пока она сверху колоды. */
  theme: string;
};

export const WORK_SECTION = {
  heading: "Our work",
  lede: "Output that matters.",
  /** Префикс счётчика в углу: «W — 00<цифра>». */
  counterPrefix: "W",
  cta: "View",
};

export const WORK: WorkCard[] = [
  {
    slug: "google",
    client: "Google",
    copy: "Defining the future of Google by driving their most ambitious initiatives.",
    image: cld(
      "v1732156276/hugeinc-website/production/v2/case-studies/google/highlight_google_v5_bkxzrc"
    ),
    theme: "#0b1a2b",
  },
  {
    slug: "nbcu",
    client: "NBCU",
    copy: "An Intelligent Experience that helps you navigate Olympics scheduling.",
    image: cld(
      "v1731965200/hugeinc-website/production/v2/case-studies/highlight_oli-v3_u6lp8x"
    ),
    theme: "#1b1030",
  },
  {
    slug: "mc-donalds",
    client: "McDonald’s",
    copy: "Driving digital transformation to create a multi-billion dollar sales channel.",
    image: cld(
      "v1731965198/hugeinc-website/production/v2/case-studies/highlight_mc-donalds-v3_psj7ge"
    ),
    theme: "#2b1405",
  },
  {
    slug: "unc-health",
    client: "UNC Health",
    copy: "Making wellness accessible, wherever people live.",
    image: cld("v1743715995/hugeinc-website/Image_1_1_UNC_Health_h19yg8"),
    theme: "#04202b",
  },
  {
    slug: "android",
    client: "Android",
    copy: "Reintroducing Android to users through the power of self-expression.",
    image: cld(
      "v1731965198/hugeinc-website/production/v2/case-studies/highlight_android-v3_cbmv8i"
    ),
    theme: "#0d2416",
  },
  {
    slug: "lpga",
    client: "LPGA",
    copy: "Modernizing LPGA’s digital presence to unify platforms, engage fans and drive revenue.",
    image: cld("v1743715719/hugeinc-website/Image_1_1_LPGA_eanliv"),
    theme: "#231a05",
  },
  {
    slug: "hublot",
    client: "Hublot",
    copy: "Business transformation designed to disrupt a sector steeped in tradition.",
    image: cld(
      "v1732048489/hugeinc-website/production/v2/case-studies/hublot/highlight_hublot-v4_wm2hdc"
    ),
    theme: "#1a1a1a",
  },
  {
    slug: "planet-fitness",
    client: "Planet Fitness",
    copy: "Creating the world’s most accessible and inclusive fitness experience.",
    image: cld(
      "v1731965198/hugeinc-website/production/v2/case-studies/highlight_planet-fitness-v3_wlofn7"
    ),
    theme: "#2b0a1c",
  },
];

/* ── Кейс, который открывается по клику на карточку ─────────────────── */

export const CASE_STUDY = {
  client: "Google",
  tagline: "Experience and brand design",
  lede: "Creating new normals for billions of users by shaping the design and experience of the world's most used products.",
  services: [
    "Website and app redesign",
    "AI-driven design and features",
    "Digital ecosystem design",
    "Brand design and strategy",
  ],
  overview:
    "In 2012 we joined Google on a mission to push the boundaries of innovation. During the course of our partnership we’ve developed new products, reimagined their most iconic brands, optimized their communications with the world, and influenced internal operations. We’ve iterated platforms such as YouTube and Search, plus designed new revenue-driving products while co-creating future visions for entire domains.",
  results: [
    { value: "1B", label: "Monthly interactions with our experiences" },
    { value: "100+", label: "Engagements across Google’s portfolio of products and brands." },
    { value: "12Y", label: "12 years — a partnership that continues to grow." },
  ],
  /** Кадры справа: сменяют друг друга по мере прокрутки кейса. */
  images: [
    cld("v1732156044/hugeinc-website/production/v2/case-studies/google/cs_google_01_sskzye"),
    cld("v1732156045/hugeinc-website/production/v2/case-studies/google/cs_google_02_emqlab"),
    cld("v1732156051/hugeinc-website/production/v2/case-studies/google/cs_google_03_iar3kd"),
    cld("v1732156044/hugeinc-website/production/v2/case-studies/google/cs_google_04_uuashk"),
  ],
  closingCta: "Want similar results for your business?",
  closingButton: "Let’s talk",
};

/* ── Чёрная полоса «Let's talk» ─────────────────────────────────────── */

export const CTA_BAND = {
  eyebrow: "Let’s talk",
  heading: "Your new ambition starts here.",
};

/* ── Careers ─────────────────────────────────────────────────────────── */

export const CAREERS = {
  heading: "Careers",
  copy: "We look for multi-talented makers who can work together to craft exceptional experiences.",
  cta: "See job openings",
  href: "/about/careers",
  image: cld("v1752696728/hugeinc-website/Ez_and_Allen_-_Careers_v2_lnpszk"),
};

/* ── Ideas: горизонтальная лента статей над вращающимся кубом ───────── */

export type Idea = { topic: string; title: string; cta: string; href: string };

export const IDEAS_SECTION = {
  heading: "Ideas",
  lede: "We uncover the trends and perspectives that shape the future of digital experiences and business growth.",
  cta: "Explore thinking",
  href: "/thinking",
};

export const IDEAS: Idea[] = [
  {
    topic: "Healthcare.",
    title: "Provider-centric was never patient-first.\nHow AI changes that.",
    cta: "Read.",
    href: "/thinking",
  },
  {
    topic: "Data x AI.",
    title: "Why Synthetic Data Fails Without Cross-Domain Validation",
    cta: "Read.",
    href: "/thinking",
  },
  {
    topic: "Technology.",
    title: "Tech Debt Is Why You’re Losing the AI Race.\nTech Wealth Is How You Win It.",
    cta: "Read.",
    href: "/thinking",
  },
  {
    topic: "AI x Research.",
    title: "Research in the AI Era: Navigating Our “iPhone Moment”",
    cta: "Read.",
    href: "/thinking",
  },
  {
    topic: "AI.",
    title: "AI Is Making You Defend Bullshit",
    cta: "Learn why.",
    href: "/thinking",
  },
];

/** Шесть граней куба: пять логотипов клиентов и одна текстура. */
export const CUBE_FACES = [
  cld(
    "v1740888954/hugeinc-website/production/cube-textures/client-textures/client_google_bfkajx_cldjwq.png",
    640
  ),
  cld(
    "v1740888954/hugeinc-website/production/cube-textures/client-textures/client_lego_mjlhin_lo7hqj.png",
    640
  ),
  cld(
    "v1740888954/hugeinc-website/production/cube-textures/client-textures/client_mcdonalds_x5ouse_fobgfa.png",
    640
  ),
  cld(
    "v1740888954/hugeinc-website/production/cube-textures/client-textures/client_nike_rb7uju_gb1xee.png",
    640
  ),
  cld(
    "v1740888954/hugeinc-website/production/cube-textures/client-textures/client_playstation_v9meog_hampwv.png",
    640
  ),
  cld(
    "v1740888954/hugeinc-website/production/cube-textures/client-textures/cube_1_mrtclz_pj4uul.jpg",
    640
  ),
];

/* ── Форма «Become a client» (выезжает справа) ──────────────────────── */

export const CONTACT_MODAL = {
  heading: "Become a client",
  footerHeading: "How else can we help?",
  contacts: [
    { label: "Become a client.", email: "business@hugeinc.com" },
    { label: "Join us.", email: "jobs@hugeinc.com" },
    { label: "Press inquiries.", email: "press@hugeinc.com" },
    { label: "Everything else.", email: "hello@hugeinc.com" },
  ],
  fields: [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Work email", type: "email" },
    { name: "company", label: "Company", type: "text" },
  ],
  message: { name: "message", label: "Tell us about your project" },
  submit: "Send",
};

/* ── Футер ───────────────────────────────────────────────────────────── */

export const FOOTER = {
  newsletterHeading: "Get to know more about our work.",
  newsletterPlaceholder: "Work email",
  newsletterSubmit: "Sign up",
  columns: [
    {
      title: "Channels",
      links: [
        { label: "News", href: "/about/newsroom" },
        { label: "Newsletter", href: "/contact" },
        { label: "Linkedin", href: "https://www.linkedin.com/company/hugeinc" },
        { label: "Instagram", href: "https://www.instagram.com/hugeinc" },
        { label: "X", href: "https://twitter.com/hugeinc" },
      ],
    },
    {
      title: "Legalities",
      links: [
        { label: "Privacy", href: "/legal" },
        { label: "Accessibility", href: "/legal" },
        { label: "Legal", href: "/legal" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "Become a Client", href: "mailto:business@hugeinc.com" },
        { label: "Press Inquiries", href: "mailto:press@hugeinc.com" },
        { label: "Careers", href: "/about/careers" },
        { label: "Everything Else", href: "mailto:hello@hugeinc.com" },
      ],
    },
    {
      title: "Headquarters",
      links: [
        { label: "53 W 23rd St, New York, NY 10010", href: "https://maps.app.goo.gl/SpknFr4xiY8jCa7P9" },
        { label: "500 W Madison Suite 850 Chicago, IL 60661", href: "https://maps.app.goo.gl/1yJedvCWbEBAzSZN8" },
        {
          label: "Chapter House, 4th Floor, 16 Brunswick Place, London N1 6DZ",
          href: "https://maps.app.goo.gl/qNYktrC5jTqwLZT57",
        },
      ],
    },
  ],
  copyright: "Copyright © 2026 Huge. All rights reserved",
  backToTop: { short: "Top", long: "Back to top" },
};

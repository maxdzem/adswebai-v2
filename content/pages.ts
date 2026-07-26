import type { Locale } from "./i18n";
import type { ContentPage } from "./site";

/**
 * Контент страниц, у которых текст жил прямо в page.tsx: About,
 * Technology Services, Careers, Leadership, Newsroom, Contact.
 * Собран сюда, чтобы у каждой была русская версия.
 */

/* ---------------------------- About ---------------------------- */

const ABOUT_EN: ContentPage = {
  slug: "about",
  title: "About adswebai",
  eyebrow: "About Us",
  lede: "A marketing and technology practice built around one idea: the bottleneck is almost never ideas, it is the machinery for getting them out.",
  keywords: ["about", "agency", "marketing technology", "team"],
  sections: [
    {
      heading: "Why we exist",
      body: "Marketing teams are not short of good thinking. They are short of a way to act on it quickly, repeatedly and without the quality drifting. We build that machinery — and then we run it with you until your team can run it alone.",
    },
    {
      heading: "How we work",
      body: "Small senior teams, embedded rather than arm's length. The people who scope the work are the people who do it. We prefer a narrow engagement that ships to a broad one that produces a roadmap.",
      bullets: [
        "Senior practitioners, not layered account teams",
        "Working software and live campaigns over decks",
        "Everything documented and handed over as we go",
        "Clear about what we will not take on",
      ],
    },
    {
      heading: "What we are careful about",
      body: "We will say when a piece of work is not worth doing, when a metric is being read too generously, or when automation would make something worse. That is occasionally an awkward conversation, and it is the main reason clients keep us.",
    },
  ],
};

const ABOUT_RU: ContentPage = {
  slug: "about",
  title: "Об adswebai",
  eyebrow: "О нас",
  lede: "Маркетинговая и технологическая практика вокруг одной мысли: узкое место почти никогда не в идеях, а в механике, которая доводит их до выпуска.",
  keywords: ["о компании", "агентство", "маркетинговые технологии", "команда"],
  sections: [
    {
      heading: "Зачем мы нужны",
      body: "У маркетинговых команд нет дефицита хороших мыслей. У них нет способа реализовать их быстро, регулярно и без потери качества. Мы строим эту механику — и дальше ведём её вместе с вами, пока команда не сможет вести её сама.",
    },
    {
      heading: "Как мы работаем",
      body: "Небольшие сильные команды, встроенные в процесс, а не работающие на расстоянии вытянутой руки. Кто оценивает объём работы, тот её и делает. Узкий проект, который дошёл до выпуска, мы предпочитаем широкому, который выдал дорожную карту.",
      bullets: [
        "Senior-специалисты, а не многослойные аккаунт-команды",
        "Работающий продукт и живые кампании вместо презентаций",
        "Всё документируется и передаётся по ходу работы",
        "Мы прямо говорим, за что не возьмёмся",
      ],
    },
    {
      heading: "К чему относимся осторожно",
      body: "Мы скажем, если работу не стоит делать, если метрику трактуют слишком щедро или если автоматизация сделает только хуже. Иногда это неудобный разговор — и именно поэтому с нами продолжают работать.",
    },
  ],
};

/* ---------------------- Technology Services ---------------------- */

const TECH_EN: ContentPage = {
  slug: "technology-services",
  title: "Technology Services",
  eyebrow: "Capability",
  lede: "The engineering underneath the marketing: platforms, integrations and data plumbing built to be handed over and maintained by your team.",
  keywords: [
    "marketing technology",
    "martech",
    "systems integration",
    "data engineering",
  ],
  sections: [
    {
      heading: "What we take on",
      body: "Most marketing problems that look strategic turn out to be plumbing. The data does not reach the platform, the CMS cannot express the design system, two tools disagree about who the customer is. We fix that layer.",
      bullets: [
        "Composable CMS and front-end builds",
        "CDP, CRM and marketing platform integration",
        "Data pipelines, warehousing and identity resolution",
        "Consent, privacy and regional compliance",
      ],
    },
    {
      heading: "Built to be handed over",
      body: "We write the documentation as we go and run the handover as a scheduled piece of work, not a final email. If your team cannot operate it without us, we have not finished.",
    },
    {
      heading: "On replatforming",
      body: "We will often argue against it. Replatforming is expensive, slow and rarely the actual cause of the problem. When the honest answer is to fix three integrations rather than replace the stack, that is what we will recommend.",
    },
  ],
};

const TECH_RU: ContentPage = {
  slug: "technology-services",
  title: "Технологические услуги",
  eyebrow: "Компетенция",
  lede: "Инженерия под маркетингом: платформы, интеграции и обвязка данных, построенные так, чтобы их можно было передать и поддерживать своими силами.",
  keywords: [
    "маркетинговые технологии",
    "martech",
    "системная интеграция",
    "инженерия данных",
  ],
  sections: [
    {
      heading: "За что мы беремся",
      body: "Большинство маркетинговых задач, которые выглядят стратегическими, на деле оказываются инженерными. Данные не доходят до платформы, CMS не умеет выразить дизайн-систему, два инструмента по-разному отвечают, кто такой клиент. Мы чиним этот слой.",
      bullets: [
        "Composable CMS и фронтенд-разработка",
        "Интеграция CDP, CRM и маркетинговых платформ",
        "Потоки данных, хранилища и разрешение идентичности",
        "Согласия, приватность и локальные требования",
      ],
    },
    {
      heading: "Сделано, чтобы передать",
      body: "Мы пишем документацию по ходу работы, а передачу проводим как запланированный этап, а не как последнее письмо. Если ваша команда не может работать с этим без нас — значит, мы не закончили.",
    },
    {
      heading: "О смене платформы",
      body: "Часто мы будем возражать. Смена платформы дорога, медленна и редко является настоящей причиной проблемы. Если честный ответ — починить три интеграции, а не менять весь стек, мы порекомендуем именно это.",
    },
  ],
};

/* -------------------------- Careers ---------------------------- */

const CAREERS = {
  en: {
    eyebrow: "About Us",
    title: "Careers",
    lede: "We hire senior and we hire slowly. Fewer people, given real ownership, with the time to do the work properly.",
    howHeading: "How we work",
    howBody:
      "Small teams with end-to-end ownership. The person who scopes a piece of work is the person who delivers it, which means fewer handovers and no writing briefs for someone else to interpret.",
    bullets: [
      "Senior-weighted teams — no pyramid staffing",
      "Remote-friendly, with deliberate time together",
      "Budget and time set aside for learning",
      "Honest about workload; we do not sell hours we do not have",
    ],
    rolesHeading: "Open roles",
    empty: "Nothing open right now. If you think you should be here anyway,",
    emptyLink: "write to us",
    emptyTail:
      "— tell us what you would want to own and why. We read all of them.",
  },
  ru: {
    eyebrow: "О нас",
    title: "Вакансии",
    lede: "Мы нанимаем сильных специалистов и делаем это неспешно. Меньше людей, но с реальной ответственностью и временем сделать работу как следует.",
    howHeading: "Как мы работаем",
    howBody:
      "Небольшие команды с ответственностью от начала до конца. Кто оценивает объём работы, тот её и выпускает: меньше передач из рук в руки и никаких брифов, которые кто-то другой будет интерпретировать.",
    bullets: [
      "Команды из сильных специалистов — без кадровой пирамиды",
      "Удалённо, но с осознанным временем вместе",
      "Бюджет и время, заложенные на обучение",
      "Честно о нагрузке: мы не продаём часы, которых у нас нет",
    ],
    rolesHeading: "Открытые позиции",
    empty: "Сейчас открытых позиций нет. Если считаете, что вам всё равно стоит быть здесь,",
    emptyLink: "напишите нам",
    emptyTail:
      "— расскажите, за что хотели бы отвечать и почему. Мы читаем все письма.",
  },
};

/* ------------------------- Leadership -------------------------- */

const LEADERSHIP = {
  en: {
    eyebrow: "About Us",
    title: "Leadership",
    lede: "The people accountable for the work. Small senior team — the names on the pitch are the names on the project.",
    outro: "Want to know who you would actually be working with?",
    outroLink: "Ask us",
    outroTail: "— we will tell you before you commit to anything.",
    portrait: "Portrait",
    roles: [
      {
        role: "Managing Director",
        remit:
          "Overall accountability for client outcomes and the shape of the practice.",
      },
      {
        role: "Executive Creative Director",
        remit:
          "Brand systems, creative standards and the quality bar across output.",
      },
      {
        role: "Head of Media",
        remit:
          "Planning, buying and the measurement standards behind spend decisions.",
      },
      {
        role: "Head of Technology",
        remit: "Platform architecture, integrations and engineering delivery.",
      },
      {
        role: "Head of Strategy",
        remit: "Positioning, research and the thinking that briefs the work.",
      },
    ],
  },
  ru: {
    eyebrow: "О нас",
    title: "Руководство",
    lede: "Люди, отвечающие за работу. Небольшая команда сильных специалистов: кто пришёл на встречу, тот и ведёт проект.",
    outro: "Хотите знать, с кем именно будете работать?",
    outroLink: "Спросите нас",
    outroTail: "— расскажем до того, как вы возьмёте на себя обязательства.",
    portrait: "Портрет",
    roles: [
      {
        role: "Управляющий директор",
        remit:
          "Общая ответственность за результат для клиента и за то, как устроена практика.",
      },
      {
        role: "Исполнительный креативный директор",
        remit:
          "Бренд-системы, креативные стандарты и планка качества во всём, что выходит.",
      },
      {
        role: "Руководитель медиа",
        remit:
          "Планирование, закупка и стандарты измерений, на которых строятся решения по бюджету.",
      },
      {
        role: "Технический директор",
        remit: "Архитектура платформ, интеграции и инженерная разработка.",
      },
      {
        role: "Руководитель стратегии",
        remit:
          "Позиционирование, исследования и мышление, из которого рождаются брифы.",
      },
    ],
  },
};

/* -------------------------- Newsroom --------------------------- */

const NEWSROOM = {
  en: {
    eyebrow: "About Us",
    title: "Newsroom",
    lede: "Announcements, writing and the occasional post-mortem. We publish when we have something worth saying.",
    empty: "Nothing published yet. For press enquiries,",
    emptyLink: "get in touch",
  },
  ru: {
    eyebrow: "О нас",
    title: "Пресс-центр",
    lede: "Анонсы, тексты и иногда разборы. Мы публикуем, когда есть что сказать по существу.",
    empty: "Пока ничего не опубликовано. По вопросам прессы —",
    emptyLink: "свяжитесь с нами",
  },
};

/* --------------------------- Contact --------------------------- */

const CONTACT_META = {
  en: {
    title: "Contact",
    lede: "Tell us what you are trying to move and we will tell you honestly whether we are the right people for it.",
  },
  ru: {
    title: "Контакты",
    lede: "Расскажите, что нужно сдвинуть, — и мы честно скажем, те ли мы люди, которые для этого нужны.",
  },
};

/* --------------------------- Экспорт --------------------------- */

export const getAboutPage = (locale: Locale) =>
  locale === "ru" ? ABOUT_RU : ABOUT_EN;

export const getTechPage = (locale: Locale) =>
  locale === "ru" ? TECH_RU : TECH_EN;

export const getCareers = (locale: Locale) => CAREERS[locale];
export const getLeadership = (locale: Locale) => LEADERSHIP[locale];
export const getNewsroom = (locale: Locale) => NEWSROOM[locale];
export const getContactMeta = (locale: Locale) => CONTACT_META[locale];

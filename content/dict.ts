import type { Locale } from "./i18n";

/**
 * Словарь интерфейса. Английский объект — источник типа: если в ru
 * забыть ключ, TypeScript не даст собраться. Контент решений и услуг
 * живёт отдельно (site.ts / site.ru.ts), здесь — всё остальное.
 */

const en = {
  nav: {
    solutions: "Solutions",
    services: "Marketing Services",
    technology: "Technology Services",
    work: "Work",
    about: "About Us",
    connect: "Connect",
    home: "adswebai — home",
    menu: "Menu",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    aboutSub: {
      story: "Our Story",
      leadership: "Leadership",
      careers: "Careers",
      newsroom: "Newsroom",
      contact: "Contact",
    },
  },

  lang: {
    change: "Change language",
    choose: "Choose your language",
    close: "Close",
  },

  common: {
    readNow: "Read now",
    startConversation: "Start a conversation",
    alsoInThisArea: "Also in this area",
    minRead: "read",
    home: "Home",
  },

  hero: {
    line1: "Transforming brands",
    line2: "for the real-time world",
    scroll: "Scroll",
  },

  services: {
    heading:
      "Your trusted partner for innovation across four strategic service offerings:",
    label: "Solutions",
    cards: [
      {
        title: "Real-Time Brands",
        copy: "Brands built as living systems to move at the speed of culture.",
      },
      {
        title: "Media Acceleration",
        copy: "Unifying intelligence, content, media, and measurement into one performance system.",
      },
      {
        title: "Marketing Orchestration",
        copy: "We collapse your content supply chain into one AI-powered system.",
      },
      {
        title: "AI Transformation",
        copy: "AI embedded across your business, from strategy to scale.",
      },
    ],
  },

  ai: {
    connect: "Connect",
    reachOut: "Reach out",
    question: "What can we do for",
    questionYou: "you",
    ourAgents: "Our Agents",
    agentsHeading:
      "Your always-on agents for last-mile intelligence — rapid, real, and powered by adswebai.flow",
    explore: "Explore adswebai.flow",
  },

  expertise: {
    heading: "Our Expertise",
    caseStudy: "Case Study",
    report: "Report",
    content: "Content",
    boomtown: "Boomtown Unboxed",
    owningAnswer:
      "Owning the Answer: The Marketer’s Playbook for AEO, GEO and the AI Search Era",
    smarter: "Smarter Investments for an Evolving Marketing Landscape",
  },

  circle: {
    watch: "Watch",
    heading:
      "Maxim Dzemidovich shares how brands can use first-party data to achieve personalization at a massive scale.",
    meet: "Meet",
    flow: "adswebai.flow",
    agents: "Always-on AI Agents",
    play: "Play",
    pause: "Pause",
  },

  articles: {
    heading: "On our minds",
    posts: [
      {
        kind: "Report",
        bold: "Unlocking High-Value Users",
        serif: "with Machine Learning",
        read: "2 min",
      },
      {
        kind: "Blog Post",
        bold: "Why Your Customer Lifetime Value Strategy",
        serif: "Hinges on a High-Performance Email Engine",
        read: "5 min",
      },
      {
        kind: "Blog Post",
        bold: "Inside Salesforce Connections 2025",
        serif: "and the Conversational Potential of Agentic AI",
        read: "5 min",
      },
      {
        kind: "Blog Post",
        bold: "Driving Experimentation and AI Innovation",
        serif: "with Amplitude",
        read: "5 min",
      },
      {
        kind: "Blog Post",
        bold: "Experience Centers:",
        serif: "Where Brands Come to Life",
        read: "6 min",
      },
      {
        kind: "Blog Post",
        bold: "Smarter Investments for an Evolving Marketing Landscape:",
        serif: "MMM Meta-Analysis with adswebai and TikTok",
        read: "7 min",
      },
    ],
  },

  contact: {
    heading: "Let’s unlock what’s possible together.",
    greeting: "Hey 👋",
    intro:
      "Please fill out the following quick questions so our team can get in touch with you.",
    thanks: "Thanks! Our team will get in touch with you shortly.",
    sent: "Your message is on its way. 👋",
    next: "Next",
    send: "Send",
    errRequired: "Please fill this in before continuing.",
    errEmail: "That does not look like a valid email address.",
    steps: {
      firstName: "First Name*",
      lastName: "Last Name*",
      company: "Company*",
      jobTitle: "Job Title*",
      email: "Work Email*",
      message: "How can we help you?",
      region: "Select a Region*",
      discover: "How did you discover adswebai?*",
    },
    regions: [
      "North America",
      "Latin America",
      "Asia Pacific",
      "Europe, the Middle East, and Africa",
      "Global",
    ],
  },

  footer: {
    keepExploring: "Keep Exploring...",
    followUs: "Follow Us",
    newsletter: "Newsletter",
    emailPlaceholder: "Email address",
    subscribe: "Subscribe",
    subscribed: "You’re on the list. 👋",
    copyright: "Copyright 2026",
    company: "An adswebai Company",
    links: {
      whatWeDo: "What We Do",
      partners: "Partners",
      work: "Work",
      careers: "Careers",
      thinking: "Thinking",
      connect: "Connect",
    },
  },

  pages: {
    solutions: {
      eyebrow: "Solutions",
      title: "Four ways in",
      lede: "Joined-up programmes for when the problem spans more than one discipline. Each one is a way of working, not a package.",
    },
    services: {
      eyebrow: "Marketing Services",
      title: "Eleven disciplines, one team",
      lede: "The individual disciplines, available on their own or joined into one of our solutions. Most engagements start with two or three.",
    },
    work: {
      eyebrow: "Work",
      title: "Selected work",
      lede: "Selected engagements. We publish a case only once the client has approved the numbers in it.",
      empty:
        "Case studies are being written up. In the meantime we are happy to walk through relevant work directly —",
      emptyLink: "ask for a walkthrough",
      emptyTail: "and tell us your category.",
    },
    whatWeDo: {
      eyebrow: "Overview",
      title: "What we do",
      lede: "Four ways in, eleven disciplines behind them, and the engineering to keep the whole thing running. Start wherever the bottleneck actually is.",
      solutionsHeading: "Solutions",
      solutionsBody:
        "Joined-up programmes when the problem spans more than one discipline. Each one is a way of working, not a package.",
      servicesHeading: "Marketing Services",
      servicesBody:
        "The individual disciplines, available on their own or joined into one of the solutions above. Most engagements start with two or three.",
      allServices: "All services",
      technologyHeading: "Technology Services",
      technologyBody:
        "The engineering underneath the marketing: platforms, integrations and data plumbing built to be handed over. Most problems that look strategic turn out to live here.",
      technologyCta: "How that works",
    },
    partners: {
      eyebrow: "Company",
      title: "Partners",
      lede: "The platforms we build on and the vendors we hold to account. We name a partnership only where we hold the certification and do the work ourselves.",
      pickHeading: "How we pick a partner",
      pickBody:
        "A partnership has to survive one test: would we still recommend this platform to a client if the commercial arrangement disappeared tomorrow? Where the answer is no, we do not sign.",
      pickBullets: [
        "No recommendation is influenced by a rebate or margin",
        "Certified people on the account, not certified logos on a slide",
        "Exit path documented before implementation starts",
        "We say when the cheaper tool is the right one",
      ],
      areas: [
        {
          title: "Advertising platforms",
          body: "Where media is bought and measured. We work inside the platform's own tooling rather than a layer on top of it, so nothing is lost in translation at reporting time.",
        },
        {
          title: "Cloud & data",
          body: "Warehousing, pipelines and identity. The choice here decides what measurement is possible two years out, so it gets made deliberately.",
        },
        {
          title: "Content & experience platforms",
          body: "CMS, DAM and the front-end stack. Chosen for what your team can actually operate after handover, not for the feature matrix.",
        },
        {
          title: "AI & automation vendors",
          body: "Model providers, orchestration and agent tooling. We stay deliberately portable here — the space moves too quickly to be locked to one supplier.",
        },
      ],
      outro:
        "Building on a platform we have not listed? Ask — we will tell you straight whether we are the right team for it.",
    },
    thinking: {
      eyebrow: "Thinking",
      title: "Thinking",
      lede: "Reports, notes and post-mortems. We publish when we have run something enough times to know whether it holds.",
      topicsLabel: "Topics",
      topics: [
        "AI in production",
        "Measurement",
        "Content supply chain",
        "Search & answer engines",
        "Platform economics",
        "Ways of working",
      ],
      empty:
        "Nothing published here yet. If there is a topic above you want our read on before we write it up,",
      emptyLink: "ask directly",
      emptyTail:
        "— we would rather answer the specific question than publish a general one.",
    },
    legal: {
      eyebrow: "Company",
      title: "Legal & policies",
      lede: "Corporate documents, policies and public commitments, grouped by what they cover.",
      breadcrumb: "Legal",
      statusHeading: "Status",
      statusBody:
        "This document is being prepared for publication and reviewed before it goes live. We would rather leave it blank than publish a version that misstates what we actually do.",
      statusBody2:
        "If you need the current position on this in writing — for a procurement review, a security questionnaire or a data request — ask us and we will send what we have today.",
      request: "Request this document",
      others: "Other documents",
      groups: {
        "Privacy & security": "Privacy & security",
        Conduct: "Conduct",
        Governance: "Governance",
        Commitments: "Commitments",
      },
    },
  },
} as const;

/**
 * Расширяет литеральные типы из `as const` до string: форма словаря
 * фиксируется английским объектом, а значения могут быть любыми —
 * иначе русские строки не подошли бы под тип "Solutions".
 */
// Примитивы проверяются ПЕРВЫМИ: иначе строковый литерал внутри
// массива уходил бы в ветку с mapped-типом и ломал вывод
type Mirror<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly Mirror<U>[]
        : { readonly [K in keyof T]: Mirror<T[K]> };

export type Dict = Mirror<typeof en>;

const ru: Dict = {
  nav: {
    solutions: "Решения",
    services: "Маркетинговые услуги",
    technology: "Технологические услуги",
    work: "Работы",
    about: "О нас",
    connect: "Связаться",
    home: "adswebai — на главную",
    menu: "Меню",
    menuOpen: "Открыть меню",
    menuClose: "Закрыть меню",
    aboutSub: {
      story: "Наша история",
      leadership: "Руководство",
      careers: "Вакансии",
      newsroom: "Пресс-центр",
      contact: "Контакты",
    },
  },

  lang: {
    change: "Сменить язык",
    choose: "Выберите язык",
    close: "Закрыть",
  },

  common: {
    readNow: "Читать",
    startConversation: "Начать разговор",
    alsoInThisArea: "Ещё в этом разделе",
    minRead: "чтения",
    home: "Главная",
  },

  hero: {
    line1: "Меняем бренды",
    line2: "для мира реального времени",
    scroll: "Листайте",
  },

  services: {
    heading:
      "Надёжный партнёр в инновациях по четырём стратегическим направлениям:",
    label: "Решения",
    cards: [
      {
        title: "Бренды в реальном времени",
        copy: "Бренды как живые системы, движущиеся со скоростью культуры.",
      },
      {
        title: "Ускорение медиа",
        copy: "Данные, контент, медиа и аналитика, собранные в одну систему результата.",
      },
      {
        title: "Оркестрация маркетинга",
        copy: "Сворачиваем вашу контентную цепочку в единую систему с AI.",
      },
      {
        title: "AI-трансформация",
        copy: "AI, встроенный в бизнес — от стратегии до масштаба.",
      },
    ],
  },

  ai: {
    connect: "Связаться",
    reachOut: "Написать нам",
    question: "Чем мы можем быть полезны",
    questionYou: "вам",
    ourAgents: "Наши агенты",
    agentsHeading:
      "Ваши всегда доступные агенты для интеллекта на последней миле — быстро, по-настоящему и на adswebai.flow",
    explore: "Открыть adswebai.flow",
  },

  expertise: {
    heading: "Наша экспертиза",
    caseStudy: "Кейс",
    report: "Отчёт",
    content: "Материал",
    boomtown: "Boomtown Unboxed",
    owningAnswer:
      "Owning the Answer: руководство маркетолога по AEO, GEO и эпохе AI-поиска",
    smarter: "Разумные инвестиции в меняющемся маркетинговом ландшафте",
  },

  circle: {
    watch: "Смотреть",
    heading:
      "Максим Дземидович рассказывает, как бренды используют собственные данные для персонализации в огромном масштабе.",
    meet: "Знакомьтесь",
    flow: "adswebai.flow",
    agents: "Всегда доступные AI-агенты",
    play: "Воспроизвести",
    pause: "Пауза",
  },

  articles: {
    heading: "О чём мы думаем",
    posts: [
      {
        kind: "Отчёт",
        bold: "Как находить самых ценных пользователей",
        serif: "с помощью машинного обучения",
        read: "2 мин",
      },
      {
        kind: "Статья",
        bold: "Почему стратегия пожизненной ценности клиента",
        serif: "держится на производительном email-движке",
        read: "5 мин",
      },
      {
        kind: "Статья",
        bold: "Изнутри Salesforce Connections 2025",
        serif: "и разговорный потенциал агентного AI",
        read: "5 мин",
      },
      {
        kind: "Статья",
        bold: "Эксперименты и AI-инновации",
        serif: "вместе с Amplitude",
        read: "5 мин",
      },
      {
        kind: "Статья",
        bold: "Центры опыта:",
        serif: "где бренды оживают",
        read: "6 мин",
      },
      {
        kind: "Статья",
        bold: "Разумные инвестиции в меняющемся ландшафте:",
        serif: "мета-анализ MMM с adswebai и TikTok",
        read: "7 мин",
      },
    ],
  },

  contact: {
    heading: "Давайте вместе откроем то, что возможно.",
    greeting: "Привет 👋",
    intro:
      "Ответьте, пожалуйста, на несколько коротких вопросов — и наша команда свяжется с вами.",
    thanks: "Спасибо! Наша команда свяжется с вами в ближайшее время.",
    sent: "Ваше сообщение отправлено. 👋",
    next: "Далее",
    send: "Отправить",
    errRequired: "Заполните это поле, чтобы продолжить.",
    errEmail: "Похоже, адрес почты введён неверно.",
    steps: {
      firstName: "Имя*",
      lastName: "Фамилия*",
      company: "Компания*",
      jobTitle: "Должность*",
      email: "Рабочая почта*",
      message: "Чем мы можем помочь?",
      region: "Выберите регион*",
      discover: "Как вы узнали об adswebai?*",
    },
    regions: [
      "Северная Америка",
      "Латинская Америка",
      "Азиатско-Тихоокеанский регион",
      "Европа, Ближний Восток и Африка",
      "Весь мир",
    ],
  },

  footer: {
    keepExploring: "Смотрите также...",
    followUs: "Мы в соцсетях",
    newsletter: "Рассылка",
    emailPlaceholder: "Электронная почта",
    subscribe: "Подписаться",
    subscribed: "Вы подписаны. 👋",
    copyright: "Copyright 2026",
    company: "Компания adswebai",
    links: {
      whatWeDo: "Что мы делаем",
      partners: "Партнёры",
      work: "Работы",
      careers: "Вакансии",
      thinking: "Идеи",
      connect: "Связаться",
    },
  },

  pages: {
    solutions: {
      eyebrow: "Решения",
      title: "Четыре точки входа",
      lede: "Комплексные программы для случаев, когда задача выходит за рамки одной дисциплины. Каждая из них — способ работы, а не пакет услуг.",
    },
    services: {
      eyebrow: "Маркетинговые услуги",
      title: "Одиннадцать дисциплин, одна команда",
      lede: "Отдельные дисциплины — сами по себе или собранные в одно из наших решений. Большинство проектов начинается с двух-трёх.",
    },
    work: {
      eyebrow: "Работы",
      title: "Избранные проекты",
      lede: "Избранные проекты. Мы публикуем кейс только после того, как клиент согласовал цифры в нём.",
      empty:
        "Кейсы сейчас готовятся к публикации. А пока мы с удовольствием разберём релевантные работы напрямую —",
      emptyLink: "запросите разбор",
      emptyTail: "и назовите свою категорию.",
    },
    whatWeDo: {
      eyebrow: "Обзор",
      title: "Что мы делаем",
      lede: "Четыре точки входа, одиннадцать дисциплин за ними и инженерия, которая держит всё это в работе. Начинайте оттуда, где узкое место на самом деле.",
      solutionsHeading: "Решения",
      solutionsBody:
        "Комплексные программы, когда задача выходит за рамки одной дисциплины. Каждая из них — способ работы, а не пакет услуг.",
      servicesHeading: "Маркетинговые услуги",
      servicesBody:
        "Отдельные дисциплины — сами по себе или собранные в одно из решений выше. Большинство проектов начинается с двух-трёх.",
      allServices: "Все услуги",
      technologyHeading: "Технологические услуги",
      technologyBody:
        "Инженерия под маркетингом: платформы, интеграции и обвязка данных, построенные так, чтобы их можно было передать. Большинство задач, которые выглядят стратегическими, живут именно здесь.",
      technologyCta: "Как это устроено",
    },
    partners: {
      eyebrow: "Компания",
      title: "Партнёры",
      lede: "Платформы, на которых мы строим, и вендоры, с которых мы спрашиваем. Мы называем партнёрство только там, где у нас есть сертификация и работу делаем сами.",
      pickHeading: "Как мы выбираем партнёра",
      pickBody:
        "Партнёрство должно пройти одну проверку: порекомендовали бы мы эту платформу клиенту, если бы завтра исчезли коммерческие условия? Там, где ответ «нет», мы не подписываемся.",
      pickBullets: [
        "Ни одна рекомендация не зависит от бонуса или маржи",
        "Сертифицированные люди на проекте, а не сертифицированные логотипы на слайде",
        "Путь выхода описан до начала внедрения",
        "Мы говорим, когда правильный инструмент — тот, что дешевле",
      ],
      areas: [
        {
          title: "Рекламные платформы",
          body: "Там, где медиа покупается и измеряется. Мы работаем в собственных инструментах платформы, а не в надстройке над ними, — чтобы на этапе отчётности ничего не терялось в переводе.",
        },
        {
          title: "Облако и данные",
          body: "Хранилища, потоки данных и идентификация. Выбор здесь определяет, какие измерения будут возможны через два года, поэтому делается он осознанно.",
        },
        {
          title: "Платформы контента и опыта",
          body: "CMS, DAM и фронтенд-стек. Выбираются по тому, чем ваша команда действительно сможет управлять после передачи, а не по таблице возможностей.",
        },
        {
          title: "AI и автоматизация",
          body: "Поставщики моделей, оркестрация и инструменты для агентов. Здесь мы сознательно сохраняем переносимость — рынок движется слишком быстро, чтобы привязываться к одному поставщику.",
        },
      ],
      outro:
        "Строите на платформе, которой нет в списке? Спросите — честно скажем, подходящая ли мы для этого команда.",
    },
    thinking: {
      eyebrow: "Идеи",
      title: "Идеи",
      lede: "Отчёты, заметки и разборы. Мы публикуем тогда, когда прогнали приём достаточно раз, чтобы понимать, работает ли он.",
      topicsLabel: "Темы",
      topics: [
        "AI в продакшне",
        "Аналитика",
        "Контентная цепочка",
        "Поиск и ответные системы",
        "Экономика платформ",
        "Методы работы",
      ],
      empty:
        "Здесь пока ничего не опубликовано. Если по теме выше вам нужно наше мнение раньше, чем мы её опишем,",
      emptyLink: "спросите напрямую",
      emptyTail:
        "— мы скорее ответим на конкретный вопрос, чем опубликуем общий текст.",
    },
    legal: {
      eyebrow: "Компания",
      title: "Документы и политики",
      lede: "Корпоративные документы, политики и публичные обязательства, сгруппированные по темам.",
      breadcrumb: "Документы",
      statusHeading: "Статус",
      statusBody:
        "Документ готовится к публикации и проходит проверку перед публикацией. Мы предпочтём оставить страницу пустой, чем опубликовать версию, которая искажает то, что мы делаем на самом деле.",
      statusBody2:
        "Если вам нужна текущая позиция в письменном виде — для проверки поставщика, анкеты по безопасности или запроса о данных — напишите нам, и мы пришлём то, что есть сегодня.",
      request: "Запросить документ",
      others: "Другие документы",
      groups: {
        "Privacy & security": "Приватность и безопасность",
        Conduct: "Этика и поведение",
        Governance: "Управление",
        Commitments: "Обязательства",
      },
    },
  },
};

const DICTS: Record<Locale, Dict> = { en, ru };

export const getDict = (locale: Locale) => DICTS[locale];

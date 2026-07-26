/**
 * Единый источник правды по контенту и SEO для всех внутренних страниц.
 *
 * Зачем отдельным модулем: страницы решений и услуг отличаются только
 * текстом, поэтому рендерятся одним динамическим роутом. Копия и мета-теги
 * лежат рядом — правишь заголовок, и он одновременно уходит и в <h1>,
 * и в <title>, и в sitemap. Рассинхрона между ними быть не может.
 */

/** Прод-домен. Нужен для metadataBase, canonical и sitemap. */
export const SITE_URL = "https://adswebai.com";

export const SITE_NAME = "adswebai";

/** Дефолтное описание — подхватывается там, где у страницы нет своего. */
export const SITE_DESCRIPTION =
  "AI-driven brand, media and marketing systems. We build always-on marketing operations that ship at the speed of demand.";

export type Section = {
  heading: string;
  body: string;
  /** Короткие пункты под текстом: услуги, этапы, результаты. */
  bullets?: string[];
};

export type ContentPage = {
  slug: string;
  /** Крупный заголовок на странице и основа <title>. */
  title: string;
  /** Надзаголовок-лейбл над h1 («Solution», «Service»). */
  eyebrow: string;
  /** Подзаголовок под h1 — он же meta description, поэтому ~150-160 симв. */
  lede: string;
  sections: Section[];
  /** Ключевые слова страницы для meta keywords и внутренней перелинковки. */
  keywords: string[];
};

/* ------------------------------------------------------------------ */
/* Решения                                                             */
/* ------------------------------------------------------------------ */

export const SOLUTIONS: ContentPage[] = [
  {
    slug: "real-time-brands",
    title: "Real-Time Brands",
    eyebrow: "Solution",
    lede: "Brand systems that respond in hours, not quarters — built so every channel stays recognisably you while the work keeps moving.",
    keywords: [
      "brand strategy",
      "brand systems",
      "real-time marketing",
      "design systems",
    ],
    sections: [
      {
        heading: "The problem with brand guidelines",
        body: "Most brand books describe a finished state. They tell you what the logo may not touch, but not how to make four hundred assets a month without the brand drifting. The gap between the guideline and the deadline is where consistency quietly dies.",
      },
      {
        heading: "What we build instead",
        body: "A brand expressed as a system: tokens, components, motion rules and copy patterns that live in the same tools your team already ships from. The rules stop being a PDF and start being defaults.",
        bullets: [
          "Design tokens wired into your component library",
          "Motion and interaction principles, documented as code",
          "Tone-of-voice patterns your writers and models can both follow",
          "Governance that flags drift automatically, before publish",
        ],
      },
      {
        heading: "How it runs day to day",
        body: "Teams brief against the system rather than against a deck. New formats inherit the rules by default, so review shifts from policing details to judging ideas. Speed comes from removing rework, not from cutting corners.",
      },
    ],
  },
  {
    slug: "media-acceleration",
    title: "Media Acceleration",
    eyebrow: "Solution",
    lede: "Planning, buying, creative and measurement joined into one loop, so spend decisions are made on evidence rather than on last month's report.",
    keywords: [
      "performance media",
      "media buying",
      "marketing measurement",
      "media mix",
    ],
    sections: [
      {
        heading: "One loop, not four teams",
        body: "Media usually fails at the seams: creative is briefed away from the data, buying optimises to a proxy metric, and measurement arrives too late to change anything. We join the loop so each part sees what the others are doing.",
      },
      {
        heading: "What that involves",
        body: "We instrument the account properly first — clean events, honest attribution, a measurement model you can defend to finance. Only then do we touch bids and budgets, because optimising against bad data just gets you to the wrong place faster.",
        bullets: [
          "Event and conversion tracking rebuilt from first principles",
          "Incrementality and geo testing, not just platform-reported ROAS",
          "Creative variants briefed from what the data actually shows",
          "Budget reallocation on a weekly rhythm, with the reasoning written down",
        ],
      },
      {
        heading: "What you should expect",
        body: "Lower cost per outcome is the usual result, but the durable win is a media operation your team can explain. If a number moves, someone can say why — and show the test that proves it.",
      },
    ],
  },
  {
    slug: "marketing-orchestration",
    title: "Marketing Orchestration",
    eyebrow: "Solution",
    lede: "The content supply chain — brief, produce, adapt, localise, ship — collapsed into one pipeline with AI doing the repetitive parts.",
    keywords: [
      "content supply chain",
      "marketing operations",
      "content automation",
      "localisation",
    ],
    sections: [
      {
        heading: "Where the time actually goes",
        body: "Ask a marketing team where the month went and the answer is rarely 'thinking'. It went into resizing, reversioning, chasing approvals and rebuilding the same asset for the eleventh market. That work is real, but almost none of it needs a human.",
      },
      {
        heading: "The pipeline we put in",
        body: "A single route from brief to live asset, with automation on the mechanical steps and people kept on the judgement calls. Every asset carries its brief, its approvals and its performance history with it.",
        bullets: [
          "Structured briefs that machines and humans read the same way",
          "Automated resizing, reversioning and format adaptation",
          "Localisation with in-market review built into the flow",
          "One asset library, with usage rights and expiry tracked",
        ],
      },
      {
        heading: "Why it holds up",
        body: "Automation only survives contact with a real team if the exceptions are designed for. We map the awkward cases first — the regulated market, the legal review, the client who wants it different — and build the escape hatches before the happy path.",
      },
    ],
  },
  {
    slug: "ai-transformation",
    title: "AI Transformation",
    eyebrow: "Solution",
    lede: "AI put where it earns its keep: inside the workflows your team runs every day, with the evaluation and guardrails that keep it trustworthy.",
    keywords: [
      "AI transformation",
      "AI agents",
      "marketing AI",
      "workflow automation",
    ],
    sections: [
      {
        heading: "Start from the workflow, not the model",
        body: "The question worth asking is not which model to use. It is which recurring decision costs you the most time, and whether that decision can be made well from the information a system can actually see. Most AI projects fail at that second half.",
      },
      {
        heading: "How we scope it",
        body: "We audit where hours go, pick the two or three workflows with a clear success metric, and build those properly before touching anything else. Narrow and working beats broad and demoed.",
        bullets: [
          "Workflow audit with time and cost attached to each step",
          "Evaluation sets built before the system is built",
          "Human review kept on anything customer-facing",
          "Clear rollback, so a bad release is an inconvenience not an incident",
        ],
      },
      {
        heading: "On honesty about limits",
        body: "Some things we will tell you not to automate. If a task needs context the system cannot observe, or the cost of being confidently wrong is high, a person should keep doing it. Knowing where that line sits is most of the value.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Маркетинговые услуги                                                */
/* ------------------------------------------------------------------ */

export const SERVICES: ContentPage[] = [
  {
    slug: "brand-strategy",
    title: "Brand Strategy",
    eyebrow: "Service",
    lede: "Positioning, architecture and messaging grounded in what your buyers actually weigh up — written so the rest of the business can use it.",
    keywords: ["brand strategy", "positioning", "messaging", "brand architecture"],
    sections: [
      {
        heading: "What you get",
        body: "A position you can defend, an architecture that survives the next product launch, and messaging written for the people who have to sell with it — not for the strategy deck.",
        bullets: [
          "Category and competitor mapping",
          "Buyer research and decision drivers",
          "Positioning and portfolio architecture",
          "Messaging framework with real proof points",
        ],
      },
      {
        heading: "How we work",
        body: "Research first, opinions second. We would rather show you three uncomfortable findings from customer interviews than a beautifully argued position built on assumptions.",
      },
    ],
  },
  {
    slug: "content-production",
    title: "Content Production",
    eyebrow: "Service",
    lede: "Studio output at operational scale — video, stills, motion and copy produced against a system rather than one campaign at a time.",
    keywords: ["content production", "video production", "creative studio", "scaled content"],
    sections: [
      {
        heading: "What you get",
        body: "Production planned around the whole year's demand instead of the next deadline, so shoots are consolidated and every asset earns more than one use.",
        bullets: [
          "Campaign and always-on production",
          "Modular shoots designed for reversioning",
          "Motion, edit and post",
          "Copy and art direction to the brand system",
        ],
      },
      {
        heading: "How we work",
        body: "We plan for the cutdowns before the shoot, not after. That single change is usually worth more than any efficiency found later in post.",
      },
    ],
  },
  {
    slug: "social-influencer",
    title: "Social & Influencer",
    eyebrow: "Service",
    lede: "Social built for the way each platform actually rewards content, with creator partnerships chosen on audience evidence rather than follower count.",
    keywords: ["social media", "influencer marketing", "creator partnerships", "community"],
    sections: [
      {
        heading: "What you get",
        body: "A channel plan that respects the differences between platforms, a creator roster picked on audience overlap and genuine fit, and a publishing rhythm your team can actually sustain.",
        bullets: [
          "Channel strategy and content pillars",
          "Creator sourcing, vetting and contracting",
          "Community management and escalation playbooks",
          "Paid amplification of what is already working",
        ],
      },
      {
        heading: "How we work",
        body: "We test creators the way we test creative — small, measured, and with an agreed definition of what success looks like before money moves.",
      },
    ],
  },
  {
    slug: "performance-media",
    title: "Performance Media",
    eyebrow: "Service",
    lede: "Paid search, social, retail and programmatic run against business outcomes, with testing rigorous enough to tell luck from causation.",
    keywords: ["performance marketing", "paid media", "PPC", "programmatic"],
    sections: [
      {
        heading: "What you get",
        body: "Full-funnel buying across the channels that matter for your category, managed to contribution rather than to platform-reported conversions.",
        bullets: [
          "Paid search and shopping",
          "Paid social across major platforms",
          "Retail media and marketplaces",
          "Programmatic display, video and CTV",
        ],
      },
      {
        heading: "How we work",
        body: "Every account starts with a measurement review. If the tracking is wrong, the optimisation is theatre — so we fix that before we ask for budget.",
      },
    ],
  },
  {
    slug: "seo-aeo",
    title: "SEO & AEO",
    eyebrow: "Service",
    lede: "Technical and editorial SEO, extended to answer engines — so you are findable whether the buyer types into search or asks an assistant.",
    keywords: ["SEO", "answer engine optimisation", "technical SEO", "content strategy"],
    sections: [
      {
        heading: "What you get",
        body: "A site that crawls and renders cleanly, content built around real demand, and structured data that gives answer engines something unambiguous to cite.",
        bullets: [
          "Technical audit and Core Web Vitals",
          "Information architecture and internal linking",
          "Content strategy from live demand data",
          "Structured data and entity coverage",
        ],
      },
      {
        heading: "How we work",
        body: "Answer engines mostly reward the same things classical SEO does — clear structure, credible sourcing, genuine coverage of a topic. We are sceptical of anyone selling a separate trick for it.",
      },
    ],
  },
  {
    slug: "crm-email",
    title: "CRM & Email",
    eyebrow: "Service",
    lede: "Lifecycle programmes that earn attention — segmentation, automation and creative that treat the inbox as a privilege rather than an entitlement.",
    keywords: ["CRM", "email marketing", "lifecycle marketing", "retention"],
    sections: [
      {
        heading: "What you get",
        body: "Lifecycle journeys mapped to how people actually buy in your category, with deliverability treated as a first-order concern rather than an afterthought.",
        bullets: [
          "Lifecycle and journey design",
          "Segmentation and audience strategy",
          "Template systems and creative",
          "Deliverability, consent and preference management",
        ],
      },
      {
        heading: "How we work",
        body: "Send less, mean more. Most programmes we inherit improve immediately by cutting volume and fixing relevance, before a single new automation is added.",
      },
    ],
  },
  {
    slug: "data-measurement",
    title: "Data & Measurement",
    eyebrow: "Service",
    lede: "Tracking, modelling and reporting you can take to the board — built so the numbers survive scrutiny from someone who wants them to be wrong.",
    keywords: ["marketing measurement", "analytics", "attribution", "incrementality"],
    sections: [
      {
        heading: "What you get",
        body: "A measurement stack where every number has a known provenance, and a reporting layer that answers the questions leadership actually asks.",
        bullets: [
          "Tracking and data-layer implementation",
          "Attribution and marketing mix modelling",
          "Incrementality and geo testing",
          "Dashboards with definitions attached",
        ],
      },
      {
        heading: "How we work",
        body: "We write down what each metric means and what it excludes. Half of measurement disputes turn out to be two teams using one word for two different things.",
      },
    ],
  },
  {
    slug: "commerce",
    title: "Commerce",
    eyebrow: "Service",
    lede: "Digital shelf, marketplace and D2C performance handled together, because the buyer does not care which channel owns the sale.",
    keywords: ["ecommerce", "marketplaces", "digital shelf", "D2C"],
    sections: [
      {
        heading: "What you get",
        body: "Content, availability, pricing and media co-ordinated across the places people actually buy, with the digital shelf monitored rather than assumed.",
        bullets: [
          "Marketplace strategy and operations",
          "Product content and digital shelf optimisation",
          "Retail media planning and buying",
          "D2C conversion and merchandising",
        ],
      },
      {
        heading: "How we work",
        body: "Traffic to a page that is out of stock or badly merchandised is wasted money. We fix the shelf before we spend on driving people to it.",
      },
    ],
  },
  {
    slug: "creative-operations",
    title: "Creative Operations",
    eyebrow: "Service",
    lede: "The unglamorous layer that decides whether good work ships: briefs, approvals, asset management and the tooling underneath.",
    keywords: ["creative operations", "marketing operations", "DAM", "workflow"],
    sections: [
      {
        heading: "What you get",
        body: "A workflow where work does not sit waiting, an asset library people can actually find things in, and rights and expiry tracked before they become a legal problem.",
        bullets: [
          "Brief and intake design",
          "Approval routing and version control",
          "Digital asset management",
          "Capacity planning and throughput reporting",
        ],
      },
      {
        heading: "How we work",
        body: "We measure how long work waits versus how long it takes. Almost always the waiting dominates — and that is the cheaper problem to fix.",
      },
    ],
  },
  {
    slug: "ai-agents-automation",
    title: "AI Agents & Automation",
    eyebrow: "Service",
    lede: "Agents and automated workflows that carry real operational load — messaging, qualification, routing and reporting — with a human accountable at every decision that matters.",
    keywords: [
      "ai agents",
      "marketing automation",
      "conversational ai",
      "chatbots",
      "workflow automation",
      "telegram bot development",
    ],
    sections: [
      {
        heading: "What you get",
        body: "Working automation in the places where your team currently loses hours: first-line enquiries, lead qualification, routing, and the reports someone assembles by hand every Monday. Deployed where your customers already are — web, WhatsApp, Telegram, email — rather than behind another login.",
        bullets: [
          "Conversational agents for enquiry handling and qualification",
          "Messaging deployments across web, WhatsApp and Telegram",
          "Workflow automation across CRM, ticketing and reporting",
          "Retrieval over your own documents, with sources cited",
          "Human handover rules and escalation paths",
          "Evaluation harness so quality is measured, not assumed",
        ],
      },
      {
        heading: "How we work",
        body: "We start by automating one narrow, high-volume path end to end and measuring it against how the work is done today. That is a deliberately small first scope: it is the only honest way to find out whether the automation improves the outcome or simply moves the failure somewhere less visible.",
      },
      {
        heading: "What we are careful about",
        body: "Anything customer-facing gets a defined escalation path to a person, and anything that touches money or a commitment stays under human approval. We will also say when a task is better solved by fixing a process than by adding a model to it — that answer comes up more often than the market admits.",
      },
    ],
  },
  {
    slug: "web-platforms",
    title: "Web Platforms",
    eyebrow: "Service",
    lede: "Sites and redesigns built as a system your team can extend: performance, search and content model settled before the first screen is designed.",
    keywords: [
      "web development",
      "website redesign",
      "cms",
      "core web vitals",
      "design system",
    ],
    sections: [
      {
        heading: "What you get",
        body: "A site your team can actually run: a content model that matches how you publish, components that hold their shape when marketing edits them, and performance budgets enforced in the build rather than audited after launch.",
        bullets: [
          "Content model and CMS implementation",
          "Design system and component library",
          "Performance budgets and Core Web Vitals",
          "Technical SEO and structured data built in",
          "Analytics, consent and measurement wiring",
          "Documented handover to your team",
        ],
      },
      {
        heading: "How we work",
        body: "Redesigns start with what is already working. We instrument the current site first, so the rebuild is argued from behaviour rather than from taste — and so we can tell afterwards whether it actually helped.",
      },
      {
        heading: "What we are careful about",
        body: "We will often argue for a smaller build. A full replatform is expensive and rarely the real cause of the problem; where three fixes and a content model would get you most of the benefit, that is what we will recommend.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Хелперы для роутов                                                  */
/* ------------------------------------------------------------------ */

export const findSolution = (slug: string) =>
  SOLUTIONS.find((p) => p.slug === slug);

export const findService = (slug: string) =>
  SERVICES.find((p) => p.slug === slug);

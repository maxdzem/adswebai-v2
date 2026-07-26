/**
 * Корпоративные и юридические документы из футера.
 *
 * ВАЖНО про содержание: тексты этих документов имеют юридическую силу
 * (privacy notice, modern slavery statement) либо заявляют о присоединении
 * компании к внешним инициативам (Armed Forces Covenant). Придумывать их
 * нельзя: это были бы ложные заявления о том, как adswebai обращается
 * с данными и какие обязательства на себя взяла.
 *
 * Поэтому страницы существуют, имеют правильные заголовки, канонические
 * URL и объясняют предмет документа — а вместо выдуманного текста стоит
 * явный статус «готовится» со ссылкой на контакт. Так навигация работает
 * и ничего некорректного в индекс не уходит.
 */

export type LegalDoc = {
  slug: string;
  title: string;
  /** Короткое честное описание, о чём этот документ. */
  purpose: string;
  /** Раздел для группировки на /legal. */
  group: "Governance" | "Privacy & security" | "Conduct" | "Commitments";
};

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "sustainability",
    title: "Sustainability",
    purpose:
      "How we account for the environmental footprint of the work we produce and the infrastructure we run it on.",
    group: "Commitments",
  },
  {
    slug: "privacy-notice",
    title: "Privacy Notice",
    purpose:
      "What personal data we collect through this site and our client work, why we hold it, how long for, and how to exercise your rights over it.",
    group: "Privacy & security",
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    purpose:
      "Which cookies and similar technologies this site sets, what each one is for, and how to change your choices.",
    group: "Privacy & security",
  },
  {
    slug: "information-security",
    title: "Information Security & Compliance",
    purpose:
      "The controls we apply to client data and credentials, and the standards we hold ourselves and our subprocessors to.",
    group: "Privacy & security",
  },
  {
    slug: "vulnerability-reporting",
    title: "Responsible Vulnerability Reporting Policy",
    purpose:
      "How to report a security issue in anything we operate, what we commit to in response, and our position on good-faith research.",
    group: "Privacy & security",
  },
  {
    slug: "ethical-marketing",
    title: "Ethical Marketing Policy",
    purpose:
      "The work we will and will not take on, how we handle claims and targeting, and where we draw the line on persuasion.",
    group: "Conduct",
  },
  {
    slug: "code-of-conduct",
    title: "Code of Conduct",
    purpose:
      "The standards we expect of everyone working here and with us, and what happens when they are not met.",
    group: "Conduct",
  },
  {
    slug: "anti-hate",
    title: "Anti-Hate Statement",
    purpose:
      "Our position on hateful content and on placing client media next to it.",
    group: "Conduct",
  },
  {
    slug: "speak-up",
    title: "Speak Up Policy",
    purpose:
      "How to raise a concern about conduct or safety, including anonymously, and how it is handled from there.",
    group: "Conduct",
  },
  {
    slug: "modern-slavery",
    title: "Modern Slavery Statement",
    purpose:
      "The steps we take to understand and reduce the risk of forced labour in our operations and supply chain.",
    group: "Governance",
  },
  {
    slug: "accessibility",
    title: "Accessibility Statement",
    purpose:
      "The accessibility standard we build to, where this site currently falls short, and how to tell us about a barrier you hit.",
    group: "Commitments",
  },
  {
    slug: "armed-forces-covenant",
    title: "Armed Forces Covenant",
    purpose:
      "Our position on employing and supporting service leavers, reservists and military families.",
    group: "Commitments",
  },
  {
    slug: "land-acknowledgement",
    title: "Land Acknowledgement",
    purpose:
      "Recognition of the traditional custodians of the land our teams work from.",
    group: "Commitments",
  },
];

export const findLegal = (slug: string) =>
  LEGAL_DOCS.find((d) => d.slug === slug);

export const LEGAL_GROUPS: LegalDoc["group"][] = [
  "Privacy & security",
  "Conduct",
  "Governance",
  "Commitments",
];

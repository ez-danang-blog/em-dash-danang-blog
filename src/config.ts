export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export const SITE = {
  url: "https://danang.ezinner.com",
  title: "EZ Da\u2009Nang",
  titleMark: "沱灢",
  tagline: "A long-term tourist’s log",
  description: "Personal notes on staying in Da Nang, Vietnam for a while as a long-term tourist.",
  lang: "en",
  locale: "en_US",
  defaultOgImage: "/images/site/og-image.webp",
} as const;

export const AUTHOR = {
  name: "Evgenii Zinner",
  url: "https://www.ezinner.com/",
  bio: "Long-term tourist in Da Nang, Vietnam. Notes on how to live here comfortably without the usual headaches.",
} as const;

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Articles", href: "/articles" },
];

export const SOCIAL: SocialLink[] = [
  { label: "Website", href: "https://www.ezinner.com/" },
  { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/evgeniizinner" },
];

export const BLOG = {
  postsPerPage: 10,
  postsOnHome: 6,
  wordsPerMinute: 220,
  showReadingTime: true,
  showTableOfContents: true,
  tocMinHeadings: 2,
} as const;

export const INK = {
  hero: true,
  divider: true,
  strength: 1,
  autoFlow: true,
} as const;

export const OG = {
  enabled: false,
  width: 1200,
  height: 630,
} as const;

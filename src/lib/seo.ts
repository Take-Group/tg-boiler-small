import { COMPANY, SITE } from '@/config/site';

/** Absolute URL for a site path ("/cennik" -> "https://domain/cennik"). */
export function absoluteUrl(path = '/'): string {
  const url = new URL(path, SITE.url).toString();
  return path === '/' ? url : url.replace(/\/$/, '');
}

type Schema = Record<string, unknown>;

export function organizationSchema(): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    legalName: COMPANY.legalName || undefined,
    url: SITE.url,
    email: COMPANY.email || undefined,
    telephone: COMPANY.phone || undefined,
  };
}

export function websiteSchema(): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    inLanguage: SITE.lang,
  };
}

export interface Crumb {
  label: string;
  href: string;
}

export function breadcrumbSchema(items: Crumb[]): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqSchema(items: FaqItem[]): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

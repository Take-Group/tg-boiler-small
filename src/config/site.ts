// Identity of the app. Every page, the sitemap, schema and robots.txt read it
// from here - never hard-code these values anywhere else.
// Values marked as placeholders are replaced by the new-app skill.

export const SITE = {
  name: 'Twoja Marka',
  url: 'https://twojadomena.pl',
  locale: 'pl_PL',
  lang: 'pl',
  // Default meta description, used when a page does not pass its own.
  description: 'Tu opisz w jednym zdaniu, co robi strona i dla kogo jest.',
  // Browser UI color on mobile. The app's main color once it has one.
  themeColor: '#ffffff',
  // Set to false while the app is a draft: every page gets noindex and robots.txt blocks crawlers.
  indexable: false,
  // Google Tag Manager container ("GTM-XXXXXXX"). Empty = no tag on the page.
  gtmId: '',
} as const;

// Legal entity behind the app, used in the footer and Organization schema.
// Leave a field empty rather than invent it.
export const COMPANY: Record<'legalName' | 'email' | 'phone' | 'address' | 'taxId', string> = {
  legalName: 'Twoja Firma Sp. z o.o.',
  email: 'kontakt@twojadomena.pl',
  phone: '',
  address: '',
  taxId: '',
};

import { SERVICES } from '@/content/services';

/**
 * Single source of truth for JetWash24's business identity (NAP),
 * reused by structured data (JSON-LD), sitemap, and metadata.
 *
 * Keep this in sync with the Google Business Profile to preserve NAP
 * consistency, which is a primary local-ranking signal.
 */

/**
 * Canonical site origin. The apex domain 307-redirects to the `www` host
 * (www is the primary on Vercel), so we normalise to `www` here to ensure
 * canonical tags, hreflang and the sitemap all point to the final 200 URL
 * — never to a redirecting one — regardless of how NEXT_PUBLIC_URL is set.
 */
function normalizeSiteUrl(raw: string): string {
  try {
    const url = new URL(raw);
    if (url.hostname === 'jetwash24.com') {
      url.hostname = 'www.jetwash24.com';
    }
    return url.origin;
  } catch {
    return 'https://www.jetwash24.com';
  }
}

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_URL ?? 'https://www.jetwash24.com'
);

export const LOCALES = ['pt', 'en'] as const;
export const DEFAULT_LOCALE = 'pt';

export const BUSINESS = {
  name: 'JetWash24 Detailing',
  // Matches the current Google Business Profile listing name.
  alternateName: 'JetWash24 - Lavagem Automóvel',
  url: SITE_URL,
  telephone: '+351928380478',
  email: 'jetwash24detailing@gmail.com',
  priceRange: '€€',
  // Google Business Profile (Maps) — consolidates the website with the GBP entity.
  googleMapsUrl:
    'https://maps.app.goo.gl/F5JnSNNxreYhAqJh7',
  address: {
    streetAddress: 'N125 610',
    addressLocality: 'Guia',
    addressRegion: 'Faro',
    postalCode: '8800-076',
    addressCountry: 'PT',
  },
  geo: {
    latitude: 37.1286649,
    longitude: -8.2733417,
  },
  // Open every day 09:00–17:00.
  openingHours: {
    days: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '09:00',
    closes: '17:00',
  },
  areaServed: ['Guia', 'Albufeira', 'Vilamoura', 'Faro', 'Algarve'],
} as const;

/**
 * Representative service catalog for `hasOfferCatalog`.
 *
 * Derived from the service content so the offer catalogue can never drift from
 * the prices actually published on the service pages — the previous hardcoded
 * copy had gone stale (it advertised a deactivated service and three outdated
 * prices). Prices are "from" (citadino) base prices; vehicle size adds a
 * surcharge, which `priceSpecification.minPrice` expresses.
 */
export const SERVICE_OFFERS = SERVICES.map((service) => ({
  slug: service.slug,
  namePt: service.pt.name,
  nameEn: service.en.name,
  price: service.fromPrice,
}));

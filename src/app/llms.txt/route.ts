import { SITE_URL, BUSINESS } from '@/lib/seo/business';
import { SERVICES } from '@/content/services';
import { LOCATIONS } from '@/content/locations';
import { SORTED_ARTICLES } from '@/content/blog';

/** This file is written in English, so prices use the English convention (€39.90). */
const euro = (amount: number) =>
  `€${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;

/**
 * /llms.txt — a plain-text map of the site for AI assistants.
 *
 * Honest expectation setting: support is partial. Anthropic and Perplexity
 * read it during retrieval; Google does not use it for AI Overviews and
 * OpenAI has not committed to it. It is cheap, additive and also useful as
 * context for coding agents, but it is not a ranking lever — the real AI
 * visibility work is the on-page answer blocks and structured data.
 *
 * A static segment outranks the `[locale]` dynamic segment, so this route is
 * what answers /llms.txt (previously that path fell through to the locale
 * segment and served the home page at HTTP 200).
 *
 * Every URL here is derived from the same content modules that generate the
 * pages, so this file cannot list a link that does not resolve.
 */

export const dynamic = 'force-static';

function build(): string {
  const lines: string[] = [];

  lines.push('# JetWash24 Detailing');
  lines.push('');
  lines.push(
    `> Professional car detailing in Guia, Albufeira, Algarve, Portugal. Interior and exterior detailing, machine polishing, paint correction and headlight restoration, bookable online. Located at ${BUSINESS.address.streetAddress}, ${BUSINESS.address.addressLocality} ${BUSINESS.address.postalCode}, a 3-minute walk from Algarve Shopping. Open every day ${BUSINESS.openingHours.opens}–${BUSINESS.openingHours.closes}. Site is bilingual: Portuguese under /pt and English under /en.`
  );
  lines.push('');
  lines.push(
    `Prices below are "from" prices for a city car. A vehicle-size surcharge applies (+€10 medium, +€20 SUV, +€30 large, +€50 supercar). Contact: ${BUSINESS.telephone} · ${BUSINESS.email}`
  );
  lines.push('');

  lines.push('## Services');
  lines.push('');
  for (const service of SERVICES) {
    lines.push(
      `- [${service.en.name}](${SITE_URL}/en/services/${service.slug}): ${service.en.tagline} From ${euro(service.fromPrice)}, takes ${service.durationLabelEn}.`
    );
  }
  lines.push('');

  lines.push('## Service areas');
  lines.push('');
  for (const location of LOCATIONS) {
    lines.push(
      `- [Car detailing in ${location.en.city}](${SITE_URL}/en/detailing/${location.slug}): ${location.en.tagline}`
    );
  }
  lines.push('');

  lines.push('## Guides');
  lines.push('');
  for (const article of SORTED_ARTICLES) {
    lines.push(
      `- [${article.en.title}](${SITE_URL}/en/blog/${article.slug}): ${article.en.excerpt}`
    );
  }
  lines.push('');

  lines.push('## Booking');
  lines.push('');
  lines.push(
    `- [Book online](${SITE_URL}/en/booking): Pick a service, vehicle size, date and time. Confirmed with a €5 deposit that is deducted from the final price. Booking takes under 2 minutes.`
  );
  lines.push('');

  lines.push('## Portuguese versions');
  lines.push('');
  lines.push(`- [Página inicial](${SITE_URL}/pt): Portuguese home page.`);
  lines.push(`- [Serviços](${SITE_URL}/pt/services): All services in Portuguese.`);
  lines.push(`- [Blog](${SITE_URL}/pt/blog): Guides in Portuguese.`);
  lines.push('');

  return lines.join('\n');
}

export function GET() {
  return new Response(build(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

import { SITE_URL, BUSINESS } from '@/lib/seo/business';
import { SERVICES } from '@/content/services';
import { LOCATIONS } from '@/content/locations';
import { SORTED_ARTICLES } from '@/content/blog';
import type { ProductCategory } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PRODUCT_CATEGORIES, categoryLabel } from '@/lib/shop/catalog';
import { DELIVERY_DAYS, MIN_ORDER_TOTAL } from '@/lib/shop/shipping';

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

/**
 * Products come from the database, so this can no longer be baked at build
 * time — a static file would keep advertising last month's catalogue. Revalidated
 * hourly rather than per request: assistants fetch it rarely, and it is a map of
 * the site, not a price feed.
 */
export const revalidate = 3600;

type ProductLine = {
  slug: string;
  nameEn: string;
  price: number;
  category: ProductCategory;
  descriptionEn: string | null;
};

/**
 * The catalogue, or an empty list if the database is unreachable. A missing
 * shop section is a worse outcome than a stale one, but a failed build is the
 * worst of the three.
 */
async function shopProducts(): Promise<ProductLine[]> {
  try {
    return await prisma.product.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        nameEn: true,
        price: true,
        category: true,
        descriptionEn: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  } catch (err) {
    console.error('llms.txt: could not load products:', err);
    return [];
  }
}

/** First sentence of the description — enough to identify the product, not a page of copy. */
function firstSentence(text: string | null): string {
  if (!text) return '';
  const trimmed = text.trim();
  const end = trimmed.search(/[.!?](\s|$)/);
  return end === -1 ? trimmed.slice(0, 160) : trimmed.slice(0, end + 1);
}

function build(products: ProductLine[]): string {
  const lines: string[] = [];

  lines.push('# JetWash24 Detailing');
  lines.push('');
  lines.push(
    `> Online shop for car cleaning products and detailing accessories, shipped free to all 27 EU countries, run by a professional detailing centre in Guia, Albufeira, Algarve. Also offers in-person detailing: machine polishing, paint correction and headlight restoration, bookable online. Located at ${BUSINESS.address.streetAddress}, ${BUSINESS.address.addressLocality} ${BUSINESS.address.postalCode}, a 3-minute walk from Algarve Shopping. Open every day ${BUSINESS.openingHours.opens}–${BUSINESS.openingHours.closes}. Site is bilingual: Portuguese under /pt and English under /en.`
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

  lines.push('## Shop');
  lines.push('');
  lines.push(
    `- [Shop](${SITE_URL}/en/shop): Car cleaning products and detailing accessories, the same ones used in the JetWash24 centre. Card and local payment methods via Stripe. Free shipping to all 27 EU countries, with no minimum beyond a ${euro(MIN_ORDER_TOTAL)} order value. Delivered in ${DELIVERY_DAYS.min}-${DELIVERY_DAYS.max} working days, with a 14-day right of return.`
  );
  for (const category of PRODUCT_CATEGORIES) {
    lines.push(
      `- [${category.en}](${SITE_URL}/en/shop?category=${category.slug}): ${category.en} products in the JetWash24 shop.`
    );
  }
  lines.push('');

  // Naming the actual products, with prices, is what lets an assistant answer
  // "where can I buy a drying towel in the EU" with a specific item rather
  // than a link to a catalogue it would have to crawl.
  if (products.length > 0) {
    lines.push('### Products');
    lines.push('');
    for (const product of products) {
      const summary = firstSentence(product.descriptionEn);
      lines.push(
        `- [${product.nameEn}](${SITE_URL}/en/shop/${product.slug}): ${euro(product.price)}, ${categoryLabel(product.category, 'en')}.${summary ? ` ${summary}` : ''}`
      );
    }
    lines.push('');
  }

  lines.push('## Booking');
  lines.push('');
  lines.push(
    `- [Book online](${SITE_URL}/en/booking): Pick a service, vehicle size, date and time. Confirmed with a €5 deposit that is deducted from the final price. Booking takes under 2 minutes.`
  );
  lines.push('');

  lines.push('## Portuguese versions');
  lines.push('');
  lines.push(`- [Página inicial](${SITE_URL}/pt): Portuguese home page.`);
  lines.push(`- [Loja](${SITE_URL}/pt/shop): The shop in Portuguese.`);
  lines.push(`- [Serviços](${SITE_URL}/pt/services): All services in Portuguese.`);
  lines.push(`- [Blog](${SITE_URL}/pt/blog): Guides in Portuguese.`);
  lines.push('');

  return lines.join('\n');
}

export async function GET() {
  return new Response(build(await shopProducts()), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

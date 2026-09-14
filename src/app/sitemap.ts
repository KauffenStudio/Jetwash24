import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { SITE_URL, LOCALES, DEFAULT_LOCALE } from '@/lib/seo/business';
import { SERVICE_SLUGS } from '@/content/services';
import { ARTICLES } from '@/content/blog';
import { LOCATION_SLUGS } from '@/content/locations';

/**
 * Date the evergreen marketing pages last genuinely changed.
 *
 * These have no CMS timestamp, so bumping this is a deliberate act: change it
 * when the copy or the prices actually change, and not otherwise. An automatic
 * value here is what produced the bug this replaces.
 */
const CONTENT_REVISED = '2026-09-03';

/**
 * Public, indexable routes (without locale prefix). Each becomes a sitemap
 * entry per locale, with hreflang alternates so Google serves the right
 * language version per user.
 *
 * `lastModified` is per route and reflects a real change date. It used to be a
 * single `new Date()` stamped onto all 50 URLs at generation time, which is the
 * textbook pattern Google treats as non-credible and discards — so the field
 * bought nothing while looking like it was doing something.
 */
const ROUTES = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const, lastModified: CONTENT_REVISED },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' as const, lastModified: CONTENT_REVISED },
  ...SERVICE_SLUGS.map((slug) => ({
    path: `/services/${slug}`,
    priority: 0.8,
    changeFrequency: 'monthly' as const,
    lastModified: CONTENT_REVISED,
  })),
  ...LOCATION_SLUGS.map((slug) => ({
    path: `/detailing/${slug}`,
    priority: 0.85,
    changeFrequency: 'monthly' as const,
    lastModified: CONTENT_REVISED,
  })),
  {
    path: '/blog',
    priority: 0.7,
    changeFrequency: 'weekly' as const,
    // The index changes when its newest article does.
    lastModified: ARTICLES.reduce(
      (latest, a) => (a.date > latest ? a.date : latest),
      CONTENT_REVISED
    ),
  },
  ...ARTICLES.map((article) => ({
    path: `/blog/${article.slug}`,
    priority: 0.6,
    changeFrequency: 'monthly' as const,
    lastModified: article.date,
  })),
  { path: '/booking', priority: 0.8, changeFrequency: 'monthly' as const, lastModified: CONTENT_REVISED },
  { path: '/shop', priority: 0.95, changeFrequency: 'weekly' as const, lastModified: CONTENT_REVISED },
];

/**
 * Rendered per request, not at build time.
 *
 * This used to be statically prerendered, and productRoutes() below swallows a
 * database failure so the sitemap still builds. Together those shipped a
 * sitemap with zero products and froze it there until the next deploy — every
 * product page was missing from the live sitemap despite the code below being
 * correct. Generating on request means a failed read is retried on the next
 * crawl instead of being baked in for weeks.
 */
export const dynamic = 'force-dynamic';

/**
 * Product pages live in the database, so they're read at request time. A DB
 * hiccup must never take the whole sitemap down — we fall back to the static
 * routes instead.
 */
async function productRoutes() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      orderBy: { sortOrder: 'asc' },
    });
    return products.map((product) => ({
      path: `/shop/${product.slug}`,
      priority: 0.7,
      changeFrequency: 'weekly' as const,
      lastModified: product.updatedAt,
    }));
  } catch (err) {
    console.error('Sitemap: could not load products:', err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [...ROUTES, ...(await productRoutes())];

  return routes.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}${route.path}`,
      lastModified: route.lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          pt: `${SITE_URL}/pt${route.path}`,
          en: `${SITE_URL}/en${route.path}`,
          'x-default': `${SITE_URL}/${DEFAULT_LOCALE}${route.path}`,
        },
      },
    }))
  );
}

import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { SITE_URL, LOCALES, DEFAULT_LOCALE } from '@/lib/seo/business';
import { SERVICE_SLUGS } from '@/content/services';
import { ARTICLE_SLUGS } from '@/content/blog';
import { LOCATION_SLUGS } from '@/content/locations';

/**
 * Public, indexable routes (without locale prefix). Each becomes a sitemap
 * entry per locale, with hreflang alternates so Google serves the right
 * language version per user.
 */
const ROUTES = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' as const },
  ...SERVICE_SLUGS.map((slug) => ({
    path: `/services/${slug}`,
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  })),
  ...LOCATION_SLUGS.map((slug) => ({
    path: `/detailing/${slug}`,
    priority: 0.85,
    changeFrequency: 'monthly' as const,
  })),
  { path: '/blog', priority: 0.7, changeFrequency: 'weekly' as const },
  ...ARTICLE_SLUGS.map((slug) => ({
    path: `/blog/${slug}`,
    priority: 0.6,
    changeFrequency: 'monthly' as const,
  })),
  { path: '/booking', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/shop', priority: 0.95, changeFrequency: 'weekly' as const },
];

/**
 * Product pages live in the database, so they're read at request time. A DB
 * hiccup must never take the whole sitemap down — we fall back to the static
 * routes instead.
 */
async function productRoutes() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true },
      orderBy: { sortOrder: 'asc' },
    });
    return products.map((product) => ({
      path: `/shop/${product.slug}`,
      priority: 0.7,
      changeFrequency: 'weekly' as const,
    }));
  } catch (err) {
    console.error('Sitemap: could not load products:', err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const routes = [...ROUTES, ...(await productRoutes())];

  return routes.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}${route.path}`,
      lastModified,
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

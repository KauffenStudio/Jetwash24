import type { MetadataRoute } from 'next';
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
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.flatMap((route) =>
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

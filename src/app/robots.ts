import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/business';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Private / non-indexable areas (locale-prefixed, e.g. /pt/admin, /en/worker).
        disallow: ['/api/', '/*/admin', '/*/worker'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

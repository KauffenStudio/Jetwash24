import JsonLd from './JsonLd';
import { SITE_URL } from '@/lib/seo/business';

export type Crumb = { name: string; path: string };

/**
 * BreadcrumbList structured data. `path` is the locale-prefixed path
 * (e.g. /pt/services/headlight-restoration); the home crumb should point
 * at /<locale>.
 */
export default function BreadcrumbSchema({ items }: { items: Crumb[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: `${SITE_URL}${item.path}`,
        })),
      }}
    />
  );
}

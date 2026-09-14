import JsonLd from './JsonLd';
import { BUSINESS, SITE_URL } from '@/lib/seo/business';

/**
 * WebSite structured data.
 *
 * The site described LocalBusiness, Service, Product and BlogPosting nodes but
 * never the site itself, so nothing tied those together as one publication.
 * `publisher` points at the business by @id, which is what makes the two
 * resolve to a single entity rather than two unrelated things that happen to
 * share a domain.
 *
 * No `potentialAction`/SearchAction: there is no site search to point one at,
 * and declaring a target that 404s is worse than declaring nothing.
 */
export default function WebSiteSchema({ locale }: { locale: string }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BUSINESS.name,
        inLanguage: locale === 'pt' ? 'pt-PT' : 'en-GB',
        publisher: { '@id': `${SITE_URL}/#business` },
      }}
    />
  );
}

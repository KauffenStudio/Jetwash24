import JsonLd from './JsonLd';
import { BUSINESS, SITE_URL } from '@/lib/seo/business';
import type { ServiceContent } from '@/content/services';

/**
 * Service structured data for an individual service page. Links the offering
 * back to the LocalBusiness entity (@id) so Google understands who provides
 * it and where, reinforcing local relevance for service-specific searches.
 */
export default function ServiceSchema({
  service,
  locale,
}: {
  service: ServiceContent;
  locale: string;
}) {
  const copy = locale === 'pt' ? service.pt : service.en;
  const url = `${SITE_URL}/${locale}/services/${service.slug}`;

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: copy.name,
        serviceType: copy.name,
        description: copy.metaDescription,
        url,
        provider: {
          '@type': 'AutoWash',
          '@id': `${SITE_URL}/#business`,
          name: BUSINESS.name,
        },
        areaServed: BUSINESS.areaServed.map((name) => ({ '@type': 'City', name })),
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: service.fromPrice,
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: service.fromPrice,
            priceCurrency: 'EUR',
          },
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/${locale}/booking`,
        },
      }}
    />
  );
}

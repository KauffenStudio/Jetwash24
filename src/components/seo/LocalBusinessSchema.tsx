import { BUSINESS, SERVICE_OFFERS, SITE_URL } from '@/lib/seo/business';

/**
 * LocalBusiness / AutoWash structured data.
 *
 * This is the single most important on-page SEO signal for a physical
 * detailing business: it tells Google the entity, location, hours, price
 * range and service catalogue, making the site eligible for rich results
 * and reinforcing the Google Business Profile in the local map pack.
 *
 * NOTE: aggregateRating is intentionally omitted. Google requires review
 * markup to reflect genuine reviews that are also visible on the page;
 * adding it without on-page reviews risks a manual action. Once real
 * reviews are embedded on the site, add an `aggregateRating` block here.
 */
export default function LocalBusinessSchema({ locale }: { locale: string }) {
  const isPt = locale === 'pt';

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'AutoWash'],
    '@id': `${SITE_URL}/#business`,
    name: BUSINESS.name,
    alternateName: BUSINESS.alternateName,
    url: BUSINESS.url,
    image: [
      `${SITE_URL}/gallery/detail-1-after.jpg`,
      `${SITE_URL}/gallery/headlight-bmw-after.jpg`,
    ],
    logo: `${SITE_URL}/${locale}/opengraph-image`,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    priceRange: BUSINESS.priceRange,
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Credit Card, MB Way',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.streetAddress,
      addressLocality: BUSINESS.address.addressLocality,
      addressRegion: BUSINESS.address.addressRegion,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    hasMap: BUSINESS.googleMapsUrl,
    sameAs: [BUSINESS.googleMapsUrl],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: BUSINESS.openingHours.days,
        opens: BUSINESS.openingHours.opens,
        closes: BUSINESS.openingHours.closes,
      },
    ],
    areaServed: BUSINESS.areaServed.map((name) => ({
      '@type': 'City',
      name,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: isPt ? 'Serviços de Detailing' : 'Detailing Services',
      itemListElement: SERVICE_OFFERS.map((service) => ({
        '@type': 'Offer',
        priceCurrency: 'EUR',
        price: service.price,
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: service.price,
          priceCurrency: 'EUR',
        },
        itemOffered: {
          '@type': 'Service',
          name: isPt ? service.namePt : service.nameEn,
          // Ties each catalogue entry to the page that describes it, so the
          // offer and the Service node on that page resolve to one entity.
          url: `${SITE_URL}/${locale}/services/${service.slug}`,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // Schema is fully static/derived — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

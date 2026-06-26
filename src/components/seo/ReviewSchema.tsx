import JsonLd from './JsonLd';
import { BUSINESS, SITE_URL } from '@/lib/seo/business';
import { REVIEWS, reviewAggregate } from '@/content/reviews';

/**
 * Emits aggregateRating + review markup attached to the LocalBusiness entity,
 * but ONLY when real reviews exist on-page (see content/reviews.ts). Renders
 * nothing otherwise — the safe default that avoids review-snippet penalties.
 */
export default function ReviewSchema({ locale }: { locale: string }) {
  const aggregate = reviewAggregate();
  if (!aggregate) return null;

  const isPt = locale === 'pt';

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'AutoWash'],
        '@id': `${SITE_URL}/#business`,
        name: BUSINESS.name,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: aggregate.ratingValue,
          reviewCount: aggregate.reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
        review: REVIEWS.map((r) => ({
          '@type': 'Review',
          author: { '@type': 'Person', name: r.author },
          datePublished: r.date,
          reviewRating: {
            '@type': 'Rating',
            ratingValue: r.rating,
            bestRating: 5,
            worstRating: 1,
          },
          reviewBody: isPt ? r.textPt : r.textEn,
        })),
      }}
    />
  );
}

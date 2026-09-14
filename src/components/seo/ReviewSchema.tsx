import JsonLd from './JsonLd';
import { REVIEWS, reviewAggregate } from '@/content/reviews';
import { BUSINESS, SITE_URL } from '@/lib/seo/business';

/**
 * Ratings and reviews for the business, attached to the LocalBusiness node
 * that LocalBusinessSchema emits from the layout.
 *
 * They are a separate block, not fields on that component, for two reasons:
 *
 * 1. LocalBusinessSchema renders on every page. Review markup must reflect
 *    reviews that are visible on the same page, and they are only visible on
 *    the home page — so this block is rendered by Testimonials, which is the
 *    thing that shows them. The markup cannot outlive the section it
 *    describes.
 * 2. Repeating `@id` lets consumers merge this into the same entity instead
 *    of declaring a second business, so there is still exactly one JetWash24.
 *
 * Google does not show review stars for a business rating published on that
 * business's own site — it treats it as self-serving. The value here is for
 * answer engines, which read the rating and cite it.
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
        review: REVIEWS.map((review) => ({
          '@type': 'Review',
          author: { '@type': 'Person', name: review.author },
          datePublished: review.date,
          reviewBody: isPt ? review.textPt : review.textEn,
          reviewRating: {
            '@type': 'Rating',
            ratingValue: review.rating,
            bestRating: 5,
            worstRating: 1,
          },
        })),
      }}
    />
  );
}

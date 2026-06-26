import JsonLd from './JsonLd';
import { BUSINESS, SITE_URL } from '@/lib/seo/business';
import type { Article } from '@/content/blog';

/**
 * BlogPosting structured data for an article, authored/published by the
 * business entity. Eligible for article rich results and reinforces topical
 * authority around car detailing in the Algarve.
 */
export default function ArticleSchema({
  article,
  locale,
}: {
  article: Article;
  locale: string;
}) {
  const copy = locale === 'pt' ? article.pt : article.en;
  const url = `${SITE_URL}/${locale}/blog/${article.slug}`;

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: copy.title,
        description: copy.metaDescription,
        image: `${SITE_URL}${article.cover}`,
        datePublished: article.date,
        dateModified: article.date,
        inLanguage: locale === 'pt' ? 'pt-PT' : 'en-GB',
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        author: {
          '@type': 'Organization',
          name: BUSINESS.name,
          url: SITE_URL,
        },
        publisher: {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#business`,
          name: BUSINESS.name,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/${locale}/opengraph-image`,
          },
        },
      }}
    />
  );
}

import JsonLd from './JsonLd';
import type { FaqItem } from '@/content/faq';

/**
 * FAQPage structured data. Google requires every question/answer here to be
 * visibly present on the same page, so always render this alongside the
 * on-page FAQ (e.g. FaqAccordion) that uses the same `items`.
 */
export default function FaqSchema({ items }: { items: FaqItem[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      }}
    />
  );
}

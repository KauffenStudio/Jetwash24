import JsonLd from './JsonLd';
import { SITE_URL } from '@/lib/seo/business';

/**
 * ItemList for the shop catalogue.
 *
 * Without it the catalogue is just a wall of links: a crawler has to open
 * every product page to learn what is sold and for how much, and an answer
 * engine asked "what does JetWash24 sell?" has nothing on the page it can
 * quote. The list names each product, its position and its price in one
 * block, which is also the form Google prefers for a category page.
 */
export default function ProductListSchema({
  products,
  locale,
  name,
}: {
  products: {
    slug: string;
    namePt: string;
    nameEn: string;
    price: number;
    images: string[];
  }[];
  locale: string;
  name: string;
}) {
  if (products.length === 0) return null;

  const isPt = locale === 'pt';

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name,
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => {
          const url = `${SITE_URL}/${locale}/shop/${product.slug}`;
          return {
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              '@id': `${url}#product`,
              name: isPt ? product.namePt : product.nameEn,
              url,
              ...(product.images[0] ? { image: product.images[0] } : {}),
              offers: {
                '@type': 'Offer',
                url,
                priceCurrency: 'EUR',
                price: product.price.toFixed(2),
                availability: 'https://schema.org/InStock',
              },
            },
          };
        }),
      }}
    />
  );
}

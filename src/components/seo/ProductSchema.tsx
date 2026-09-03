import JsonLd from './JsonLd';
import { SITE_URL, BUSINESS } from '@/lib/seo/business';

/**
 * Product structured data with an Offer, so the shop can win rich results
 * (price, availability) and be quoted by AI answer engines. Availability and
 * price must mirror what the page shows, or Google drops the enhancement.
 */
export default function ProductSchema({
  product,
  locale,
}: {
  product: {
    slug: string;
    namePt: string;
    nameEn: string;
    descriptionPt: string | null;
    descriptionEn: string | null;
    brand: string | null;
    sku: string | null;
    price: number;
    stock: number;
    images: string[];
  };
  locale: string;
}) {
  const isPt = locale === 'pt';
  const url = `${SITE_URL}/${locale}/shop/${product.slug}`;

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${url}#product`,
        name: isPt ? product.namePt : product.nameEn,
        ...(product.descriptionPt || product.descriptionEn
          ? { description: (isPt ? product.descriptionPt : product.descriptionEn) ?? undefined }
          : {}),
        ...(product.images.length > 0 ? { image: product.images } : {}),
        ...(product.sku ? { sku: product.sku } : {}),
        ...(product.brand ? { brand: { '@type': 'Brand', name: product.brand } } : {}),
        offers: {
          '@type': 'Offer',
          url,
          priceCurrency: 'EUR',
          price: product.price.toFixed(2),
          availability:
            product.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@type': 'Organization', name: BUSINESS.name, url: SITE_URL },
        },
      }}
    />
  );
}

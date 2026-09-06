import JsonLd from './JsonLd';
import { SITE_URL, BUSINESS } from '@/lib/seo/business';
import { COUNTRY_CODES, deliveryWindowFor } from '@/lib/shop/shipping';

/**
 * Google will not show shipping or returns in a merchant listing unless the
 * Offer states them, and flags both as missing in Search Console otherwise.
 * Both facts below are already printed on the product page: free delivery to
 * every EU country we sell to, and the 14-day withdrawal right.
 *
 * returnFees is deliberately absent. Who pays return postage isn't stated
 * anywhere on the site, and under EU law that means the customer does unless
 * the trader says otherwise — claiming free returns here would be a promise
 * the shop hasn't made.
 */

/** Days between payment and handing the parcel to the carrier. */
const HANDLING_DAYS = { min: 0, max: 2 } as const;

/** How long the advertised price is guaranteed. Google wants a date on Offers. */
function priceValidUntil(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().slice(0, 10);
}

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
    images: string[];
    deliveryMinDays?: number | null;
    deliveryMaxDays?: number | null;
  };
  locale: string;
}) {
  const isPt = locale === 'pt';
  const url = `${SITE_URL}/${locale}/shop/${product.slug}`;
  const delivery = deliveryWindowFor(product);

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
          // Made to order: orderable at any time, delivered within the window
          // advertised on the page.
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          priceValidUntil: priceValidUntil(),
          seller: { '@type': 'Organization', name: BUSINESS.name, url: SITE_URL },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: '0',
              currency: 'EUR',
            },
            shippingDestination: {
              '@type': 'DefinedRegion',
              addressCountry: COUNTRY_CODES,
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: HANDLING_DAYS.min,
                maxValue: HANDLING_DAYS.max,
                unitCode: 'DAY',
              },
              transitTime: {
                '@type': 'QuantitativeValue',
                minValue: delivery.min,
                maxValue: delivery.max,
                unitCode: 'DAY',
              },
            },
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: COUNTRY_CODES,
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 14,
            returnMethod: 'https://schema.org/ReturnByMail',
          },
        },
      }}
    />
  );
}

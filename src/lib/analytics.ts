/**
 * GA4 e-commerce events for the shop.
 *
 * The Google tag is already loaded site-wide in [locale]/layout.tsx, but until
 * now it only ever saw page views — so the funnel (viewed → added → checkout →
 * paid) was invisible, and Google Ads had no purchase conversion to optimise
 * against. These are the standard GA4 recommended-event names; renaming them
 * breaks the built-in Monetisation reports, so don't.
 *
 * Every call is a no-op when gtag is missing (an ad blocker, a consent banner,
 * SSR). Analytics must never be able to break the shop.
 */

export const CURRENCY = 'EUR';

/** GA4 recommended-event item shape. */
export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  item_brand?: string;
  item_category?: string;
};

type Gtag = (command: 'event', name: string, params: Record<string, unknown>) => void;

function gtag(): Gtag | null {
  if (typeof window === 'undefined') return null;
  const fn = (window as unknown as { gtag?: Gtag }).gtag;
  return typeof fn === 'function' ? fn : null;
}

function send(name: string, params: Record<string, unknown>): void {
  gtag()?.('event', name, params);
}

/** Sums a basket the way GA4 expects `value`: price × quantity, rounded to cents. */
export function itemsValue(items: AnalyticsItem[]): number {
  return Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100;
}

type ProductLike = {
  id: string;
  namePt: string;
  nameEn: string;
  price: number;
  brand?: string | null;
  category?: string | null;
};

/** Maps a product to a GA4 item. Names follow the locale so reports stay readable. */
export function toItem(
  product: ProductLike,
  locale: string,
  quantity = 1,
): AnalyticsItem {
  return {
    item_id: product.id,
    item_name: locale === 'pt' ? product.namePt : product.nameEn,
    price: product.price,
    quantity,
    ...(product.brand ? { item_brand: product.brand } : {}),
    ...(product.category ? { item_category: product.category } : {}),
  };
}

export function trackViewItem(items: AnalyticsItem[]): void {
  send('view_item', { currency: CURRENCY, value: itemsValue(items), items });
}

export function trackAddToCart(items: AnalyticsItem[]): void {
  send('add_to_cart', { currency: CURRENCY, value: itemsValue(items), items });
}

export function trackRemoveFromCart(items: AnalyticsItem[]): void {
  send('remove_from_cart', { currency: CURRENCY, value: itemsValue(items), items });
}

export function trackViewCart(items: AnalyticsItem[]): void {
  send('view_cart', { currency: CURRENCY, value: itemsValue(items), items });
}

export function trackBeginCheckout(items: AnalyticsItem[]): void {
  send('begin_checkout', { currency: CURRENCY, value: itemsValue(items), items });
}

/**
 * Fires once per order. The success page is a plain URL the customer can
 * reload, bookmark or reach twice from their inbox, so the transaction id is
 * remembered locally — otherwise one sale is counted as three and every
 * conversion-based bid Google makes is wrong.
 */
export function trackPurchase(params: {
  transactionId: string;
  value: number;
  shipping: number;
  items: AnalyticsItem[];
}): void {
  const key = `jetwash24.ga.purchase.${params.transactionId}`;

  try {
    if (window.localStorage.getItem(key)) return;
    window.localStorage.setItem(key, '1');
  } catch {
    // Storage blocked (private mode): send it anyway. GA4 also de-duplicates
    // on transaction_id, so an occasional double is better than a missed sale.
  }

  send('purchase', {
    transaction_id: params.transactionId,
    currency: CURRENCY,
    value: params.value,
    shipping: params.shipping,
    items: params.items,
  });
}

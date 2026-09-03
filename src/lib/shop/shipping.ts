/**
 * Shipping rules for the shop. Portugal only for now.
 *
 * Everything the business can change lives in this file: rates, free-shipping
 * thresholds and the postal-code ranges that separate mainland from islands.
 * Prices are gross (IVA included), like every other price on the site.
 */

export type ShippingZone = 'CONTINENTAL' | 'ISLANDS';

export const SHIPPING_RATES: Record<
  ShippingZone,
  { cost: number; freeFrom: number }
> = {
  CONTINENTAL: { cost: 4.9, freeFrom: 50 },
  ISLANDS: { cost: 11.9, freeFrom: 120 },
};

/** Below this order value we don't ship at all (keeps postage from eating the sale). */
export const MIN_ORDER_TOTAL = 10;

/** Accepts "8800-076" and "8800076"; returns the normalised "NNNN-NNN" form or null. */
export function normalisePostalCode(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  if (digits.length !== 7) return null;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}

/**
 * Madeira and the Azores share the 9xxx block; everything else is mainland.
 * An unparseable code falls back to mainland — the checkout validates the
 * format before this runs, so the fallback only guards against bad data.
 */
export function zoneForPostalCode(postalCode: string): ShippingZone {
  const normalised = normalisePostalCode(postalCode);
  if (!normalised) return 'CONTINENTAL';
  const prefix = Number(normalised.slice(0, 4));
  return prefix >= 9000 && prefix <= 9999 ? 'ISLANDS' : 'CONTINENTAL';
}

/** Shipping charged for a given subtotal in a given zone (0 once free shipping kicks in). */
export function shippingCostFor(subtotal: number, zone: ShippingZone): number {
  const rate = SHIPPING_RATES[zone];
  return subtotal >= rate.freeFrom ? 0 : rate.cost;
}

/** How much more the customer needs to spend for free shipping (null once reached). */
export function amountToFreeShipping(
  subtotal: number,
  zone: ShippingZone = 'CONTINENTAL',
): number | null {
  const missing = SHIPPING_RATES[zone].freeFrom - subtotal;
  return missing > 0 ? Math.round(missing * 100) / 100 : null;
}

export const ZONE_LABEL: Record<ShippingZone, { pt: string; en: string }> = {
  CONTINENTAL: { pt: 'Portugal Continental', en: 'Mainland Portugal' },
  ISLANDS: { pt: 'Madeira e Açores', en: 'Madeira & Azores' },
};

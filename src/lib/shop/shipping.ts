/**
 * Shipping rules for the shop: the 27 EU countries.
 *
 * Everything the business can change lives in this file — the country list,
 * which zone each country belongs to, the rates and the free-shipping
 * thresholds. Prices are gross (IVA included), like every other price on the
 * site.
 *
 * Only EU countries are offered on purpose: no customs declarations, no import
 * charges landing on the customer at the door. Adding the UK, Switzerland or
 * Norway is not just a line in COUNTRIES — those need customs paperwork per
 * parcel.
 */

export type ShippingZone =
  | 'PT_MAINLAND'
  | 'PT_ISLANDS'
  | 'ES'
  | 'EU_WEST'
  | 'EU_EAST';

/**
 * Shipping is free everywhere, on purpose — it is a marketing position, not a
 * cost that happens to be zero. The postage is absorbed by the product margin,
 * so price accordingly.
 *
 * The zone machinery stays in place so charging can be switched back on
 * without touching the checkout. The rates that were costed before free
 * shipping, if you ever need them again:
 *   PT_MAINLAND 4,90€ (free from 50€) · PT_ISLANDS 11,90€ (120€)
 *   ES 6,90€ (75€) · EU_WEST 12,90€ (150€) · EU_EAST 19,90€ (200€)
 */
export const SHIPPING_RATES: Record<
  ShippingZone,
  { cost: number; freeFrom: number }
> = {
  PT_MAINLAND: { cost: 0, freeFrom: 0 },
  PT_ISLANDS: { cost: 0, freeFrom: 0 },
  ES: { cost: 0, freeFrom: 0 },
  EU_WEST: { cost: 0, freeFrom: 0 },
  EU_EAST: { cost: 0, freeFrom: 0 },
};

/** True while every zone ships free — drives the copy shown across the shop. */
export const FREE_SHIPPING = Object.values(SHIPPING_RATES).every(
  (rate) => rate.cost === 0,
);

/**
 * Below this order value we don't ship at all. With free shipping the postage
 * comes out of the margin, so a 4€ order would be sold at a loss.
 */
export const MIN_ORDER_TOTAL = 10;

/**
 * Default delivery window in working days, used by any product that does not
 * declare its own. Products stocked in an EU warehouse override it and arrive
 * much sooner.
 */
export const DELIVERY_DAYS = { min: 7, max: 15 } as const;

/** The window to advertise for one product, falling back to the shop default. */
export function deliveryWindowFor(product: {
  deliveryMinDays?: number | null;
  deliveryMaxDays?: number | null;
}): { min: number; max: number } {
  return {
    min: product.deliveryMinDays ?? DELIVERY_DAYS.min,
    max: product.deliveryMaxDays ?? DELIVERY_DAYS.max,
  };
}

/**
 * The window to advertise for a basket. A mixed order is only complete when
 * its slowest item lands, so the upper bound is the slowest of them all —
 * quoting anything shorter is a promise the order cannot keep.
 */
export function deliveryWindowForBasket(
  items: { deliveryMinDays?: number | null; deliveryMaxDays?: number | null }[],
): { min: number; max: number } {
  if (items.length === 0) return { ...DELIVERY_DAYS };
  const windows = items.map(deliveryWindowFor);
  return {
    min: Math.min(...windows.map((w) => w.min)),
    max: Math.max(...windows.map((w) => w.max)),
  };
}

type Country = {
  code: string;
  pt: string;
  en: string;
  zone: Exclude<ShippingZone, 'PT_MAINLAND' | 'PT_ISLANDS'> | 'PT';
};

/**
 * The 27 EU member states, Portugal first and then alphabetical in Portuguese.
 * Portugal carries the placeholder zone 'PT' because its real zone (mainland
 * or islands) depends on the postal code.
 */
export const COUNTRIES: Country[] = [
  { code: 'PT', pt: 'Portugal', en: 'Portugal', zone: 'PT' },
  { code: 'DE', pt: 'Alemanha', en: 'Germany', zone: 'EU_WEST' },
  { code: 'AT', pt: 'Áustria', en: 'Austria', zone: 'EU_WEST' },
  { code: 'BE', pt: 'Bélgica', en: 'Belgium', zone: 'EU_WEST' },
  { code: 'BG', pt: 'Bulgária', en: 'Bulgaria', zone: 'EU_EAST' },
  { code: 'CY', pt: 'Chipre', en: 'Cyprus', zone: 'EU_EAST' },
  { code: 'HR', pt: 'Croácia', en: 'Croatia', zone: 'EU_EAST' },
  { code: 'DK', pt: 'Dinamarca', en: 'Denmark', zone: 'EU_WEST' },
  { code: 'SK', pt: 'Eslováquia', en: 'Slovakia', zone: 'EU_EAST' },
  { code: 'SI', pt: 'Eslovénia', en: 'Slovenia', zone: 'EU_EAST' },
  { code: 'ES', pt: 'Espanha', en: 'Spain', zone: 'ES' },
  { code: 'EE', pt: 'Estónia', en: 'Estonia', zone: 'EU_EAST' },
  { code: 'FI', pt: 'Finlândia', en: 'Finland', zone: 'EU_WEST' },
  { code: 'FR', pt: 'França', en: 'France', zone: 'EU_WEST' },
  { code: 'GR', pt: 'Grécia', en: 'Greece', zone: 'EU_EAST' },
  { code: 'HU', pt: 'Hungria', en: 'Hungary', zone: 'EU_EAST' },
  { code: 'IE', pt: 'Irlanda', en: 'Ireland', zone: 'EU_WEST' },
  { code: 'IT', pt: 'Itália', en: 'Italy', zone: 'EU_WEST' },
  { code: 'LV', pt: 'Letónia', en: 'Latvia', zone: 'EU_EAST' },
  { code: 'LT', pt: 'Lituânia', en: 'Lithuania', zone: 'EU_EAST' },
  { code: 'LU', pt: 'Luxemburgo', en: 'Luxembourg', zone: 'EU_WEST' },
  { code: 'MT', pt: 'Malta', en: 'Malta', zone: 'EU_EAST' },
  { code: 'NL', pt: 'Países Baixos', en: 'Netherlands', zone: 'EU_WEST' },
  { code: 'PL', pt: 'Polónia', en: 'Poland', zone: 'EU_EAST' },
  { code: 'CZ', pt: 'República Checa', en: 'Czechia', zone: 'EU_EAST' },
  { code: 'RO', pt: 'Roménia', en: 'Romania', zone: 'EU_EAST' },
  { code: 'SE', pt: 'Suécia', en: 'Sweden', zone: 'EU_WEST' },
];

export const COUNTRY_CODES = COUNTRIES.map((c) => c.code);

export function countryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code.toUpperCase());
}

export function countryLabel(code: string, locale: string): string {
  const country = countryByCode(code);
  if (!country) return code;
  return locale === 'pt' ? country.pt : country.en;
}

/**
 * Postal codes only need to be plausible outside Portugal — carriers correct
 * the rest, and rejecting a valid foreign format is worse than accepting a
 * sloppy one. Portuguese codes are normalised to NNNN-NNN because the
 * mainland/islands split depends on reading them.
 */
export function normalisePostalCode(input: string, country = 'PT'): string | null {
  const trimmed = input.trim();

  if (country.toUpperCase() === 'PT') {
    const digits = trimmed.replace(/\D/g, '');
    if (digits.length !== 7) return null;
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }

  return /^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(trimmed) ? trimmed.toUpperCase() : null;
}

/**
 * Madeira and the Azores share the 9xxx block, so a Portuguese order is only
 * placed in a zone after its postal code is read. Everything else follows its
 * country.
 */
export function zoneFor(country: string, postalCode: string): ShippingZone {
  const entry = countryByCode(country);
  if (!entry) return 'EU_EAST'; // Unknown country: charge the highest rate, never the lowest.
  if (entry.zone !== 'PT') return entry.zone;

  const normalised = normalisePostalCode(postalCode, 'PT');
  if (!normalised) return 'PT_MAINLAND';
  const prefix = Number(normalised.slice(0, 4));
  return prefix >= 9000 && prefix <= 9999 ? 'PT_ISLANDS' : 'PT_MAINLAND';
}

/** Shipping charged for a given subtotal in a given zone (0 once free shipping kicks in). */
export function shippingCostFor(subtotal: number, zone: ShippingZone): number {
  const rate = SHIPPING_RATES[zone];
  return subtotal >= rate.freeFrom ? 0 : rate.cost;
}

/** How much more the customer needs to spend for free shipping (null once reached). */
export function amountToFreeShipping(
  subtotal: number,
  zone: ShippingZone = 'PT_MAINLAND',
): number | null {
  const missing = SHIPPING_RATES[zone].freeFrom - subtotal;
  return missing > 0 ? Math.round(missing * 100) / 100 : null;
}

export const ZONE_LABEL: Record<ShippingZone, { pt: string; en: string }> = {
  PT_MAINLAND: { pt: 'Portugal Continental', en: 'Mainland Portugal' },
  PT_ISLANDS: { pt: 'Madeira e Açores', en: 'Madeira & Azores' },
  ES: { pt: 'Espanha', en: 'Spain' },
  EU_WEST: { pt: 'Europa Ocidental', en: 'Western Europe' },
  EU_EAST: { pt: 'Resto da União Europeia', en: 'Rest of the EU' },
};

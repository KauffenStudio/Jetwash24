/**
 * Summer 2026 promotion — single source of truth.
 *
 * Everything about the campaign (price, deadline, which service it books)
 * lives here so the popup, the booking wizard and any future banner can never
 * drift apart. To end the campaign early, set `PROMO.endsAt` to a past date —
 * every surface hides itself automatically, no code changes needed.
 *
 * The matching bookable service is seeded in prisma/seed.ts as
 * `svc-summer-promo`; deactivate it there (isActive: false) once the campaign
 * is over, otherwise it stays selectable in the wizard after the popup is gone.
 */

/** Service id the promo CTA pre-selects in the booking wizard. */
export const PROMO_SERVICE_ID = 'svc-summer-promo';

/**
 * End of the campaign, in Lisbon time (WEST, UTC+1 in September).
 *
 * The brief said "31 de setembro", a day that does not exist — September has
 * 30 days — so the deadline is the last real moment of the month.
 */
export const PROMO_ENDS_AT = new Date('2026-09-30T23:59:59+01:00');

export const PROMO = {
  serviceId: PROMO_SERVICE_ID,
  endsAt: PROMO_ENDS_AT,
  /** Promotional price for a small car, before vehicle-size adjustments. */
  price: 29.9,
  /**
   * What the bundle costs booked separately: the express exterior wash and
   * the express interior are 19,90€ each as of 23 August 2026.
   *
   * This must stay equal to the sum of those two live prices. Announcing a
   * reduction against a reference price that was never charged is what the
   * price-indication rules (DL 109-G/2021) exist to stop, so if either
   * service moves, this moves with it — scripts/seed-summer-promo.mjs checks
   * the sum against the database and warns when they disagree.
   */
  compareAtPrice: 39.8,
  /** localStorage key — versioned so a future campaign is not pre-dismissed. */
  storageKey: 'jw24:promo:summer-2026:dismissed',
} as const;

/** Amount saved versus booking the two services separately. */
export const PROMO_SAVING = PROMO.compareAtPrice - PROMO.price;

/**
 * Whether the campaign is still running.
 *
 * Takes `now` so callers on the server (which may render ahead of the client)
 * and the countdown tick can both ask the same question.
 */
export function isPromoLive(now: Date = new Date()): boolean {
  return now.getTime() < PROMO.endsAt.getTime();
}

/** Milliseconds left, floored at 0 so a finished campaign never goes negative. */
export function promoTimeLeft(now: Date = new Date()): number {
  return Math.max(0, PROMO.endsAt.getTime() - now.getTime());
}

/** Splits the remaining milliseconds into the countdown's four cells. */
export function splitCountdown(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

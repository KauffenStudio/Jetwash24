import Stripe from 'stripe';

// Reservation deposit charged online to prevent no-shows.
// Deducted from the total — the customer pays the remainder on-site.
export const DEPOSIT_AMOUNT = 5; // euros

let _stripe: Stripe | null = null;

/**
 * Lazily instantiate the Stripe client so the app still builds/runs when
 * STRIPE_SECRET_KEY is not configured yet (booking then falls back to the
 * no-deposit flow). Throws only if actually used without a key.
 */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    _stripe = new Stripe(key, { apiVersion: '2024-06-20' });
  }
  return _stripe;
}

/** Whether Stripe is configured well enough to take the deposit. */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

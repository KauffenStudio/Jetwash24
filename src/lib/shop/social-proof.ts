import { prisma } from '@/lib/prisma';

/**
 * "X pessoas compraram nas últimas 24 horas" — social proof counted from real
 * paid orders, never invented.
 *
 * Fabricating this number is not a style choice in the EU: the Omnibus
 * Directive (EU) 2019/2161, transposed in Portugal by DL 109-G/2021, added
 * false social proof and false urgency to the UCPD Annex I blacklist — banned
 * outright, with fines reaching 4% of turnover. It is also trivially
 * falsifiable by anyone who watches the page for an hour.
 *
 * So the count is a query, and the component renders nothing until the shop
 * has genuinely sold enough for the claim to be true.
 */

/** Statuses that mean money actually changed hands. */
const SOLD = ['PAID', 'SHIPPED', 'DELIVERED'] as const;

/**
 * Below this, don't show anything. "1 pessoa comprou este produto" advertises
 * that almost nobody buys here — worse than staying quiet.
 */
export const PROOF_MIN_BUYERS = 3;

/**
 * Windows from tightest to widest. The tightest one that clears the threshold
 * wins, so the copy sharpens by itself as the shop grows: a quiet month says
 * "nos últimos 30 dias", a busy launch day says "na última hora".
 */
const WINDOWS = [
  { hours: 1, pt: 'na última hora', en: 'in the last hour' },
  { hours: 24, pt: 'nas últimas 24 horas', en: 'in the last 24 hours' },
  { hours: 24 * 7, pt: 'nos últimos 7 dias', en: 'in the last 7 days' },
  { hours: 24 * 30, pt: 'nos últimos 30 dias', en: 'in the last 30 days' },
] as const;

const WIDEST_HOURS = WINDOWS[WINDOWS.length - 1].hours;

export type PurchaseProof = {
  /** Distinct buyers — people, not units. */
  buyers: number;
  windowPt: string;
  windowEn: string;
};

/**
 * Counts distinct paid orders containing `productId`, then reports it against
 * the tightest window that still clears PROOF_MIN_BUYERS.
 *
 * Returns null when there is nothing honest to claim — the caller renders
 * nothing at all rather than a weak number.
 */
export async function purchaseProofFor(productId: string): Promise<PurchaseProof | null> {
  const since = new Date(Date.now() - WIDEST_HOURS * 60 * 60 * 1000);

  // One query for the widest window; the narrower ones are counted in memory.
  // Orders count once each however many units they contain — the claim is
  // about people, and two towels in one basket is still one buyer.
  const orders = await prisma.order.findMany({
    where: {
      status: { in: [...SOLD] },
      paidAt: { gte: since },
      items: { some: { productId } },
    },
    select: { paidAt: true },
  });

  if (orders.length < PROOF_MIN_BUYERS) return null;

  const now = Date.now();
  for (const window of WINDOWS) {
    const cutoff = now - window.hours * 60 * 60 * 1000;
    const buyers = orders.filter((o) => o.paidAt !== null && o.paidAt.getTime() >= cutoff).length;

    if (buyers >= PROOF_MIN_BUYERS) {
      return { buyers, windowPt: window.pt, windowEn: window.en };
    }
  }

  return null;
}

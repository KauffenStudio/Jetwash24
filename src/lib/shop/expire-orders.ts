import { prisma } from '@/lib/prisma';

/**
 * Closing an unpaid order. Products are made to order, so nothing has to go
 * back on a shelf — this only stops abandoned checkouts from sitting in the
 * order list forever. The conditional update makes it safe for the three
 * callers that race here: the cron, the Stripe `checkout.session.expired`
 * event, and the sweep before the next checkout.
 */
export async function releaseOrder(orderId: string): Promise<boolean> {
  const claimed = await prisma.order.updateMany({
    where: { id: orderId, status: 'PENDING' },
    data: { status: 'EXPIRED', paymentExpiresAt: null },
  });
  return claimed.count === 1;
}

/** Expires every unpaid order whose hold has run out. Returns how many were closed. */
export async function releaseExpiredOrders(): Promise<number> {
  const stale = await prisma.order.findMany({
    where: { status: 'PENDING', paymentExpiresAt: { lt: new Date() } },
    select: { id: true },
  });

  let released = 0;
  for (const { id } of stale) {
    if (await releaseOrder(id)) released += 1;
  }
  return released;
}

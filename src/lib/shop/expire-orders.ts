import { prisma } from '@/lib/prisma';

/**
 * Releasing an unpaid order: mark it EXPIRED and put its reserved units back on
 * the shelf. Guarded by a conditional update so two callers racing (the cron,
 * the Stripe `checkout.session.expired` event, the opportunistic sweep on the
 * next checkout) can never restock the same order twice.
 */
export async function releaseOrder(orderId: string): Promise<boolean> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order || order.status !== 'PENDING') return false;

  return prisma.$transaction(async (tx) => {
    const claimed = await tx.order.updateMany({
      where: { id: orderId, status: 'PENDING' },
      data: { status: 'EXPIRED', paymentExpiresAt: null },
    });
    if (claimed.count !== 1) return false;

    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }
    return true;
  });
}

/** Releases every unpaid order whose hold has run out. Returns how many were freed. */
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

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendOrderShippedEmail } from '@/lib/order-emails';

const updateSchema = z.object({
  status: z.enum(['PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).optional(),
  trackingCode: z.string().max(60).nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
});

// Statuses that mean the goods are no longer going out, so reserved units go
// back on the shelf. Only applied on the transition into one of them.
const RESTOCKING_STATUSES = ['CANCELLED', 'REFUNDED'] as const;

// PATCH /api/orders/[id] — Admin only: fulfilment status and tracking code.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const existing = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const { status, trackingCode, notes } = parsed.data;
  const becomesShipped = status === 'SHIPPED' && existing.status !== 'SHIPPED';
  const becomesCancelled =
    status !== undefined &&
    (RESTOCKING_STATUSES as readonly string[]).includes(status) &&
    !(RESTOCKING_STATUSES as readonly string[]).includes(existing.status);

  const order = await prisma.$transaction(async (tx) => {
    if (becomesCancelled) {
      for (const item of existing.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    return tx.order.update({
      where: { id: params.id },
      data: {
        ...(status ? { status } : {}),
        ...(trackingCode !== undefined ? { trackingCode } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(becomesShipped ? { shippedAt: new Date() } : {}),
        ...(becomesCancelled ? { cancelledAt: new Date() } : {}),
      },
      include: { items: true },
    });
  });

  if (becomesShipped) {
    await sendOrderShippedEmail(order);
  }

  return NextResponse.json(order);
}

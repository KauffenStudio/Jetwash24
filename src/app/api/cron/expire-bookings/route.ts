import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { releaseExpiredOrders } from '@/lib/shop/expire-orders';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();

  const result = await prisma.booking.updateMany({
    where: {
      status: 'PENDING',
      paymentExpiresAt: { lt: now },
    },
    data: { status: 'EXPIRED' },
  });

  // Shop orders that were never paid: free the stock they were holding.
  const ordersExpired = await releaseExpiredOrders();

  return NextResponse.json({ expired: result.count, ordersExpired });
}

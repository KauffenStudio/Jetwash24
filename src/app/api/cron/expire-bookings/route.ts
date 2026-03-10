import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await prisma.booking.updateMany({
    where: {
      status: 'PENDING',
      paymentExpiresAt: { lt: new Date() },
    },
    data: { status: 'EXPIRED' },
  });

  return NextResponse.json({ expired: result.count });
}

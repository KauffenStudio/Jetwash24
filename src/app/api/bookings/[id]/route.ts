import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/bookings/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      service: true,
      addons: { include: { addon: true } },
    },
  });

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  return NextResponse.json(booking);
}

// PATCH /api/bookings/:id — Cancel or complete (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { action, note } = body;

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { customer: true, service: true, addons: { include: { addon: true } } },
  });

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  if (action === 'cancel') {
    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellationNote: note ?? null,
      },
    });

    return NextResponse.json(updated);
  }

  if (action === 'complete') {
    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: { status: 'COMPLETED' },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { parseISO, startOfDay, endOfDay } from 'date-fns';

const createSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  reason: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const dateParam = searchParams.get('date');

  if (dateParam) {
    const date = parseISO(dateParam);
    const slots = await prisma.blockedSlot.findMany({
      where: {
        date: { gte: startOfDay(date), lte: endOfDay(date) },
      },
      orderBy: { startTime: 'asc' },
    });
    return NextResponse.json(slots);
  }

  const slots = await prisma.blockedSlot.findMany({
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });
  return NextResponse.json(slots);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { date, startTime, endTime, reason } = parsed.data;

  const slot = await prisma.blockedSlot.create({
    data: {
      date: parseISO(date),
      startTime,
      endTime,
      reason: reason ?? null,
    },
  });

  return NextResponse.json(slot, { status: 201 });
}

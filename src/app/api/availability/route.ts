import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/availability';
import { z } from 'zod';

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  duration: z.coerce.number().int().positive(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const parsed = querySchema.safeParse({
    date: searchParams.get('date'),
    duration: searchParams.get('duration'),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { date, duration } = parsed.data;

  // Don't allow past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const requested = new Date(date);
  if (requested < today) {
    return NextResponse.json({ slots: [], date, duration });
  }

  try {
    const slots = await getAvailableSlots(date, duration);
    return NextResponse.json({ slots, date, duration });
  } catch (err) {
    console.error('Availability error:', err);
    return NextResponse.json({ error: 'Failed to get availability' }, { status: 500 });
  }
}

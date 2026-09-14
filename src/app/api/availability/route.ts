import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/availability';
import { earliestBookableDate } from '@/lib/booking-window';
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

  // Answer early for dates that can never have slots. getAvailableSlots
  // enforces the same rule, so this only saves the database round-trip; the
  // `earliest` field lets the wizard show why a date is unavailable.
  const earliest = earliestBookableDate();
  if (date < earliest) {
    return NextResponse.json({ slots: [], date, duration, earliest });
  }

  try {
    const slots = await getAvailableSlots(date, duration);
    return NextResponse.json({ slots, date, duration, earliest });
  } catch (err) {
    console.error('Availability error:', err);
    return NextResponse.json({ error: 'Failed to get availability' }, { status: 500 });
  }
}

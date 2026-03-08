import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { formatDurationLabel } from '@/lib/utils';
import { z } from 'zod';

const schema = z.object({
  bookingId: z.string().min(1),
  locale: z.enum(['pt', 'en']).default('pt'),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { bookingId, locale } = parsed.data;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: true,
      service: true,
      addons: { include: { addon: true } },
    },
  });

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  if (booking.status !== 'PENDING') {
    return NextResponse.json({ error: 'Booking is not in pending state' }, { status: 400 });
  }

  const serviceName = locale === 'pt' ? booking.service.namePt : booking.service.nameEn;
  const addonsNames = booking.addons.map((a) =>
    locale === 'pt' ? a.addon.namePt : a.addon.nameEn,
  );

  const description = [
    `${booking.startTime} — ${booking.endTime}`,
    booking.date instanceof Date
      ? booking.date.toLocaleDateString(locale === 'pt' ? 'pt-PT' : 'en-GB')
      : new Date(booking.date).toLocaleDateString(locale === 'pt' ? 'pt-PT' : 'en-GB'),
    addonsNames.length > 0 ? `Extras: ${addonsNames.join(', ')}` : null,
    `${locale === 'pt' ? 'Duração' : 'Duration'}: ${formatDurationLabel(booking.totalDuration, locale)}`,
    `${booking.customer.carModel} • ${booking.customer.licensePlate}`,
  ]
    .filter(Boolean)
    .join(' | ');

  const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: booking.customer.email,
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `JetWash24 — ${serviceName}`,
            description,
          },
          unit_amount: Math.round(booking.totalPrice * 100), // cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingId: booking.id,
    },
    success_url: `${baseUrl}/${locale}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/${locale}/booking/cancel?booking_id=${booking.id}`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min
    locale: locale === 'pt' ? 'pt' : 'en',
  });

  // Store the session ID on the booking
  await prisma.booking.update({
    where: { id: bookingId },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({ url: session.url });
}

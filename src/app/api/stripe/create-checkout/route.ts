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
  const depositAmount = booking.depositAmount > 0 ? booking.depositAmount : Math.max(5, Math.round(booking.totalPrice * 0.2 * 100) / 100);
  const remainingAmount = Math.round((booking.totalPrice - depositAmount) * 100) / 100;
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
    locale === 'pt'
      ? `Restante a pagar no local: €${remainingAmount.toFixed(2)}`
      : `Remaining to pay on-site: €${remainingAmount.toFixed(2)}`,
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
            name: locale === 'pt'
              ? `JetWash24 — ${serviceName} (Sinal)`
              : `JetWash24 — ${serviceName} (Deposit)`,
            description,
          },
          unit_amount: Math.round(depositAmount * 100), // cents — deposit only
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

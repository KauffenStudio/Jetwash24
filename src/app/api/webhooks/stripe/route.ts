import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendBookingEmails } from '@/lib/booking-emails';

export const runtime = 'nodejs';

const bookingInclude = {
  customer: true,
  service: true,
  addons: { include: { addon: true } },
} as const;

// POST /api/webhooks/stripe — Stripe sends events here.
// On successful deposit payment we confirm the booking and send the emails.
export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get('stripe-signature');

  if (!webhookSecret || !signature) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 400 });
  }

  // Raw body is required for signature verification.
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (bookingId && session.payment_status === 'paid') {
      const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

      // Idempotent: only act on a still-pending booking.
      if (booking && booking.status === 'PENDING') {
        const confirmed = await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: 'CONFIRMED',
            stripePaymentId:
              typeof session.payment_intent === 'string' ? session.payment_intent : null,
            paymentExpiresAt: null,
          },
          include: bookingInclude,
        });

        await sendBookingEmails(confirmed);
      }
    }
  }

  return NextResponse.json({ received: true });
}

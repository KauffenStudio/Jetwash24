import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendBookingEmails } from '@/lib/booking-emails';
import { sendOrderEmails } from '@/lib/order-emails';
import { releaseOrder } from '@/lib/shop/expire-orders';

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
    const orderId = session.metadata?.orderId;

    // ── Shop order paid: mark it PAID and send the receipt ──
    if (orderId && session.payment_status === 'paid') {
      const order = await prisma.order.findUnique({ where: { id: orderId } });

      // Idempotent: Stripe retries, and only a still-pending order should move.
      if (order && order.status === 'PENDING') {
        const paid = await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'PAID',
            paidAt: new Date(),
            stripePaymentId:
              typeof session.payment_intent === 'string' ? session.payment_intent : null,
            paymentExpiresAt: null,
          },
          include: { items: true },
        });

        await sendOrderEmails(paid);
      }
    }

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

  // Abandoned shop checkout: free the stock the order was holding right away
  // instead of waiting for the nightly sweep.
  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) await releaseOrder(orderId);
  }

  return NextResponse.json({ received: true });
}

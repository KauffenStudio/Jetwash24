import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getAvailableSlots, calculateEndTime } from '@/lib/availability';
import { getVehicleAdjustment } from '@/lib/utils';
import { sendBookingEmails } from '@/lib/booking-emails';
import { getStripe, isStripeConfigured, DEPOSIT_AMOUNT } from '@/lib/stripe';
import { z } from 'zod';
import { parseISO, startOfDay, endOfDay } from 'date-fns';

// How long a PENDING (unpaid) booking holds its slot before expiring.
// Kept just above Stripe Checkout's 30-minute minimum session lifetime.
const HOLD_MINUTES = 31;

const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'https://www.jetwash24.com';

const customerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(6),
  carModel: z.string().min(1),
  licensePlate: z.string().min(1),
  notes: z.string().optional(),
});

const createBookingSchema = z.object({
  vehicleSize: z.enum(['SMALL', 'MEDIUM', 'SUV', 'LARGE']),
  serviceId: z.string().min(1),
  addonIds: z.array(z.string()),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  customer: customerSchema,
  totalPrice: z.number().positive(),
  totalDuration: z.number().int().positive(),
  vehicleAdjustment: z.number(),
  locale: z.enum(['pt', 'en']).optional().default('pt'),
  captchaToken: z.string().min(1).optional(),
});

const bookingInclude = {
  customer: true,
  service: true,
  addons: { include: { addon: true } },
} as const;

// GET /api/bookings — Admin/Worker only
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const dateParam = searchParams.get('date');
  const statusParam = searchParams.get('status');
  const limitParam = searchParams.get('limit');

  const where: Record<string, unknown> = {};

  if (dateParam) {
    const date = parseISO(dateParam);
    where.date = { gte: startOfDay(date), lte: endOfDay(date) };
  }

  if (statusParam) {
    where.status = statusParam;
  } else {
    where.status = { in: ['CONFIRMED', 'PENDING', 'COMPLETED'] };
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: bookingInclude,
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    take: limitParam ? parseInt(limitParam) : undefined,
  });

  return NextResponse.json(bookings);
}

// POST /api/bookings — Create a booking.
// With Stripe configured: creates a PENDING booking + a Checkout Session for
// the deposit, and returns a checkoutUrl to redirect the customer to.
// Without Stripe: confirms the booking directly (no deposit) and emails it.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createBookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const {
    vehicleSize,
    serviceId,
    addonIds,
    date,
    startTime,
    customer: customerData,
    locale,
  } = parsed.data;

  // Verify the service exists
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  // Verify addons exist
  const addons = addonIds.length > 0
    ? await prisma.addon.findMany({ where: { id: { in: addonIds } } })
    : [];

  // Recalculate price server-side to prevent tampering
  const addonsDuration = addons.reduce((sum, a) => sum + a.duration, 0);
  const addonsPrice = addons.reduce((sum, a) => sum + a.price, 0);
  const vehicleAdj = getVehicleAdjustment(vehicleSize);
  const calculatedPrice = service.price + vehicleAdj + addonsPrice;
  const calculatedDuration = service.duration + addonsDuration;

  // Re-check availability (prevent race conditions)
  const availableSlots = await getAvailableSlots(date, calculatedDuration);
  if (!availableSlots.includes(startTime)) {
    return NextResponse.json(
      { error: 'Selected time slot is no longer available. Please choose another time.' },
      { status: 409 },
    );
  }

  const endTime = calculateEndTime(startTime, calculatedDuration);
  const bookingDate = parseISO(date);

  const takeDeposit = isStripeConfigured();
  // Deposit is deducted from the total; never exceeds the total.
  const depositAmount = takeDeposit ? Math.min(DEPOSIT_AMOUNT, calculatedPrice) : 0;
  const remainingAmount = calculatedPrice - depositAmount;
  const paymentExpiresAt = takeDeposit
    ? new Date(Date.now() + HOLD_MINUTES * 60 * 1000)
    : null;

  // Create or find customer
  const existingCustomer = await prisma.customer.findFirst({
    where: {
      email: customerData.email,
      licensePlate: customerData.licensePlate.toUpperCase(),
    },
  });

  let customerId: string;
  if (existingCustomer) {
    const updated = await prisma.customer.update({
      where: { id: existingCustomer.id },
      data: {
        name: customerData.name,
        phone: customerData.phone,
        carModel: customerData.carModel,
        notes: customerData.notes ?? null,
      },
    });
    customerId = updated.id;
  } else {
    const newCustomer = await prisma.customer.create({
      data: {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        carModel: customerData.carModel,
        licensePlate: customerData.licensePlate.toUpperCase(),
        notes: customerData.notes ?? null,
      },
    });
    customerId = newCustomer.id;
  }

  const booking = await prisma.booking.create({
    data: {
      customerId,
      serviceId,
      vehicleSize,
      date: bookingDate,
      startTime,
      endTime,
      totalDuration: calculatedDuration,
      totalPrice: calculatedPrice,
      vehicleAdjustment: vehicleAdj,
      depositAmount,
      remainingAmount,
      paymentExpiresAt,
      status: takeDeposit ? 'PENDING' : 'CONFIRMED',
      addons: {
        create: addonIds.map((addonId) => ({ addonId })),
      },
    },
    include: bookingInclude,
  });

  // ── No Stripe: confirm immediately and email (legacy / fallback flow) ──
  if (!takeDeposit) {
    await sendBookingEmails(booking);
    return NextResponse.json(
      { bookingId: booking.id, totalPrice: calculatedPrice, depositAmount, remainingAmount },
      { status: 201 },
    );
  }

  // ── Stripe: create a Checkout Session for the deposit ──
  try {
    const checkout = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customerData.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(depositAmount * 100),
            product_data: {
              name: `Sinal de reserva — ${service.namePt}`,
              description: `Sinal descontado do total (${calculatedPrice.toFixed(2)}€). Restante de ${remainingAmount.toFixed(2)}€ pago no local.`,
            },
          },
        },
      ],
      metadata: { bookingId: booking.id },
      success_url: `${BASE_URL}/${locale}/booking/success?booking_id=${booking.id}`,
      cancel_url: `${BASE_URL}/${locale}/booking/cancel`,
      expires_at: Math.floor(Date.now() / 1000) + HOLD_MINUTES * 60,
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripeSessionId: checkout.id },
    });

    return NextResponse.json(
      { bookingId: booking.id, checkoutUrl: checkout.url, depositAmount, remainingAmount },
      { status: 201 },
    );
  } catch (err) {
    console.error('Stripe checkout creation failed:', err);
    // Roll back the held booking so the slot is freed immediately.
    await prisma.booking.delete({ where: { id: booking.id } }).catch(() => {});
    return NextResponse.json(
      { error: 'Não foi possível iniciar o pagamento. Tente novamente.' },
      { status: 502 },
    );
  }
}

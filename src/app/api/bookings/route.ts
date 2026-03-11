import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getAvailableSlots, calculateEndTime } from '@/lib/availability';
import { getVehicleAdjustment } from '@/lib/utils';
import { calculateDeposit } from '@/lib/deposit';
import { z } from 'zod';
import { parseISO, startOfDay, endOfDay } from 'date-fns';

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
});

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
    include: {
      customer: true,
      service: true,
      addons: { include: { addon: true } },
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    take: limitParam ? parseInt(limitParam) : undefined,
  });

  return NextResponse.json(bookings);
}

// POST /api/bookings — Create a pending booking
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
    totalDuration,
    vehicleAdjustment,
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
  const depositAmount = calculateDeposit(calculatedPrice);
  const remainingAmount = Math.round((calculatedPrice - depositAmount) * 100) / 100;

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

  // Create booking in PENDING state
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
      status: 'PENDING',
      paymentExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
      addons: {
        create: addonIds.map((addonId) => ({ addonId })),
      },
    },
    include: {
      customer: true,
      service: true,
      addons: { include: { addon: true } },
    },
  });

  return NextResponse.json({ bookingId: booking.id, totalPrice: calculatedPrice, depositAmount, remainingAmount }, { status: 201 });
}

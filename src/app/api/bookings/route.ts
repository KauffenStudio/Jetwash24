import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getAvailableSlots, calculateEndTime } from '@/lib/availability';
import { getVehicleAdjustment, formatDateShort, formatDurationLabel } from '@/lib/utils';
import { resend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/resend';
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
  captchaToken: z.string().min(1).optional(),
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
  const depositAmount = 0;
  const remainingAmount = calculatedPrice;

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
      status: 'CONFIRMED',
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

  const dateStr = formatDateShort(booking.date instanceof Date ? booking.date : new Date(booking.date));

  // Send confirmation email to customer
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: booking.customer.email,
      subject: `Reserva Confirmada — JetWash24 | ${dateStr} ${booking.startTime}`,
      html: buildCustomerEmailHtml(booking, dateStr),
    });
  } catch (err) {
    console.error('Customer email failed:', err);
  }

  // Send notification email to admin
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Nova Reserva — ${booking.customer.name} | ${dateStr} ${booking.startTime}`,
      html: buildAdminEmailHtml(booking, dateStr),
    });
  } catch (err) {
    console.error('Admin email failed:', err);
  }

  return NextResponse.json({ bookingId: booking.id, totalPrice: calculatedPrice, depositAmount, remainingAmount }, { status: 201 });
}

// ─── Email HTML builders ──────────────────────────────────────────────────────

type BookingWithDetails = {
  id: string;
  startTime: string;
  endTime: string;
  date: Date | string;
  totalDuration: number;
  totalPrice: number;
  customer: { name: string; email: string; phone: string; carModel: string; licensePlate: string; notes: string | null };
  service: { namePt: string; nameEn: string };
  addons: { addon: { namePt: string; nameEn: string; price: number } }[];
};

function buildCustomerEmailHtml(booking: BookingWithDetails, dateStr: string): string {
  const addonsHtml = booking.addons.length > 0
    ? booking.addons.map((a) => `<li>${a.addon.namePt} — +${a.addon.price}€</li>`).join('')
    : '<li>Nenhum</li>';

  return `
<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"><title>Reserva Confirmada</title></head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden;">
    <div style="background: #0A0A0A; padding: 32px; text-align: center;">
      <h1 style="color: #C9A84C; margin: 0; font-size: 24px; letter-spacing: 2px;">JETWASH24</h1>
      <p style="color: #fff; margin: 8px 0 0; font-size: 14px;">Detailing Profissional</p>
    </div>
    <div style="padding: 32px;">
      <h2 style="color: #0A0A0A; margin: 0 0 8px;">Reserva Confirmada!</h2>
      <p style="color: #525252; margin: 0 0 24px;">Olá ${booking.customer.name}, a sua reserva foi confirmada. Aqui estão os detalhes:</p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr style="border-bottom: 1px solid #E8E8E8;">
          <td style="padding: 12px 0; color: #737373; font-size: 14px;">Data</td>
          <td style="padding: 12px 0; font-weight: bold; text-align: right;">${dateStr}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E8E8E8;">
          <td style="padding: 12px 0; color: #737373; font-size: 14px;">Hora</td>
          <td style="padding: 12px 0; font-weight: bold; text-align: right;">${booking.startTime}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E8E8E8;">
          <td style="padding: 12px 0; color: #737373; font-size: 14px;">Serviço</td>
          <td style="padding: 12px 0; font-weight: bold; text-align: right;">${booking.service.namePt}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E8E8E8;">
          <td style="padding: 12px 0; color: #737373; font-size: 14px;">Veículo</td>
          <td style="padding: 12px 0; font-weight: bold; text-align: right;">${booking.customer.carModel}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E8E8E8;">
          <td style="padding: 12px 0; color: #737373; font-size: 14px;">Matrícula</td>
          <td style="padding: 12px 0; font-weight: bold; text-align: right;">${booking.customer.licensePlate}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E8E8E8;">
          <td style="padding: 12px 0; color: #737373; font-size: 14px;">Duração</td>
          <td style="padding: 12px 0; font-weight: bold; text-align: right;">${formatDurationLabel(booking.totalDuration, 'pt')}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #737373; font-size: 14px;">Total</td>
          <td style="padding: 12px 0; font-weight: bold; font-size: 18px; color: #C9A84C; text-align: right;">${booking.totalPrice.toFixed(2)}€</td>
        </tr>
      </table>

      ${booking.addons.length > 0 ? `
      <div style="margin-bottom: 24px;">
        <p style="color: #737373; font-size: 14px; margin: 0 0 8px;">Extras:</p>
        <ul style="margin: 0; padding-left: 20px; color: #0A0A0A;">${addonsHtml}</ul>
      </div>` : ''}

      <div style="background: #F3F3F3; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0 0 4px; font-weight: bold; font-size: 14px;">Morada:</p>
        <p style="margin: 0; color: #525252; font-size: 14px;">JetWash24, N125 610, 8800-076 Guia, Algarve</p>
        <p style="margin: 8px 0 0; color: #525252; font-size: 13px;">A 3 minutos a pé do Algarve Shopping</p>
      </div>

      <a href="https://maps.google.com/?q=N125+610,+8800-076+Guia,+Portugal"
         style="display: inline-block; background: #0A0A0A; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; margin-bottom: 24px;">
        Abrir no Google Maps
      </a>

      <div style="border-top: 1px solid #E8E8E8; padding-top: 16px;">
        <p style="color: #737373; font-size: 13px; margin: 0;">
          Cancelamento gratuito até 12 horas antes. Entre em contacto via WhatsApp: +351 928 380 478
        </p>
      </div>
    </div>
    <div style="background: #0A0A0A; padding: 20px; text-align: center;">
      <p style="color: #737373; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} JetWash24 Detailing. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>`;
}

function buildAdminEmailHtml(booking: BookingWithDetails, dateStr: string): string {
  const addonsNames = booking.addons.map((a) => a.addon.namePt).join(', ') || 'Nenhum';
  return `
<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"><title>Nova Reserva</title></head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 32px;">
    <h2 style="color: #0A0A0A; margin: 0 0 20px;">Nova Reserva — JetWash24</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #737373;">Data:</td><td style="padding: 8px 0; font-weight: bold;">${dateStr}</td></tr>
      <tr><td style="padding: 8px 0; color: #737373;">Hora:</td><td style="padding: 8px 0; font-weight: bold;">${booking.startTime} – ${booking.endTime}</td></tr>
      <tr><td style="padding: 8px 0; color: #737373;">Serviço:</td><td style="padding: 8px 0; font-weight: bold;">${booking.service.namePt}</td></tr>
      <tr><td style="padding: 8px 0; color: #737373;">Extras:</td><td style="padding: 8px 0;">${addonsNames}</td></tr>
      <tr><td style="padding: 8px 0; color: #737373;">Cliente:</td><td style="padding: 8px 0;">${booking.customer.name}</td></tr>
      <tr><td style="padding: 8px 0; color: #737373;">Email:</td><td style="padding: 8px 0;">${booking.customer.email}</td></tr>
      <tr><td style="padding: 8px 0; color: #737373;">Telefone:</td><td style="padding: 8px 0;">${booking.customer.phone}</td></tr>
      <tr><td style="padding: 8px 0; color: #737373;">Carro:</td><td style="padding: 8px 0;">${booking.customer.carModel}</td></tr>
      <tr><td style="padding: 8px 0; color: #737373;">Matrícula:</td><td style="padding: 8px 0;">${booking.customer.licensePlate}</td></tr>
      <tr><td style="padding: 8px 0; color: #737373;">Duração:</td><td style="padding: 8px 0;">${formatDurationLabel(booking.totalDuration, 'pt')}</td></tr>
      <tr><td style="padding: 8px 0; color: #737373; font-weight: bold;">Total:</td><td style="padding: 8px 0; font-weight: bold; color: #C9A84C; font-size: 18px;">${booking.totalPrice.toFixed(2)}€</td></tr>
    </table>
    ${booking.customer.notes ? `<p style="margin-top: 16px; color: #525252;"><strong>Notas:</strong> ${booking.customer.notes}</p>` : ''}
  </div>
</body>
</html>`;
}

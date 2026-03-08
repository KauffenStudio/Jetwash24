import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { resend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/resend';
import { triggerWhatsAppNotification, formatDateShort, formatDurationLabel } from '@/lib/utils';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // ─── Handle checkout.session.completed ───────────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      return NextResponse.json({ received: true });
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
        stripePaymentId: session.payment_intent as string,
      },
      include: {
        customer: true,
        service: true,
        addons: { include: { addon: true } },
      },
    });

    const dateStr = formatDateShort(booking.date instanceof Date ? booking.date : new Date(booking.date));
    const addonsNames = booking.addons.map((a) => a.addon.namePt);

    // Send customer confirmation email
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

    // Send admin notification email
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

    // Trigger WhatsApp webhook notification
    await triggerWhatsAppNotification({
      time: booking.startTime,
      date: dateStr,
      service: booking.service.namePt,
      carModel: booking.customer.carModel,
      customerName: booking.customer.name,
      extras: addonsNames,
      totalDuration: booking.totalDuration,
      phone: booking.customer.phone,
    });
  }

  // ─── Handle checkout.session.expired ─────────────────────────────────────────
  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED', cancelledAt: new Date() },
      }).catch(() => {}); // Ignore if already cancelled
    }
  }

  return NextResponse.json({ received: true });
}

// ─── Email HTML builders ──────────────────────────────────────────────────────

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
          <td style="padding: 12px 0; color: #737373; font-size: 14px;">Total Pago</td>
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

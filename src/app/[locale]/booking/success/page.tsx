import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDateShort, formatPrice, formatDurationLabel } from '@/lib/utils';

interface SuccessPageProps {
  params: { locale: string };
  searchParams: { booking_id?: string };
}

export default async function SuccessPage({ params, searchParams }: SuccessPageProps) {
  const { locale } = params;
  const { booking_id } = searchParams;

  let booking = null;

  if (booking_id) {
    try {
      booking = await prisma.booking.findUnique({
        where: { id: booking_id },
        include: {
          customer: true,
          service: true,
          addons: { include: { addon: true } },
        },
      });
    } catch {
      // Silently fail — still show success page
    }
  }

  const t = {
    title: locale === 'pt' ? 'Reserva Confirmada!' : 'Booking Confirmed!',
    subtitle: locale === 'pt' ? 'Reserva confirmada com sucesso' : 'Booking confirmed successfully',
    description: locale === 'pt'
      ? 'Enviámos um email de confirmação com todos os detalhes.'
      : 'We sent a confirmation email with all the details.',
    backHome: locale === 'pt' ? 'Voltar ao Início' : 'Back to Home',
    newBooking: locale === 'pt' ? 'Nova Reserva' : 'New Booking',
  };

  return (
    <div className="min-h-screen bg-white pt-20 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M10 20L16.5 26.5L30 13" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="text-3xl font-black text-black mb-2">{t.title}</h1>
        <p className="text-gold font-semibold mb-4">{t.subtitle}</p>
        <p className="text-surface-500 mb-8">{t.description}</p>

        {/* Booking details */}
        {booking && (
          <div className="border-2 border-surface-200 rounded-lg p-6 text-left mb-8">
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-4">
              {locale === 'pt' ? 'Detalhes da Reserva' : 'Booking Details'}
            </p>
            <div className="space-y-3 text-sm">
              <Row label={locale === 'pt' ? 'Data' : 'Date'} value={formatDateShort(booking.date)} />
              <Row label={locale === 'pt' ? 'Hora' : 'Time'} value={booking.startTime} />
              <Row
                label={locale === 'pt' ? 'Serviço' : 'Service'}
                value={locale === 'pt' ? booking.service.namePt : booking.service.nameEn}
              />
              {booking.addons.length > 0 && (
                <Row
                  label={locale === 'pt' ? 'Extras' : 'Add-ons'}
                  value={booking.addons.map((a) => locale === 'pt' ? a.addon.namePt : a.addon.nameEn).join(', ')}
                />
              )}
              <Row label={locale === 'pt' ? 'Veículo' : 'Vehicle'} value={booking.customer.carModel} />
              <Row label={locale === 'pt' ? 'Duração' : 'Duration'} value={formatDurationLabel(booking.totalDuration, locale)} />
              <div className="pt-3 border-t border-surface-200 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-gold">{formatPrice(booking.totalPrice)}</span>
              </div>
              {booking.depositAmount > 0 && (
                <>
                  <div className="flex justify-between text-green-600">
                    <span>{locale === 'pt' ? 'Sinal pago online' : 'Deposit paid online'}</span>
                    <span>−{formatPrice(booking.depositAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>{locale === 'pt' ? 'A pagar no local' : 'Due on-site'}</span>
                    <span>{formatPrice(booking.remainingAmount)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-surface-200 text-xs text-surface-400 space-y-1">
              <p>JetWash24 • N125 610, 8800-076 Guia, Algarve</p>
              <p>{locale === 'pt' ? 'A 3 minutos a pé do Algarve Shopping' : '3-minute walk from Algarve Shopping'}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/${locale}`}
            className="px-6 py-3 border border-surface-300 text-black font-semibold rounded hover:border-black transition-colors"
          >
            {t.backHome}
          </Link>
          <Link
            href={`/${locale}/booking`}
            className="px-6 py-3 bg-black text-white font-semibold rounded hover:bg-surface-800 transition-colors"
          >
            {t.newBooking}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-surface-500">{label}</span>
      <span className="font-medium text-black text-right">{value}</span>
    </div>
  );
}

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const VEHICLE_ADJUSTMENTS: Record<string, number> = {
  SMALL: 0,
  MEDIUM: 10,
  SUV: 20,
  LARGE: 30,
  SUPERCAR: 50,
};

export function getVehicleAdjustment(vehicleSize: string): number {
  return VEHICLE_ADJUSTMENTS[vehicleSize] ?? 0;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

/**
 * Formats a euro amount for inline display next to a "€" sign.
 * Whole numbers stay clean ("50"); non-round charm prices show two
 * decimals with a comma ("39,90"). Used everywhere prices render as `{x}€`.
 */
export function formatEuro(amount: number): string {
  return Number.isInteger(amount)
    ? String(amount)
    : amount.toFixed(2).replace('.', ',');
}

/**
 * Discount percentage between a crossed-out "before" price and the price now,
 * e.g. 50 → 39.90 gives 20 (rendered as "-20%").
 *
 * Rounds DOWN on purpose: an advertised percentage must never claim more than
 * the customer actually saves. Returns null when there is no real discount, so
 * callers can simply skip the badge.
 */
export function discountPercent(
  price: number,
  compareAtPrice?: number | null
): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  const pct = Math.floor(((compareAtPrice - price) / compareAtPrice) * 100);
  return pct > 0 ? pct : null;
}

export function formatDate(date: Date | string, locale: string = 'pt'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'PPP', { locale: locale === 'pt' ? ptBR : undefined });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd/MM/yyyy');
}

export function formatDurationLabel(minutes: number, locale: string = 'pt'): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (locale === 'pt') {
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;
    return `${h}h${m}min`;
  }

  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Trigger WhatsApp webhook notification
export async function triggerWhatsAppNotification(data: {
  time: string;
  date: string;
  service: string;
  carModel: string;
  customerName: string;
  extras: string[];
  totalDuration: number;
  phone: string;
}) {
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  if (!webhookUrl) return; // Silently skip if not configured

  const message =
    `*Nova reserva JetWash24 Detailing*\n\n` +
    `📅 Data: ${data.date}\n` +
    `⏰ Hora: ${data.time}\n` +
    `🚗 Serviço: ${data.service}\n` +
    `🚙 Carro: ${data.carModel}\n` +
    (data.extras.length > 0 ? `➕ Extras: ${data.extras.join(', ')}\n` : '') +
    `⏱ Duração: ${formatDurationLabel(data.totalDuration, 'pt')}\n` +
    `👤 Cliente: ${data.customerName}\n` +
    `📞 Telefone: ${data.phone}`;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (process.env.WHATSAPP_WEBHOOK_SECRET) {
      headers['x-webhook-secret'] = process.env.WHATSAPP_WEBHOOK_SECRET;
    }

    await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        to: process.env.WHATSAPP_NOTIFY_NUMBER,
        message,
        bookingData: data,
      }),
    });
  } catch (err) {
    // Don't fail the booking if WhatsApp notification fails
    console.error('WhatsApp webhook failed:', err);
  }
}

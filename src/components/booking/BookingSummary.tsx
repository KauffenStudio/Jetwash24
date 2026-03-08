'use client';

import { useTranslations, useLocale } from 'next-intl';
import { BookingState } from '@/types';
import { formatPrice, formatDurationLabel, formatDateShort, VEHICLE_ADJUSTMENTS } from '@/lib/utils';

interface BookingSummaryProps {
  state: BookingState;
}

export default function BookingSummary({ state }: BookingSummaryProps) {
  const t = useTranslations('booking.summary');
  const locale = useLocale();

  const vehicleSizeLabel: Record<string, string> = {
    SMALL: locale === 'pt' ? 'Carro Pequeno' : 'Small Car',
    MEDIUM: locale === 'pt' ? 'Carro Médio' : 'Medium Car',
    SUV: 'SUV',
    LARGE: locale === 'pt' ? 'Veículo Grande' : 'Large Vehicle',
  };

  const serviceName = state.service
    ? (locale === 'pt' ? state.service.namePt : state.service.nameEn)
    : null;

  const addonNames = state.selectedAddons.map((a) =>
    locale === 'pt' ? a.namePt : a.nameEn,
  );

  return (
    <div className="bg-[#F9F9F9] border border-surface-200 rounded-lg p-5">
      <h3 className="font-bold text-black text-sm tracking-wide uppercase mb-4">{t('title')}</h3>

      <div className="space-y-3 text-sm">
        {/* Vehicle */}
        <SummaryRow
          label={t('vehicle')}
          value={state.vehicleSize ? vehicleSizeLabel[state.vehicleSize] : '—'}
          dimmed={!state.vehicleSize}
        />

        {/* Service */}
        <SummaryRow
          label={t('service')}
          value={serviceName ?? '—'}
          dimmed={!serviceName}
        />

        {/* Extras */}
        <SummaryRow
          label={t('extras')}
          value={addonNames.length > 0 ? addonNames.join(', ') : t('none')}
          dimmed={addonNames.length === 0}
        />

        {/* Date */}
        {state.date && (
          <SummaryRow
            label={t('date')}
            value={formatDateShort(state.date)}
          />
        )}

        {/* Time */}
        {state.startTime && (
          <SummaryRow
            label={t('time')}
            value={state.startTime}
          />
        )}

        {/* Duration */}
        {state.totalDuration > 0 && (
          <SummaryRow
            label={t('duration')}
            value={formatDurationLabel(state.totalDuration, locale)}
          />
        )}
      </div>

      {/* Price breakdown */}
      {state.service && (
        <div className="mt-4 pt-4 border-t border-surface-200 space-y-2">
          <div className="flex justify-between text-sm text-surface-600">
            <span>{t('basePrice')}</span>
            <span>{formatPrice(state.service.price)}</span>
          </div>

          {state.vehicleAdjustment > 0 && (
            <div className="flex justify-between text-sm text-surface-600">
              <span>{t('vehicleAdjustment')}</span>
              <span>+{formatPrice(state.vehicleAdjustment)}</span>
            </div>
          )}

          {state.selectedAddons.length > 0 && (
            <div className="flex justify-between text-sm text-surface-600">
              <span>{t('extrasPrice')}</span>
              <span>+{formatPrice(state.selectedAddons.reduce((sum, a) => sum + a.price, 0))}</span>
            </div>
          )}

          <div className="flex justify-between font-bold text-black text-lg pt-2 border-t border-surface-200">
            <span>{t('total')}</span>
            <span className="text-gold">{formatPrice(state.totalPrice)}</span>
          </div>
        </div>
      )}

      {/* Cancellation policy */}
      <p className="mt-4 text-surface-400 text-xs leading-relaxed">
        {useTranslations('booking.cancellation')('policy')}
      </p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  dimmed = false,
}: {
  label: string;
  value: string;
  dimmed?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-surface-500 flex-shrink-0">{label}</span>
      <span className={`font-medium text-right ${dimmed ? 'text-surface-300' : 'text-black'}`}>
        {value}
      </span>
    </div>
  );
}

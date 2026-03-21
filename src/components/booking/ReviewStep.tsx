'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { BookingState } from '@/types';
import { formatPrice, formatDurationLabel, formatDateShort } from '@/lib/utils';

interface ReviewStepProps {
  state: BookingState;
  onConfirm: () => Promise<void>;
  onBack: () => void;
}

const VEHICLE_LABELS: Record<string, { pt: string; en: string }> = {
  SMALL: { pt: 'Carro Pequeno', en: 'Small Car' },
  MEDIUM: { pt: 'Carro Médio', en: 'Medium Car' },
  SUV: { pt: 'SUV', en: 'SUV' },
  LARGE: { pt: 'Veículo Grande', en: 'Large Vehicle' },
};

export default function ReviewStep({ state, onConfirm, onBack }: ReviewStepProps) {
  const t = useTranslations('booking.step6');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  if (!state.service || !state.vehicleSize) return null;

  const serviceName = locale === 'pt' ? state.service.namePt : state.service.nameEn;
  const vehicleLabel = VEHICLE_LABELS[state.vehicleSize];
  const vehicleName = locale === 'pt' ? vehicleLabel.pt : vehicleLabel.en;

  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl sm:text-3xl font-black text-black mb-2">{t('title')}</h2>
      <p className="text-surface-500 mb-8">{t('subtitle')}</p>

      {/* Booking summary card */}
      <div className="border-2 border-black rounded-lg overflow-hidden mb-6">
        <div className="bg-black text-white px-6 py-4">
          <p className="text-xs font-semibold tracking-widest text-white/50 uppercase">JetWash24 Detailing</p>
          <h3 className="text-xl font-bold mt-1">{serviceName}</h3>
        </div>

        <div className="p-6 space-y-3">
          <Row label={locale === 'pt' ? 'Veículo' : 'Vehicle'} value={vehicleName} />
          {state.date && (
            <Row label={locale === 'pt' ? 'Data' : 'Date'} value={formatDateShort(state.date)} />
          )}
          {state.startTime && (
            <Row label={locale === 'pt' ? 'Hora' : 'Time'} value={state.startTime} />
          )}
          <Row
            label={locale === 'pt' ? 'Duração' : 'Duration'}
            value={formatDurationLabel(state.totalDuration, locale)}
          />
          {state.selectedAddons.length > 0 && (
            <Row
              label={locale === 'pt' ? 'Extras' : 'Add-ons'}
              value={state.selectedAddons.map((a) => locale === 'pt' ? a.namePt : a.nameEn).join(', ')}
            />
          )}
          <div className="pt-3 border-t border-surface-200 space-y-1.5">
            <div className="flex justify-between text-sm text-surface-500">
              <span>{locale === 'pt' ? 'Preço base' : 'Base price'}</span>
              <span>{formatPrice(state.service.price)}</span>
            </div>
            {state.vehicleAdjustment > 0 && (
              <div className="flex justify-between text-sm text-surface-500">
                <span>{locale === 'pt' ? 'Acréscimo veículo' : 'Vehicle surcharge'}</span>
                <span>+{formatPrice(state.vehicleAdjustment)}</span>
              </div>
            )}
            {state.selectedAddons.length > 0 && (
              <div className="flex justify-between text-sm text-surface-500">
                <span>{locale === 'pt' ? 'Extras' : 'Add-ons'}</span>
                <span>+{formatPrice(state.selectedAddons.reduce((s, a) => s + a.price, 0))}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-surface-200">
              <span className="font-bold text-black text-lg">{locale === 'pt' ? 'Total' : 'Total'}</span>
              <span className="font-black text-2xl text-black">{formatPrice(state.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer details */}
      <div className="border border-surface-200 rounded-lg p-5 mb-6">
        <p className="text-xs font-semibold tracking-widest text-surface-400 uppercase mb-3">
          {locale === 'pt' ? 'Os seus dados' : 'Your details'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <Row label={locale === 'pt' ? 'Nome' : 'Name'} value={state.customer.name} />
          <Row label={locale === 'pt' ? 'Telefone' : 'Phone'} value={state.customer.phone} />
          <Row label="Email" value={state.customer.email} />
          <Row label={locale === 'pt' ? 'Carro' : 'Car'} value={`${state.customer.carModel} • ${state.customer.licensePlate}`} />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-6 py-3 border border-surface-300 text-black font-medium rounded hover:border-black transition-colors disabled:opacity-40"
        >
          ← {tCommon('back')}
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="px-8 py-4 bg-black text-white font-black text-lg rounded hover:bg-surface-800 transition-all duration-200 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {locale === 'pt' ? 'A confirmar...' : 'Confirming...'}
            </>
          ) : (
            locale === 'pt' ? 'Reservar Agora' : 'Book Now'
          )}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-surface-500 flex-shrink-0">{label}</span>
      <span className="font-medium text-black text-right">{value}</span>
    </div>
  );
}

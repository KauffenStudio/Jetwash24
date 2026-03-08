'use client';

import { useTranslations, useLocale } from 'next-intl';
import { VehicleSize } from '@/types';

interface VehicleStepProps {
  selectedSize: VehicleSize | null;
  onSelect: (size: VehicleSize) => void;
}

const VEHICLES: { size: VehicleSize; icon: string; examples: string }[] = [
  { size: 'SMALL', icon: '🚗', examples: 'Polo, Clio, Aygo' },
  { size: 'MEDIUM', icon: '🚙', examples: 'Golf, 308, Focus' },
  { size: 'SUV', icon: '🚐', examples: 'X3, Qashqai, CR-V' },
  { size: 'LARGE', icon: '🚌', examples: 'Transit, Sprinter, Ducato' },
];

const ADJUSTMENT_LABELS: Record<VehicleSize, string> = {
  SMALL: '—',
  MEDIUM: '+10€',
  SUV: '+20€',
  LARGE: '+30€',
};

export default function VehicleStep({ selectedSize, onSelect }: VehicleStepProps) {
  const t = useTranslations('booking.step1');
  const locale = useLocale();
  const sizeNames = useTranslations('vehicleSizes');

  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl sm:text-3xl font-black text-black mb-2">{t('title')}</h2>
      <p className="text-surface-500 mb-8">{t('subtitle')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {VEHICLES.map(({ size, icon, examples }) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              onClick={() => onSelect(size)}
              className={`relative p-6 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? 'border-black bg-black text-white'
                  : 'border-surface-200 bg-white hover:border-surface-400'
              }`}
            >
              {/* Checkmark */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L4.5 8.5L10 3" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              <div className="text-3xl mb-3">{icon}</div>
              <h3 className={`text-lg font-bold mb-1 ${isSelected ? 'text-white' : 'text-black'}`}>
                {sizeNames(size)}
              </h3>
              <p className={`text-sm mb-3 ${isSelected ? 'text-white/60' : 'text-surface-500'}`}>
                {examples}
              </p>
              <div
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded ${
                  isSelected ? 'bg-white/10 text-white' : 'bg-surface-100 text-surface-600'
                }`}
              >
                {ADJUSTMENT_LABELS[size]}
                {size !== 'SMALL' && (
                  <span className="opacity-70">
                    {locale === 'pt' ? 'acréscimo' : 'surcharge'}
                  </span>
                )}
                {size === 'SMALL' && (
                  <span className="opacity-70">
                    {locale === 'pt' ? 'sem acréscimo' : 'no surcharge'}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

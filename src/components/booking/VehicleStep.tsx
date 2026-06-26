'use client';

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { VehicleSize } from '@/types';

interface VehicleStepProps {
  selectedSize: VehicleSize | null;
  onSelect: (size: VehicleSize) => void;
}

// Realistic studio car photos (transparent PNG) per size category.
const VEHICLES: { size: VehicleSize; examples: string; image: string }[] = [
  { size: 'SMALL', examples: 'Polo, Clio, Aygo, Ibiza', image: '/vehicles/small.png' },
  { size: 'MEDIUM', examples: 'Golf, 308, Focus, Civic', image: '/vehicles/medium.png' },
  { size: 'SUV', examples: 'X3, Qashqai, CR-V, Tiguan', image: '/vehicles/suv.png' },
  { size: 'LARGE', examples: 'Transit, Sprinter, Ducato', image: '/vehicles/van.png' },
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
        {VEHICLES.map(({ size, examples, image }) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              onClick={() => onSelect(size)}
              className={`group relative p-6 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? 'border-black bg-black text-white'
                  : 'border-surface-200 bg-white hover:border-surface-400'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-gold rounded-full flex items-center justify-center z-10">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L4.5 8.5L10 3" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              <div className="mb-4 h-20 flex items-center">
                <Image
                  src={image}
                  alt={sizeNames(size)}
                  width={180}
                  height={120}
                  className="h-20 w-auto object-contain object-left transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>

              <h3 className={`text-lg font-bold mb-1 ${isSelected ? 'text-white' : 'text-black'}`}>
                {sizeNames(size)}
              </h3>
              <p className={`text-sm mb-3 ${isSelected ? 'text-white/60' : 'text-surface-500'}`}>
                {examples}
              </p>
              <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded ${
                isSelected ? 'bg-white/10 text-gold' : 'bg-surface-100 text-surface-600'
              }`}>
                {ADJUSTMENT_LABELS[size]}
                {size !== 'SMALL' && (
                  <span className={isSelected ? 'text-white/60' : 'text-surface-400'}>
                    {locale === 'pt' ? 'acréscimo' : 'surcharge'}
                  </span>
                )}
                {size === 'SMALL' && (
                  <span className={isSelected ? 'text-white/60' : 'text-surface-400'}>
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

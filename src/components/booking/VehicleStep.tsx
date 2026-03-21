'use client';

import { useTranslations, useLocale } from 'next-intl';
import { VehicleSize } from '@/types';

interface VehicleStepProps {
  selectedSize: VehicleSize | null;
  onSelect: (size: VehicleSize) => void;
}

const VEHICLES: { size: VehicleSize; examples: string }[] = [
  { size: 'SMALL', examples: 'Polo, Clio, Aygo, Ibiza' },
  { size: 'MEDIUM', examples: 'Golf, 308, Focus, Civic' },
  { size: 'SUV', examples: 'X3, Qashqai, CR-V, Tiguan' },
  { size: 'LARGE', examples: 'Transit, Sprinter, Ducato' },
];

const ADJUSTMENT_LABELS: Record<VehicleSize, string> = {
  SMALL: '—',
  MEDIUM: '+10€',
  SUV: '+20€',
  LARGE: '+30€',
};

// Clean SVG silhouettes — each progressively larger/taller
function CarIcon({ size, selected }: { size: VehicleSize; selected: boolean }) {
  const color = selected ? '#C9A84C' : '#0A0A0A';

  if (size === 'SMALL') {
    // Low, compact hatchback
    return (
      <svg width="72" height="36" viewBox="0 0 72 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 24H4C2.9 24 2 23.1 2 22V20C2 19.4 2.3 18.9 2.7 18.5L8 13.5C8.4 13.2 8.9 13 9.4 13H22L28 7H48L56 13H62C63.7 13 65 14.3 65 16V22C65 23.1 64.1 24 63 24H66C67.1 24 68 24.9 68 26V27H4V26C4 24.9 4.9 24 6 24Z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill={selected ? '#C9A84C15' : 'none'}/>
        <circle cx="18" cy="27" r="5" stroke={color} strokeWidth="2"/>
        <circle cx="54" cy="27" r="5" stroke={color} strokeWidth="2"/>
        <circle cx="18" cy="27" r="2" fill={color}/>
        <circle cx="54" cy="27" r="2" fill={color}/>
        <path d="M29 13H47L43 8H33L29 13Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    );
  }

  if (size === 'MEDIUM') {
    // Standard sedan
    return (
      <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 26H2V22C2 21.3 2.4 20.7 3 20.4L10 16L18 8H52L60 16L70 19C71.1 19.4 72 20.5 72 21.7V26H68" stroke={color} strokeWidth="2" strokeLinejoin="round" fill={selected ? '#C9A84C15' : 'none'}/>
        <path d="M4 26H22M32 26H68" stroke={color} strokeWidth="2"/>
        <path d="M19 16H37L33 9H25L19 16Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M39 16H57L53 9H43L39 16Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="20" cy="30" r="6" stroke={color} strokeWidth="2"/>
        <circle cx="60" cy="30" r="6" stroke={color} strokeWidth="2"/>
        <circle cx="20" cy="30" r="2.5" fill={color}/>
        <circle cx="60" cy="30" r="2.5" fill={color}/>
      </svg>
    );
  }

  if (size === 'SUV') {
    // Taller SUV/crossover
    return (
      <svg width="84" height="46" viewBox="0 0 84 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="10" width="68" height="22" rx="3" stroke={color} strokeWidth="2" fill={selected ? '#C9A84C15' : 'none'}/>
        <path d="M8 16H76" stroke={color} strokeWidth="1.5"/>
        <path d="M14 10V6H70V10" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
        <rect x="16" y="11" width="20" height="4" rx="1" stroke={color} strokeWidth="1.5"/>
        <rect x="48" y="11" width="20" height="4" rx="1" stroke={color} strokeWidth="1.5"/>
        <path d="M2 32H82V34H2V32Z" stroke={color} strokeWidth="1.5"/>
        <path d="M8 32V28H76V32" stroke={color} strokeWidth="1.5"/>
        <circle cx="22" cy="36" r="6" stroke={color} strokeWidth="2"/>
        <circle cx="62" cy="36" r="6" stroke={color} strokeWidth="2"/>
        <circle cx="22" cy="36" r="2.5" fill={color}/>
        <circle cx="62" cy="36" r="2.5" fill={color}/>
      </svg>
    );
  }

  // LARGE — van/minibus
  return (
    <svg width="92" height="48" viewBox="0 0 92 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="80" height="28" rx="4" stroke={color} strokeWidth="2" fill={selected ? '#C9A84C15' : 'none'}/>
      <path d="M4 20H84" stroke={color} strokeWidth="1.5"/>
      <rect x="10" y="9" width="18" height="10" rx="1" stroke={color} strokeWidth="1.5"/>
      <rect x="32" y="9" width="18" height="10" rx="1" stroke={color} strokeWidth="1.5"/>
      <rect x="54" y="9" width="18" height="10" rx="1" stroke={color} strokeWidth="1.5"/>
      <path d="M4 36H88" stroke={color} strokeWidth="1.5"/>
      <circle cx="22" cy="39" r="6" stroke={color} strokeWidth="2"/>
      <circle cx="68" cy="39" r="6" stroke={color} strokeWidth="2"/>
      <circle cx="22" cy="39" r="2.5" fill={color}/>
      <circle cx="68" cy="39" r="2.5" fill={color}/>
    </svg>
  );
}

export default function VehicleStep({ selectedSize, onSelect }: VehicleStepProps) {
  const t = useTranslations('booking.step1');
  const locale = useLocale();
  const sizeNames = useTranslations('vehicleSizes');

  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl sm:text-3xl font-black text-black mb-2">{t('title')}</h2>
      <p className="text-surface-500 mb-8">{t('subtitle')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {VEHICLES.map(({ size, examples }) => {
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
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L4.5 8.5L10 3" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              <div className="mb-4 opacity-90">
                <CarIcon size={size} selected={isSelected} />
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

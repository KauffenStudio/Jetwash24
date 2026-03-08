'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Service, VehicleSize } from '@/types';
import { formatDurationLabel, getVehicleAdjustment } from '@/lib/utils';

interface ServiceStepProps {
  services: Service[];
  selectedServiceId: string | null;
  vehicleSize: VehicleSize | null;
  onSelect: (service: Service) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ServiceStep({
  services,
  selectedServiceId,
  vehicleSize,
  onSelect,
  onNext,
  onBack,
}: ServiceStepProps) {
  const t = useTranslations('booking.step2');
  const tServices = useTranslations('services');
  const locale = useLocale();

  const vehicleAdj = vehicleSize ? getVehicleAdjustment(vehicleSize) : 0;
  const interior = services.filter((s) => s.category === 'INTERIOR');
  const exterior = services.filter((s) => s.category === 'EXTERIOR');

  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl sm:text-3xl font-black text-black mb-2">{t('title')}</h2>
      <p className="text-surface-500 mb-8">{t('subtitle')}</p>

      {/* Interior */}
      <ServiceGroup
        label={tServices('interior')}
        services={interior}
        selectedServiceId={selectedServiceId}
        vehicleAdj={vehicleAdj}
        locale={locale}
        tServices={tServices}
        onSelect={onSelect}
      />

      {/* Exterior */}
      <ServiceGroup
        label={tServices('exterior')}
        services={exterior}
        selectedServiceId={selectedServiceId}
        vehicleAdj={vehicleAdj}
        locale={locale}
        tServices={tServices}
        onSelect={onSelect}
        className="mt-8"
      />

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-surface-300 text-black font-medium rounded hover:border-black transition-colors"
        >
          ← {useTranslations('common')('back')}
        </button>
        <button
          onClick={onNext}
          disabled={!selectedServiceId}
          className="px-8 py-3 bg-black text-white font-bold rounded hover:bg-surface-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {useTranslations('common')('continue')} →
        </button>
      </div>
    </div>
  );
}

function ServiceGroup({
  label,
  services,
  selectedServiceId,
  vehicleAdj,
  locale,
  tServices,
  onSelect,
  className = '',
}: {
  label: string;
  services: Service[];
  selectedServiceId: string | null;
  vehicleAdj: number;
  locale: string;
  tServices: ReturnType<typeof useTranslations<'services'>>;
  onSelect: (service: Service) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="text-xs font-semibold tracking-widest text-surface-400 uppercase mb-4 flex items-center gap-3">
        <span className="flex-1 h-px bg-surface-200" />
        {label}
        <span className="flex-1 h-px bg-surface-200" />
      </h3>
      <div className="space-y-3">
        {services.map((service) => {
          const isSelected = service.id === selectedServiceId;
          const name = locale === 'pt' ? service.namePt : service.nameEn;
          const includes = locale === 'pt' ? service.includesPt : service.includesEn;
          const displayPrice = service.price + vehicleAdj;

          return (
            <button
              key={service.id}
              onClick={() => onSelect(service)}
              className={`w-full p-5 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? 'border-black bg-black text-white'
                  : 'border-surface-200 bg-white hover:border-surface-400'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-2xl font-black ${isSelected ? 'text-gold' : 'text-black'}`}>
                      {displayPrice}€
                    </span>
                    <span className={`text-sm ${isSelected ? 'text-white/60' : 'text-surface-400'}`}>
                      {formatDurationLabel(service.duration, locale)}
                    </span>
                  </div>
                  <h4 className={`font-bold text-base mb-2 ${isSelected ? 'text-white' : 'text-black'}`}>
                    {name}
                  </h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {includes.slice(0, 4).map((item, i) => (
                      <span
                        key={i}
                        className={`text-xs ${isSelected ? 'text-white/60' : 'text-surface-500'}`}
                      >
                        ✓ {item}
                      </span>
                    ))}
                    {includes.length > 4 && (
                      <span className={`text-xs ${isSelected ? 'text-white/40' : 'text-surface-400'}`}>
                        +{includes.length - 4} {locale === 'pt' ? 'mais' : 'more'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Selection indicator */}
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'border-gold bg-gold' : 'border-surface-300'
                  }`}
                >
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L4.5 8.5L10 3" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

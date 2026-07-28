'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Service, VehicleSize } from '@/types';
import { formatDurationLabel, getVehicleAdjustment, formatEuro } from '@/lib/utils';

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
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const vehicleAdj = vehicleSize ? getVehicleAdjustment(vehicleSize) : 0;
  const interior = services.filter((s) => s.category === 'INTERIOR');
  const exterior = services.filter((s) => s.category === 'EXTERIOR');
  const fullPackage = services.find((s) => s.category === 'FULL');

  const originalPrice = 149.8; // Interior Detalhada 79,90€ + Exterior Detalhada 69,90€

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
        onSelect={onSelect}
      />

      {/* Exterior */}
      <ServiceGroup
        label={tServices('exterior')}
        services={exterior}
        selectedServiceId={selectedServiceId}
        vehicleAdj={vehicleAdj}
        locale={locale}
        onSelect={onSelect}
        className="mt-8"
      />

      {/* ── Pacote Completo ────────────────────────────────────────────── */}
      {fullPackage && (
        <div className="mt-8">
          <h3 className="text-xs font-semibold tracking-widest text-surface-400 uppercase mb-4 flex items-center gap-3">
            <span className="flex-1 h-px bg-surface-200" />
            {locale === 'pt' ? 'Pacote' : 'Package'}
            <span className="flex-1 h-px bg-surface-200" />
          </h3>
          <button
            onClick={() => onSelect(fullPackage)}
            className={`w-full rounded-xl border-2 text-left transition-all duration-200 overflow-hidden ${
              fullPackage.id === selectedServiceId
                ? 'border-gold'
                : 'border-surface-200 hover:border-surface-300'
            }`}
          >
            {/* Dark header strip */}
            <div className={`px-5 py-4 ${fullPackage.id === selectedServiceId ? 'bg-[#0A0A0A]' : 'bg-[#0A0A0A]'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {/* Best value badge */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold/20 border border-gold/40 rounded-full text-gold text-[9px] font-bold tracking-widest uppercase">
                      ★ {locale === 'pt' ? 'Melhor Valor' : 'Best Value'}
                    </span>
                  </div>
                  <h4 className="text-white font-black text-lg">
                    {locale === 'pt' ? fullPackage.namePt : fullPackage.nameEn}
                  </h4>
                  <p className="text-white/40 text-xs mt-0.5">
                    {formatDurationLabel(fullPackage.duration, locale)}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  {/* Saving pill */}
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold rounded text-black text-[10px] font-black mb-1.5">
                    -{formatEuro(originalPrice - fullPackage.price)}€ {locale === 'pt' ? 'poupança' : 'saving'}
                  </div>
                  <div className="flex items-baseline gap-2 justify-end">
                    <span className="text-white/30 line-through text-sm">{formatEuro(originalPrice + vehicleAdj)}€</span>
                    <span className="text-3xl font-black text-gold">{formatEuro(fullPackage.price + vehicleAdj)}€</span>
                  </div>

                  {/* Selection indicator */}
                  <div className="flex justify-end mt-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      fullPackage.id === selectedServiceId ? 'border-gold bg-gold' : 'border-white/30'
                    }`}>
                      {fullPackage.id === selectedServiceId && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4 7.5L8.5 2.5" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Includes */}
            <div className={`px-5 py-3 border-t ${fullPackage.id === selectedServiceId ? 'bg-black/5 border-gold/20' : 'bg-surface-50 border-surface-100'}`}>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {(locale === 'pt' ? fullPackage.includesPt : fullPackage.includesEn).slice(0, 6).map((item, i) => (
                  <span key={i} className="text-xs text-surface-500 flex items-center gap-1">
                    <span className="text-gold">✓</span> {item}
                  </span>
                ))}
                <span className="text-xs text-surface-400">
                  +{(locale === 'pt' ? fullPackage.includesPt : fullPackage.includesEn).length - 6} {locale === 'pt' ? 'mais' : 'more'}
                </span>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-surface-300 text-black font-medium rounded hover:border-black transition-colors"
        >
          ← {tCommon('back')}
        </button>
        <button
          onClick={onNext}
          disabled={!selectedServiceId}
          className="px-8 py-3 bg-black text-white font-bold rounded hover:bg-surface-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {tCommon('continue')} →
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
  onSelect,
  className = '',
}: {
  label: string;
  services: Service[];
  selectedServiceId: string | null;
  vehicleAdj: number;
  locale: string;
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
          const displayCompareAt =
            service.compareAtPrice && service.compareAtPrice > service.price
              ? service.compareAtPrice + vehicleAdj
              : null;

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
                    {displayCompareAt && (
                      <span className={`text-lg font-semibold line-through ${isSelected ? 'text-white/40' : 'text-surface-400'}`}>
                        {formatEuro(displayCompareAt)}€
                      </span>
                    )}
                    <span className={`text-2xl font-black ${isSelected ? 'text-gold' : 'text-black'}`}>
                      {formatEuro(displayPrice)}€
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
                      <span key={i} className={`text-xs ${isSelected ? 'text-white/60' : 'text-surface-500'}`}>
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
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected ? 'border-gold bg-gold' : 'border-surface-300'
                }`}>
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

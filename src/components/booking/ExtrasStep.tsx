'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Addon } from '@/types';
import { formatDurationLabel } from '@/lib/utils';

interface ExtrasStepProps {
  addons: Addon[];
  selectedAddonIds: string[];
  onToggle: (addon: Addon) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ExtrasStep({
  addons,
  selectedAddonIds,
  onToggle,
  onNext,
  onBack,
}: ExtrasStepProps) {
  const t = useTranslations('booking.step3');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl sm:text-3xl font-black text-black mb-2">{t('title')}</h2>
      <p className="text-surface-500 mb-8">{t('subtitle')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {addons.map((addon) => {
          const isSelected = selectedAddonIds.includes(addon.id);
          const name = locale === 'pt' ? addon.namePt : addon.nameEn;

          return (
            <button
              key={addon.id}
              onClick={() => onToggle(addon)}
              className={`p-5 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? 'border-black bg-black text-white'
                  : 'border-surface-200 bg-white hover:border-surface-400'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className={`font-bold text-base mb-1 ${isSelected ? 'text-white' : 'text-black'}`}>
                    {name}
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${isSelected ? 'text-gold' : 'text-black'}`}>
                      +{addon.price}€
                    </span>
                    <span className={`text-xs ${isSelected ? 'text-white/50' : 'text-surface-400'}`}>
                      +{formatDurationLabel(addon.duration, locale)}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
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

      {selectedAddonIds.length > 0 && (
        <p className="mt-4 text-sm text-surface-500">
          {selectedAddonIds.length} {locale === 'pt' ? 'extra(s) selecionado(s)' : 'extra(s) selected'}
        </p>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-surface-300 text-black font-medium rounded hover:border-black transition-colors"
        >
          ← {tCommon('back')}
        </button>
        <div className="flex gap-3">
          {selectedAddonIds.length === 0 && (
            <button
              onClick={onNext}
              className="px-6 py-3 border border-surface-300 text-surface-500 font-medium rounded hover:border-surface-400 transition-colors text-sm"
            >
              {t('skip')}
            </button>
          )}
          <button
            onClick={onNext}
            className="px-8 py-3 bg-black text-white font-bold rounded hover:bg-surface-800 transition-colors"
          >
            {tCommon('continue')} →
          </button>
        </div>
      </div>
    </div>
  );
}

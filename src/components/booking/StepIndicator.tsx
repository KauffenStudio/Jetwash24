'use client';

import { useTranslations } from 'next-intl';
import { BookingStep } from '@/types';

interface StepIndicatorProps {
  currentStep: BookingStep;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const t = useTranslations('booking.steps');

  const steps: { key: string; label: string }[] = [
    { key: 'vehicle', label: t('vehicle') },
    { key: 'extras', label: t('extras') },
    { key: 'datetime', label: t('datetime') },
    { key: 'details', label: t('details') },
  ];

  return (
    <div className="w-full py-4 px-4 sm:px-6">
      {/* Step dots (mobile) */}
      <div className="flex items-center justify-center gap-1.5 sm:hidden mb-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i + 1 < currentStep
                ? 'w-4 bg-black'
                : i + 1 === currentStep
                ? 'w-6 bg-gold'
                : 'w-4 bg-surface-200'
            }`}
          />
        ))}
      </div>
      <p className="text-center text-sm text-surface-500 sm:hidden">
        {steps[currentStep - 1]?.label} ({currentStep}/{steps.length})
      </p>

      {/* Step labels (desktop) */}
      <div className="hidden sm:flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, i) => {
          const stepNum = i + 1 as BookingStep;
          const isPast = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isPast
                      ? 'bg-black text-white'
                      : isCurrent
                      ? 'bg-gold text-black'
                      : 'bg-surface-100 text-surface-400'
                  }`}
                >
                  {isPast ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7L5.5 10.5L12 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <p
                  className={`text-xs mt-1.5 whitespace-nowrap font-medium ${
                    isCurrent ? 'text-black' : isPast ? 'text-surface-500' : 'text-surface-400'
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mb-4 transition-all duration-300 ${
                    isPast ? 'bg-black' : 'bg-surface-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { format, addDays, startOfToday, isToday, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DateTimeStepProps {
  totalDuration: number;
  selectedDate: string | null;
  selectedTime: string | null;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function DateTimeStep({
  totalDuration,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  onNext,
  onBack,
}: DateTimeStepProps) {
  const t = useTranslations('booking.step4');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const dfLocale = locale === 'pt' ? ptBR : undefined;

  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Show next 30 days for date picker
  const today = startOfToday();
  const dateOptions = Array.from({ length: 30 }, (_, i) => addDays(today, i));

  const fetchSlots = useCallback(
    async (date: string) => {
      setLoadingSlots(true);
      try {
        const res = await fetch(`/api/availability?date=${date}&duration=${totalDuration}`);
        const data = await res.json();
        setSlots(data.slots ?? []);
      } catch {
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    },
    [totalDuration],
  );

  useEffect(() => {
    if (selectedDate) fetchSlots(selectedDate);
  }, [selectedDate, fetchSlots]);

  const handleDateSelect = (date: Date) => {
    const str = format(date, 'yyyy-MM-dd');
    onDateChange(str);
  };

  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl sm:text-3xl font-black text-black mb-2">{t('title')}</h2>
      <p className="text-surface-500 mb-8">{t('subtitle')}</p>

      {/* Date picker */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-surface-500 uppercase tracking-wide mb-4">{t('selectDate')}</p>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2">
          {dateOptions.map((date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const isSelected = selectedDate === dateStr;
            const isToday_ = isToday(date);

            return (
              <button
                key={dateStr}
                onClick={() => handleDateSelect(date)}
                className={`p-2 sm:p-3 rounded-lg border-2 text-center transition-all duration-150 hover:shadow-sm ${
                  isSelected
                    ? 'border-black bg-black text-white'
                    : 'border-surface-200 bg-white hover:border-surface-400'
                }`}
              >
                <p className={`text-xs font-medium uppercase tracking-wide ${isSelected ? 'text-white/60' : 'text-surface-400'}`}>
                  {format(date, 'EEE', { locale: dfLocale })}
                </p>
                <p className={`text-lg font-black mt-0.5 ${isSelected ? 'text-white' : 'text-black'}`}>
                  {format(date, 'd')}
                </p>
                <p className={`text-xs ${isSelected ? 'text-white/50' : 'text-surface-400'}`}>
                  {format(date, 'MMM', { locale: dfLocale })}
                </p>
                {isToday_ && (
                  <div className={`mt-1 w-1.5 h-1.5 rounded-full mx-auto ${isSelected ? 'bg-gold' : 'bg-gold'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="mb-8">
          <p className="text-sm font-semibold text-surface-500 uppercase tracking-wide mb-4">{t('availableSlots')}</p>
          {loadingSlots ? (
            <div className="flex items-center gap-3 text-surface-400 py-4">
              <div className="w-4 h-4 border-2 border-surface-300 border-t-black rounded-full animate-spin" />
              <span className="text-sm">{t('loadingSlots')}</span>
            </div>
          ) : slots.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-surface-500">{t('noSlots')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {slots.map((slot) => {
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => onTimeChange(slot)}
                    className={`py-3 rounded-lg border-2 text-sm font-bold transition-all duration-150 ${
                      isSelected
                        ? 'border-black bg-black text-gold'
                        : 'border-surface-200 bg-white text-black hover:border-black hover:shadow-sm'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-surface-300 text-black font-medium rounded hover:border-black transition-colors"
        >
          ← {tCommon('back')}
        </button>
        <button
          onClick={onNext}
          disabled={!selectedDate || !selectedTime}
          className="px-8 py-3 bg-black text-white font-bold rounded hover:bg-surface-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {tCommon('continue')} →
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CustomerForm } from '@/types';

interface CustomerStepProps {
  customer: CustomerForm;
  onChange: (data: Partial<CustomerForm>) => void;
  onConfirm: () => Promise<void>;
  onBack: () => void;
}

export default function CustomerStep({ customer, onChange, onConfirm, onBack }: CustomerStepProps) {
  const t = useTranslations('booking.step5');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [loading, setLoading] = useState(false);

  const isValid =
    customer.name.trim() &&
    customer.email.trim() &&
    customer.phone.trim() &&
    customer.carModel.trim() &&
    customer.licensePlate.trim();

  const handleBook = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  const field = (
    key: keyof CustomerForm,
    label: string,
    placeholder: string,
    required = true,
    type = 'text',
    isTextarea = false,
  ) => (
    <div>
      <label className="block text-sm font-semibold text-black mb-1.5">
        {label}
        {required && <span className="text-gold ml-1">*</span>}
      </label>
      {isTextarea ? (
        <textarea
          value={customer[key]}
          onChange={(e) => onChange({ [key]: e.target.value })}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-3 border-2 border-surface-200 rounded-lg text-black placeholder-surface-400 focus:outline-none focus:border-black transition-colors resize-none text-sm"
        />
      ) : (
        <input
          type={type}
          value={customer[key]}
          onChange={(e) => onChange({ [key]: e.target.value })}
          placeholder={placeholder}
          className="w-full px-4 py-3 border-2 border-surface-200 rounded-lg text-black placeholder-surface-400 focus:outline-none focus:border-black transition-colors text-sm"
        />
      )}
    </div>
  );

  return (
    <div className="animate-slide-up">
      <h2 className="text-2xl sm:text-3xl font-black text-black mb-2">{t('title')}</h2>
      <p className="text-surface-500 mb-8">{t('subtitle')}</p>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {field('name', t('name'), t('namePlaceholder'))}
          {field('phone', t('phone'), t('phonePlaceholder'), true, 'tel')}
        </div>
        {field('email', t('email'), t('emailPlaceholder'), true, 'email')}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {field('carModel', t('carModel'), t('carModelPlaceholder'))}
          {field('licensePlate', t('licensePlate'), t('licensePlatePlaceholder'))}
        </div>
        {field('notes', t('notes'), t('notesPlaceholder'), false, 'text', true)}
      </div>

      <p className="mt-4 text-xs text-surface-400">{t('privacy')}</p>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-6 py-3 border border-surface-300 text-black font-medium rounded hover:border-black transition-colors disabled:opacity-40"
        >
          ← {tCommon('back')}
        </button>
        <button
          onClick={handleBook}
          disabled={!isValid || loading}
          className="px-8 py-4 bg-black text-white font-black text-lg rounded hover:bg-surface-800 transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3"
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

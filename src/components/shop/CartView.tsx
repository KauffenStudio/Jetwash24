'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { formatEuro } from '@/lib/utils';
import {
  MIN_ORDER_TOTAL,
  ZONE_LABEL,
  amountToFreeShipping,
  normalisePostalCode,
  shippingCostFor,
  zoneForPostalCode,
} from '@/lib/shop/shipping';
import { useCart } from './CartProvider';

type FormState = {
  name: string;
  email: string;
  phone: string;
  nif: string;
  line1: string;
  line2: string;
  postalCode: string;
  city: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  name: '',
  email: '',
  phone: '',
  nif: '',
  line1: '',
  line2: '',
  postalCode: '',
  city: '',
  notes: '',
};

/**
 * Cart + checkout in one page: line items on the left, contact and shipping
 * details on the right. Totals shown here are a preview — /api/orders recomputes
 * everything from the database before charging anything.
 */
export default function CartView({ canceled = false }: { canceled?: boolean }) {
  const t = useTranslations('shop');
  const locale = useLocale();
  const isPt = locale === 'pt';
  const { items, ready, subtotal, setQuantity, remove } = useCart();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const zone = useMemo(
    () => (normalisePostalCode(form.postalCode) ? zoneForPostalCode(form.postalCode) : null),
    [form.postalCode],
  );
  const shippingCost = shippingCostFor(subtotal, zone ?? 'CONTINENTAL');
  const total = Math.round((subtotal + shippingCost) * 100) / 100;
  const missingForFree = amountToFreeShipping(subtotal, zone ?? 'CONTINENTAL');
  const belowMinimum = subtotal > 0 && subtotal < MIN_ORDER_TOTAL;

  const update = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || items.length === 0) return;

    if (!normalisePostalCode(form.postalCode)) {
      setError(t('errorPostalCode'));
      return;
    }
    if (belowMinimum) {
      setError(t('errorBelowMinimum', { amount: formatEuro(MIN_ORDER_TOTAL) }));
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            ...(form.nif ? { nif: form.nif } : {}),
          },
          address: {
            line1: form.line1,
            ...(form.line2 ? { line2: form.line2 } : {}),
            postalCode: form.postalCode,
            city: form.city,
          },
          ...(form.notes ? { notes: form.notes } : {}),
          locale: isPt ? 'pt' : 'en',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkoutUrl) {
        if (data.error === 'OUT_OF_STOCK' || data.error === 'PRODUCT_UNAVAILABLE') {
          setError(t('errorOutOfStock'));
        } else if (data.error === 'BELOW_MINIMUM') {
          setError(t('errorBelowMinimum', { amount: formatEuro(MIN_ORDER_TOTAL) }));
        } else if (data.error === 'INVALID_POSTAL_CODE') {
          setError(t('errorPostalCode'));
        } else {
          setError(t('errorGeneric'));
        }
        setSubmitting(false);
        return;
      }

      // The cart is cleared on the success page, once payment actually went through.
      window.location.href = data.checkoutUrl;
    } catch {
      setError(t('errorGeneric'));
      setSubmitting(false);
    }
  };

  if (!ready) {
    return <div className="py-24 text-center text-surface-400">{t('loading')}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-semibold text-black">{t('emptyCart')}</p>
        <p className="mt-2 text-surface-500">{t('emptyCartHint')}</p>
        <Link
          href={`/${locale}/shop`}
          className="mt-8 inline-flex items-center rounded-lg bg-black px-6 py-3.5 font-semibold text-white transition-colors hover:bg-gold hover:text-black"
        >
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px]">
      {/* ── Line items ── */}
      <div>
        {canceled && (
          <p className="mb-6 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-surface-700">
            {t('paymentCanceled')}
          </p>
        )}

        <ul className="divide-y divide-surface-200 border-y border-surface-200">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 py-5">
              <Link
                href={`/${locale}/shop/${item.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-surface-200 bg-white"
              >
                {item.image ? (
                  <Image src={item.image} alt="" fill sizes="96px" className="object-contain p-2" />
                ) : null}
              </Link>

              <div className="flex flex-1 flex-col">
                <Link
                  href={`/${locale}/shop/${item.slug}`}
                  className="font-semibold text-black hover:text-gold"
                >
                  {isPt ? item.namePt : item.nameEn}
                </Link>
                <p className="mt-1 text-sm text-surface-500">{formatEuro(item.price)}€</p>

                <div className="mt-auto flex items-center gap-3 pt-3">
                  <div className="flex items-center rounded-lg border border-surface-300">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      aria-label={t('decrease')}
                      className="px-3 py-1.5 text-lg leading-none text-surface-600 hover:text-black"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      aria-label={t('increase')}
                      className="px-3 py-1.5 text-lg leading-none text-surface-600 hover:text-black disabled:cursor-not-allowed disabled:text-surface-300"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(item.productId)}
                    className="text-sm text-surface-400 underline-offset-4 hover:text-black hover:underline"
                  >
                    {t('remove')}
                  </button>
                </div>
              </div>

              <p className="font-bold text-black">{formatEuro(item.price * item.quantity)}€</p>
            </li>
          ))}
        </ul>

        <Link
          href={`/${locale}/shop`}
          className="mt-6 inline-block text-sm text-surface-500 underline-offset-4 hover:text-black hover:underline"
        >
          ← {t('continueShopping')}
        </Link>
      </div>

      {/* ── Details + summary ── */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-surface-200 p-6">
        <h2 className="text-lg font-black text-black">{t('yourDetails')}</h2>

        <div className="mt-5 space-y-4">
          <Field label={t('fullName')} value={form.name} onChange={update('name')} required autoComplete="name" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Email" type="email" value={form.email} onChange={update('email')} required autoComplete="email" />
            <Field label={t('phone')} type="tel" value={form.phone} onChange={update('phone')} required autoComplete="tel" />
          </div>
          <Field label={t('nif')} value={form.nif} onChange={update('nif')} inputMode="numeric" autoComplete="off" />

          <h3 className="pt-2 text-sm font-bold uppercase tracking-wider text-surface-500">
            {t('shippingAddress')}
          </h3>
          <Field label={t('addressLine1')} value={form.line1} onChange={update('line1')} required autoComplete="address-line1" />
          <Field label={t('addressLine2')} value={form.line2} onChange={update('line2')} autoComplete="address-line2" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label={t('postalCode')}
              value={form.postalCode}
              onChange={update('postalCode')}
              required
              placeholder="8800-076"
              autoComplete="postal-code"
            />
            <Field label={t('city')} value={form.city} onChange={update('city')} required autoComplete="address-level2" />
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-surface-600">{t('notes')}</span>
            <textarea
              value={form.notes}
              onChange={update('notes')}
              rows={2}
              maxLength={500}
              className="w-full rounded-lg border border-surface-300 px-3 py-2.5 text-sm focus:border-black focus:outline-none"
            />
          </label>
        </div>

        {/* Totals */}
        <div className="mt-6 space-y-2 border-t border-surface-200 pt-5 text-sm">
          <Row label={t('subtotal')} value={`${formatEuro(subtotal)}€`} />
          <Row
            label={t('shipping')}
            value={
              zone === null
                ? t('shippingPending')
                : shippingCost === 0
                  ? t('free')
                  : `${formatEuro(shippingCost)}€`
            }
          />
          {zone && (
            <p className="text-xs text-surface-400">
              {isPt ? ZONE_LABEL[zone].pt : ZONE_LABEL[zone].en}
            </p>
          )}
          {missingForFree !== null && (
            <p className="text-xs text-gold-dark">
              {t('freeShippingMissing', { amount: formatEuro(missingForFree) })}
            </p>
          )}
          <div className="flex items-center justify-between border-t border-surface-200 pt-3 text-base font-black text-black">
            <span>{t('total')}</span>
            <span>{formatEuro(total)}€</span>
          </div>
        </div>

        {belowMinimum && (
          <p className="mt-4 text-sm text-red-600">
            {t('errorBelowMinimum', { amount: formatEuro(MIN_ORDER_TOTAL) })}
          </p>
        )}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting || belowMinimum}
          className="mt-6 w-full rounded-lg bg-black px-6 py-4 font-bold tracking-wide text-white transition-colors hover:bg-gold hover:text-black disabled:cursor-not-allowed disabled:bg-surface-200 disabled:text-surface-400"
        >
          {submitting ? t('processing') : t('payNow')}
        </button>
        <p className="mt-3 text-center text-xs text-surface-400">{t('securePayment')}</p>
      </form>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-surface-600">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-surface-300 px-3 py-2.5 text-sm focus:border-black focus:outline-none"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-surface-600">
      <span>{label}</span>
      <span className="font-semibold text-black">{value}</span>
    </div>
  );
}

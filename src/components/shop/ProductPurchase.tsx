'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import AddToCartButton, { type CartProductInput } from './AddToCartButton';

/** Quantity stepper + add-to-cart, used on the product page. */
export default function ProductPurchase({
  product,
  locale,
}: {
  product: CartProductInput;
  locale: string;
}) {
  const t = useTranslations('shop');
  const [quantity, setQuantity] = useState(1);
  const max = Math.max(product.stock, 1);

  return (
    <div>
      {product.stock > 0 && (
        <div className="mb-4 flex items-center gap-4">
          <span className="text-sm font-medium text-surface-600">{t('quantity')}</span>
          <div className="flex items-center rounded-lg border border-surface-300">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label={t('decrease')}
              className="px-3.5 py-2 text-lg leading-none text-surface-600 hover:text-black"
            >
              −
            </button>
            <span className="w-10 text-center font-semibold">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(max, q + 1))}
              disabled={quantity >= max}
              aria-label={t('increase')}
              className="px-3.5 py-2 text-lg leading-none text-surface-600 hover:text-black disabled:cursor-not-allowed disabled:text-surface-300"
            >
              +
            </button>
          </div>
        </div>
      )}

      <AddToCartButton product={product} locale={locale} quantity={quantity} />
    </div>
  );
}

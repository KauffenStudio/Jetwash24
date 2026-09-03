'use client';

import { useState } from 'react';
import { MAX_PER_LINE, useCart } from './CartProvider';

export type CartProductInput = {
  id: string;
  slug: string;
  namePt: string;
  nameEn: string;
  price: number;
  images: string[];
  deliveryMinDays: number | null;
  deliveryMaxDays: number | null;
};

/**
 * Adds a product to the cart and confirms it in place — no redirect, so the
 * customer keeps browsing. `compact` is the version used on catalogue cards.
 */
export default function AddToCartButton({
  product,
  locale,
  quantity = 1,
  compact = false,
  className = '',
}: {
  product: CartProductInput;
  locale: string;
  quantity?: number;
  compact?: boolean;
  className?: string;
}) {
  const { add, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const isPt = locale === 'pt';

  const inCart = items.find((i) => i.productId === product.id)?.quantity ?? 0;
  const maxedOut = inCart >= MAX_PER_LINE;

  const handleAdd = () => {
    if (maxedOut) return;
    add(
      {
        productId: product.id,
        slug: product.slug,
        namePt: product.namePt,
        nameEn: product.nameEn,
        price: product.price,
        image: product.images[0] ?? null,
        deliveryMinDays: product.deliveryMinDays,
        deliveryMaxDays: product.deliveryMaxDays,
      },
      quantity,
    );
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  const label = maxedOut
    ? isPt ? 'Máximo por artigo' : 'Max per item'
    : justAdded
      ? isPt ? 'Adicionado ✓' : 'Added ✓'
      : compact
        ? isPt ? 'Adicionar' : 'Add'
        : isPt ? 'Adicionar ao carrinho' : 'Add to cart';

  const base = compact
    ? 'w-full px-4 py-2.5 text-sm rounded-lg font-semibold transition-colors duration-200'
    : 'w-full px-6 py-4 rounded-lg font-bold tracking-wide transition-colors duration-200';

  const palette =
    maxedOut
      ? 'bg-surface-100 text-surface-400 cursor-not-allowed'
      : justAdded
        ? 'bg-green-600 text-white'
        : 'bg-black text-white hover:bg-gold hover:text-black';

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={maxedOut}
      aria-live="polite"
      className={`${base} ${palette} ${className}`}
    >
      {label}
    </button>
  );
}

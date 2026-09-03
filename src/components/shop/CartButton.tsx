'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useCart } from './CartProvider';

/** Header cart link with a live item count. */
export default function CartButton({ className = '' }: { className?: string }) {
  const { count, ready } = useCart();
  const locale = useLocale();
  const t = useTranslations('shop');

  return (
    <Link
      href={`/${locale}/shop/cart`}
      aria-label={t('cart')}
      className={`relative inline-flex items-center justify-center p-2 text-white/80 transition-colors hover:text-white ${className}`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.8L20 7H6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="20" r="1.4" fill="currentColor" />
        <circle cx="17" cy="20" r="1.4" fill="currentColor" />
      </svg>
      {ready && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-black">
          {count}
        </span>
      )}
    </Link>
  );
}

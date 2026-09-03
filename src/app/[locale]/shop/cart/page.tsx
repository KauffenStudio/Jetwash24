import type { Metadata } from 'next';
import CartView from '@/components/shop/CartView';

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  return {
    title: locale === 'pt' ? 'Carrinho' : 'Cart',
    // A cart is per-visitor state: useful to the customer, worthless in an index.
    robots: { index: false, follow: true },
  };
}

export default function CartPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { canceled?: string };
}) {
  const isPt = locale === 'pt';

  return (
    <div className="min-h-screen bg-white pt-28 sm:pt-36">
      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <h1 className="mb-10 text-3xl font-black text-black sm:text-4xl">
          {isPt ? 'Carrinho' : 'Your cart'}
        </h1>
        <CartView canceled={searchParams.canceled === '1'} />
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatEuro } from '@/lib/utils';
import { DELIVERY_DAYS, countryLabel } from '@/lib/shop/shipping';
import ClearCartOnMount from '@/components/shop/ClearCartOnMount';

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  return {
    title: locale === 'pt' ? 'Encomenda confirmada' : 'Order confirmed',
    robots: { index: false, follow: false },
  };
}

export default async function ShopSuccessPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { order_id?: string };
}) {
  const isPt = locale === 'pt';

  let order = null;
  if (searchParams.order_id) {
    try {
      order = await prisma.order.findUnique({
        where: { id: searchParams.order_id },
        include: { items: true },
      });
    } catch {
      // Show the generic success screen rather than an error page.
    }
  }

  // Stripe redirects here the moment the payment is accepted; the webhook that
  // flips the order to PAID can land a second or two later.
  const awaitingWebhook = order?.status === 'PENDING';

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 pt-20">
      <ClearCartOnMount />

      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M10 20L16.5 26.5L30 13"
              stroke="#16A34A"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-3xl font-black text-black">
          {isPt ? 'Encomenda confirmada!' : 'Order confirmed!'}
        </h1>
        {order && (
          <p className="mb-4 font-semibold text-gold">{order.orderNumber}</p>
        )}
        <p className="mb-8 text-surface-500">
          {awaitingWebhook
            ? isPt
              ? 'Estamos a confirmar o pagamento. Recebe o email de confirmação dentro de momentos.'
              : 'We are confirming your payment. Your confirmation email will arrive shortly.'
            : isPt
              ? `Enviámos um email com os detalhes. A encomenda chega em ${DELIVERY_DAYS.min} a ${DELIVERY_DAYS.max} dias úteis.`
              : `We sent you an email with the details. Your order arrives in ${DELIVERY_DAYS.min} to ${DELIVERY_DAYS.max} working days.`}
        </p>

        {order && (
          <div className="mb-8 rounded-lg border-2 border-surface-200 p-6 text-left">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-surface-400">
              {isPt ? 'Resumo' : 'Summary'}
            </p>
            <ul className="space-y-3 text-sm">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4">
                  <span className="text-surface-600">
                    {(isPt ? item.namePt : item.nameEn)} × {item.quantity}
                  </span>
                  <span className="font-semibold">
                    {formatEuro(item.unitPrice * item.quantity)}€
                  </span>
                </li>
              ))}
              <li className="flex justify-between gap-4 border-t border-surface-200 pt-3 text-surface-600">
                <span>{isPt ? 'Portes' : 'Shipping'}</span>
                <span className="font-semibold">
                  {order.shippingCost === 0
                    ? isPt
                      ? 'Grátis'
                      : 'Free'
                    : `${formatEuro(order.shippingCost)}€`}
                </span>
              </li>
              <li className="flex justify-between gap-4 border-t border-surface-200 pt-3 font-bold">
                <span>Total</span>
                <span className="text-gold">{formatEuro(order.total)}€</span>
              </li>
            </ul>

            <p className="mt-6 text-xs uppercase tracking-wide text-surface-400">
              {isPt ? 'Envio para' : 'Shipping to'}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-surface-600">
              {order.name}
              <br />
              {order.addressLine1}
              {order.addressLine2 ? (
                <>
                  <br />
                  {order.addressLine2}
                </>
              ) : null}
              <br />
              {order.postalCode} {order.city}
              <br />
              {countryLabel(order.country, locale)}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/${locale}/shop`}
            className="rounded-lg bg-black px-6 py-3.5 font-semibold text-white transition-colors hover:bg-gold hover:text-black"
          >
            {isPt ? 'Continuar a comprar' : 'Keep shopping'}
          </Link>
          <Link
            href={`/${locale}`}
            className="rounded-lg border border-surface-300 px-6 py-3.5 font-semibold text-black transition-colors hover:border-black"
          >
            {isPt ? 'Voltar ao início' : 'Back home'}
          </Link>
        </div>
      </div>
    </div>
  );
}

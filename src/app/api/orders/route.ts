import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { releaseExpiredOrders } from '@/lib/shop/expire-orders';
import {
  COUNTRY_CODES,
  MIN_ORDER_TOTAL,
  normalisePostalCode,
  shippingCostFor,
  zoneFor,
} from '@/lib/shop/shipping';

// How long an unpaid order stays open before it is marked expired. Kept just
// above Stripe Checkout's 30-minute minimum session lifetime, like bookings.
const HOLD_MINUTES = 31;

const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'https://www.jetwash24.com';

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1),
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(6),
    nif: z.string().optional(),
  }),
  address: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    postalCode: z.string().min(3),
    city: z.string().min(1),
    country: z.enum(COUNTRY_CODES as [string, ...string[]]),
  }),
  notes: z.string().max(500).optional(),
  locale: z.enum(['pt', 'en']).optional().default('pt'),
});

const orderInclude = { items: true } as const;

/** JW-YYMMDD-XXXX — short enough to read out on the phone, unique in practice. */
function generateOrderNumber(): string {
  const now = new Date();
  const ymd =
    String(now.getFullYear()).slice(2) +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `JW-${ymd}-${suffix}`;
}

// GET /api/orders — Admin only.
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const status = searchParams.get('status');
  const limit = searchParams.get('limit');

  const orders = await prisma.order.findMany({
    // Unpaid and expired orders are noise in the fulfilment list unless asked for.
    where: status ? { status: status as never } : { status: { notIn: ['PENDING', 'EXPIRED'] } },
    include: orderInclude,
    orderBy: { createdAt: 'desc' },
    take: limit ? Number(limit) : 100,
  });

  return NextResponse.json(orders);
}

// POST /api/orders — Public. Prices and shipping are recomputed server-side;
// the cart in the browser is only a suggestion.
export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'A loja está temporariamente indisponível. Tente mais tarde.' },
      { status: 503 },
    );
  }

  const body = await req.json();
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { items, customer, address, notes, locale } = parsed.data;

  const postalCode = normalisePostalCode(address.postalCode, address.country);
  if (!postalCode) {
    return NextResponse.json({ error: 'INVALID_POSTAL_CODE' }, { status: 400 });
  }

  // Collapse duplicate lines so the same product can't appear twice on the order.
  const quantities = new Map<string, number>();
  for (const item of items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }

  // Tidy away checkouts that were never paid, so the order list stays honest.
  await releaseExpiredOrders();

  const products = await prisma.product.findMany({
    where: { id: { in: [...quantities.keys()] }, isActive: true },
  });

  if (products.length !== quantities.size) {
    return NextResponse.json({ error: 'PRODUCT_UNAVAILABLE' }, { status: 409 });
  }

  const subtotal =
    Math.round(
      products.reduce((sum, p) => sum + p.price * (quantities.get(p.id) ?? 0), 0) * 100,
    ) / 100;

  if (subtotal < MIN_ORDER_TOTAL) {
    return NextResponse.json(
      { error: 'BELOW_MINIMUM', minimum: MIN_ORDER_TOTAL },
      { status: 400 },
    );
  }

  const zone = zoneFor(address.country, postalCode);
  const shippingCost = shippingCostFor(subtotal, zone);
  const total = Math.round((subtotal + shippingCost) * 100) / 100;

  // Products are made to order — nothing is reserved, so this is a plain write.
  let order;
  try {
    order = await (async () => {
      // Retry the order number on the (rare) unique collision.
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          return await prisma.order.create({
            data: {
              orderNumber: generateOrderNumber(),
              name: customer.name,
              email: customer.email,
              phone: customer.phone,
              nif: customer.nif ?? null,
              addressLine1: address.line1,
              addressLine2: address.line2 ?? null,
              postalCode,
              city: address.city,
              country: address.country,
              shippingZone: zone,
              notes: notes ?? null,
              locale,
              subtotal,
              shippingCost,
              total,
              paymentExpiresAt: new Date(Date.now() + HOLD_MINUTES * 60 * 1000),
              items: {
                create: products.map((p) => ({
                  productId: p.id,
                  namePt: p.namePt,
                  nameEn: p.nameEn,
                  unitPrice: p.price,
                  quantity: quantities.get(p.id) ?? 0,
                })),
              },
            },
            include: orderInclude,
          });
        } catch (err) {
          const code = (err as { code?: string }).code;
          if (code !== 'P2002' || attempt === 4) throw err;
        }
      }
      throw new Error('ORDER_NUMBER_COLLISION');
    })();
  } catch (err) {
    console.error('Order creation failed:', err);
    return NextResponse.json({ error: 'ORDER_FAILED' }, { status: 500 });
  }

  const isPt = locale === 'pt';

  try {
    const checkout = await getStripe().checkout.sessions.create({
      mode: 'payment',
      // No payment_method_types on purpose: Stripe then offers whatever is
      // enabled in the Dashboard and valid for the buyer's country — iDEAL in
      // the Netherlands, Bancontact in Belgium, cards everywhere. Selling
      // across the EU on cards alone leaves conversions on the table.
      customer_email: customer.email,
      line_items: [
        ...products.map((p) => ({
          quantity: quantities.get(p.id) ?? 0,
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(p.price * 100),
            product_data: {
              name: isPt ? p.namePt : p.nameEn,
              ...(p.images[0] ? { images: [p.images[0]] } : {}),
            },
          },
        })),
        ...(shippingCost > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: 'eur',
                  unit_amount: Math.round(shippingCost * 100),
                  product_data: { name: isPt ? 'Portes de envio' : 'Shipping' },
                },
              },
            ]
          : []),
      ],
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
      success_url: `${BASE_URL}/${locale}/shop/success?order_id=${order.id}`,
      cancel_url: `${BASE_URL}/${locale}/shop/cart?canceled=1`,
      expires_at: Math.floor(Date.now() / 1000) + HOLD_MINUTES * 60,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: checkout.id },
    });

    return NextResponse.json(
      { orderId: order.id, orderNumber: order.orderNumber, total, checkoutUrl: checkout.url },
      { status: 201 },
    );
  } catch (err) {
    console.error('Stripe checkout creation failed:', err);
    // Drop the dead order so it never shows up in the fulfilment list.
    await prisma.order
      .delete({ where: { id: order.id } })
      .catch((rollbackErr) => console.error('Order rollback failed:', rollbackErr));

    return NextResponse.json(
      { error: 'Não foi possível iniciar o pagamento. Tente novamente.' },
      { status: 502 },
    );
  }
}

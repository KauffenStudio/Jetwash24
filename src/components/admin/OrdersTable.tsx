'use client';

import { useEffect, useState } from 'react';
import { formatDateShort, formatEuro } from '@/lib/utils';
import { ZONE_LABEL, type ShippingZone } from '@/lib/shop/shipping';

type OrderItem = {
  id: string;
  namePt: string;
  nameEn: string;
  unitPrice: number;
  quantity: number;
};

type Order = {
  id: string;
  orderNumber: string;
  name: string;
  email: string;
  phone: string;
  nif: string | null;
  addressLine1: string;
  addressLine2: string | null;
  postalCode: string;
  city: string;
  shippingZone: string;
  notes: string | null;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: string;
  trackingCode: string | null;
  createdAt: string;
  items: OrderItem[];
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Por pagar',
  PAID: 'Pago',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
  EXPIRED: 'Expirado',
  REFUNDED: 'Reembolsado',
};

const STATUS_STYLE: Record<string, string> = {
  PENDING: 'bg-surface-100 text-surface-600',
  PAID: 'bg-green-50 text-green-700',
  SHIPPED: 'bg-blue-50 text-blue-700',
  DELIVERED: 'bg-surface-800 text-white',
  CANCELLED: 'bg-red-50 text-red-600',
  EXPIRED: 'bg-surface-100 text-surface-400',
  REFUNDED: 'bg-amber-50 text-amber-700',
};

/** Statuses the admin can set by hand (PENDING/EXPIRED are driven by payment). */
const SETTABLE = ['PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tracking, setTracking] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchOrders = async () => {
    const res = await fetch('/api/orders');
    setOrders(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const patch = async (id: string, body: Record<string, unknown>) => {
    setBusyId(id);
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setBusyId(null);
    fetchOrders();
  };

  // Marking SHIPPED emails the customer, so send the tracking code in the same
  // request — otherwise the email goes out without it.
  const markShipped = (order: Order) => {
    const code = (tracking[order.id] ?? order.trackingCode ?? '').trim();
    patch(order.id, { status: 'SHIPPED', trackingCode: code || null });
  };

  if (loading) {
    return <div className="py-16 text-center text-surface-400">A carregar...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-surface-200 py-16 text-center text-surface-400">
        Ainda não há encomendas pagas.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const isOpen = expanded === order.id;
        const zone = ZONE_LABEL[(order.shippingZone as ShippingZone) ?? 'CONTINENTAL'];

        return (
          <div key={order.id} className="rounded-lg border-2 border-surface-200">
            <button
              onClick={() => setExpanded(isOpen ? null : order.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 p-4 text-left"
            >
              <span className={`rounded px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[order.status]}`}>
                {STATUS_LABEL[order.status] ?? order.status}
              </span>
              <span className="font-mono text-sm font-bold text-black">{order.orderNumber}</span>
              <span className="min-w-0 flex-1 truncate text-sm text-surface-600">
                {order.name} · {order.city}
              </span>
              <span className="text-sm text-surface-400">{formatDateShort(order.createdAt)}</span>
              <span className="font-black text-black">{formatEuro(order.total)}€</span>
              <span className="text-surface-400">{isOpen ? '▴' : '▾'}</span>
            </button>

            {isOpen && (
              <div className="border-t border-surface-200 p-5">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-surface-400">
                      Artigos
                    </p>
                    <ul className="space-y-2 text-sm">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between gap-4">
                          <span className="text-surface-600">
                            {item.namePt} × {item.quantity}
                          </span>
                          <span className="font-semibold">
                            {formatEuro(item.unitPrice * item.quantity)}€
                          </span>
                        </li>
                      ))}
                      <li className="flex justify-between gap-4 border-t border-surface-200 pt-2 text-surface-600">
                        <span>Portes ({zone.pt})</span>
                        <span>
                          {order.shippingCost === 0 ? 'Grátis' : `${formatEuro(order.shippingCost)}€`}
                        </span>
                      </li>
                      <li className="flex justify-between gap-4 border-t border-surface-200 pt-2 font-bold">
                        <span>Total</span>
                        <span>{formatEuro(order.total)}€</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-surface-400">
                      Envio
                    </p>
                    <p className="text-sm leading-relaxed text-surface-600">
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
                      {order.phone} · {order.email}
                      {order.nif ? (
                        <>
                          <br />
                          NIF: {order.nif}
                        </>
                      ) : null}
                    </p>
                    {order.notes && (
                      <p className="mt-3 rounded border-l-2 border-gold bg-gold/10 px-3 py-2 text-sm text-surface-600">
                        {order.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-end gap-3 border-t border-surface-200 pt-5">
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-surface-500">
                      Código de seguimento
                    </span>
                    <input
                      value={tracking[order.id] ?? order.trackingCode ?? ''}
                      onChange={(e) =>
                        setTracking((t) => ({ ...t, [order.id]: e.target.value }))
                      }
                      placeholder="CTT / DPD…"
                      className="rounded border border-surface-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                    />
                  </label>

                  <button
                    onClick={() => markShipped(order)}
                    disabled={busyId === order.id || order.status === 'SHIPPED'}
                    className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gold hover:text-black disabled:bg-surface-200 disabled:text-surface-400"
                  >
                    Marcar enviado + email
                  </button>

                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-surface-500">Estado</span>
                    <select
                      value={order.status}
                      onChange={(e) => patch(order.id, { status: e.target.value })}
                      disabled={busyId === order.id}
                      className="rounded border border-surface-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                    >
                      {!SETTABLE.includes(order.status) && (
                        <option value={order.status}>{STATUS_LABEL[order.status]}</option>
                      )}
                      {SETTABLE.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABEL[status]}
                        </option>
                      ))}
                    </select>
                  </label>

                  <p className="text-xs text-surface-400">
                    Cancelar ou reembolsar devolve o stock ao inventário.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

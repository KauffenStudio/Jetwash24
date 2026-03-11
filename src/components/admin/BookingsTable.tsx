'use client';

import { useState } from 'react';
import { Booking } from '@/types';
import { formatPrice, formatDateShort, formatDurationLabel } from '@/lib/utils';

interface BookingsTableProps {
  bookings: Booking[];
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-surface-100 text-surface-600',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  CANCELLED: 'Cancelado',
  COMPLETED: 'Concluído',
};

export default function BookingsTable({ bookings, onCancel, onComplete }: BookingsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 text-surface-400">
        <p className="text-4xl mb-3">📋</p>
        <p>Sem reservas para mostrar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-surface-200">
      <table className="w-full text-sm">
        <thead className="bg-surface-50 border-b border-surface-200">
          <tr>
            {['Data', 'Hora', 'Cliente', 'Serviço', 'Carro', 'Duração', 'Total', 'Estado', ''].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wide whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100">
          {bookings.map((booking) => {
            const isExpanded = expandedId === booking.id;
            return (
              <>
                <tr
                  key={booking.id}
                  className="hover:bg-surface-50 cursor-pointer transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                >
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-black">
                    {formatDateShort(booking.date)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-black font-mono">
                    {booking.startTime}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-black">{booking.customer.name}</p>
                      <p className="text-surface-400 text-xs">{booking.customer.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-black max-w-xs truncate">
                    {booking.service.namePt}
                  </td>
                  <td className="px-4 py-3 text-surface-600 whitespace-nowrap">
                    {booking.customer.carModel}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-surface-600">
                    {formatDurationLabel(booking.totalDuration, 'pt')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-bold text-black">
                    {formatPrice(booking.totalPrice)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${STATUS_STYLES[booking.status]}`}>
                      {STATUS_LABELS[booking.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-surface-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
                  </td>
                </tr>

                {/* Expanded row */}
                {isExpanded && (
                  <tr key={`${booking.id}-expanded`} className="bg-surface-50">
                    <td colSpan={9} className="px-6 py-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs font-semibold text-surface-400 uppercase mb-1">Cliente</p>
                          <p>{booking.customer.name}</p>
                          <p className="text-surface-500">{booking.customer.email}</p>
                          <p className="text-surface-500">{booking.customer.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-surface-400 uppercase mb-1">Veículo</p>
                          <p>{booking.customer.carModel}</p>
                          <p className="text-surface-500 font-mono">{booking.customer.licensePlate}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-surface-400 uppercase mb-1">Serviço</p>
                          <p>{booking.service.namePt}</p>
                          {booking.addons.length > 0 && (
                            <p className="text-surface-500 text-xs mt-1">
                              + {booking.addons.map((a) => a.addon.namePt).join(', ')}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-surface-400 uppercase mb-1">Pagamento</p>
                          <p className="text-xs">Total: <span className="font-bold text-black">{formatPrice(booking.totalPrice)}</span></p>
                          {booking.depositAmount > 0 && (
                            <>
                              <p className="text-xs text-green-700">Sinal pago: <span className="font-semibold">{formatPrice(booking.depositAmount)}</span></p>
                              <p className="text-xs text-surface-500">Restante no local: <span className="font-semibold">{formatPrice(booking.remainingAmount)}</span></p>
                            </>
                          )}
                        </div>
                        {booking.customer.notes && (
                          <div className="sm:col-span-2">
                            <p className="text-xs font-semibold text-surface-400 uppercase mb-1">Notas</p>
                            <p className="text-surface-600">{booking.customer.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                        <div className="flex gap-3 mt-4 pt-4 border-t border-surface-200">
                          {booking.status === 'CONFIRMED' && onComplete && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onComplete(booking.id); }}
                              className="px-4 py-2 bg-black text-white text-xs font-semibold rounded hover:bg-surface-800 transition-colors"
                            >
                              Marcar como Concluído
                            </button>
                          )}
                          {onCancel && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Cancelar esta reserva? O cliente será reembolsado.')) {
                                  onCancel(booking.id);
                                }
                              }}
                              className="px-4 py-2 border border-red-300 text-red-600 text-xs font-semibold rounded hover:bg-red-50 transition-colors"
                            >
                              Cancelar Reserva
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

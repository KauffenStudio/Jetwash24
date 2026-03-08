'use client';

import { Booking } from '@/types';
import { formatDurationLabel, formatPrice } from '@/lib/utils';

interface DayScheduleProps {
  bookings: Booking[];
  title: string;
  emptyMessage: string;
}

export default function DaySchedule({ bookings, title, emptyMessage }: DayScheduleProps) {
  const confirmed = bookings.filter((b) => b.status === 'CONFIRMED');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-black">{title}</h2>
        <span className="px-2 py-1 bg-black text-white text-xs font-bold rounded">
          {confirmed.length} {confirmed.length === 1 ? 'marcação' : 'marcações'}
        </span>
      </div>

      {confirmed.length === 0 ? (
        <div className="border border-surface-200 rounded-lg py-10 text-center text-surface-400">
          <p className="text-3xl mb-2">✓</p>
          <p className="text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {confirmed
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((booking) => (
              <JobCard key={booking.id} booking={booking} />
            ))}
        </div>
      )}
    </div>
  );
}

function JobCard({ booking }: { booking: Booking }) {
  const addonsNames = booking.addons.map((a) => a.addon.namePt).join(', ');

  return (
    <div className="border-2 border-surface-200 rounded-lg p-5 hover:border-black transition-colors">
      {/* Time bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl font-black text-black font-mono">
          {booking.startTime}
        </div>
        <div className="text-surface-400 text-sm">→</div>
        <div className="text-lg font-bold text-surface-600 font-mono">
          {booking.endTime}
        </div>
        <div className="ml-auto">
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
            Confirmado
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {/* Service */}
        <div>
          <p className="text-xs font-semibold text-surface-400 uppercase mb-1">Serviço</p>
          <p className="font-bold text-black">{booking.service.namePt}</p>
          {addonsNames && (
            <p className="text-surface-500 text-xs mt-0.5">+ {addonsNames}</p>
          )}
          <p className="text-surface-400 text-xs mt-1">
            {formatDurationLabel(booking.totalDuration, 'pt')}
          </p>
        </div>

        {/* Customer */}
        <div>
          <p className="text-xs font-semibold text-surface-400 uppercase mb-1">Cliente</p>
          <p className="font-bold text-black">{booking.customer.name}</p>
          <p className="text-surface-500 text-xs">{booking.customer.phone}</p>
        </div>

        {/* Vehicle */}
        <div>
          <p className="text-xs font-semibold text-surface-400 uppercase mb-1">Veículo</p>
          <p className="font-medium text-black">{booking.customer.carModel}</p>
          <p className="text-surface-500 font-mono text-xs">{booking.customer.licensePlate}</p>
        </div>

        {/* Notes */}
        {booking.customer.notes && (
          <div>
            <p className="text-xs font-semibold text-surface-400 uppercase mb-1">Notas</p>
            <p className="text-surface-600 text-xs">{booking.customer.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

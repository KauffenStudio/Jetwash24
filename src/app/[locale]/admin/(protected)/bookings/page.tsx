'use client';

import { useState, useEffect, useCallback } from 'react';
import { Booking } from '@/types';
import BookingsTable from '@/components/admin/BookingsTable';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('active');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const params = statusFilter === 'active' ? '' : `&status=${statusFilter}`;
    const res = await fetch(`/api/bookings?${params}`);
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleCancel = async (id: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel' }),
    });
    fetchBookings();
  };

  const handleComplete = async (id: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'complete' }),
    });
    fetchBookings();
  };

  const statuses = [
    { value: 'active', label: 'Ativas' },
    { value: 'CONFIRMED', label: 'Confirmadas' },
    { value: 'PENDING', label: 'Pendentes' },
    { value: 'CANCELLED', label: 'Canceladas' },
    { value: 'COMPLETED', label: 'Concluídas' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-black mb-6">Reservas</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              statusFilter === s.value
                ? 'bg-black text-white'
                : 'bg-white border border-surface-200 text-surface-600 hover:border-black'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-surface-400">
          <div className="w-6 h-6 border-2 border-surface-300 border-t-black rounded-full animate-spin mx-auto mb-3" />
          <p>A carregar...</p>
        </div>
      ) : (
        <BookingsTable
          bookings={bookings}
          onCancel={handleCancel}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}

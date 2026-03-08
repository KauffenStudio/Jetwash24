'use client';

import { useState, useEffect } from 'react';
import { BlockedSlot } from '@/types';
import { format } from 'date-fns';

export default function AdminBlockedSlotsPage() {
  const [slots, setSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    reason: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchSlots = async () => {
    const res = await fetch('/api/blocked-slots');
    setSlots(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchSlots(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/blocked-slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setForm((f) => ({ ...f, reason: '' }));
    fetchSlots();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este bloqueio?')) return;
    await fetch(`/api/blocked-slots/${id}`, { method: 'DELETE' });
    fetchSlots();
  };

  const TIME_OPTIONS = Array.from({ length: 17 }, (_, i) => {
    const h = 9 + Math.floor(i / 2);
    const m = (i % 2) * 30;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black text-black mb-2">Bloquear Horários</h1>
      <p className="text-surface-500 mb-8">Bloqueia períodos para manutenção, pausas ou outros compromissos</p>

      {/* Create form */}
      <div className="border-2 border-black rounded-lg p-6 mb-8">
        <h2 className="font-bold text-lg mb-4">Novo Bloqueio</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Data</label>
            <input
              type="date"
              value={form.date}
              min={format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              required
              className="w-full px-3 py-2 border-2 border-surface-200 rounded-lg focus:outline-none focus:border-black text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Hora Início</label>
              <select
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                className="w-full px-3 py-2 border-2 border-surface-200 rounded-lg focus:outline-none focus:border-black text-sm"
              >
                {TIME_OPTIONS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Hora Fim</label>
              <select
                value={form.endTime}
                onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                className="w-full px-3 py-2 border-2 border-surface-200 rounded-lg focus:outline-none focus:border-black text-sm"
              >
                {TIME_OPTIONS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Motivo (opcional)</label>
            <input
              type="text"
              value={form.reason}
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              placeholder="Ex: Almoço, Manutenção..."
              className="w-full px-3 py-2 border-2 border-surface-200 rounded-lg focus:outline-none focus:border-black text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-black text-white font-semibold rounded-lg hover:bg-surface-800 transition-colors disabled:opacity-50 text-sm"
          >
            {saving ? 'A guardar...' : 'Bloquear Horário'}
          </button>
        </form>
      </div>

      {/* Existing slots */}
      <h2 className="font-bold text-lg mb-4">Bloqueios Ativos</h2>
      {loading ? (
        <p className="text-surface-400">A carregar...</p>
      ) : slots.length === 0 ? (
        <p className="text-surface-400 text-sm">Sem bloqueios configurados.</p>
      ) : (
        <div className="space-y-3">
          {slots
            .filter((s) => new Date(s.date) >= new Date(format(new Date(), 'yyyy-MM-dd')))
            .map((slot) => (
              <div key={slot.id} className="flex items-center justify-between gap-4 py-3 border-b border-surface-200">
                <div>
                  <p className="font-semibold text-black">
                    {new Date(slot.date).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    {' '} — {slot.startTime} → {slot.endTime}
                  </p>
                  {slot.reason && <p className="text-sm text-surface-500">{slot.reason}</p>}
                </div>
                <button
                  onClick={() => handleDelete(slot.id)}
                  className="text-red-400 hover:text-red-600 text-sm transition-colors flex-shrink-0"
                >
                  Remover
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

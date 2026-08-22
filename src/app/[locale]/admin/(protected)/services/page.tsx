'use client';

import { useState, useEffect } from 'react';
import { Service } from '@/types';
import { formatDurationLabel, formatPrice } from '@/lib/utils';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ price: number; compareAtPrice: number; duration: number }>({ price: 0, compareAtPrice: 0, duration: 0 });

  const fetchServices = async () => {
    const res = await fetch('/api/services');
    const data = await res.json();
    setServices(data);
    setLoading(false);
  };

  useEffect(() => { fetchServices(); }, []);

  const startEdit = (service: Service) => {
    setEditingId(service.id);
    setEditForm({ price: service.price, compareAtPrice: service.compareAtPrice ?? 0, duration: service.duration });
  };

  const saveEdit = async (id: string) => {
    await fetch(`/api/services/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price: editForm.price,
        duration: editForm.duration,
        // 0 (or blank) clears the "before" price
        compareAtPrice: editForm.compareAtPrice > 0 ? editForm.compareAtPrice : null,
      }),
    });
    setEditingId(null);
    fetchServices();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/services/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    });
    fetchServices();
  };

  const CATEGORY_LABEL: Record<string, string> = {
    INTERIOR: 'Interior',
    EXTERIOR: 'Exterior',
    POLISHING: 'Polimento',
    FULL: 'Pacote',
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-black mb-2">Serviços</h1>
      <p className="text-surface-500 mb-8">Edite preços e durações dos serviços</p>

      {loading ? (
        <div className="text-center py-16 text-surface-400">A carregar...</div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => {
            const isEditing = editingId === service.id;
            return (
              <div
                key={service.id}
                className={`border-2 rounded-lg p-5 ${
                  service.isActive ? 'border-surface-200' : 'border-surface-100 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-surface-100 rounded text-surface-600">
                        {CATEGORY_LABEL[service.category]}
                      </span>
                      {!service.isActive && (
                        <span className="text-xs font-semibold px-2 py-0.5 bg-red-50 rounded text-red-500">
                          Inativo
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-black">{service.namePt}</h3>
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-3">
                      <div>
                        <label className="block text-xs text-surface-400 mb-1">Preço antes (€)</label>
                        <input
                          type="number"
                          value={editForm.compareAtPrice || ''}
                          placeholder="—"
                          onChange={(e) => setEditForm((f) => ({ ...f, compareAtPrice: Number(e.target.value) }))}
                          className="w-20 px-2 py-1.5 border border-surface-300 rounded text-sm focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-surface-400 mb-1">Preço agora (€)</label>
                        <input
                          type="number"
                          value={editForm.price}
                          onChange={(e) => setEditForm((f) => ({ ...f, price: Number(e.target.value) }))}
                          className="w-20 px-2 py-1.5 border border-surface-300 rounded text-sm focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-surface-400 mb-1">Duração (min)</label>
                        <input
                          type="number"
                          value={editForm.duration}
                          onChange={(e) => setEditForm((f) => ({ ...f, duration: Number(e.target.value) }))}
                          className="w-20 px-2 py-1.5 border border-surface-300 rounded text-sm focus:outline-none focus:border-black"
                        />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => saveEdit(service.id)}
                          className="px-3 py-1.5 bg-black text-white text-xs font-semibold rounded hover:bg-surface-800"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 border border-surface-300 text-xs font-semibold rounded hover:border-black"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-black text-black">
                          {service.compareAtPrice && service.compareAtPrice > service.price && (
                            <span className="text-sm font-medium text-surface-400 line-through mr-2">
                              {formatPrice(service.compareAtPrice)}
                            </span>
                          )}
                          {formatPrice(service.price)}
                        </p>
                        <p className="text-sm text-surface-500">{formatDurationLabel(service.duration, 'pt')}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(service)}
                          className="px-3 py-1.5 border border-surface-200 text-xs font-semibold rounded hover:border-black transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => toggleActive(service.id, service.isActive)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                            service.isActive
                              ? 'border border-red-200 text-red-500 hover:bg-red-50'
                              : 'border border-green-200 text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {service.isActive ? 'Desativar' : 'Ativar'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

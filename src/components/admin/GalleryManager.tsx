'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GalleryImage } from '@/types';

interface GalleryManagerProps {
  images: GalleryImage[];
  onDelete: (id: string) => void;
  onUpload: (formData: FormData) => Promise<void>;
}

export default function GalleryManager({ images, onDelete, onUpload }: GalleryManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    descriptionPt: '',
    descriptionEn: '',
    servicePerformed: '',
  });
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beforeFile || !afterFile) {
      alert('Por favor selecione as duas imagens (antes e depois).');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('beforeImage', beforeFile);
      formData.append('afterImage', afterFile);
      formData.append('descriptionPt', form.descriptionPt);
      formData.append('descriptionEn', form.descriptionEn);
      formData.append('servicePerformed', form.servicePerformed);

      await onUpload(formData);
      setForm({ descriptionPt: '', descriptionEn: '', servicePerformed: '' });
      setBeforeFile(null);
      setAfterFile(null);
      setShowForm(false);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-black">Galeria ({images.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-black text-white text-sm font-semibold rounded hover:bg-surface-800 transition-colors"
        >
          + Adicionar Foto
        </button>
      </div>

      {/* Upload form */}
      {showForm && (
        <div className="border-2 border-black rounded-lg p-6 mb-8">
          <h3 className="font-bold text-lg mb-4">Nova Foto Antes/Depois</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Foto ANTES <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setBeforeFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-black file:text-white file:font-semibold hover:file:bg-surface-800 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Foto DEPOIS <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setAfterFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-black file:text-white file:font-semibold hover:file:bg-surface-800 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Serviço Realizado</label>
              <input
                type="text"
                value={form.servicePerformed}
                onChange={(e) => setForm((f) => ({ ...f, servicePerformed: e.target.value }))}
                placeholder="Ex: Restauração Interior Premium"
                className="w-full px-3 py-2 border border-surface-300 rounded focus:outline-none focus:border-black text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Descrição (PT)</label>
                <input
                  type="text"
                  value={form.descriptionPt}
                  onChange={(e) => setForm((f) => ({ ...f, descriptionPt: e.target.value }))}
                  placeholder="Descrição em português"
                  className="w-full px-3 py-2 border border-surface-300 rounded focus:outline-none focus:border-black text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Description (EN)</label>
                <input
                  type="text"
                  value={form.descriptionEn}
                  onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))}
                  placeholder="Description in English"
                  className="w-full px-3 py-2 border border-surface-300 rounded focus:outline-none focus:border-black text-sm"
                />
              </div>
            </div>

            <p className="text-xs text-surface-400">
              Atenção: Certifique-se que as matrículas estão ocultadas nas fotografias antes de carregar.
            </p>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2 bg-black text-white font-semibold rounded hover:bg-surface-800 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    A carregar...
                  </>
                ) : 'Guardar Foto'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-surface-300 font-semibold rounded hover:border-black transition-colors text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery grid */}
      {images.length === 0 ? (
        <div className="text-center py-16 text-surface-400">
          <p className="text-4xl mb-3">🖼</p>
          <p>Sem fotos na galeria. Adicione a primeira!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div key={img.id} className="border border-surface-200 rounded-lg overflow-hidden group">
              <div className="grid grid-cols-2 gap-0.5 bg-surface-200">
                <div className="relative aspect-[4/3]">
                  <Image src={img.beforeImageUrl} alt="Antes" fill className="object-cover" />
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">Antes</span>
                </div>
                <div className="relative aspect-[4/3]">
                  <Image src={img.afterImageUrl} alt="Depois" fill className="object-cover" />
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">Depois</span>
                </div>
              </div>
              <div className="p-3 flex items-start justify-between gap-2">
                <div className="text-xs text-surface-500 flex-1 min-w-0">
                  {img.servicePerformed && <p className="font-semibold text-black truncate">{img.servicePerformed}</p>}
                  {img.descriptionPt && <p className="truncate mt-0.5">{img.descriptionPt}</p>}
                </div>
                <button
                  onClick={() => {
                    if (confirm('Eliminar esta foto?')) onDelete(img.id);
                  }}
                  className="flex-shrink-0 text-red-400 hover:text-red-600 text-xs transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

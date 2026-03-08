'use client';

import { useState, useEffect } from 'react';
import { GalleryImage } from '@/types';
import GalleryManager from '@/components/admin/GalleryManager';

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    const res = await fetch('/api/gallery');
    const data = await res.json();
    setImages(data);
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    fetchImages();
  };

  const handleUpload = async (formData: FormData) => {
    const res = await fetch('/api/gallery', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error ?? 'Erro ao carregar imagem');
      return;
    }
    fetchImages();
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-surface-400">
        <div className="w-6 h-6 border-2 border-surface-300 border-t-black rounded-full animate-spin mx-auto mb-3" />
        A carregar...
      </div>
    );
  }

  return (
    <GalleryManager
      images={images}
      onDelete={handleDelete}
      onUpload={handleUpload}
    />
  );
}

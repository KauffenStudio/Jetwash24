'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { PRODUCT_CATEGORIES } from '@/lib/shop/catalog';
import { formatEuro } from '@/lib/utils';

type Product = {
  id: string;
  slug: string;
  namePt: string;
  nameEn: string;
  descriptionPt: string | null;
  descriptionEn: string | null;
  brand: string | null;
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  supplierUrl: string | null;
  supplierCost: number | null;
  deliveryMinDays: number | null;
  deliveryMaxDays: number | null;
  images: string[];
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

const EMPTY = {
  namePt: '',
  nameEn: '',
  descriptionPt: '',
  descriptionEn: '',
  brand: '',
  sku: '',
  price: '',
  compareAtPrice: '',
  supplierUrl: '',
  supplierCost: '',
  deliveryMinDays: '',
  deliveryMaxDays: '',
  category: 'WASH',
  sortOrder: '0',
  isFeatured: false,
};

type FormState = typeof EMPTY;

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [files, setFiles] = useState<FileList | null>(null);
  const [keptImages, setKeptImages] = useState<string[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  /** Moves one photo within the kept list. Index 0 is the catalogue cover. */
  const moveImage = (from: number, to: number) =>
    setKeptImages((imgs) => {
      if (from === to || to < 0 || to >= imgs.length) return imgs;
      const next = [...imgs];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });

  const fetchProducts = async () => {
    const res = await fetch('/api/products?all=1');
    setProducts(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setKeptImages([]);
    setFiles(null);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      namePt: product.namePt,
      nameEn: product.nameEn,
      descriptionPt: product.descriptionPt ?? '',
      descriptionEn: product.descriptionEn ?? '',
      brand: product.brand ?? '',
      sku: product.sku ?? '',
      price: String(product.price),
      compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : '',
      supplierUrl: product.supplierUrl ?? '',
      supplierCost: product.supplierCost ? String(product.supplierCost) : '',
      deliveryMinDays: product.deliveryMinDays ? String(product.deliveryMinDays) : '',
      deliveryMaxDays: product.deliveryMaxDays ? String(product.deliveryMaxDays) : '',
      category: product.category,
      sortOrder: String(product.sortOrder),
      isFeatured: product.isFeatured,
    });
    setKeptImages(product.images);
    setFiles(null);
    setError(null);
    setShowForm(true);
  };

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.namePt || !form.nameEn || !form.price) {
      setError('Nome (PT), nome (EN) e preço são obrigatórios.');
      return;
    }

    setSaving(true);
    setError(null);

    const data = new FormData();
    data.set('namePt', form.namePt);
    data.set('nameEn', form.nameEn);
    if (form.descriptionPt) data.set('descriptionPt', form.descriptionPt);
    if (form.descriptionEn) data.set('descriptionEn', form.descriptionEn);
    if (form.brand) data.set('brand', form.brand);
    if (form.sku) data.set('sku', form.sku);
    data.set('price', form.price);
    if (form.compareAtPrice) data.set('compareAtPrice', form.compareAtPrice);
    if (form.supplierUrl) data.set('supplierUrl', form.supplierUrl);
    if (form.supplierCost) data.set('supplierCost', form.supplierCost);
    if (form.deliveryMinDays) data.set('deliveryMinDays', form.deliveryMinDays);
    if (form.deliveryMaxDays) data.set('deliveryMaxDays', form.deliveryMaxDays);
    data.set('category', form.category);
    data.set('sortOrder', form.sortOrder || '0');
    data.set('isFeatured', String(form.isFeatured));
    data.set('existingImages', JSON.stringify(keptImages));
    if (files) Array.from(files).forEach((file) => data.append('images', file));

    const res = await fetch(
      editing ? `/api/products/${editing.id}` : '/api/products',
      { method: editing ? 'PATCH' : 'POST', body: data },
    );

    setSaving(false);

    if (!res.ok) {
      setError('Não foi possível guardar. Verifique os campos e tente de novo.');
      return;
    }

    setShowForm(false);
    fetchProducts();
  };

  const toggleActive = async (product: Product) => {
    await fetch(`/api/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !product.isActive }),
    });
    fetchProducts();
  };

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-2xl font-black text-black">Produtos</h1>
          <p className="text-surface-500">
            Catálogo da loja online · produtos sob encomenda, sem contagem de stock
          </p>
        </div>
        <button
          onClick={openNew}
          className="rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold hover:text-black"
        >
          + Novo produto
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-lg border-2 border-black p-6"
        >
          <h2 className="mb-5 font-black text-black">
            {editing ? `Editar — ${editing.namePt}` : 'Novo produto'}
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Nome (PT)" value={form.namePt} onChange={set('namePt')} required />
            <Input label="Nome (EN)" value={form.nameEn} onChange={set('nameEn')} required />
            <Input label="Marca" value={form.brand} onChange={set('brand')} />
            <Input label="Referência / SKU" value={form.sku} onChange={set('sku')} />
            <Input label="Preço (€)" type="number" step="0.01" value={form.price} onChange={set('price')} required />
            <Input label="Preço antes (€)" type="number" step="0.01" value={form.compareAtPrice} onChange={set('compareAtPrice')} />
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-surface-500">Categoria</span>
              <select
                value={form.category}
                onChange={set('category')}
                className="w-full rounded border border-surface-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.pt}
                  </option>
                ))}
              </select>
            </label>
            <Input label="Custo de compra (€)" type="number" step="0.01" value={form.supplierCost} onChange={set('supplierCost')} />
            <Input label="Entrega — mín. dias" type="number" value={form.deliveryMinDays} onChange={set('deliveryMinDays')} placeholder="7" />
            <Input label="Entrega — máx. dias" type="number" value={form.deliveryMaxDays} onChange={set('deliveryMaxDays')} placeholder="15" />
            <Input label="Ordem" type="number" value={form.sortOrder} onChange={set('sortOrder')} />
            <label className="flex items-end gap-2 pb-2 text-sm text-surface-600">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
              />
              Destacar na loja
            </label>
          </div>

          <div className="mt-4">
            <Input
              label="Link do fornecedor (só visível aqui)"
              type="url"
              value={form.supplierUrl}
              onChange={set('supplierUrl')}
              placeholder="https://pt.aliexpress.com/item/…"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Textarea label="Descrição (PT)" value={form.descriptionPt} onChange={set('descriptionPt')} />
            <Textarea label="Descrição (EN)" value={form.descriptionEn} onChange={set('descriptionEn')} />
          </div>

          <div className="mt-4">
            <span className="mb-1 block text-xs font-medium text-surface-500">Fotos</span>
            {keptImages.length > 0 && (
              <ul className="mb-3 flex flex-wrap gap-3">
                {keptImages.map((url, i) => (
                  <li
                    key={url}
                    draggable
                    onDragStart={() => setDragIndex(i)}
                    onDragEnd={() => setDragIndex(null)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragIndex !== null) moveImage(dragIndex, i);
                      setDragIndex(null);
                    }}
                    className={`relative h-24 w-20 cursor-grab rounded border bg-white active:cursor-grabbing ${
                      dragIndex === i ? 'border-gold opacity-50' : 'border-surface-200'
                    }`}
                  >
                    <div className="relative h-20 w-full overflow-hidden rounded-t">
                      <Image src={url} alt="" fill sizes="80px" className="object-contain p-1" />
                      {i === 0 && (
                        <span className="absolute left-0 top-0 bg-gold px-1 text-[10px] font-bold text-black">
                          Capa
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setKeptImages((imgs) => imgs.filter((img) => img !== url))}
                        aria-label={`Remover foto ${i + 1}`}
                        className="absolute right-0 top-0 bg-black/70 px-1.5 text-xs text-white hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                    {/* Arrows keep reordering usable by keyboard and on touch, where
                        HTML5 drag events don't fire. */}
                    <div className="flex h-4 items-stretch border-t border-surface-200 text-[11px] leading-none">
                      <button
                        type="button"
                        onClick={() => moveImage(i, i - 1)}
                        disabled={i === 0}
                        aria-label={`Mover foto ${i + 1} para trás`}
                        className="flex-1 text-surface-500 hover:bg-surface-100 hover:text-black disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(i, i + 1)}
                        disabled={i === keptImages.length - 1}
                        aria-label={`Mover foto ${i + 1} para a frente`}
                        className="flex-1 border-l border-surface-200 text-surface-500 hover:bg-surface-100 hover:text-black disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        →
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="text-sm text-surface-600"
            />
            <p className="mt-1 text-xs text-surface-400">
              A primeira foto (&laquo;Capa&raquo;) é a que aparece no catálogo. Arraste as
              fotos ou use as setas para as reordenar. Fotos novas entram no fim &mdash;
              guarde e volte a editar para as mover.
            </p>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gold hover:text-black disabled:bg-surface-300"
            >
              {saving ? 'A guardar…' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-surface-300 px-5 py-2.5 text-sm font-semibold text-surface-600 hover:border-black hover:text-black"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-16 text-center text-surface-400">A carregar...</div>
      ) : products.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-surface-200 py-16 text-center text-surface-400">
          Ainda não há produtos. Crie o primeiro.
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className={`flex items-center gap-4 rounded-lg border-2 p-4 ${
                product.isActive ? 'border-surface-200' : 'border-surface-100 opacity-60'
              }`}
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-surface-200 bg-surface-50">
                {product.images[0] && (
                  <Image src={product.images[0]} alt="" fill sizes="64px" className="object-contain p-1" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="rounded bg-surface-100 px-2 py-0.5 text-xs font-semibold text-surface-600">
                    {PRODUCT_CATEGORIES.find((c) => c.value === product.category)?.pt ?? product.category}
                  </span>
                  {product.isFeatured && (
                    <span className="rounded bg-gold/20 px-2 py-0.5 text-xs font-semibold text-gold-dark">
                      Destaque
                    </span>
                  )}
                  {!product.isActive && (
                    <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-500">
                      Inativo
                    </span>
                  )}
                </div>
                <p className="truncate font-bold text-black">{product.namePt}</p>
                <p className="text-sm text-surface-400">/{product.slug}</p>
              </div>

              <div className="text-right">
                <p className="font-black text-black">{formatEuro(product.price)}€</p>
                {product.supplierCost !== null && (
                  <p className="text-xs text-surface-500">
                    custo {formatEuro(product.supplierCost)}€ · margem{' '}
                    <span className="font-semibold text-green-700">
                      {formatEuro(Math.round((product.price - product.supplierCost) * 100) / 100)}€
                    </span>
                  </p>
                )}
                {product.supplierUrl && (
                  <a
                    href={product.supplierUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-surface-400 underline-offset-2 hover:text-black hover:underline"
                  >
                    abrir no fornecedor ↗
                  </a>
                )}
              </div>

              <div className="flex shrink-0 flex-col gap-1.5">
                <button
                  onClick={() => openEdit(product)}
                  className="rounded border border-surface-300 px-3 py-1.5 text-xs font-semibold hover:border-black"
                >
                  Editar
                </button>
                <button
                  onClick={() => toggleActive(product)}
                  className="rounded border border-surface-300 px-3 py-1.5 text-xs font-semibold hover:border-black"
                >
                  {product.isActive ? 'Ocultar' : 'Publicar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-surface-500">{label}</span>
      <input
        {...props}
        className="w-full rounded border border-surface-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
      />
    </label>
  );
}

function Textarea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-surface-500">{label}</span>
      <textarea
        {...props}
        rows={4}
        className="w-full rounded border border-surface-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
      />
    </label>
  );
}

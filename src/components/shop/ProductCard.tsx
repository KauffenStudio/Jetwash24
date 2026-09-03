import Image from 'next/image';
import Link from 'next/link';
import DiscountBadge from '@/components/ui/DiscountBadge';
import { discountPercent, formatEuro } from '@/lib/utils';
import { categoryLabel } from '@/lib/shop/catalog';
import AddToCartButton, { type CartProductInput } from './AddToCartButton';
import type { ProductCategory } from '@prisma/client';

export type CatalogueProduct = CartProductInput & {
  brand: string | null;
  compareAtPrice: number | null;
  category: ProductCategory;
};

export default function ProductCard({
  product,
  locale,
}: {
  product: CatalogueProduct;
  locale: string;
}) {
  const isPt = locale === 'pt';
  const name = isPt ? product.namePt : product.nameEn;
  const discount = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock <= 0;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white transition-colors duration-200 hover:border-black">
      <Link
        href={`/${locale}/shop/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-surface-50"
      >
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-surface-300 text-sm">
            {isPt ? 'Sem imagem' : 'No image'}
          </span>
        )}

        <span className="absolute left-3 top-3 flex gap-2">
          {discount !== null && <DiscountBadge percent={discount} />}
          {soldOut && (
            <span className="rounded-full bg-surface-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              {isPt ? 'Esgotado' : 'Sold out'}
            </span>
          )}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
          {product.brand ?? categoryLabel(product.category, locale)}
        </p>
        <Link href={`/${locale}/shop/${product.slug}`} className="mt-2 flex-1">
          <h3 className="font-bold leading-snug text-black transition-colors group-hover:text-gold">
            {name}
          </h3>
        </Link>

        <div className="mt-4 flex items-baseline gap-2">
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm font-semibold text-surface-400 line-through">
              {formatEuro(product.compareAtPrice)}€
            </span>
          )}
          <span className="text-xl font-black text-black">{formatEuro(product.price)}€</span>
        </div>

        <AddToCartButton product={product} locale={locale} compact className="mt-4" />
      </div>
    </div>
  );
}

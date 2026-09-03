import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { SITE_URL } from '@/lib/seo/business';
import { categoryLabel } from '@/lib/shop/catalog';
import { SHIPPING_RATES } from '@/lib/shop/shipping';
import { discountPercent, formatEuro } from '@/lib/utils';
import DiscountBadge from '@/components/ui/DiscountBadge';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import ProductSchema from '@/components/seo/ProductSchema';
import ProductCard from '@/components/shop/ProductCard';
import ProductGallery from '@/components/shop/ProductGallery';
import ProductPurchase from '@/components/shop/ProductPurchase';

type Props = { params: { locale: string; slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return {};

  const isPt = params.locale === 'pt';
  const name = isPt ? product.namePt : product.nameEn;
  const description =
    (isPt ? product.descriptionPt : product.descriptionEn) ??
    (isPt
      ? `${name} disponível na loja JetWash24. Envio para todo o Portugal.`
      : `${name} available at the JetWash24 shop. Shipping across Portugal.`);

  return {
    title: name,
    description: description.slice(0, 160),
    alternates: {
      canonical: `/${params.locale}/shop/${product.slug}`,
      languages: {
        'pt-PT': `/pt/shop/${product.slug}`,
        'en-GB': `/en/shop/${product.slug}`,
        'x-default': `/pt/shop/${product.slug}`,
      },
    },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/${params.locale}/shop/${product.slug}`,
      title: name,
      description: description.slice(0, 160),
      ...(product.images[0] ? { images: [product.images[0]] } : {}),
    },
  };
}

export default async function ProductPage({ params: { locale, slug } }: Props) {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || !product.isActive) notFound();

  const isPt = locale === 'pt';
  const name = isPt ? product.namePt : product.nameEn;
  const description = isPt ? product.descriptionPt : product.descriptionEn;
  const discount = discountPercent(product.price, product.compareAtPrice);
  const freeFrom = SHIPPING_RATES.CONTINENTAL.freeFrom;

  const related = await prisma.product.findMany({
    where: { isActive: true, category: product.category, id: { not: product.id } },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    take: 4,
  });

  return (
    <>
      <ProductSchema product={product} locale={locale} />
      <BreadcrumbSchema
        items={[
          { name: isPt ? 'Início' : 'Home', path: `/${locale}` },
          { name: isPt ? 'Loja' : 'Shop', path: `/${locale}/shop` },
          { name, path: `/${locale}/shop/${product.slug}` },
        ]}
      />

      <div className="bg-white pt-28 sm:pt-36">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <nav className="mb-8 text-sm text-surface-400">
            <Link href={`/${locale}/shop`} className="hover:text-black">
              {isPt ? 'Loja' : 'Shop'}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-surface-600">{categoryLabel(product.category, locale)}</span>
          </nav>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            <ProductGallery
              images={product.images}
              alt={name}
              emptyLabel={isPt ? 'Sem imagem' : 'No image'}
            />

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                {product.brand ?? categoryLabel(product.category, locale)}
              </p>
              <h1 className="mt-3 text-3xl font-black leading-tight text-black sm:text-4xl">
                {name}
              </h1>

              <div className="mt-5 flex items-center gap-3">
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-xl font-semibold text-surface-400 line-through">
                    {formatEuro(product.compareAtPrice)}€
                  </span>
                )}
                <span className="text-3xl font-black text-black">
                  {formatEuro(product.price)}€
                </span>
                {discount !== null && <DiscountBadge percent={discount} />}
              </div>

              <p className="mt-3 text-sm">
                {product.stock > 5 ? (
                  <span className="font-semibold text-green-600">
                    {isPt ? 'Em stock' : 'In stock'}
                  </span>
                ) : product.stock > 0 ? (
                  <span className="font-semibold text-gold-dark">
                    {isPt
                      ? `Últimas ${product.stock} unidades`
                      : `Only ${product.stock} left`}
                  </span>
                ) : (
                  <span className="font-semibold text-surface-400">
                    {isPt ? 'Esgotado' : 'Sold out'}
                  </span>
                )}
              </p>

              {description && (
                <p className="mt-6 whitespace-pre-line leading-relaxed text-surface-600">
                  {description}
                </p>
              )}

              <div className="mt-8">
                <ProductPurchase product={product} locale={locale} />
              </div>

              <ul className="mt-8 space-y-2 border-t border-surface-200 pt-6 text-sm text-surface-500">
                <li>
                  {isPt
                    ? `Portes grátis em encomendas acima de ${formatEuro(freeFrom)}€ (Continente)`
                    : `Free shipping on orders over ${formatEuro(freeFrom)}€ (mainland)`}
                </li>
                <li>{isPt ? 'Expedição em 1–2 dias úteis' : 'Dispatched within 1–2 working days'}</li>
                <li>
                  {isPt
                    ? 'Pagamento seguro com cartão via Stripe'
                    : 'Secure card payment via Stripe'}
                </li>
                {product.sku && (
                  <li className="text-surface-400">
                    {isPt ? 'Referência' : 'SKU'}: {product.sku}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mb-8 text-2xl font-black text-black">
              {isPt ? 'Também pode precisar' : 'You might also need'}
            </h2>
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

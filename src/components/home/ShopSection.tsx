import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { PRODUCT_CATEGORIES } from '@/lib/shop/catalog';
import { SHIPPING_RATES } from '@/lib/shop/shipping';
import { formatEuro } from '@/lib/utils';
import ProductCard from '@/components/shop/ProductCard';
import Reveal from '@/components/ui/Reveal';

/**
 * Shop showcase on the home page. Shows the products flagged as featured in
 * the admin, falling back to the newest ones so the section is never empty
 * while the catalogue is being filled. Renders nothing at all if there are no
 * products yet — an empty grid on the home page is worse than no grid.
 */
export default async function ShopSection({ locale }: { locale: string }) {
  const isPt = locale === 'pt';

  const featured = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    take: 4,
  });

  const products =
    featured.length > 0
      ? featured
      : await prisma.product.findMany({
          where: { isActive: true },
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
          take: 4,
        });

  if (products.length === 0) return null;

  const freeFrom = SHIPPING_RATES.CONTINENTAL.freeFrom;

  return (
    <section id="shop" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                {isPt ? 'Loja' : 'Shop'}
              </p>
              <h2 className="text-3xl font-black leading-tight text-black sm:text-4xl">
                {isPt ? 'Produtos de detailing profissional' : 'Professional detailing products'}
              </h2>
              <p className="mt-3 max-w-xl leading-relaxed text-surface-600">
                {isPt
                  ? `Os mesmos produtos que usamos nos carros dos nossos clientes. Envio para todo o Portugal, portes grátis acima de ${formatEuro(freeFrom)}€.`
                  : `The same products we use on our customers' cars. Shipped across Portugal, free over ${formatEuro(freeFrom)}€.`}
              </p>
            </div>
            <Link
              href={`/${locale}/shop`}
              className="shrink-0 self-start rounded-lg bg-black px-6 py-3.5 font-semibold text-white transition-colors hover:bg-gold hover:text-black sm:self-auto"
            >
              {isPt ? 'Ver toda a loja' : 'Browse the shop'}
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 60}>
              <ProductCard product={product} locale={locale} />
            </Reveal>
          ))}
        </div>

        <nav
          className="mt-10 flex flex-wrap gap-2"
          aria-label={isPt ? 'Categorias da loja' : 'Shop categories'}
        >
          {PRODUCT_CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/${locale}/shop?category=${category.slug}`}
              className="rounded-full border border-surface-200 px-4 py-2 text-sm font-semibold text-surface-600 transition-colors hover:border-black hover:text-black"
            >
              {isPt ? category.pt : category.en}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { SITE_URL } from '@/lib/seo/business';
import { PRODUCT_CATEGORIES, categoryBySlug } from '@/lib/shop/catalog';
import { SHIPPING_RATES } from '@/lib/shop/shipping';
import { formatEuro } from '@/lib/utils';
import ProductCard from '@/components/shop/ProductCard';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import Reveal from '@/components/ui/Reveal';
import Spotlight from '@/components/ui/Spotlight';

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const isPt = locale === 'pt';
  return {
    title: isPt
      ? 'Loja — Produtos de Limpeza Auto e Acessórios'
      : 'Shop — Car Cleaning Products & Accessories',
    description: isPt
      ? 'Produtos de limpeza automóvel e acessórios de detailing usados no nosso centro em Guia, Albufeira. Envio para todo o Portugal.'
      : 'Car cleaning products and detailing accessories we use in our own centre in Guia, Albufeira. Shipping across Portugal.',
    alternates: {
      canonical: `/${locale}/shop`,
      languages: { 'pt-PT': '/pt/shop', 'en-GB': '/en/shop', 'x-default': '/pt/shop' },
    },
    openGraph: {
      url: `${SITE_URL}/${locale}/shop`,
      title: isPt ? 'Loja JetWash24' : 'JetWash24 Shop',
    },
  };
}

export default async function ShopPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { category?: string };
}) {
  const isPt = locale === 'pt';
  const activeCategory = categoryBySlug(searchParams.category);

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(activeCategory ? { category: activeCategory.value } : {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  const freeFrom = SHIPPING_RATES.CONTINENTAL.freeFrom;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: isPt ? 'Início' : 'Home', path: `/${locale}` },
          { name: isPt ? 'Loja' : 'Shop', path: `/${locale}/shop` },
        ]}
      />

      {/* Hero */}
      <Spotlight className="bg-[#0A0A0A] pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              {isPt ? 'Loja' : 'Shop'}
            </p>
            <h1 className="text-4xl font-black leading-tight text-white sm:text-6xl">
              {isPt ? 'Os produtos que ' : 'The products we '}
              <span className="text-gold">{isPt ? 'usamos' : 'use'}</span>
              {isPt ? ' no seu carro' : ' on your car'}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
              {isPt
                ? 'Produtos de limpeza e acessórios de detailing testados no dia a dia do nosso centro em Guia. Envio para todo o Portugal.'
                : 'Cleaning products and detailing accessories tested daily in our centre in Guia. Shipped anywhere in Portugal.'}
            </p>
            <p className="mt-4 text-sm text-white/40">
              {isPt
                ? `Portes grátis a partir de ${formatEuro(freeFrom)}€ (Continente)`
                : `Free shipping from ${formatEuro(freeFrom)}€ (mainland)`}
            </p>
          </Reveal>
        </div>
      </Spotlight>

      {/* Catalogue */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Category filter */}
          <nav className="mb-10 flex flex-wrap gap-2" aria-label={isPt ? 'Categorias' : 'Categories'}>
            <FilterPill
              href={`/${locale}/shop`}
              label={isPt ? 'Todos' : 'All'}
              active={!activeCategory}
            />
            {PRODUCT_CATEGORIES.map((category) => (
              <FilterPill
                key={category.slug}
                href={`/${locale}/shop?category=${category.slug}`}
                label={isPt ? category.pt : category.en}
                active={activeCategory?.slug === category.slug}
              />
            ))}
          </nav>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-surface-300 py-20 text-center">
              <p className="font-semibold text-black">
                {isPt ? 'Ainda não há produtos nesta categoria.' : 'No products in this category yet.'}
              </p>
              <p className="mt-2 text-surface-500">
                {isPt
                  ? 'Estamos a preparar o catálogo — volte em breve.'
                  : 'We are stocking the catalogue — check back soon.'}
              </p>
              <Link
                href={`/${locale}/booking`}
                className="mt-8 inline-flex items-center rounded-lg bg-black px-6 py-3.5 font-semibold text-white transition-colors hover:bg-gold hover:text-black"
              >
                {isPt ? 'Marcar um detailing' : 'Book a detailing'}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {products.map((product, i) => (
                <Reveal key={product.id} delay={(i % 4) * 60}>
                  <ProductCard product={product} locale={locale} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function FilterPill({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? 'border-black bg-black text-white'
          : 'border-surface-200 text-surface-600 hover:border-black hover:text-black'
      }`}
    >
      {label}
    </Link>
  );
}

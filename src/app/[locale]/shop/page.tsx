import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { SITE_URL } from '@/lib/seo/business';
import { PRODUCT_CATEGORIES, PUBLIC_PRODUCT_SELECT, categoryBySlug } from '@/lib/shop/catalog';
import { DELIVERY_DAYS } from '@/lib/shop/shipping';
import ProductCard from '@/components/shop/ProductCard';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import Reveal from '@/components/ui/Reveal';
import Spotlight from '@/components/ui/Spotlight';

/**
 * Category views are real pages, so they describe themselves.
 *
 * This used to ignore searchParams entirely: every `?category=` view returned
 * the generic shop title and, worse, a canonical pointing back at bare /shop.
 * llms.txt curates those seven category URLs as distinct citable pages, so a
 * crawler that honours canonical was folding all seven back into one.
 */
export function generateMetadata({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { category?: string };
}): Metadata {
  const isPt = locale === 'pt';
  const category = categoryBySlug(searchParams.category);
  const suffix = category ? `?category=${category.slug}` : '';
  const path = `/${locale}/shop${suffix}`;
  const label = category ? (isPt ? category.pt : category.en) : null;

  // The root layout appends ' | JetWash24 Detailing', so `title` stays brand-free
  // to avoid saying the name twice. Social cards don't go through that template,
  // so they carry the brand themselves.
  const title = label
    ? isPt
      ? `${label} — Loja`
      : `${label} — Shop`
    : isPt
      ? 'Loja — Produtos de Limpeza Auto e Acessórios'
      : 'Shop — Car Cleaning Products & Accessories';

  const socialTitle = label
    ? isPt
      ? `${label} — Loja JetWash24`
      : `${label} — JetWash24 Shop`
    : isPt
      ? 'Loja JetWash24'
      : 'JetWash24 Shop';

  const description = label
    ? isPt
      ? `Produtos de ${label.toLowerCase()} usados no nosso centro de detailing em Guia, Albufeira. Portes grátis para toda a União Europeia.`
      : `${label} products we use in our own detailing centre in Guia, Albufeira. Free shipping across the European Union.`
    : isPt
      ? 'Produtos de limpeza automóvel e acessórios de detailing usados no nosso centro em Guia, Albufeira. Portes grátis para toda a União Europeia.'
      : 'Car cleaning products and detailing accessories we use in our own centre in Guia, Albufeira. Free shipping across the European Union.';

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        'pt-PT': `/pt/shop${suffix}`,
        'en-GB': `/en/shop${suffix}`,
        'x-default': `/pt/shop${suffix}`,
      },
    },
    openGraph: {
      url: `${SITE_URL}${path}`,
      title: socialTitle,
      description,
      images: [`${SITE_URL}/${locale}/opengraph-image`],
    },
    twitter: { title: socialTitle, description },
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
    select: PUBLIC_PRODUCT_SELECT,
    where: {
      isActive: true,
      ...(activeCategory ? { category: activeCategory.value } : {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

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
                ? 'Produtos de limpeza e acessórios de detailing testados no dia a dia do nosso centro em Guia. Enviamos para toda a União Europeia, sem custos de envio.'
                : 'Cleaning products and detailing accessories tested daily in our centre in Guia. Shipped across the European Union at no delivery cost.'}
            </p>
            <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm font-semibold text-gold">
              {isPt
                ? `Portes grátis em toda a União Europeia · entrega em ${DELIVERY_DAYS.min}–${DELIVERY_DAYS.max} dias úteis`
                : `Free shipping across the European Union · delivered in ${DELIVERY_DAYS.min}–${DELIVERY_DAYS.max} working days`}
            </p>
          </Reveal>
        </div>
      </Spotlight>

      {/* Catalogue */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Names the grid so the product cards' H3s have an H2 to sit under.
              Visually redundant next to the hero, hence sr-only. */}
          <h2 className="sr-only">
            {activeCategory
              ? isPt
                ? activeCategory.pt
                : activeCategory.en
              : isPt
                ? 'Todos os produtos'
                : 'All products'}
          </h2>
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

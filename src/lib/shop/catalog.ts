import type { ProductCategory } from '@prisma/client';

/**
 * Shop categories in display order, with the URL slug used by /shop?category=…
 * Adding a category means adding it here and to the Prisma enum.
 */
export const PRODUCT_CATEGORIES: {
  value: ProductCategory;
  slug: string;
  pt: string;
  en: string;
}[] = [
  { value: 'WASH', slug: 'lavagem', pt: 'Lavagem', en: 'Washing' },
  { value: 'INTERIOR', slug: 'interior', pt: 'Interior', en: 'Interior' },
  { value: 'POLISH', slug: 'polimento', pt: 'Polimento', en: 'Polishing' },
  { value: 'PROTECTION', slug: 'protecao', pt: 'Proteção', en: 'Protection' },
  { value: 'WHEELS', slug: 'jantes-e-pneus', pt: 'Jantes e Pneus', en: 'Wheels & Tyres' },
  { value: 'ACCESSORIES', slug: 'acessorios', pt: 'Acessórios', en: 'Accessories' },
  { value: 'KITS', slug: 'kits', pt: 'Kits', en: 'Kits' },
];

/**
 * Fields the public shop is allowed to read. Products also carry sourcing data
 * (supplier link and cost) that must never reach a browser — and a page that
 * hands a whole product row to a client component serialises every column into
 * the HTML. Selecting explicitly is what keeps that from happening by accident.
 */
export const PUBLIC_PRODUCT_SELECT = {
  id: true,
  slug: true,
  namePt: true,
  nameEn: true,
  descriptionPt: true,
  descriptionEn: true,
  brand: true,
  sku: true,
  price: true,
  compareAtPrice: true,
  images: true,
  category: true,
  isActive: true,
  isFeatured: true,
  sortOrder: true,
} as const;

export function categoryBySlug(slug?: string | null) {
  if (!slug) return undefined;
  return PRODUCT_CATEGORIES.find((c) => c.slug === slug);
}

export function categoryLabel(value: ProductCategory, locale: string): string {
  const category = PRODUCT_CATEGORIES.find((c) => c.value === value);
  if (!category) return value;
  return locale === 'pt' ? category.pt : category.en;
}

/** URL-safe slug from a product name, used when the admin leaves the slug blank. */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * Create shop products from a JSON file.
 *
 *   node --env-file=.env.local scripts/import-products.mjs produtos.json
 *
 * Each entry describes one product and its AliExpress landed cost; the retail
 * price is derived here so the markup rule cannot drift between batches:
 *
 *   cost < 5€    → ×3
 *   cost 5–20€   → ×2
 *   cost > 20€   → ×1.8
 *   then rounded UP to the next …,90
 *
 * `cost` must be the FULL cost of getting the item to the customer — product
 * plus AliExpress shipping — because the shop ships free and that postage comes
 * out of this margin.
 *
 * Products are created hidden and without images: nothing reaches the shop
 * before a photo is uploaded and it is published from /admin/products.
 */
import { readFile } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Markup rule, in one place. Returns the shelf price for a landed cost. */
export function retailPrice(cost) {
  const multiplier = cost < 5 ? 3 : cost <= 20 ? 2 : 1.8;
  const raw = cost * multiplier;
  // Round up to the next …,90 — never down, so rounding can't eat the margin.
  const rounded = Math.ceil((raw - 0.9) / 1) + 0.9;
  return Math.max(rounded, 0.9);
}

function slugify(input) {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

const file = process.argv[2];
if (!file) {
  console.error('Uso: node --env-file=.env.local scripts/import-products.mjs <ficheiro.json>');
  process.exit(1);
}

const entries = JSON.parse(await readFile(file, 'utf8'));

try {
  for (const entry of entries) {
    const price = entry.price ?? retailPrice(entry.cost);

    let slug = entry.slug ?? slugify(entry.namePt);
    let attempt = 2;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${entry.slug ?? slugify(entry.namePt)}-${attempt}`;
      attempt += 1;
    }

    const product = await prisma.product.create({
      data: {
        slug,
        namePt: entry.namePt,
        nameEn: entry.nameEn,
        descriptionPt: entry.descriptionPt ?? null,
        descriptionEn: entry.descriptionEn ?? null,
        brand: entry.brand ?? null,
        sku: entry.sku ?? null,
        price,
        compareAtPrice: entry.compareAtPrice ?? null,
        supplierUrl: entry.supplierUrl ?? null,
        supplierCost: entry.cost ?? null,
        images: [],
        category: entry.category,
        isActive: false,
        isFeatured: entry.isFeatured ?? false,
        sortOrder: entry.sortOrder ?? 0,
      },
    });

    const margin = price - (entry.cost ?? 0);
    console.log(
      `${product.slug.padEnd(38)} custo ${(entry.cost ?? 0).toFixed(2)}€ → ${price.toFixed(2)}€ (margem ${margin.toFixed(2)}€)`,
    );
  }

  console.log(`\n${entries.length} produtos criados, ocultos e sem imagem.`);
  console.log('Carrega as imagens em /pt/admin/products e clica em Publicar.');
} finally {
  await prisma.$disconnect();
}

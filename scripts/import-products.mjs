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
 *   and finally stepped DOWN to the …9,90 below when it lands within 1,50€
 *   over a round ten (30,90 → 29,90), because crossing a round number costs
 *   far more in conversion than the euro it saves
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
  let price = Math.max(Math.ceil(raw - 0.9) + 0.9, 0.9);

  // A price that lands just over a round ten reads as "thirty-something" and
  // the shopper starts comparing. Step it down to the …9,90 below: it costs
  // about a euro and buys back the whole psychological bracket.
  const ten = Math.floor(price / 10) * 10;
  if (ten > 0 && price - ten <= 1.5) price = ten - 0.1;

  return Math.round(price * 100) / 100;
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
        deliveryMinDays: entry.deliveryMinDays ?? null,
        deliveryMaxDays: entry.deliveryMaxDays ?? null,
        images: [],
        category: entry.category,
        isActive: false,
        isFeatured: entry.isFeatured ?? false,
        sortOrder: entry.sortOrder ?? 0,
      },
    });

    // An entry without a cost is a draft priced from research, not from a real
    // quote — say so rather than printing a margin against a cost of zero.
    console.log(
      entry.cost
        ? `${product.slug.padEnd(38)} custo ${entry.cost.toFixed(2)}€ → ${price.toFixed(2)}€ (margem ${(price - entry.cost).toFixed(2)}€)`
        : `${product.slug.padEnd(38)} custo por confirmar → ${price.toFixed(2)}€ (preço provisório)`,
    );
  }

  console.log(`\n${entries.length} produtos criados, ocultos e sem imagem.`);
  console.log('Carrega as imagens em /pt/admin/products e clica em Publicar.');
} finally {
  await prisma.$disconnect();
}

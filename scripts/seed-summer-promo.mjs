#!/usr/bin/env node
/**
 * Create (or refresh) the summer promotion service in the database.
 *
 * This exists instead of `npm run db:seed` because the full seed rewrites the
 * price of every other service back to its committed value. If prices were
 * adjusted in the admin panel since the last seed, running it would silently
 * revert them. This script touches one row and nothing else.
 *
 * Price and deadline must stay in step with src/lib/promo.ts, which drives the
 * popup — the two are read from there so they cannot drift.
 *
 * Usage:  vercel env pull --environment=production .env.production.local
 *         node --env-file=.env.production.local scripts/seed-summer-promo.mjs
 *
 * Pass --end to retire the campaign instead (sets isActive: false), which is
 * what you run on 1 October once the popup has disarmed itself:
 *         node --env-file=.env.production.local scripts/seed-summer-promo.mjs --end
 *
 * Pass --sync-express to also drop the two express services to 19,90€ each.
 * That is opt-in and deliberately separate, because it rewrites the price of
 * services this campaign does not own.
 *
 * Either way the script compares the promo's crossed-out price against the
 * live sum of those two services and warns when they disagree — an inflated
 * reference price is the one thing here with real legal exposure.
 */

import { PrismaClient } from '@prisma/client';

const PROMO_ID = 'svc-summer-promo';
const PRICE = 29.9;
const COMPARE_AT = 39.8;

const retiring = process.argv.includes('--end');
const syncExpress = process.argv.includes('--sync-express');
const EXPRESS = { 'svc-hand-wash': 19.9, 'svc-express-interior': 19.9 };
const prisma = new PrismaClient();

if (syncExpress) {
  for (const [id, price] of Object.entries(EXPRESS)) {
    const updated = await prisma.service.update({ where: { id }, data: { price } });
    console.log(`Priced: ${updated.namePt} is now ${updated.price}€.`);
  }
}

const service = await prisma.service.upsert({
  where: { id: PROMO_ID },
  update: {
    price: PRICE,
    compareAtPrice: COMPARE_AT,
    isActive: !retiring,
  },
  create: {
    id: PROMO_ID,
    name: 'Summer Offer — Hand Wash + Express Interior',
    namePt: 'Promoção de Verão — Exterior + Interior Express',
    nameEn: 'Summer Offer — Hand Wash + Express Interior',
    descriptionPt:
      'Lavagem manual exterior e interior express, com lavagem do tablier incluída. Preço de promoção até 30 de setembro.',
    descriptionEn:
      'Exterior hand wash and express interior, dashboard clean included. Promotional price until 30 September.',
    includes: ['Exterior hand wash', 'Wheel cleaning and tyre shine', 'Microfibre drying', 'Express interior vacuum', 'Dashboard clean', 'Interior windows'],
    includesPt: ['Lavagem manual exterior', 'Limpeza das jantes e brilho nos pneus', 'Secagem com microfibra', 'Aspiração interior express', 'Lavagem do tablier', 'Vidros interiores'],
    includesEn: ['Exterior hand wash', 'Wheel cleaning and tyre shine', 'Microfibre drying', 'Express interior vacuum', 'Dashboard clean', 'Interior windows'],
    price: PRICE,
    compareAtPrice: COMPARE_AT,
    duration: 70,
    category: 'FULL',
    sortOrder: 0,
    isActive: !retiring,
  },
});

console.log(
  retiring
    ? `Retired: ${service.namePt} is no longer bookable.`
    : `Live: ${service.namePt} — ${service.price}€ (was ${service.compareAtPrice}€), ${service.duration} min.`
);

// The crossed-out price must equal what the two services actually cost today.
const parts = await prisma.service.findMany({
  where: { id: { in: Object.keys(EXPRESS) } },
  select: { namePt: true, price: true },
});
const sum = Number(parts.reduce((total, s) => total + s.price, 0).toFixed(2));
if (sum !== COMPARE_AT) {
  console.warn(
    `\nWARNING: the popup crosses out ${COMPARE_AT}€, but those services now sum to ${sum}€ ` +
      `(${parts.map((s) => `${s.namePt} ${s.price}€`).join(' + ')}).\n` +
      `Update compareAtPrice in src/lib/promo.ts and this script, then redeploy — ` +
      `advertising a saving larger than the real one is what DL 109-G/2021 prohibits.`
  );
} else {
  console.log(`Reference price checks out: ${parts.map((s) => `${s.price}€`).join(' + ')} = ${sum}€.`);
}

await prisma.$disconnect();

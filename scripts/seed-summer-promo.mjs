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
 */

import { PrismaClient } from '@prisma/client';

const PROMO_ID = 'svc-summer-promo';
const PRICE = 29.9;
const COMPARE_AT = 70;

const retiring = process.argv.includes('--end');
const prisma = new PrismaClient();

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

await prisma.$disconnect();

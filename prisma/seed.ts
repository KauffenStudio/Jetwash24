import { PrismaClient, ServiceCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';

const prisma = new PrismaClient();

async function main() {
  // ─── Interior Services ────────────────────────────────────────────────────────
  await prisma.service.upsert({
    where: { id: 'svc-express-interior' },
    update: {
      price: 40,
      compareAtPrice: 50,
    },
    create: {
      id: 'svc-express-interior',
      name: 'Express Interior Refresh',
      namePt: 'Limpeza Interior Expresso',
      nameEn: 'Express Interior Refresh',
      descriptionPt: 'Limpeza rápida e eficaz do interior do seu veículo.',
      descriptionEn: 'Quick and effective interior cleaning for your vehicle.',
      includes: ['Interior vacuum', 'Dashboard wipe', 'Door plastics cleaning', 'Interior windows', 'Quick odor neutralizer'],
      includesPt: ['Aspiração interior', 'Limpeza do tablier', 'Limpeza dos plásticos das portas', 'Vidros interiores', 'Neutralizador de odores rápido'],
      includesEn: ['Interior vacuum', 'Dashboard wipe', 'Door plastics cleaning', 'Interior windows', 'Quick odor neutralizer'],
      price: 40,
      compareAtPrice: 50,
      duration: 40,
      category: ServiceCategory.INTERIOR,
      sortOrder: 1,
    },
  });

  await prisma.service.upsert({
    where: { id: 'svc-full-interior' },
    update: {
      name: 'Detailed Interior Clean',
      namePt: 'Limpeza Interior Detalhada',
      nameEn: 'Detailed Interior Clean',
      descriptionPt: 'Limpeza detalhada e profunda do interior, com tratamento dos bancos a estofo ou a pele.',
      descriptionEn: 'Deep detailed interior cleaning with fabric or leather seat treatment.',
      includes: ['Deep vacuum', 'Detailed cleaning', 'Deep seat cleaning (fabric or leather)', 'Deep hygienization', 'Odor treatment'],
      includesPt: ['Aspiração profunda', 'Limpeza detalhada', 'Limpeza profunda dos bancos a estofo ou a pele', 'Higienização profunda', 'Tratamento de odores'],
      includesEn: ['Deep vacuum', 'Detailed cleaning', 'Deep seat cleaning (fabric or leather)', 'Deep hygienization', 'Odor treatment'],
      price: 80,
      compareAtPrice: 90,
      duration: 120,
    },
    create: {
      id: 'svc-full-interior',
      name: 'Detailed Interior Clean',
      namePt: 'Limpeza Interior Detalhada',
      nameEn: 'Detailed Interior Clean',
      descriptionPt: 'Limpeza detalhada e profunda do interior, com tratamento dos bancos a estofo ou a pele.',
      descriptionEn: 'Deep detailed interior cleaning with fabric or leather seat treatment.',
      includes: ['Deep vacuum', 'Detailed cleaning', 'Deep seat cleaning (fabric or leather)', 'Deep hygienization', 'Odor treatment'],
      includesPt: ['Aspiração profunda', 'Limpeza detalhada', 'Limpeza profunda dos bancos a estofo ou a pele', 'Higienização profunda', 'Tratamento de odores'],
      includesEn: ['Deep vacuum', 'Detailed cleaning', 'Deep seat cleaning (fabric or leather)', 'Deep hygienization', 'Odor treatment'],
      price: 80,
      compareAtPrice: 90,
      duration: 120,
      category: ServiceCategory.INTERIOR,
      sortOrder: 2,
    },
  });

  // Deactivated — removed from service menu
  await prisma.service.upsert({
    where: { id: 'svc-premium-interior' },
    update: { isActive: false },
    create: {
      id: 'svc-premium-interior',
      name: 'Premium Interior Restoration',
      namePt: 'Restauração Interior Premium',
      nameEn: 'Premium Interior Restoration',
      descriptionPt: 'Restauração completa do interior com tratamentos premium.',
      descriptionEn: 'Complete interior restoration with premium treatments.',
      includes: [],
      includesPt: [],
      includesEn: [],
      price: 90,
      duration: 240,
      category: ServiceCategory.INTERIOR,
      isActive: false,
      sortOrder: 3,
    },
  });

  // ─── Summer 2026 promotion ────────────────────────────────────────────────────
  // Bundles the express hand wash (30€) and the express interior (40€) at 29,90€
  // until 30 September 2026 — see src/lib/promo.ts, which drives the popup and
  // must keep the same price and deadline. When the campaign ends, flip
  // `isActive` to false here and re-run the seed, otherwise the service stays
  // bookable in the wizard after the popup has disarmed itself.
  await prisma.service.upsert({
    where: { id: 'svc-summer-promo' },
    update: {
      price: 29.9,
      compareAtPrice: 39.8,
      isActive: true,
    },
    create: {
      id: 'svc-summer-promo',
      name: 'Summer Offer — Hand Wash + Express Interior',
      namePt: 'Promoção de Verão — Exterior + Interior Express',
      nameEn: 'Summer Offer — Hand Wash + Express Interior',
      descriptionPt: 'Lavagem manual exterior e interior express, com lavagem do tablier incluída. Preço de promoção até 30 de setembro.',
      descriptionEn: 'Exterior hand wash and express interior, dashboard clean included. Promotional price until 30 September.',
      includes: ['Exterior hand wash', 'Wheel cleaning and tyre shine', 'Microfibre drying', 'Express interior vacuum', 'Dashboard clean', 'Interior windows'],
      includesPt: ['Lavagem manual exterior', 'Limpeza das jantes e brilho nos pneus', 'Secagem com microfibra', 'Aspiração interior express', 'Lavagem do tablier', 'Vidros interiores'],
      includesEn: ['Exterior hand wash', 'Wheel cleaning and tyre shine', 'Microfibre drying', 'Express interior vacuum', 'Dashboard clean', 'Interior windows'],
      price: 29.9,
      compareAtPrice: 39.8,
      duration: 70,
      category: ServiceCategory.FULL,
      sortOrder: 0,
    },
  });

  // ─── Exterior Services ────────────────────────────────────────────────────────
  await prisma.service.upsert({
    where: { id: 'svc-hand-wash' },
    update: {
      name: 'Express Exterior Wash',
      namePt: 'Lavagem Exterior Express',
      nameEn: 'Express Exterior Wash',
      descriptionPt: 'Lavagem exterior rápida e eficaz com secagem e brilho nos pneus.',
      descriptionEn: 'Quick and effective exterior wash with drying and tire shine.',
      includes: ['Hand wash', 'Wheel cleaning', 'Drying', 'Tire shine'],
      includesPt: ['Lavagem manual', 'Limpeza das jantes', 'Secagem', 'Brilho nos pneus'],
      includesEn: ['Hand wash', 'Wheel cleaning', 'Drying', 'Tire shine'],
      price: 30,
      compareAtPrice: 40,
      duration: 30,
    },
    create: {
      id: 'svc-hand-wash',
      name: 'Express Exterior Wash',
      namePt: 'Lavagem Exterior Express',
      nameEn: 'Express Exterior Wash',
      descriptionPt: 'Lavagem exterior rápida e eficaz com secagem e brilho nos pneus.',
      descriptionEn: 'Quick and effective exterior wash with drying and tire shine.',
      includes: ['Hand wash', 'Wheel cleaning', 'Drying', 'Tire shine'],
      includesPt: ['Lavagem manual', 'Limpeza das jantes', 'Secagem', 'Brilho nos pneus'],
      includesEn: ['Hand wash', 'Wheel cleaning', 'Drying', 'Tire shine'],
      price: 30,
      compareAtPrice: 40,
      duration: 30,
      category: ServiceCategory.EXTERIOR,
      sortOrder: 4,
    },
  });

  await prisma.service.upsert({
    where: { id: 'svc-exterior-premium' },
    update: {
      name: 'Detailed Exterior Clean',
      namePt: 'Limpeza Exterior Detalhada',
      nameEn: 'Detailed Exterior Clean',
      descriptionPt: 'Limpeza exterior completa com polimento dos faróis e remoção de pequenos riscos.',
      descriptionEn: 'Complete exterior cleaning with headlight polishing and minor scratch removal.',
      includes: ['Foam prewash', 'Hand wash', 'Wheel deep cleaning', 'Tire shine', 'Headlight polishing', 'Minor scratch removal'],
      includesPt: ['Pré-lavagem com espuma', 'Lavagem manual', 'Limpeza profunda das jantes', 'Brilho nos pneus', 'Polimento dos faróis', 'Remoção de pequenos riscos'],
      includesEn: ['Foam prewash', 'Hand wash', 'Wheel deep cleaning', 'Tire shine', 'Headlight polishing', 'Minor scratch removal'],
      price: 70,
      compareAtPrice: 80,
      duration: 90,
    },
    create: {
      id: 'svc-exterior-premium',
      name: 'Detailed Exterior Clean',
      namePt: 'Limpeza Exterior Detalhada',
      nameEn: 'Detailed Exterior Clean',
      descriptionPt: 'Limpeza exterior completa com polimento dos faróis e remoção de pequenos riscos.',
      descriptionEn: 'Complete exterior cleaning with headlight polishing and minor scratch removal.',
      includes: ['Foam prewash', 'Hand wash', 'Wheel deep cleaning', 'Tire shine', 'Headlight polishing', 'Minor scratch removal'],
      includesPt: ['Pré-lavagem com espuma', 'Lavagem manual', 'Limpeza profunda das jantes', 'Brilho nos pneus', 'Polimento dos faróis', 'Remoção de pequenos riscos'],
      includesEn: ['Foam prewash', 'Hand wash', 'Wheel deep cleaning', 'Tire shine', 'Headlight polishing', 'Minor scratch removal'],
      price: 70,
      compareAtPrice: 80,
      duration: 90,
      category: ServiceCategory.EXTERIOR,
      sortOrder: 5,
    },
  });

  // ─── Polishing Services ───────────────────────────────────────────────────────
  // Prices are managed from the admin panel once live, so these upserts never
  // overwrite an existing row — they only create it if missing.
  await prisma.service.upsert({
    where: { id: 'svc-gloss-polish' },
    update: {},
    create: {
      id: 'svc-gloss-polish',
      name: 'Gloss Polish',
      namePt: 'Polimento de Brilho',
      nameEn: 'Gloss Polish',
      descriptionPt: 'Polimento a máquina numa fase que devolve brilho e profundidade à pintura e atenua marcas de lavagem.',
      descriptionEn: 'Single-stage machine polish that brings back gloss and depth and softens light wash marks.',
      includes: ['Safe wash and decontamination', 'Clay bar treatment', 'Single-stage machine polish', 'Softens light wash marks', 'Protective sealant', 'Tyre shine'],
      includesPt: ['Lavagem segura e descontaminação', 'Tratamento com clay bar', 'Polimento a máquina numa fase', 'Atenua marcas de lavagem ligeiras', 'Selante de proteção', 'Brilho nos pneus'],
      includesEn: ['Safe wash and decontamination', 'Clay bar treatment', 'Single-stage machine polish', 'Softens light wash marks', 'Protective sealant', 'Tyre shine'],
      price: 149,
      compareAtPrice: 190,
      duration: 150,
      category: ServiceCategory.POLISHING,
      sortOrder: 6,
    },
  });

  await prisma.service.upsert({
    where: { id: 'svc-paint-correction' },
    update: {},
    create: {
      id: 'svc-paint-correction',
      name: 'Paint Correction',
      namePt: 'Correção de Pintura',
      nameEn: 'Paint Correction',
      descriptionPt: 'Correção de pintura em duas fases que remove swirls e riscos ligeiros do verniz, com acabamento de brilho de espelho.',
      descriptionEn: 'Two-stage paint correction that removes swirls and light scratches from the clear coat, finished to a mirror shine.',
      includes: ['Safe wash and decontamination', 'Clay bar treatment', 'Clear-coat thickness assessment', 'Two-stage correction (cut + refine)', 'Removal of swirls and light scratches', 'Protective sealant'],
      includesPt: ['Lavagem segura e descontaminação', 'Tratamento com clay bar', 'Avaliação da espessura do verniz', 'Correção em duas fases (corte + refinamento)', 'Remoção de swirls e riscos ligeiros', 'Selante de proteção'],
      includesEn: ['Safe wash and decontamination', 'Clay bar treatment', 'Clear-coat thickness assessment', 'Two-stage correction (cut + refine)', 'Removal of swirls and light scratches', 'Protective sealant'],
      price: 249,
      compareAtPrice: 320,
      duration: 300,
      category: ServiceCategory.POLISHING,
      sortOrder: 7,
    },
  });

  console.log('Services seeded.');

  // ─── Add-ons ──────────────────────────────────────────────────────────────────
  const addons = [
    { id: 'addon-seat-shampoo', name: 'Seat Shampoo', namePt: 'Champô nos Bancos', nameEn: 'Seat Shampoo', price: 15, duration: 20, sortOrder: 1 },
    { id: 'addon-pet-hair', name: 'Pet Hair Removal', namePt: 'Remoção de Pelos de Animal', nameEn: 'Pet Hair Removal', price: 12, duration: 20, sortOrder: 2 },
    { id: 'addon-leather', name: 'Leather Conditioning', namePt: 'Condicionamento de Couro', nameEn: 'Leather Conditioning', price: 15, duration: 15, sortOrder: 3 },
    { id: 'addon-odor', name: 'Odor Removal', namePt: 'Remoção de Odores', nameEn: 'Odor Removal', price: 12, duration: 10, sortOrder: 4 },
    { id: 'addon-engine', name: 'Engine Bay Cleaning', namePt: 'Limpeza do Motor', nameEn: 'Engine Bay Cleaning', price: 25, duration: 30, sortOrder: 5 },
    { id: 'addon-headlights', name: 'Headlight Restoration', namePt: 'Restauração de Faróis', nameEn: 'Headlight Restoration', price: 30, duration: 45, sortOrder: 6 },
  ];

  for (const addon of addons) {
    await prisma.addon.upsert({
      where: { id: addon.id },
      update: {},
      create: addon,
    });
  }

  console.log('Add-ons seeded.');

  // ─── Users ────────────────────────────────────────────────────────────────────
  // Passwords come from the environment so this file — which is in a public
  // repository — never carries a working credential. With no value set we
  // generate a random one and print it once; use scripts/set-password.mjs to
  // change a password later.
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? randomPassword();
  const workerPassword = process.env.SEED_WORKER_PASSWORD ?? randomPassword();

  const adminHash = await bcrypt.hash(adminPassword, 12);
  const workerHash = await bcrypt.hash(workerPassword, 12);

  await prisma.user.upsert({
    where: { email: 'admin@jetwash24.com' },
    update: {},
    create: {
      email: 'admin@jetwash24.com',
      name: 'Admin',
      password: adminHash,
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'worker@jetwash24.com' },
    update: {},
    create: {
      email: 'worker@jetwash24.com',
      name: 'Worker',
      password: workerHash,
      role: 'WORKER',
    },
  });

  console.log('Users seeded.');
  console.log('\nSeed complete!');
  // Only shown for accounts this run actually created — an upsert leaves an
  // existing password untouched, so printing it would be a lie.
  console.log('Admin:  admin@jetwash24.com  / ' + adminPassword);
  console.log('Worker: worker@jetwash24.com / ' + workerPassword);
  console.log('(if the accounts already existed, their passwords are unchanged)');
}

/** Random 24-char password, used when no seed password is provided. */
function randomPassword(): string {
  return randomBytes(18).toString('base64url');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient, ServiceCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // ─── Interior Services ────────────────────────────────────────────────────────
  await prisma.service.upsert({
    where: { id: 'svc-express-interior' },
    update: {},
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
      price: 25,
      duration: 40,
      category: ServiceCategory.INTERIOR,
      sortOrder: 1,
    },
  });

  await prisma.service.upsert({
    where: { id: 'svc-full-interior' },
    update: {},
    create: {
      id: 'svc-full-interior',
      name: 'Full Interior Detail',
      namePt: 'Limpeza Interior Completa',
      nameEn: 'Full Interior Detail',
      descriptionPt: 'Limpeza profunda e detalhada de todo o interior do veículo.',
      descriptionEn: 'Deep and thorough cleaning of the entire vehicle interior.',
      includes: ['Deep vacuum', 'Seat cleaning', 'Carpet cleaning', 'Dashboard deep clean', 'Plastics cleaning', 'Door panels', 'Interior windows', 'Odor treatment'],
      includesPt: ['Aspiração profunda', 'Limpeza dos bancos', 'Limpeza dos tapetes', 'Limpeza profunda do tablier', 'Limpeza dos plásticos', 'Painéis das portas', 'Vidros interiores', 'Tratamento de odores'],
      includesEn: ['Deep vacuum', 'Seat cleaning', 'Carpet cleaning', 'Dashboard deep clean', 'Plastics cleaning', 'Door panels', 'Interior windows', 'Odor treatment'],
      price: 75,
      duration: 120,
      category: ServiceCategory.INTERIOR,
      sortOrder: 2,
    },
  });

  await prisma.service.upsert({
    where: { id: 'svc-premium-interior' },
    update: {},
    create: {
      id: 'svc-premium-interior',
      name: 'Premium Interior Restoration',
      namePt: 'Restauração Interior Premium',
      nameEn: 'Premium Interior Restoration',
      descriptionPt: 'Restauração completa do interior com tratamentos premium para um resultado impecável.',
      descriptionEn: 'Complete interior restoration with premium treatments for a flawless result.',
      includes: ['Full deep interior cleaning', 'Carpet shampoo extraction', 'Seat shampoo extraction', 'Leather conditioning', 'Plastics restoration', 'Air vent cleaning', 'Odor elimination', 'Interior protection'],
      includesPt: ['Limpeza interior profunda completa', 'Extração de champô nos tapetes', 'Extração de champô nos bancos', 'Condicionamento de couro', 'Restauração de plásticos', 'Limpeza das saídas de ar', 'Eliminação de odores', 'Proteção interior'],
      includesEn: ['Full deep interior cleaning', 'Carpet shampoo extraction', 'Seat shampoo extraction', 'Leather conditioning', 'Plastics restoration', 'Air vent cleaning', 'Odor elimination', 'Interior protection'],
      price: 140,
      duration: 240,
      category: ServiceCategory.INTERIOR,
      sortOrder: 3,
    },
  });

  // ─── Exterior Services ────────────────────────────────────────────────────────
  await prisma.service.upsert({
    where: { id: 'svc-hand-wash' },
    update: {},
    create: {
      id: 'svc-hand-wash',
      name: 'Hand Wash & Dry',
      namePt: 'Lavagem Manual e Secagem',
      nameEn: 'Hand Wash & Dry',
      descriptionPt: 'Lavagem manual cuidadosa com secagem e brilho nos pneus.',
      descriptionEn: 'Careful hand wash with drying and tire shine.',
      includes: ['Hand wash', 'Wheel cleaning', 'Drying', 'Tire shine'],
      includesPt: ['Lavagem manual', 'Limpeza das jantes', 'Secagem', 'Brilho nos pneus'],
      includesEn: ['Hand wash', 'Wheel cleaning', 'Drying', 'Tire shine'],
      price: 15,
      duration: 30,
      category: ServiceCategory.EXTERIOR,
      sortOrder: 4,
    },
  });

  await prisma.service.upsert({
    where: { id: 'svc-exterior-premium' },
    update: {},
    create: {
      id: 'svc-exterior-premium',
      name: 'Exterior Premium Wash',
      namePt: 'Lavagem Exterior Premium',
      nameEn: 'Exterior Premium Wash',
      descriptionPt: 'Lavagem premium com pré-lavagem com espuma e proteção com cera spray.',
      descriptionEn: 'Premium wash with foam prewash and spray wax protection.',
      includes: ['Foam prewash', 'Hand wash', 'Wheel deep cleaning', 'Tire shine', 'Spray wax protection'],
      includesPt: ['Pré-lavagem com espuma', 'Lavagem manual', 'Limpeza profunda das jantes', 'Brilho nos pneus', 'Proteção com cera spray'],
      includesEn: ['Foam prewash', 'Hand wash', 'Wheel deep cleaning', 'Tire shine', 'Spray wax protection'],
      price: 50,
      duration: 60,
      category: ServiceCategory.EXTERIOR,
      sortOrder: 5,
    },
  });

  console.log('Services seeded.');

  // ─── Add-ons ──────────────────────────────────────────────────────────────────
  const addons = [
    { id: 'addon-seat-shampoo', name: 'Seat Shampoo', namePt: 'Champô nos Bancos', nameEn: 'Seat Shampoo', price: 25, duration: 20, sortOrder: 1 },
    { id: 'addon-pet-hair', name: 'Pet Hair Removal', namePt: 'Remoção de Pelos de Animal', nameEn: 'Pet Hair Removal', price: 20, duration: 20, sortOrder: 2 },
    { id: 'addon-leather', name: 'Leather Conditioning', namePt: 'Condicionamento de Couro', nameEn: 'Leather Conditioning', price: 25, duration: 15, sortOrder: 3 },
    { id: 'addon-odor', name: 'Odor Removal', namePt: 'Remoção de Odores', nameEn: 'Odor Removal', price: 20, duration: 10, sortOrder: 4 },
    { id: 'addon-engine', name: 'Engine Bay Cleaning', namePt: 'Limpeza do Motor', nameEn: 'Engine Bay Cleaning', price: 40, duration: 30, sortOrder: 5 },
    { id: 'addon-headlights', name: 'Headlight Restoration', namePt: 'Restauração de Faróis', nameEn: 'Headlight Restoration', price: 50, duration: 45, sortOrder: 6 },
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
  const adminHash = await bcrypt.hash('Admin@JetWash24!', 12);
  const workerHash = await bcrypt.hash('Worker@JetWash24!', 12);

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
  console.log('Admin:  admin@jetwash24.com  / Admin@JetWash24!');
  console.log('Worker: worker@jetwash24.com / Worker@JetWash24!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

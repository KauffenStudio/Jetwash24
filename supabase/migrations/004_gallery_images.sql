-- Gallery images: real before/after detailing transformations
-- Images stored in /public/gallery/ (Next.js static serving)

INSERT INTO gallery_images (
  id,
  "beforeImageUrl",
  "afterImageUrl",
  "descriptionPt",
  "descriptionEn",
  "servicePerformed",
  "isActive",
  "sortOrder",
  "createdAt",
  "updatedAt"
) VALUES
  (
    'gal-01',
    '/gallery/detail-1-before.jpg',
    '/gallery/detail-1-after.jpg',
    'Interior completo: tapetes e bancos com sujidade acumulada restaurados ao estado original',
    'Full interior: floor mats and seats with built-up grime restored to original condition',
    'Limpeza Interior Detalhada',
    true, 1, NOW(), NOW()
  ),
  (
    'gal-02',
    '/gallery/detail-9-before.jpg',
    '/gallery/detail-9-after.jpg',
    'Honda Accord: interior completamente transformado — bancos, painel e tapetes',
    'Honda Accord: full interior transformation — seats, dashboard and floor mats',
    'Limpeza Interior Detalhada',
    true, 2, NOW(), NOW()
  ),
  (
    'gal-03',
    '/gallery/detail-10-before.jpg',
    '/gallery/detail-10-after.jpg',
    'Capô com riscos e oxidação eliminados por polimento profissional — pintura revitalizada',
    'Bonnet with scratches and oxidation removed by professional polishing — paint revitalised',
    'Limpeza Exterior Detalhada',
    true, 3, NOW(), NOW()
  ),
  (
    'gal-04',
    '/gallery/detail-11-before.jpg',
    '/gallery/detail-11-after.jpg',
    'Consola central e apoio de braço com acumulação severa de sujidade — limpeza profunda',
    'Centre console and armrest with severe dirt build-up — deep cleaned to like new',
    'Limpeza Interior Detalhada',
    true, 4, NOW(), NOW()
  ),
  (
    'gal-05',
    '/gallery/headlight-bmw-before.jpg',
    '/gallery/headlight-bmw-after.jpg',
    'BMW 530i: faróis oxidados e opacos restaurados a cristal claro com polimento especializado',
    'BMW 530i: oxidised and hazy headlights restored to crystal clear with specialist polishing',
    'Restauro de Faróis',
    true, 5, NOW(), NOW()
  ),
  (
    'gal-06',
    '/gallery/detail-15-before.jpg',
    '/gallery/detail-15-after.jpg',
    'Exterior preto: remoção de contaminantes e aplicação de cera — brilho profundo recuperado',
    'Black exterior: contaminant removal and wax application — deep shine restored',
    'Limpeza Exterior Detalhada',
    true, 6, NOW(), NOW()
  ),
  (
    'gal-07',
    '/gallery/detail-17-before.jpg',
    '/gallery/detail-17-after.jpg',
    'Porta vermelha com riscos superficiais eliminados por paint correction de 2 etapas',
    'Red door with surface scratches removed by 2-stage paint correction',
    'Limpeza Exterior Detalhada',
    true, 7, NOW(), NOW()
  ),
  (
    'gal-08',
    '/gallery/detail-19-before.jpg',
    '/gallery/detail-19-after.jpg',
    'Banco de couro bege: manchas e desgaste removidos — couro nutrido e revitalizado',
    'Beige leather seat: stains and wear removed — leather nourished and revitalised',
    'Limpeza Interior Detalhada',
    true, 8, NOW(), NOW()
  ),
  (
    'gal-09',
    '/gallery/detail-12-before.jpg',
    '/gallery/detail-12-after.jpg',
    'Faróis amarelados com visibilidade reduzida — restaurados a transparência total',
    'Yellowed headlights with reduced visibility — restored to full transparency',
    'Restauro de Faróis',
    true, 9, NOW(), NOW()
  )
ON CONFLICT (id) DO NOTHING;

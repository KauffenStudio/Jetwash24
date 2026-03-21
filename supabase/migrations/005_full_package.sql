-- Add FULL category to ServiceCategory enum and insert Pacote Completo service

ALTER TYPE "ServiceCategory" ADD VALUE IF NOT EXISTS 'FULL';

INSERT INTO services (
  id, name, "namePt", "nameEn",
  description, "descriptionPt", "descriptionEn",
  includes, "includesPt", "includesEn",
  price, duration, category,
  "isActive", "sortOrder", "createdAt", "updatedAt"
) VALUES (
  'svc-full-package',
  'Pacote Completo',
  'Pacote Completo',
  'Complete Package',
  'Interior + Exterior completo a preço especial',
  'Transformação completa do seu veículo: interior e exterior detalhado incluídos num único serviço a preço especial.',
  'Complete vehicle transformation: detailed interior and exterior included in one service at a special price.',
  ARRAY[
    'Deep vacuuming',
    'Detailed interior cleaning',
    'Fabric or leather seat cleaning',
    'Sanitisation and odour treatment',
    'Pre-wash with foam',
    'Manual exterior wash',
    'Deep wheel cleaning',
    'Headlight polishing',
    'Minor scratch removal',
    'Tyre shine'
  ],
  ARRAY[
    'Aspiração profunda',
    'Limpeza detalhada do interior',
    'Bancos a estofo ou pele',
    'Higienização e neutralização de odores',
    'Pré-lavagem com espuma',
    'Lavagem manual exterior',
    'Limpeza profunda das jantes',
    'Polimento dos faróis',
    'Remoção de pequenos riscos',
    'Brilho nos pneus'
  ],
  ARRAY[
    'Deep vacuuming',
    'Detailed interior cleaning',
    'Fabric or leather seat cleaning',
    'Sanitisation and odour treatment',
    'Pre-wash with foam',
    'Manual exterior wash',
    'Deep wheel cleaning',
    'Headlight polishing',
    'Minor scratch removal',
    'Tyre shine'
  ],
  85, 180, 'FULL',
  true, 5, NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

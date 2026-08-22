-- Add POLISHING category to ServiceCategory enum and insert the two polishing tiers:
--   svc-gloss-polish     — Polimento de Brilho (single stage, gloss enhancement)
--   svc-paint-correction — Correção de Pintura (two stage, defect removal)
--
-- Run the ALTER TYPE on its own first: Postgres cannot add an enum value and
-- then use it inside the same transaction block.

ALTER TYPE "ServiceCategory" ADD VALUE IF NOT EXISTS 'POLISHING';

-- ── Polimento de Brilho ──────────────────────────────────────────────────────
INSERT INTO services (
  id, name, "namePt", "nameEn",
  description, "descriptionPt", "descriptionEn",
  includes, "includesPt", "includesEn",
  price, "compareAtPrice", duration, category,
  "isActive", "sortOrder", "createdAt", "updatedAt"
) VALUES (
  'svc-gloss-polish',
  'Gloss Polish',
  'Polimento de Brilho',
  'Gloss Polish',
  'Single-stage machine polish for depth and gloss',
  'Polimento a máquina numa fase que devolve brilho e profundidade à pintura e atenua marcas de lavagem.',
  'Single-stage machine polish that brings back gloss and depth and softens light wash marks.',
  ARRAY[
    'Safe wash and decontamination',
    'Clay bar treatment',
    'Single-stage machine polish',
    'Softens light wash marks',
    'Protective sealant',
    'Tyre shine'
  ],
  ARRAY[
    'Lavagem segura e descontaminação',
    'Tratamento com clay bar',
    'Polimento a máquina numa fase',
    'Atenua marcas de lavagem ligeiras',
    'Selante de proteção',
    'Brilho nos pneus'
  ],
  ARRAY[
    'Safe wash and decontamination',
    'Clay bar treatment',
    'Single-stage machine polish',
    'Softens light wash marks',
    'Protective sealant',
    'Tyre shine'
  ],
  149, 190, 150, 'POLISHING',
  true, 6, NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- ── Correção de Pintura ──────────────────────────────────────────────────────
INSERT INTO services (
  id, name, "namePt", "nameEn",
  description, "descriptionPt", "descriptionEn",
  includes, "includesPt", "includesEn",
  price, "compareAtPrice", duration, category,
  "isActive", "sortOrder", "createdAt", "updatedAt"
) VALUES (
  'svc-paint-correction',
  'Paint Correction',
  'Correção de Pintura',
  'Paint Correction',
  'Two-stage paint correction that removes swirls and light scratches',
  'Correção de pintura em duas fases que remove swirls e riscos ligeiros do verniz, com acabamento de brilho de espelho.',
  'Two-stage paint correction that removes swirls and light scratches from the clear coat, finished to a mirror shine.',
  ARRAY[
    'Safe wash and decontamination',
    'Clay bar treatment',
    'Clear-coat thickness assessment',
    'Two-stage correction (cut + refine)',
    'Removal of swirls and light scratches',
    'Protective sealant'
  ],
  ARRAY[
    'Lavagem segura e descontaminação',
    'Tratamento com clay bar',
    'Avaliação da espessura do verniz',
    'Correção em duas fases (corte + refinamento)',
    'Remoção de swirls e riscos ligeiros',
    'Selante de proteção'
  ],
  ARRAY[
    'Safe wash and decontamination',
    'Clay bar treatment',
    'Clear-coat thickness assessment',
    'Two-stage correction (cut + refine)',
    'Removal of swirls and light scratches',
    'Protective sealant'
  ],
  249, 320, 300, 'POLISHING',
  true, 7, NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

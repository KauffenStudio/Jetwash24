-- Update services: Interior Detalhada (svc-full-interior)
UPDATE services
SET
  name = 'Detailed Interior Clean',
  "namePt" = 'Limpeza Interior Detalhada',
  "nameEn" = 'Detailed Interior Clean',
  "descriptionPt" = 'Limpeza detalhada e profunda do interior, com tratamento dos bancos a estofo ou a pele.',
  "descriptionEn" = 'Deep detailed interior cleaning with fabric or leather seat treatment.',
  includes = ARRAY['Deep vacuum', 'Detailed cleaning', 'Deep seat cleaning (fabric or leather)', 'Deep hygienization', 'Odor treatment'],
  "includesPt" = ARRAY['Aspiração profunda', 'Limpeza detalhada', 'Limpeza profunda dos bancos a estofo ou a pele', 'Higienização profunda', 'Tratamento de odores'],
  "includesEn" = ARRAY['Deep vacuum', 'Detailed cleaning', 'Deep seat cleaning (fabric or leather)', 'Deep hygienization', 'Odor treatment'],
  price = 45,
  duration = 120
WHERE id = 'svc-full-interior';

-- Deactivate Premium Interior (svc-premium-interior)
UPDATE services
SET "isActive" = false
WHERE id = 'svc-premium-interior';

-- Update Exterior Express (svc-hand-wash): rename + price 15€
UPDATE services
SET
  name = 'Express Exterior Wash',
  "namePt" = 'Lavagem Exterior Express',
  "nameEn" = 'Express Exterior Wash',
  "descriptionPt" = 'Lavagem exterior rápida e eficaz com secagem e brilho nos pneus.',
  "descriptionEn" = 'Quick and effective exterior wash with drying and tire shine.',
  includes = ARRAY['Hand wash', 'Wheel cleaning', 'Drying', 'Tire shine'],
  "includesPt" = ARRAY['Lavagem manual', 'Limpeza das jantes', 'Secagem', 'Brilho nos pneus'],
  "includesEn" = ARRAY['Hand wash', 'Wheel cleaning', 'Drying', 'Tire shine'],
  price = 15,
  duration = 30
WHERE id = 'svc-hand-wash';

-- Update Exterior Detalhada (svc-exterior-premium): rename + price 55€ + new includes
UPDATE services
SET
  name = 'Detailed Exterior Clean',
  "namePt" = 'Limpeza Exterior Detalhada',
  "nameEn" = 'Detailed Exterior Clean',
  "descriptionPt" = 'Limpeza exterior completa com polimento dos faróis e remoção de pequenos riscos.',
  "descriptionEn" = 'Complete exterior cleaning with headlight polishing and minor scratch removal.',
  includes = ARRAY['Foam prewash', 'Hand wash', 'Wheel deep cleaning', 'Tire shine', 'Headlight polishing', 'Minor scratch removal'],
  "includesPt" = ARRAY['Pré-lavagem com espuma', 'Lavagem manual', 'Limpeza profunda das jantes', 'Brilho nos pneus', 'Polimento dos faróis', 'Remoção de pequenos riscos'],
  "includesEn" = ARRAY['Foam prewash', 'Hand wash', 'Wheel deep cleaning', 'Tire shine', 'Headlight polishing', 'Minor scratch removal'],
  price = 55,
  duration = 90
WHERE id = 'svc-exterior-premium';

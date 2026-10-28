-- Restauro de Faróis: 35€ → 40€ (Oct 2026). Matches fromPrice in
-- src/content/services.ts.
--
-- compareAtPrice is cleared: a price rise has no honest struck-through
-- reference. Under Omnibus (DL 109-G/2021) it would have to be the lowest
-- price of the previous 30 days — 35€ — and showing "40€, antes 44,90€"
-- would advertise a cut that never happened.
--
-- Guarded on the current price so a re-run is a no-op.

UPDATE services SET price = 40, "compareAtPrice" = NULL, "updatedAt" = NOW()
WHERE id = 'cmu1aiyue0000gjhxay3lf7ib' AND price = 35;

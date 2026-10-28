-- Booking extra "Restauração de Faróis": 50€ → 40€ (Oct 2026), the same as
-- the standalone Restauro de Faróis service (migration 009). At 50€ the extra
-- cost more than booking the service on its own.
--
-- Guarded on the current price so a re-run is a no-op.

UPDATE addons SET price = 40, "updatedAt" = NOW()
WHERE id = 'addon-headlights' AND price = 50;

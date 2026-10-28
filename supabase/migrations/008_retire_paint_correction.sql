-- Retire the Correção de Pintura service. The owner no longer offers it.
--
-- Deactivated rather than deleted: past bookings reference this row, and
-- isActive = false is what takes it off the home page and out of the booking
-- wizard. Bookings already made for it are left as they are.

UPDATE services SET "isActive" = false, "updatedAt" = NOW()
WHERE id = 'svc-paint-correction';

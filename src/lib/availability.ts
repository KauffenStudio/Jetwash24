import { prisma } from './prisma';
import { parseISO, startOfDay, endOfDay } from 'date-fns';

// Business hours (minutes from midnight)
const OPEN_TIME = 9 * 60;   // 09:00 = 540 min
const CLOSE_TIME = 17 * 60; // 17:00 = 1020 min
const BUFFER_MINUTES = 20;  // Buffer between jobs
const SLOT_INCREMENT = 30;  // Generate slots every 30 min

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

interface BookingPeriod {
  start: number; // minutes from midnight
  end: number;   // minutes from midnight (duration + buffer)
}

interface BlockedPeriod {
  start: number;
  end: number;
}

export async function getAvailableSlots(
  dateStr: string,       // 'YYYY-MM-DD'
  serviceDuration: number, // total service duration in minutes
): Promise<string[]> {
  const date = parseISO(dateStr);
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  // Fetch worker capacity, existing bookings, and blocked slots in parallel
  const [workerCapacity, existingBookings, blockedSlots] = await Promise.all([
    prisma.user.count({
      where: { role: 'WORKER', isActive: true },
    }),
    prisma.booking.findMany({
      where: {
        date: { gte: dayStart, lte: dayEnd },
        OR: [
          { status: 'CONFIRMED' },
          {
            status: 'PENDING',
            paymentExpiresAt: { gt: new Date() },
          },
        ],
      },
      select: {
        startTime: true,
        totalDuration: true,
      },
    }),
    prisma.blockedSlot.findMany({
      where: {
        date: { gte: dayStart, lte: dayEnd },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    }),
  ]);

  // Precompute booking periods (start + duration + buffer per booking)
  const bookingPeriods: BookingPeriod[] = existingBookings.map((b) => ({
    start: timeToMinutes(b.startTime),
    end: timeToMinutes(b.startTime) + b.totalDuration + BUFFER_MINUTES,
  }));

  // Precompute fully-blocked periods (blocked slots block all workers)
  const blockedPeriods: BlockedPeriod[] = blockedSlots.map((s) => ({
    start: timeToMinutes(s.startTime),
    end: timeToMinutes(s.endTime),
  }));

  // Effective capacity: at least 1 even if no workers seeded yet
  const capacity = Math.max(workerCapacity, 1);

  const availableSlots: string[] = [];

  for (
    let slotStart = OPEN_TIME;
    slotStart + serviceDuration <= CLOSE_TIME;
    slotStart += SLOT_INCREMENT
  ) {
    const slotEnd = slotStart + serviceDuration;

    // Hard block: admin-created blocked slot covers this window
    const isHardBlocked = blockedPeriods.some(
      (p) => slotStart < p.end && slotEnd > p.start,
    );
    if (isHardBlocked) continue;

    // Count how many existing bookings overlap this candidate slot
    // Two intervals overlap when: start < otherEnd AND end > otherStart
    const overlapping = bookingPeriods.filter(
      (b) => slotStart < b.end && slotEnd > b.start,
    ).length;

    if (overlapping < capacity) {
      availableSlots.push(minutesToTime(slotStart));
    }
  }

  return availableSlots;
}

export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const startMinutes = timeToMinutes(startTime);
  return minutesToTime(startMinutes + durationMinutes);
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${m}min`;
}

export { BUFFER_MINUTES, OPEN_TIME, CLOSE_TIME };

import { prisma } from './prisma';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';

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

interface BlockedPeriod {
  start: number; // minutes from midnight
  end: number;   // minutes from midnight (inclusive of buffer for bookings)
}

export async function getAvailableSlots(
  dateStr: string, // 'YYYY-MM-DD'
  serviceDuration: number, // total service duration in minutes
): Promise<string[]> {
  const date = parseISO(dateStr);
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  // Load existing CONFIRMED bookings and active PENDING bookings (not expired)
  const existingBookings = await prisma.booking.findMany({
    where: {
      date: {
        gte: dayStart,
        lte: dayEnd,
      },
      status: {
        in: ['CONFIRMED', 'PENDING'],
      },
      // Exclude expired pending bookings
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
  });

  // Load blocked slots for the day
  const blockedSlots = await prisma.blockedSlot.findMany({
    where: {
      date: {
        gte: dayStart,
        lte: dayEnd,
      },
    },
    select: {
      startTime: true,
      endTime: true,
    },
  });

  // Build blocked periods
  const blockedPeriods: BlockedPeriod[] = [];

  for (const booking of existingBookings) {
    const start = timeToMinutes(booking.startTime);
    // End = start + duration + buffer (so next slot must start after this)
    const end = start + booking.totalDuration + BUFFER_MINUTES;
    blockedPeriods.push({ start, end });
  }

  for (const slot of blockedSlots) {
    blockedPeriods.push({
      start: timeToMinutes(slot.startTime),
      end: timeToMinutes(slot.endTime),
    });
  }

  // Generate available slots
  const availableSlots: string[] = [];

  for (
    let slotStart = OPEN_TIME;
    slotStart + serviceDuration <= CLOSE_TIME;
    slotStart += SLOT_INCREMENT
  ) {
    const slotEnd = slotStart + serviceDuration;

    // Check if this slot overlaps with any blocked period
    const isBlocked = blockedPeriods.some(
      (period) => slotStart < period.end && slotEnd > period.start,
    );

    if (!isBlocked) {
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

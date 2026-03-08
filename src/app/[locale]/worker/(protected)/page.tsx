import { prisma } from '@/lib/prisma';
import DaySchedule from '@/components/worker/DaySchedule';
import { startOfDay, endOfDay, addDays } from 'date-fns';

async function getDayBookings(date: Date) {
  return prisma.booking.findMany({
    where: {
      date: { gte: startOfDay(date), lte: endOfDay(date) },
      status: { in: ['CONFIRMED', 'PENDING'] },
    },
    include: {
      customer: true,
      service: true,
      addons: { include: { addon: true } },
    },
    orderBy: { startTime: 'asc' },
  });
}

export default async function WorkerPage() {
  const today = new Date();
  const tomorrow = addDays(today, 1);

  const [todayBookings, tomorrowBookings] = await Promise.all([
    getDayBookings(today),
    getDayBookings(tomorrow),
  ]);

  const fmt = (d: Date) =>
    d.toLocaleDateString('pt-PT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

  return (
    <div className="space-y-10">
      <DaySchedule
        bookings={todayBookings as Parameters<typeof DaySchedule>[0]['bookings']}
        title={`Hoje — ${fmt(today)}`}
        emptyMessage="Sem marcações para hoje"
      />
      <DaySchedule
        bookings={tomorrowBookings as Parameters<typeof DaySchedule>[0]['bookings']}
        title={`Amanhã — ${fmt(tomorrow)}`}
        emptyMessage="Sem marcações para amanhã"
      />
    </div>
  );
}

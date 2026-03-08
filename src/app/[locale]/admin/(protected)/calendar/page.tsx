import { prisma } from '@/lib/prisma';
import { formatDateShort } from '@/lib/utils';
import { startOfDay, endOfDay, addDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

async function getUpcomingBookings() {
  const today = startOfDay(new Date());
  const in14Days = endOfDay(addDays(today, 14));

  return prisma.booking.findMany({
    where: {
      date: { gte: today, lte: in14Days },
      status: { in: ['CONFIRMED', 'PENDING'] },
    },
    include: {
      customer: true,
      service: true,
      addons: { include: { addon: true } },
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });
}

export default async function AdminCalendarPage() {
  const bookings = await getUpcomingBookings();

  // Group by date
  const grouped = bookings.reduce(
    (acc, booking) => {
      const dateStr = format(
        booking.date instanceof Date ? booking.date : new Date(booking.date),
        'yyyy-MM-dd',
      );
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(booking);
      return acc;
    },
    {} as Record<string, typeof bookings>,
  );

  // Generate next 14 days
  const days = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(startOfDay(new Date()), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    return { date, dateStr, bookings: grouped[dateStr] ?? [] };
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-black mb-2">Calendário</h1>
      <p className="text-surface-500 mb-8">Próximos 14 dias</p>

      <div className="space-y-4">
        {days.map(({ date, dateStr, bookings: dayBookings }) => {
          const isToday = dateStr === format(new Date(), 'yyyy-MM-dd');
          return (
            <div
              key={dateStr}
              className={`rounded-lg border ${
                isToday ? 'border-black' : 'border-surface-200'
              } overflow-hidden`}
            >
              {/* Day header */}
              <div
                className={`px-5 py-3 flex items-center justify-between ${
                  isToday ? 'bg-black text-white' : 'bg-surface-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <p className={`font-black text-xl ${isToday ? 'text-gold' : 'text-black'}`}>
                    {format(date, 'd')}
                  </p>
                  <div>
                    <p className={`font-semibold text-sm capitalize ${isToday ? 'text-white' : 'text-black'}`}>
                      {format(date, 'EEEE', { locale: ptBR })}
                    </p>
                    <p className={`text-xs ${isToday ? 'text-white/50' : 'text-surface-400'}`}>
                      {format(date, 'MMMM yyyy', { locale: ptBR })}
                    </p>
                  </div>
                  {isToday && (
                    <span className="ml-2 px-2 py-0.5 bg-gold text-black text-xs font-bold rounded">
                      Hoje
                    </span>
                  )}
                </div>
                <span className={`text-sm font-semibold ${isToday ? 'text-white/70' : 'text-surface-500'}`}>
                  {dayBookings.length} {dayBookings.length === 1 ? 'marcação' : 'marcações'}
                </span>
              </div>

              {/* Bookings for the day */}
              {dayBookings.length === 0 ? (
                <div className="px-5 py-4 text-surface-400 text-sm">Dia livre</div>
              ) : (
                <div className="divide-y divide-surface-100">
                  {dayBookings.map((booking) => (
                    <div key={booking.id} className="px-5 py-4 flex items-center gap-4">
                      <div className="text-base font-black text-black font-mono w-12 flex-shrink-0">
                        {booking.startTime}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-black">{booking.customer.name}</p>
                        <p className="text-sm text-surface-500 truncate">
                          {booking.service.namePt}
                          {booking.addons.length > 0 && ` + ${booking.addons.map((a) => a.addon.namePt).join(', ')}`}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm text-surface-500">{booking.customer.carModel}</p>
                        <p className="text-xs text-surface-400 font-mono">{booking.customer.licensePlate}</p>
                      </div>
                      <span
                        className={`flex-shrink-0 px-2 py-1 text-xs font-semibold rounded ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {booking.status === 'CONFIRMED' ? '✓' : '⏳'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import Link from 'next/link';

async function getDashboardStats() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [
    todayBookings,
    weekBookings,
    monthRevenue,
    totalBookings,
    recentBookings,
  ] = await Promise.all([
    prisma.booking.count({
      where: { date: { gte: todayStart, lte: todayEnd }, status: 'CONFIRMED' },
    }),
    prisma.booking.count({
      where: { date: { gte: weekStart, lte: weekEnd }, status: 'CONFIRMED' },
    }),
    prisma.booking.aggregate({
      where: { status: 'CONFIRMED', date: { gte: monthStart, lte: monthEnd } },
      _sum: { totalPrice: true },
    }),
    prisma.booking.count({ where: { status: { in: ['CONFIRMED', 'COMPLETED'] } } }),
    prisma.booking.findMany({
      where: { status: { in: ['CONFIRMED', 'PENDING'] } },
      include: { customer: true, service: true, addons: { include: { addon: true } } },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      take: 5,
    }),
  ]);

  return { todayBookings, weekBookings, monthRevenue: monthRevenue._sum.totalPrice ?? 0, totalBookings, recentBookings };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    { label: 'Reservas hoje', value: stats.todayBookings.toString(), icon: '📅' },
    { label: 'Esta semana', value: stats.weekBookings.toString(), icon: '📊' },
    { label: 'Receita este mês', value: formatPrice(stats.monthRevenue), icon: '💶' },
    { label: 'Total confirmadas', value: stats.totalBookings.toString(), icon: '✅' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-black mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white border border-surface-200 rounded-lg p-6">
            <p className="text-2xl mb-2">{card.icon}</p>
            <p className="text-2xl font-black text-black">{card.value}</p>
            <p className="text-sm text-surface-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-white border border-surface-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-black">Próximas Reservas</h2>
          <Link
            href="bookings"
            className="text-sm text-surface-500 hover:text-black transition-colors"
          >
            Ver todas →
          </Link>
        </div>

        {stats.recentBookings.length === 0 ? (
          <p className="text-surface-400 text-sm py-4">Sem reservas próximas.</p>
        ) : (
          <div className="space-y-3">
            {stats.recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center gap-4 py-3 border-b border-surface-100 last:border-0">
                <div className="text-center w-14">
                  <p className="text-lg font-black text-black font-mono">{booking.startTime}</p>
                  <p className="text-xs text-surface-400">
                    {new Date(booking.date).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' })}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-black truncate">{booking.customer.name}</p>
                  <p className="text-sm text-surface-500 truncate">{booking.service.namePt}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-black">{formatPrice(booking.totalPrice)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {booking.status === 'CONFIRMED' ? 'Confirmado' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

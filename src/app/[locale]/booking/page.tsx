import { prisma } from '@/lib/prisma';
import BookingWizard from '@/components/booking/BookingWizard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reservar Serviço',
  description: 'Reserve o seu serviço de detailing online em minutos.',
};

async function getData() {
  const [services, addons] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.addon.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);
  return { services, addons };
}

export default async function BookingPage() {
  const { services, addons } = await getData();

  return (
    <div className="pt-16 md:pt-20">
      <BookingWizard services={services} addons={addons} />
    </div>
  );
}

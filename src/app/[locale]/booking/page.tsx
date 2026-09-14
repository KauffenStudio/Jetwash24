import { prisma } from '@/lib/prisma';
import BookingWizard from '@/components/booking/BookingWizard';
import { isStripeConfigured, DEPOSIT_AMOUNT } from '@/lib/stripe';
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

export default async function BookingPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { serviceId?: string };
}) {
  const { services, addons } = await getData();
  const preSelectedService = searchParams?.serviceId
    ? (services.find((s) => s.id === searchParams.serviceId) ?? null)
    : null;

  // Deposit is taken only when Stripe is configured.
  const depositAmount = isStripeConfigured() ? DEPOSIT_AMOUNT : 0;

  return (
    <div className="pt-16 md:pt-20">
      {/* The page had no H1 at all — its outline started at H2. The wizard
          carries its own step headings, so this names the page itself. */}
      <h1 className="sr-only">
        {locale === 'pt' ? 'Reservar serviço de detailing' : 'Book a detailing service'}
      </h1>
      <BookingWizard
        services={services}
        addons={addons}
        preSelectedService={preSelectedService}
        depositAmount={depositAmount}
      />
    </div>
  );
}

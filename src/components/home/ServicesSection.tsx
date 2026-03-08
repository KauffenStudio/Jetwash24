import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getTranslations, getLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { formatDurationLabel } from '@/lib/utils';

async function getServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
}

export default async function ServicesSection() {
  const t = await getTranslations('services');
  const locale = await getLocale();
  const services = await getServices();

  const interior = services.filter((s) => s.category === 'INTERIOR');
  const exterior = services.filter((s) => s.category === 'EXTERIOR');

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">{t('subtitle')}</p>
          <h2 className="text-4xl sm:text-5xl font-black text-black">{t('title')}</h2>
        </div>

        {/* Interior Services */}
        <ServiceCategory
          title={t('interior')}
          services={interior}
          locale={locale}
          t={t}
        />

        {/* Exterior Services */}
        <ServiceCategory
          title={t('exterior')}
          services={exterior}
          locale={locale}
          t={t}
          className="mt-16"
        />

        {/* Vehicle size note */}
        <p className="text-center text-surface-500 text-sm mt-10">
          * {t('vehicleAdjustment')} (+10€ Médio / +20€ SUV / +30€ Grande)
        </p>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/booking`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-bold tracking-wide rounded hover:bg-surface-800 transition-colors duration-200"
          >
            {t('bookNow')}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ServiceCategory({
  title,
  services,
  locale,
  t,
  className = '',
}: {
  title: string;
  services: Awaited<ReturnType<typeof getServices>>;
  locale: string;
  t: ReturnType<typeof useTranslations<'services'>>;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-surface-500 tracking-widest uppercase mb-6 flex items-center gap-3">
        <span className="flex-1 h-px bg-surface-200" />
        {title}
        <span className="flex-1 h-px bg-surface-200" />
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} locale={locale} t={t} />
        ))}
      </div>
    </div>
  );
}

function ServiceCard({
  service,
  locale,
  t,
}: {
  service: Awaited<ReturnType<typeof getServices>>[0];
  locale: string;
  t: ReturnType<typeof useTranslations<'services'>>;
}) {
  const name = locale === 'pt' ? service.namePt : service.nameEn;
  const includes = locale === 'pt' ? service.includesPt : service.includesEn;

  return (
    <div className="border border-surface-200 rounded-lg p-6 hover:border-black hover:shadow-lg transition-all duration-300 group flex flex-col">
      {/* Price & Duration */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-3xl font-black text-black">
            {service.price}€
          </p>
          <p className="text-surface-400 text-xs mt-0.5">{t('from')}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-surface-600">
            {formatDurationLabel(service.duration, locale)}
          </p>
          <p className="text-surface-400 text-xs">{t('duration')}</p>
        </div>
      </div>

      {/* Name */}
      <h4 className="text-lg font-bold text-black mb-3 group-hover:text-gold transition-colors">
        {name}
      </h4>

      {/* Includes */}
      <ul className="space-y-1.5 flex-1">
        {includes.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-surface-600">
            <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

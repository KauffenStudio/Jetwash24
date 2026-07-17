import Link from 'next/link';
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
  const fullPackage = services.find((s) => s.category === 'FULL');

  const originalPrice = 150; // Interior Detalhada 80€ + Exterior Detalhada 70€
  const saving = fullPackage ? originalPrice - fullPackage.price : 0;

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">{t('subtitle')}</p>
          <h2 className="text-4xl sm:text-5xl font-black text-black">{t('title')}</h2>
        </div>

        {/* ── 4 individual services — 2 columns ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 mb-6">
          {/* Interior column */}
          <div>
            <p className="text-sm font-black tracking-[0.2em] uppercase text-black mb-4 flex items-center gap-3">
              <span className="flex-1 h-px bg-surface-200" />
              {t('interior')}
              <span className="flex-1 h-px bg-surface-200" />
            </p>
            <div className="space-y-4">
              {interior.map((service) => (
                <ServiceCard key={service.id} service={service} locale={locale} />
              ))}
            </div>
          </div>

          {/* Exterior column */}
          <div>
            <p className="text-sm font-black tracking-[0.2em] uppercase text-black mb-4 flex items-center gap-3">
              <span className="flex-1 h-px bg-surface-200" />
              {t('exterior')}
              <span className="flex-1 h-px bg-surface-200" />
            </p>
            <div className="space-y-4">
              {exterior.map((service) => (
                <ServiceCard key={service.id} service={service} locale={locale} />
              ))}
            </div>
          </div>
        </div>

        {/* Vehicle size note */}
        <p className="text-center text-surface-400 text-xs mb-12">
          * {t('vehicleAdjustment')} (+5€ {locale === 'pt' ? 'Médio' : 'Medium'} / +10€ SUV / +15€ {locale === 'pt' ? 'Grande' : 'Large'})
        </p>

        {/* ── Pacote Completo — full-width featured card ─────────────────── */}
        {fullPackage && (
          <div className="relative rounded-2xl overflow-hidden bg-[#0A0A0A] shadow-2xl">
            {/* Gold top accent line */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />

            {/* Background texture */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundSize: '200px 200px',
              }}
            />

            <div className="relative z-10 p-8 sm:p-10">

              {/* ── Row 1: header — name left, price right ── */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/15 border border-gold/30 rounded-full mb-3">
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M5 1L6.18 3.64L9 4.09L7 6.04L7.45 9L5 7.64L2.55 9L3 6.04L1 4.09L3.82 3.64L5 1Z" fill="#C9A84C"/>
                    </svg>
                    <span className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase">
                      {locale === 'pt' ? 'Melhor Valor' : 'Best Value'}
                    </span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                    {locale === 'pt' ? 'Pacote ' : 'Complete '}
                    <span className="text-gold">{locale === 'pt' ? 'Completo' : 'Package'}</span>
                  </h3>
                  <p className="text-white/45 text-sm mt-2">
                    {locale === 'pt'
                      ? 'Interior + Exterior num único serviço · ' + formatDurationLabel(fullPackage.duration, locale)
                      : 'Interior + Exterior in one service · ' + formatDurationLabel(fullPackage.duration, locale)}
                  </p>
                </div>

                {/* Price block */}
                <div className="sm:text-right flex-shrink-0">
                  <div className="flex sm:justify-end items-baseline gap-3 mb-2">
                    <span className="text-white/35 line-through text-xl font-medium">{originalPrice}€</span>
                    <span className="text-5xl font-black text-white">{fullPackage.price}€</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold rounded-lg">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L4.5 8.5L10 3" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-black text-xs font-black tracking-wide">
                      {locale === 'pt' ? `POUPA ${saving}€` : `SAVE €${saving}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Row 2: includes grid — full width ── */}
              <div className="border-t border-white/10 pt-7 mb-7">
                <p className="text-white/35 text-[10px] font-bold tracking-[0.2em] uppercase mb-5">
                  {locale === 'pt' ? 'Tudo incluído' : 'Everything included'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {(locale === 'pt' ? fullPackage.includesPt : fullPackage.includesEn).map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center flex-shrink-0">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3 5.5L6.5 2" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-white/65 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Row 3: comparison + CTA ── */}
              <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-white/30 text-xs">
                  {locale === 'pt' ? 'Interior Detalhada' : 'Detailed Interior'}{' '}
                  <span className="line-through">80€</span>
                  {' + '}
                  {locale === 'pt' ? 'Exterior Detalhada' : 'Detailed Exterior'}{' '}
                  <span className="line-through">70€</span>
                  {' = '}
                  <span className="line-through">{originalPrice}€</span>
                  {'  →  '}
                  <span className="text-gold font-bold not-line-through">{locale === 'pt' ? 'Com pacote: ' : 'With package: '}{fullPackage.price}€</span>
                </p>
                <Link
                  href={`/${locale}/booking?serviceId=${fullPackage.id}`}
                  className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gold text-black font-black text-sm tracking-wide rounded-lg hover:bg-gold-light transition-all duration-200 hover:scale-[1.02]"
                  style={{ boxShadow: '0 0 20px rgba(201,168,76,0.25)' }}
                >
                  {locale === 'pt' ? 'Reservar Pacote' : 'Book Package'}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Bottom gold line */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Clickable service card ───────────────────────────────────────────────────

type ServiceRow = Awaited<ReturnType<typeof getServices>>[0];

function ServiceCard({ service, locale }: { service: ServiceRow; locale: string }) {
  const name = locale === 'pt' ? service.namePt : service.nameEn;
  const includes = locale === 'pt' ? service.includesPt : service.includesEn;

  return (
    <Link
      href={`/${locale}/booking?serviceId=${service.id}`}
      className="group block border border-surface-100 rounded-xl p-5 hover:border-black hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-black text-base group-hover:text-gold transition-colors">{name}</h4>
          <p className="text-surface-400 text-xs mt-0.5">{formatDurationLabel(service.duration, locale)}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="flex items-baseline gap-1.5">
            {service.compareAtPrice && service.compareAtPrice > service.price && (
              <span className="text-sm font-semibold text-surface-400 line-through">{service.compareAtPrice}€</span>
            )}
            <span className="text-2xl font-black text-black">{service.price}€</span>
          </p>
          <svg className="opacity-0 group-hover:opacity-100 transition-opacity text-gold" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <ul className="space-y-1">
        {includes.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-surface-500">
            <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs font-semibold text-surface-400 group-hover:text-gold transition-colors">
        {locale === 'pt' ? 'Reservar →' : 'Book →'}
      </p>
    </Link>
  );
}

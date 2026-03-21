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

  const originalPrice = 100; // Interior Detalhada 45€ + Exterior Detalhada 55€
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
              {interior.map((service) => {
                const name = locale === 'pt' ? service.namePt : service.nameEn;
                const includes = locale === 'pt' ? service.includesPt : service.includesEn;
                return (
                  <div key={service.id} className="border border-surface-100 rounded-xl p-5 hover:border-surface-300 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-black text-base">{name}</h4>
                        <p className="text-surface-400 text-xs mt-0.5">{formatDurationLabel(service.duration, locale)}</p>
                      </div>
                      <p className="text-2xl font-black text-black">{service.price}€</p>
                    </div>
                    <ul className="space-y-1">
                      {includes.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-surface-500">
                          <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
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
              {exterior.map((service) => {
                const name = locale === 'pt' ? service.namePt : service.nameEn;
                const includes = locale === 'pt' ? service.includesPt : service.includesEn;
                return (
                  <div key={service.id} className="border border-surface-100 rounded-xl p-5 hover:border-surface-300 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-black text-base">{name}</h4>
                        <p className="text-surface-400 text-xs mt-0.5">{formatDurationLabel(service.duration, locale)}</p>
                      </div>
                      <p className="text-2xl font-black text-black">{service.price}€</p>
                    </div>
                    <ul className="space-y-1">
                      {includes.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-surface-500">
                          <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
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

            <div className="relative z-10 p-8 sm:p-10 lg:p-12">
              <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">

                {/* Left: headline + pricing */}
                <div className="lg:w-80 flex-shrink-0 mb-8 lg:mb-0">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/15 border border-gold/30 rounded-full mb-5">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 1L6.18 3.64L9 4.09L7 6.04L7.45 9L5 7.64L2.55 9L3 6.04L1 4.09L3.82 3.64L5 1Z" fill="#C9A84C"/>
                    </svg>
                    <span className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase">
                      {locale === 'pt' ? 'Melhor Valor' : 'Best Value'}
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight">
                    {locale === 'pt' ? 'Pacote' : 'Complete'}
                    <br />
                    <span className="text-gold">{locale === 'pt' ? 'Completo' : 'Package'}</span>
                  </h3>

                  <p className="text-white/50 text-sm mb-6">
                    {locale === 'pt'
                      ? 'Interior + Exterior num único serviço. Transformação total do seu veículo.'
                      : 'Interior + Exterior in one service. Total vehicle transformation.'}
                  </p>

                  {/* Pricing */}
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-5xl font-black text-white">{fullPackage.price}€</span>
                    <div className="mb-1">
                      <p className="text-white/35 line-through text-lg font-medium">{originalPrice}€</p>
                      <p className="text-[10px] text-white/40">{locale === 'pt' ? 'se separado' : 'if separate'}</p>
                    </div>
                  </div>

                  {/* Saving badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold rounded-lg mb-4">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L4.5 8.5L10 3" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-black text-xs font-black tracking-wide">
                      {locale === 'pt' ? `POUPA ${saving}€` : `SAVE €${saving}`}
                    </span>
                  </div>

                  <p className="text-white/30 text-xs mb-8">
                    {formatDurationLabel(fullPackage.duration, locale)}
                    {' · '}
                    {locale === 'pt' ? 'aprox.' : 'approx.'}
                  </p>

                  <Link
                    href={`/${locale}/booking`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold text-black font-black text-sm tracking-wide rounded-lg hover:bg-gold-light transition-all duration-200 hover:scale-[1.02]"
                    style={{ boxShadow: '0 0 24px rgba(201,168,76,0.3)' }}
                  >
                    {locale === 'pt' ? 'Reservar Pacote' : 'Book Package'}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>

                {/* Right: includes split in 2 columns */}
                <div className="flex-1">
                  <p className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase mb-5">
                    {locale === 'pt' ? 'Tudo incluído' : 'Everything included'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                    {(locale === 'pt' ? fullPackage.includesPt : fullPackage.includesEn).map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1.5 4L3 5.5L6.5 2" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="text-white/70 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* VS comparison strip */}
                  <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <span className="px-2 py-0.5 border border-white/10 rounded text-white/25 line-through">
                        {locale === 'pt' ? 'Interior Detalhada' : 'Detailed Interior'} 45€
                      </span>
                      <span className="text-white/20">+</span>
                      <span className="px-2 py-0.5 border border-white/10 rounded text-white/25 line-through">
                        {locale === 'pt' ? 'Exterior Detalhada' : 'Detailed Exterior'} 55€
                      </span>
                      <span className="text-white/20">=</span>
                      <span className="text-white/30 line-through">{originalPrice}€</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-gold font-bold">{locale === 'pt' ? 'Com pacote:' : 'With package:'}</span>
                      <span className="text-gold font-black text-sm">{fullPackage.price}€</span>
                    </div>
                  </div>
                </div>
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

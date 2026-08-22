import type { Metadata } from 'next';
import Link from 'next/link';
import { SERVICES } from '@/content/services';
import { discountPercent, formatEuro } from '@/lib/utils';
import DiscountBadge from '@/components/ui/DiscountBadge';
import { SITE_URL } from '@/lib/seo/business';
import Reveal from '@/components/ui/Reveal';
import TiltCard from '@/components/ui/TiltCard';
import Spotlight from '@/components/ui/Spotlight';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const isPt = locale === 'pt';
  return {
    title: isPt
      ? 'Serviços de Detailing em Guia, Albufeira'
      : 'Car Detailing Services in Guia, Albufeira',
    description: isPt
      ? 'Detailing de interiores, lavagem exterior, polimento, restauro de faróis e correção de pintura em Guia, Albufeira. Veja todos os serviços e reserve online.'
      : 'Interior detailing, exterior wash, car polishing, headlight restoration and paint correction in Guia, Albufeira. See all services and book online.',
    alternates: {
      canonical: `/${locale}/services`,
      languages: { 'pt-PT': '/pt/services', 'en-GB': '/en/services', 'x-default': '/pt/services' },
    },
    openGraph: {
      url: `${SITE_URL}/${locale}/services`,
      title: isPt ? 'Serviços de Detailing | JetWash24' : 'Car Detailing Services | JetWash24',
    },
  };
}

export default function ServicesHubPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const isPt = locale === 'pt';

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: isPt ? 'Início' : 'Home', path: `/${locale}` },
          { name: isPt ? 'Serviços' : 'Services', path: `/${locale}/services` },
        ]}
      />

      {/* Hero */}
      <Spotlight className="bg-[#0A0A0A] pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <Reveal>
            <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              {isPt ? 'Os Nossos Serviços' : 'Our Services'}
            </p>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">
              {isPt ? 'O seu carro, ao ' : 'Your car, in expert '}
              <span className="text-gold">{isPt ? 'detalhe' : 'detail'}</span>
            </h1>
            <p className="mt-6 text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
              {isPt
                ? 'Do refrescar rápido à restauração completa — escolha o serviço certo para o seu carro, feito por profissionais em Guia, Albufeira.'
                : 'From a quick refresh to a full restoration — pick the right service for your car, done by professionals in Guia, Albufeira.'}
            </p>
          </Reveal>
        </div>
      </Spotlight>

      {/* Services grid */}
      <section className="bg-white py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((service, i) => {
              const copy = isPt ? service.pt : service.en;
              const discount = discountPercent(service.fromPrice, service.compareAtPrice);
              return (
                <Reveal key={service.slug} delay={i * 70}>
                  <TiltCard className="h-full rounded-2xl">
                    <Link
                      href={`/${locale}/services/${service.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-surface-200 bg-white p-7 transition-colors duration-200 hover:border-black"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="flex items-center gap-2">
                          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold">
                            {copy.eyebrow}
                          </span>
                          {discount !== null && <DiscountBadge percent={discount} />}
                        </span>
                        <span className="text-sm text-surface-400">
                          {isPt ? service.durationLabelPt : service.durationLabelEn}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black text-black group-hover:text-gold transition-colors">
                        {copy.name}
                      </h2>
                      <p className="mt-3 text-surface-600 leading-relaxed flex-1">{copy.tagline}</p>
                      <div className="mt-6 flex items-center justify-between border-t border-surface-100 pt-5">
                        <p className="text-black">
                          <span className="text-xs text-surface-400">{isPt ? 'desde' : 'from'}</span>{' '}
                          {service.compareAtPrice && service.compareAtPrice > service.fromPrice && (
                            <span className="text-base font-semibold text-surface-400 line-through mr-1.5">
                              {formatEuro(service.compareAtPrice)}€
                            </span>
                          )}
                          <span className="text-2xl font-black">{formatEuro(service.fromPrice)}€</span>
                        </p>
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-black group-hover:text-gold transition-colors">
                          {isPt ? 'Ver serviço' : 'View service'}
                          <svg className="transition-transform group-hover:translate-x-1" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

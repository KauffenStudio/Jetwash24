import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getLocation, LOCATION_SLUGS, LOCATIONS } from '@/content/locations';
import { SERVICES } from '@/content/services';
import { formatEuro } from '@/lib/utils';
import { getArticle } from '@/content/blog';
import { BUSINESS, SITE_URL } from '@/lib/seo/business';
import Reveal from '@/components/ui/Reveal';
import Spotlight from '@/components/ui/Spotlight';
import FaqAccordion from '@/components/ui/FaqAccordion';
import JsonLd from '@/components/seo/JsonLd';
import FaqSchema from '@/components/seo/FaqSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

export function generateStaticParams() {
  return LOCATION_SLUGS.flatMap((location) => [
    { locale: 'pt', location },
    { locale: 'en', location },
  ]);
}

export function generateMetadata({
  params: { locale, location },
}: {
  params: { locale: string; location: string };
}): Metadata {
  const loc = getLocation(location);
  if (!loc) return {};
  const copy = locale === 'pt' ? loc.pt : loc.en;
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: {
      canonical: `/${locale}/detailing/${location}`,
      languages: {
        'pt-PT': `/pt/detailing/${location}`,
        'en-GB': `/en/detailing/${location}`,
        'x-default': `/pt/detailing/${location}`,
      },
    },
    openGraph: {
      url: `${SITE_URL}/${locale}/detailing/${location}`,
      title: copy.metaTitle,
      description: copy.metaDescription,
    },
  };
}

export default function LocationPage({
  params: { locale, location },
}: {
  params: { locale: string; location: string };
}) {
  const loc = getLocation(location);
  if (!loc) notFound();

  const isPt = locale === 'pt';
  const copy = isPt ? loc.pt : loc.en;
  const article = getArticle(loc.relatedArticle);
  const otherAreas = LOCATIONS.filter((l) => l.slug !== location);
  const url = `${SITE_URL}/${locale}/detailing/${location}`;

  return (
    <>
      {/* Service offered in this specific area, tied to the LocalBusiness entity. */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: copy.h1,
          serviceType: isPt ? 'Detailing automóvel' : 'Car detailing',
          description: copy.metaDescription,
          url,
          provider: {
            '@type': 'AutoWash',
            '@id': `${SITE_URL}/#business`,
            name: BUSINESS.name,
          },
          areaServed: { '@type': 'City', name: copy.city },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price: 15,
            availability: 'https://schema.org/InStock',
            url: `${SITE_URL}/${locale}/booking`,
          },
        }}
      />
      <FaqSchema items={copy.faq} />
      <BreadcrumbSchema
        items={[
          { name: isPt ? 'Início' : 'Home', path: `/${locale}` },
          { name: isPt ? 'Serviços' : 'Services', path: `/${locale}/services` },
          { name: copy.city, path: `/${locale}/detailing/${location}` },
        ]}
      />

      {/* Hero */}
      <Spotlight className="bg-[#0A0A0A] pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Reveal>
            <nav className="mb-8 flex items-center gap-2 text-xs text-white/40">
              <Link href={`/${locale}/services`} className="hover:text-gold transition-colors">
                {isPt ? 'Serviços' : 'Services'}
              </Link>
              <span>/</span>
              <span className="text-white/70">{copy.city}</span>
            </nav>
            <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              {copy.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.05]">{copy.h1}</h1>
            <p className="mt-6 text-white/60 text-lg max-w-2xl leading-relaxed">{copy.tagline}</p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link
                href={`/${locale}/booking`}
                className="inline-flex items-center gap-2 rounded-lg bg-gold px-8 py-4 text-sm font-black tracking-wide text-black transition-all duration-200 hover:scale-[1.02] hover:bg-gold-light"
                style={{ boxShadow: '0 0 24px rgba(201,168,76,0.25)' }}
              >
                {isPt ? 'Reservar agora' : 'Book now'}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>
      </Spotlight>

      {/* Intro + proximity */}
      <section className="bg-white py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal className="space-y-6">
            {copy.intro.map((para, i) => (
              <p key={i} className={i === 0 ? 'text-xl text-black leading-relaxed' : 'text-surface-600 leading-relaxed'}>
                {para}
              </p>
            ))}
          </Reveal>
          <Reveal delay={80} className="mt-10">
            <div className="flex items-start gap-3 rounded-xl border border-surface-200 bg-surface-50 p-5">
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 border border-gold/25">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3 4.5 8.5 4.5 8.5S12.5 9 12.5 6c0-2.5-2-4.5-4.5-4.5Z" stroke="#A07B2A" strokeWidth="1.4" />
                  <circle cx="8" cy="6" r="1.6" stroke="#A07B2A" strokeWidth="1.4" />
                </svg>
              </span>
              <p className="text-surface-700 leading-relaxed">{copy.distance}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why choose us in this area */}
      <section className="bg-[#0A0A0A] py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Reveal className="mb-14 text-center">
            <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">
              {isPt ? 'Porquê a JetWash24' : 'Why JetWash24'}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {isPt ? `O seu detailing em ${copy.city}` : `Your detailing in ${copy.city}`}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {copy.reasons.map((reason, i) => (
              <Reveal key={i} delay={i * 90}>
                <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-gold/40">
                  <span className="text-5xl font-black text-white/10 transition-colors group-hover:text-gold/30">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">{reason.title}</h3>
                  <p className="mt-2 text-sm text-white/50 leading-relaxed">{reason.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services available in this area */}
      <section className="bg-white py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal className="mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-black">
              {isPt ? `Serviços disponíveis em ${copy.city}` : `Services available in ${copy.city}`}
            </h2>
            <p className="mt-4 text-surface-600">
              {isPt
                ? 'Todos os nossos serviços de detailing estão disponíveis para a sua zona.'
                : 'All of our detailing services are available for your area.'}
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((service, i) => {
              const s = isPt ? service.pt : service.en;
              return (
                <Reveal key={service.slug} delay={i * 60}>
                  <Link
                    href={`/${locale}/services/${service.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-surface-200 bg-white p-7 transition-colors duration-200 hover:border-black"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold">{s.eyebrow}</span>
                      <span className="text-sm text-surface-400">{isPt ? service.durationLabelPt : service.durationLabelEn}</span>
                    </div>
                    <h3 className="text-2xl font-black text-black group-hover:text-gold transition-colors">{s.name}</h3>
                    <p className="mt-3 text-surface-600 leading-relaxed flex-1">{s.tagline}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-surface-100 pt-5">
                      <p className="text-black">
                        <span className="text-xs text-surface-400">{isPt ? 'desde' : 'from'}</span>{' '}
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
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Local FAQ */}
      <section className="bg-surface-50 py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal className="mb-12 text-center">
            <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-black text-black">
              {isPt ? `Detailing em ${copy.city} — perguntas frequentes` : `Detailing in ${copy.city} — FAQ`}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <FaqAccordion items={copy.faq} />
          </Reveal>
        </div>
      </section>

      {/* Related article + other areas */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {article && (
            <div>
              <Reveal className="mb-6">
                <h2 className="text-2xl font-black text-black">{isPt ? 'Para ler' : 'Worth a read'}</h2>
              </Reveal>
              <Reveal delay={60}>
                <Link
                  href={`/${locale}/blog/${article.slug}`}
                  className="group flex gap-4 rounded-xl border border-surface-200 p-4 transition-colors hover:border-black"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image src={article.cover} alt={(isPt ? article.pt : article.en).title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="80px" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gold">{(isPt ? article.pt : article.en).category}</p>
                    <h3 className="mt-1 font-bold text-black leading-snug group-hover:text-gold transition-colors">{(isPt ? article.pt : article.en).title}</h3>
                  </div>
                </Link>
              </Reveal>
            </div>
          )}
          <div>
            <Reveal className="mb-6">
              <h2 className="text-2xl font-black text-black">{isPt ? 'Outras áreas' : 'Other areas'}</h2>
            </Reveal>
            <Reveal delay={60} className="flex flex-wrap gap-2">
              {otherAreas.map((other) => (
                <Link
                  key={other.slug}
                  href={`/${locale}/detailing/${other.slug}`}
                  className="rounded-full border border-surface-200 bg-surface-50 px-4 py-2 text-sm font-semibold text-surface-700 transition-colors hover:border-black hover:text-black"
                >
                  {isPt ? `Detailing em ${other.pt.city}` : `Detailing in ${other.en.city}`}
                </Link>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#0A0A0A] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {isPt ? `Pronto para tratar do seu carro em ${copy.city}?` : `Ready to sort your car in ${copy.city}?`}
            </h2>
            <p className="mt-4 text-white/50">
              {isPt ? 'Reserve online em menos de 2 minutos.' : 'Book online in under 2 minutes.'}
            </p>
            <Link
              href={`/${locale}/booking`}
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gold px-8 py-4 text-sm font-black tracking-wide text-black transition-all duration-200 hover:scale-[1.02] hover:bg-gold-light"
              style={{ boxShadow: '0 0 24px rgba(201,168,76,0.25)' }}
            >
              {isPt ? 'Reservar agora' : 'Book now'}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7H11.5M8 3.5L11.5 7L8 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

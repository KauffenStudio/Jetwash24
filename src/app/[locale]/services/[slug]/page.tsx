import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getService, SERVICE_SLUGS } from '@/content/services';
import { SORTED_ARTICLES } from '@/content/blog';
import { SITE_URL } from '@/lib/seo/business';
import Reveal from '@/components/ui/Reveal';
import Spotlight from '@/components/ui/Spotlight';
import FaqAccordion from '@/components/ui/FaqAccordion';
import ServiceSchema from '@/components/seo/ServiceSchema';
import FaqSchema from '@/components/seo/FaqSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

export function generateStaticParams() {
  return SERVICE_SLUGS.flatMap((slug) => [
    { locale: 'pt', slug },
    { locale: 'en', slug },
  ]);
}

export function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Metadata {
  const service = getService(slug);
  if (!service) return {};
  const copy = locale === 'pt' ? service.pt : service.en;
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: {
      canonical: `/${locale}/services/${slug}`,
      languages: {
        'pt-PT': `/pt/services/${slug}`,
        'en-GB': `/en/services/${slug}`,
        'x-default': `/pt/services/${slug}`,
      },
    },
    openGraph: {
      url: `${SITE_URL}/${locale}/services/${slug}`,
      title: copy.metaTitle,
      description: copy.metaDescription,
    },
  };
}

export default function ServicePage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const service = getService(slug);
  if (!service) notFound();

  const isPt = locale === 'pt';
  const copy = isPt ? service.pt : service.en;
  const related = SORTED_ARTICLES.filter((a) => a.relatedService === slug).slice(0, 2);

  return (
    <>
      <ServiceSchema service={service} locale={locale} />
      <FaqSchema items={copy.faq} />
      <BreadcrumbSchema
        items={[
          { name: isPt ? 'Início' : 'Home', path: `/${locale}` },
          { name: isPt ? 'Serviços' : 'Services', path: `/${locale}/services` },
          { name: copy.name, path: `/${locale}/services/${slug}` },
        ]}
      />

      {/* Hero */}
      <Spotlight className="bg-[#0A0A0A] pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Reveal>
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 text-xs text-white/40">
              <Link href={`/${locale}/services`} className="hover:text-gold transition-colors">
                {isPt ? 'Serviços' : 'Services'}
              </Link>
              <span>/</span>
              <span className="text-white/70">{copy.name}</span>
            </nav>
            <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              {copy.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.05]">{copy.name}</h1>
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
              <p className="text-white/70">
                <span className="text-xs text-white/40">{isPt ? 'desde' : 'from'}</span>{' '}
                <span className="text-3xl font-black text-white">{service.fromPrice}€</span>{' '}
                <span className="text-sm text-white/40">· {isPt ? service.durationLabelPt : service.durationLabelEn}</span>
              </p>
            </div>
          </Reveal>
        </div>
      </Spotlight>

      {/* Intro */}
      <section className="bg-white py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal className="space-y-6">
            {copy.intro.map((para, i) => (
              <p key={i} className={i === 0 ? 'text-xl text-black leading-relaxed' : 'text-surface-600 leading-relaxed'}>
                {para}
              </p>
            ))}
          </Reveal>

          {/* Ideal for chips */}
          <Reveal delay={80} className="mt-10 flex flex-wrap gap-2">
            {copy.idealFor.map((chip) => (
              <span key={chip} className="rounded-full border border-surface-200 bg-surface-50 px-4 py-1.5 text-sm text-surface-700">
                {chip}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#0A0A0A] py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Reveal className="mb-14 text-center">
            <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">
              {isPt ? 'O Processo' : 'The Process'}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {isPt ? 'Como trabalhamos' : 'How we work'}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {copy.process.map((step, i) => (
              <Reveal key={i} delay={i * 90}>
                <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-gold/40">
                  <span className="text-5xl font-black text-white/10 transition-colors group-hover:text-gold/30">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-white/50 leading-relaxed">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Includes */}
      <section className="bg-white py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Reveal className="mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-black">
              {isPt ? 'O que está incluído' : 'What’s included'}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
            {copy.includes.map((item, i) => (
              <Reveal key={i} delay={i * 50} as="div">
                <div className="flex items-start gap-3 border-b border-surface-100 pb-4">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 border border-gold/25">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L4.5 8.5L10 3" stroke="#A07B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-black">{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Service FAQ */}
      <section className="bg-surface-50 py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal className="mb-12 text-center">
            <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-black text-black">
              {isPt ? 'Perguntas frequentes' : 'Frequently asked'}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <FaqAccordion items={copy.faq} />
          </Reveal>
        </div>
      </section>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="bg-white py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Reveal className="mb-10">
              <h2 className="text-2xl font-black text-black">
                {isPt ? 'Para ler' : 'Worth a read'}
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((article, i) => {
                const a = isPt ? article.pt : article.en;
                return (
                  <Reveal key={article.slug} delay={i * 80}>
                    <Link
                      href={`/${locale}/blog/${article.slug}`}
                      className="group flex gap-4 rounded-xl border border-surface-200 p-4 transition-colors hover:border-black"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                        <Image src={article.cover} alt={a.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="80px" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gold">{a.category}</p>
                        <h3 className="mt-1 font-bold text-black leading-snug group-hover:text-gold transition-colors">{a.title}</h3>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <FinalCta locale={locale} />
    </>
  );
}

function FinalCta({ locale }: { locale: string }) {
  const isPt = locale === 'pt';
  return (
    <section className="bg-[#0A0A0A] py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {isPt ? 'Pronto para transformar o seu carro?' : 'Ready to transform your car?'}
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
  );
}

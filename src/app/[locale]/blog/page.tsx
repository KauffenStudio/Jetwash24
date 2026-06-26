import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SORTED_ARTICLES } from '@/content/blog';
import { SITE_URL } from '@/lib/seo/business';
import Reveal from '@/components/ui/Reveal';
import Spotlight from '@/components/ui/Spotlight';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const isPt = locale === 'pt';
  return {
    title: isPt ? 'Blog — Dicas de Detailing e Lavagem Auto' : 'Blog — Car Detailing & Wash Tips',
    description: isPt
      ? 'Dicas práticas de lavagem e detailing automóvel no Algarve: proteção de pintura, limpeza de interiores, restauro de faróis e mais.'
      : 'Practical car wash and detailing tips for the Algarve: paint protection, interior cleaning, headlight restoration and more.',
    alternates: {
      canonical: `/${locale}/blog`,
      languages: { 'pt-PT': '/pt/blog', 'en-GB': '/en/blog', 'x-default': '/pt/blog' },
    },
    openGraph: {
      url: `${SITE_URL}/${locale}/blog`,
      title: isPt ? 'Blog JetWash24' : 'JetWash24 Blog',
    },
  };
}

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === 'pt' ? 'pt-PT' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogIndexPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const isPt = locale === 'pt';
  const [featured, ...rest] = SORTED_ARTICLES;
  const fc = isPt ? featured.pt : featured.en;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: isPt ? 'Início' : 'Home', path: `/${locale}` },
          { name: 'Blog', path: `/${locale}/blog` },
        ]}
      />

      {/* Hero */}
      <Spotlight className="bg-[#0A0A0A] pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <Reveal>
            <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              {isPt ? 'Blog' : 'Blog'}
            </p>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">
              {isPt ? 'Dicas para o seu ' : 'Tips to keep your '}
              <span className="text-gold">{isPt ? 'carro impecável' : 'car spotless'}</span>
            </h1>
            <p className="mt-6 text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
              {isPt
                ? 'Conselhos práticos de detailing e manutenção, pensados para o clima e as estradas do Algarve.'
                : 'Practical detailing and maintenance advice, written for the Algarve’s climate and roads.'}
            </p>
          </Reveal>
        </div>
      </Spotlight>

      {/* Featured */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal>
            <Link
              href={`/${locale}/blog/${featured.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-3xl border border-surface-200 overflow-hidden hover:border-black transition-colors"
            >
              <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                <Image
                  src={featured.cover}
                  alt={fc.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col justify-center p-8 lg:pr-12">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold uppercase tracking-wider text-gold">{fc.category}</span>
                  <span className="text-surface-400">{formatDate(featured.date, locale)}</span>
                </div>
                <h2 className="mt-4 text-3xl font-black text-black leading-tight group-hover:text-gold transition-colors">
                  {fc.title}
                </h2>
                <p className="mt-4 text-surface-600 leading-relaxed">{fc.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-black group-hover:text-gold transition-colors">
                  {isPt ? 'Ler artigo' : 'Read article'}
                  <svg className="transition-transform group-hover:translate-x-1" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-white pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((article, i) => {
              const a = isPt ? article.pt : article.en;
              return (
                <Reveal key={article.slug} delay={i * 70}>
                  <Link href={`/${locale}/blog/${article.slug}`} className="group block">
                    <div className="relative aspect-[16/11] overflow-hidden rounded-2xl">
                      <Image
                        src={article.cover}
                        alt={a.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold backdrop-blur-sm">
                        {a.category}
                      </span>
                    </div>
                    <p className="mt-4 text-xs text-surface-400">
                      {formatDate(article.date, locale)} · {a.readingMinutes} min
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-black leading-snug group-hover:text-gold transition-colors">
                      {a.title}
                    </h3>
                    <p className="mt-2 text-sm text-surface-600 leading-relaxed line-clamp-2">{a.excerpt}</p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

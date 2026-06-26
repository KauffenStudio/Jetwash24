import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getArticle, ARTICLE_SLUGS, SORTED_ARTICLES, type Block } from '@/content/blog';
import { getService } from '@/content/services';
import { SITE_URL } from '@/lib/seo/business';
import Reveal from '@/components/ui/Reveal';
import ReadingProgress from '@/components/ui/ReadingProgress';
import ArticleSchema from '@/components/seo/ArticleSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

export function generateStaticParams() {
  return ARTICLE_SLUGS.flatMap((slug) => [
    { locale: 'pt', slug },
    { locale: 'en', slug },
  ]);
}

export function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Metadata {
  const article = getArticle(slug);
  if (!article) return {};
  const copy = locale === 'pt' ? article.pt : article.en;
  return {
    title: copy.title,
    description: copy.metaDescription,
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: {
        'pt-PT': `/pt/blog/${slug}`,
        'en-GB': `/en/blog/${slug}`,
        'x-default': `/pt/blog/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/${locale}/blog/${slug}`,
      title: copy.title,
      description: copy.metaDescription,
      images: [`${SITE_URL}${article.cover}`],
      publishedTime: article.date,
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

function BlockRenderer({ block }: { block: Block }) {
  if (block.type === 'h2') {
    return <h2 className="mt-12 mb-4 text-2xl sm:text-3xl font-black text-black">{block.text}</h2>;
  }
  if (block.type === 'ul') {
    return (
      <ul className="my-6 space-y-3">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-surface-700 leading-relaxed">
            <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
            {item}
          </li>
        ))}
      </ul>
    );
  }
  return <p className="my-5 text-lg leading-relaxed text-surface-700">{block.text}</p>;
}

export default function ArticlePage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const article = getArticle(slug);
  if (!article) notFound();

  const isPt = locale === 'pt';
  const copy = isPt ? article.pt : article.en;
  const service = getService(article.relatedService);
  const serviceCopy = service ? (isPt ? service.pt : service.en) : null;
  const more = SORTED_ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <>
      <ReadingProgress />
      <ArticleSchema article={article} locale={locale} />
      <BreadcrumbSchema
        items={[
          { name: isPt ? 'Início' : 'Home', path: `/${locale}` },
          { name: 'Blog', path: `/${locale}/blog` },
          { name: copy.title, path: `/${locale}/blog/${slug}` },
        ]}
      />

      {/* Header */}
      <header className="bg-[#0A0A0A] pt-32 pb-12 sm:pt-40">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <nav className="mb-8 flex items-center gap-2 text-xs text-white/40">
            <Link href={`/${locale}/blog`} className="hover:text-gold transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white/70">{copy.category}</span>
          </nav>
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">{copy.category}</p>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-[1.1]">{copy.title}</h1>
          <p className="mt-5 text-white/40 text-sm">
            {formatDate(article.date, locale)} · {copy.readingMinutes} min {isPt ? 'de leitura' : 'read'}
          </p>
        </div>
      </header>

      {/* Cover */}
      <div className="bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-2">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl -mb-16 sm:-mb-24 shadow-2xl">
            <Image src={article.cover} alt={copy.title} fill priority className="object-cover" sizes="(max-width: 896px) 100vw, 896px" />
          </div>
        </div>
      </div>

      {/* Body */}
      <article className="bg-white pt-28 sm:pt-36 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <Reveal>
            <p className="text-xl text-black leading-relaxed font-medium">{copy.excerpt}</p>
            <div className="mt-2">
              {copy.body.map((block, i) => (
                <BlockRenderer key={i} block={block} />
              ))}
            </div>
          </Reveal>

          {/* In-article CTA */}
          {service && serviceCopy && (
            <Reveal className="mt-14">
              <div className="rounded-2xl border border-surface-200 bg-surface-50 p-7 sm:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                  {isPt ? 'Serviço relacionado' : 'Related service'}
                </p>
                <h3 className="mt-2 text-2xl font-black text-black">{serviceCopy.name}</h3>
                <p className="mt-2 text-surface-600 leading-relaxed">{serviceCopy.tagline}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/${locale}/services/${service.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-black px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white"
                  >
                    {isPt ? 'Ver serviço' : 'View service'}
                  </Link>
                  <Link
                    href={`/${locale}/booking`}
                    className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-3 text-sm font-black text-black transition-colors hover:bg-gold-light"
                  >
                    {isPt ? 'Reservar' : 'Book'}
                  </Link>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </article>

      {/* More articles */}
      <section className="bg-surface-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal className="mb-10">
            <h2 className="text-2xl font-black text-black">{isPt ? 'Continue a ler' : 'Keep reading'}</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {more.map((a, i) => {
              const c = isPt ? a.pt : a.en;
              return (
                <Reveal key={a.slug} delay={i * 70}>
                  <Link href={`/${locale}/blog/${a.slug}`} className="group block">
                    <div className="relative aspect-[16/11] overflow-hidden rounded-xl">
                      <Image src={a.cover} alt={c.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" />
                    </div>
                    <h3 className="mt-3 font-bold text-black leading-snug group-hover:text-gold transition-colors">{c.title}</h3>
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

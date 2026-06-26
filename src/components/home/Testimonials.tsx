import { getLocale } from 'next-intl/server';
import { REVIEWS, HAS_REVIEWS } from '@/content/reviews';
import { BUSINESS } from '@/lib/seo/business';
import ReviewSchema from '@/components/seo/ReviewSchema';
import Reveal from '@/components/ui/Reveal';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 10 10" fill="none">
          <path
            d="M5 1L6.18 3.64L9 4.09L7 6.04L7.45 9L5 7.64L2.55 9L3 6.04L1 4.09L3.82 3.64L5 1Z"
            fill={i <= rating ? '#C9A84C' : '#E8E8E8'}
          />
        </svg>
      ))}
    </div>
  );
}

/**
 * Real customer testimonials. Renders nothing (and emits no schema) until
 * content/reviews.ts holds at least one genuine review — see that file.
 */
export default async function Testimonials() {
  if (!HAS_REVIEWS) return null;

  const locale = await getLocale();
  const isPt = locale === 'pt';

  return (
    <section className="bg-surface-50 py-24">
      <ReviewSchema locale={locale} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-14">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">
            {isPt ? 'Testemunhos' : 'Reviews'}
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-black">
            {isPt ? 'O que dizem os clientes' : 'What our customers say'}
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <Reveal key={i} delay={i * 70}>
              <figure className="h-full rounded-2xl border border-surface-200 bg-white p-7">
                <Stars rating={review.rating} />
                <blockquote className="mt-4 text-surface-700 leading-relaxed">
                  “{isPt ? review.textPt : review.textEn}”
                </blockquote>
                <figcaption className="mt-5 text-sm font-bold text-black">{review.author}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-center">
          <a
            href={BUSINESS.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-surface-500 hover:text-gold transition-colors"
          >
            {isPt ? 'Ver todas as avaliações no Google →' : 'See all reviews on Google →'}
          </a>
        </p>
      </div>
    </section>
  );
}

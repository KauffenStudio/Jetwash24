/**
 * Customer reviews — REAL ONLY.
 *
 * ⚠️ Google's review snippet policy requires that any aggregateRating / Review
 * markup reflects genuine reviews that are ALSO visible on the page. Inventing
 * ratings risks a manual action that can remove the site from results.
 *
 * HOW TO POPULATE: copy real reviews from your Google Business Profile into the
 * array below (author = reviewer's name, rating 1–5, text = their words, date =
 * ISO). The Testimonials section and the Review/aggregateRating JSON-LD both
 * read from here and only render once there is at least one real review.
 *
 * Leave the array empty until you have real reviews — the section and schema
 * stay hidden automatically, which is the safe default.
 */

export type Review = {
  author: string;
  /** 1–5 */
  rating: number;
  /** ISO date, e.g. '2026-06-01' */
  date: string;
  textPt: string;
  textEn: string;
};

export const REVIEWS: Review[] = [
  // Real reviews from the JetWash24 Google Business Profile (verbatim PT,
  // faithful EN translation). Add new genuine reviews here as they come in.
  {
    author: 'Dante Iacona',
    rating: 5,
    date: '2026-04-26',
    textPt:
      'Serviço impecável! Levei o meu carro bem sujo e ele saiu parecendo novo em folha. Os funcionários foram muito simpáticos e atenciosos o tempo todo, explicando cada etapa do processo. As instalações são muito bem conservadas e o preço é mais do que justo pelos resultados. Utilizam produtos de qualidade e preocupam-se com os clientes. Com certeza voltarei.',
    textEn:
      'Impeccable service! I took my very dirty car in and it came out looking brand new. The staff were friendly and attentive the whole time, explaining every step of the process. The facilities are very well kept and the price is more than fair for the results. They use quality products and care about their customers. I’ll definitely be back.',
  },
  {
    author: 'Maria Inês Mestre',
    rating: 5,
    date: '2026-04-20',
    textPt:
      'Ótimas condições. Deixa o nosso carro perfeito, sem manchas. Recomendo muito, a residentes e visitantes do Algarve.',
    textEn:
      'Great conditions. They leave our car perfect, with no marks. Highly recommend, to both residents and visitors of the Algarve.',
  },
];

export const HAS_REVIEWS = REVIEWS.length > 0;

export function reviewAggregate() {
  if (!HAS_REVIEWS) return null;
  const total = REVIEWS.reduce((sum, r) => sum + r.rating, 0);
  return {
    ratingValue: Math.round((total / REVIEWS.length) * 10) / 10,
    reviewCount: REVIEWS.length,
  };
}

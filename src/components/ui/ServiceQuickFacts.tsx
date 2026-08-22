import { BUSINESS } from '@/lib/seo/business';
import { VEHICLE_ADJUSTMENTS, formatEuro } from '@/lib/utils';
import type { ServiceContent } from '@/content/services';

/**
 * An up-front, self-contained summary of one service.
 *
 * Generative engines (AI Overviews, ChatGPT, Perplexity) cite passages they
 * can lift whole, without the surrounding page for context. This block is
 * built for exactly that: a one-sentence answer that names the service, the
 * price, the duration and the town, followed by a definition list of the
 * facts a customer actually asks for. `<dl>` is used deliberately — term/
 * definition pairs survive extraction far better than prose.
 *
 * Every value is derived from the service content or BUSINESS, so it cannot
 * drift away from what the rest of the page says.
 */
export default function ServiceQuickFacts({
  service,
  locale,
}: {
  service: ServiceContent;
  locale: string;
}) {
  const isPt = locale === 'pt';
  const copy = isPt ? service.pt : service.en;
  const duration = isPt ? service.durationLabelPt : service.durationLabelEn;
  const price = `${formatEuro(service.fromPrice)}€`;

  const surcharge = [
    `+${VEHICLE_ADJUSTMENTS.MEDIUM}€ ${isPt ? 'médio' : 'medium'}`,
    `+${VEHICLE_ADJUSTMENTS.SUV}€ SUV`,
    `+${VEHICLE_ADJUSTMENTS.LARGE}€ ${isPt ? 'grande' : 'large'}`,
    `+${VEHICLE_ADJUSTMENTS.SUPERCAR}€ ${isPt ? 'supercarro' : 'supercar'}`,
  ].join(' · ');

  const summary = isPt
    ? `Em resumo: o serviço de ${copy.name} da JetWash24, em ${BUSINESS.address.addressLocality}, Albufeira, custa desde ${price} para um carro citadino e demora ${duration}. ${copy.tagline}`
    : `In short: the ${copy.name} service at JetWash24 in ${BUSINESS.address.addressLocality}, Albufeira costs from ${price} for a city car and takes ${duration}. ${copy.tagline}`;

  const facts: { term: string; value: string }[] = [
    {
      term: isPt ? 'Preço' : 'Price',
      value: isPt
        ? `Desde ${price} (carro citadino)`
        : `From ${price} (city car)`,
    },
    { term: isPt ? 'Duração' : 'Duration', value: duration },
    {
      term: isPt ? 'Acréscimo por tamanho' : 'Size surcharge',
      value: surcharge,
    },
    {
      term: isPt ? 'Onde' : 'Where',
      value: `${BUSINESS.address.streetAddress}, ${BUSINESS.address.addressLocality}, ${BUSINESS.address.postalCode} Albufeira — ${
        isPt ? '3 minutos a pé do Algarve Shopping' : 'a 3-minute walk from Algarve Shopping'
      }`,
    },
    {
      term: isPt ? 'Horário' : 'Opening hours',
      value: isPt
        ? `Todos os dias, ${BUSINESS.openingHours.opens} às ${BUSINESS.openingHours.closes}`
        : `Every day, ${BUSINESS.openingHours.opens} to ${BUSINESS.openingHours.closes}`,
    },
    {
      term: isPt ? 'Reserva' : 'Booking',
      value: isPt
        ? 'Online em menos de 2 minutos, com sinal de 5€ descontado no valor final'
        : 'Online in under 2 minutes, with a €5 deposit deducted from the final price',
    },
  ];

  return (
    <section
      aria-label={isPt ? 'Resumo do serviço' : 'Service summary'}
      className="bg-surface-50 border-y border-surface-200 py-12 sm:py-14"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
          {isPt ? 'Em resumo' : 'At a glance'}
        </p>
        <p className="text-lg text-black leading-relaxed">{summary}</p>

        <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
          {facts.map((fact) => (
            <div key={fact.term} className="border-t border-surface-200 pt-4">
              <dt className="text-xs font-bold tracking-[0.15em] uppercase text-surface-400">
                {fact.term}
              </dt>
              <dd className="mt-1.5 text-black leading-relaxed">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

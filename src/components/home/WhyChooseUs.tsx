import { getLocale } from 'next-intl/server';
import Reveal from '@/components/ui/Reveal';

/**
 * "Why choose us" — the reasons a customer picks JetWash24 over a tunnel wash.
 *
 * Every claim here must stay backed by what we actually do (see content/faq.ts
 * and content/services.ts). No certifications or figures we cannot show.
 */

type Reason = {
  icon: 'health' | 'products' | 'paint' | 'craft' | 'price' | 'time';
  pt: { title: string; body: string };
  en: { title: string; body: string };
};

const REASONS: Reason[] = [
  {
    icon: 'health',
    pt: {
      title: 'Um interior saudável, não só limpo',
      body: 'Passa horas dentro do carro. Fazemos higienização profunda de bancos, tapetes e plásticos, eliminamos odores e tratamos o ar — para que o habitáculo deixe de acumular pó e humidade.',
    },
    en: {
      title: 'A healthy interior, not just a clean one',
      body: 'You spend hours inside your car. We deep-sanitise seats, mats and plastics, remove odours and treat the air — so the cabin stops holding dust and damp.',
    },
  },
  {
    icon: 'products',
    pt: {
      title: 'Produtos com pH equilibrado',
      body: 'Usamos apenas produtos profissionais de pH equilibrado, seguros para pintura, plásticos, couro e vidros — e sem resíduos agressivos nas superfícies que toca todos os dias.',
    },
    en: {
      title: 'pH-balanced products only',
      body: 'We use professional, pH-balanced products that are safe on paint, plastics, leather and glass — and leave no harsh residue on the surfaces you touch every day.',
    },
  },
  {
    icon: 'paint',
    pt: {
      title: 'Sem riscos na pintura',
      body: 'Nada de escovas de túnel. Lavagem manual com método dos dois baldes e microfibras limpas, a técnica que evita os microriscos que fazem a pintura perder brilho.',
    },
    en: {
      title: 'No swirl marks, ever',
      body: 'No tunnel brushes. Hand wash using the two-bucket method and clean microfibre towels — the technique that avoids the micro-scratches that dull your paint.',
    },
  },
  {
    icon: 'craft',
    pt: {
      title: 'Profissionalismo a sério',
      body: 'Detailing, não lavagem à pressa. Cada serviço segue um processo definido, passo a passo, com equipamento profissional e o mesmo padrão em cada carro que entra.',
    },
    en: {
      title: 'Genuine professionalism',
      body: 'Detailing, not a rushed wash. Every service follows a defined step-by-step process, with professional equipment and the same standard on every car that comes in.',
    },
  },
  {
    icon: 'price',
    pt: {
      title: 'Preços transparentes',
      body: 'Vê o preço e a duração antes de reservar, incluindo o acréscimo pelo tamanho do veículo. Sem surpresas no fim — paga no local em dinheiro, cartão ou MB Way.',
    },
    en: {
      title: 'Transparent pricing',
      body: 'You see the price and duration before you book, vehicle-size surcharge included. No surprises at the end — pay on-site by cash, card or MB Way.',
    },
  },
  {
    icon: 'time',
    pt: {
      title: 'O seu tempo conta',
      body: 'Reserva online em menos de 2 minutos, com hora garantida. Estamos na N125, a 3 minutos a pé do Algarve Shopping, e pode esperar pelo carro num espaço confortável.',
    },
    en: {
      title: 'Your time matters',
      body: 'Book online in under 2 minutes with a guaranteed slot. We are on the N125, a 3-minute walk from Algarve Shopping, and you can wait in a comfortable space.',
    },
  },
];

const FACTS = [
  { pt: '7 dias por semana', en: 'Open 7 days a week' },
  { pt: '09h – 17h', en: '09:00 – 17:00' },
  { pt: 'Guia · Albufeira · Vilamoura', en: 'Guia · Albufeira · Vilamoura' },
  { pt: 'Reserva online em 2 min', en: 'Book online in 2 min' },
];

export default async function WhyChooseUs() {
  const locale = await getLocale();
  const isPt = locale === 'pt';

  return (
    <section id="why-us" className="py-24 bg-surface-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-14">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">
            {isPt ? 'Porquê a JetWash24' : 'Why JetWash24'}
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-black">
            {isPt ? 'Porque nos escolhem' : 'Why customers choose us'}
          </h2>
          <p className="mt-4 text-surface-500 max-w-2xl mx-auto leading-relaxed">
            {isPt
              ? 'Um carro limpo é o mínimo. O que nos distingue é como lá chegamos — e o que isso significa para a sua saúde, para a pintura e para o seu tempo.'
              : 'A clean car is the baseline. What sets us apart is how we get there — and what that means for your health, your paintwork and your time.'}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((reason, i) => {
            const copy = isPt ? reason.pt : reason.en;
            return (
              <Reveal key={reason.icon} delay={i * 70}>
                <article className="group h-full rounded-2xl border border-surface-200 bg-white p-7 hover:border-black hover:shadow-md transition-all duration-200">
                  <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center mb-5">
                    <ReasonIcon name={reason.icon} />
                  </div>
                  <h3 className="text-lg font-bold text-black group-hover:text-gold transition-colors">
                    {copy.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-surface-500 leading-relaxed">{copy.body}</p>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Quick facts strip */}
        <Reveal delay={140}>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-surface-200 bg-white px-6 py-5">
            {FACTS.map((fact) => (
              <li key={fact.en} className="flex items-center gap-2 text-sm font-semibold text-surface-600">
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M2 6L4.5 8.5L10 3"
                    stroke="#C9A84C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {isPt ? fact.pt : fact.en}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ReasonIcon({ name }: { name: Reason['icon'] }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: '#C9A84C',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (name) {
    case 'health': // shield with heartbeat — healthy cabin
      return (
        <svg {...common}>
          <path d="M12 3l7 3v5.5c0 4.2-2.9 7.9-7 9.5-4.1-1.6-7-5.3-7-9.5V6l7-3z" />
          <path d="M8.2 11.8h2l1.2-2.4 1.6 4 1.1-1.6h1.7" />
        </svg>
      );
    case 'products': // droplet — pH-balanced products
      return (
        <svg {...common}>
          <path d="M12 3.2s5.2 5 5.2 8.6a5.2 5.2 0 11-10.4 0C6.8 8.2 12 3.2 12 3.2z" />
          <path d="M9.6 13.4a2.6 2.6 0 002.6 2.6" />
        </svg>
      );
    case 'paint': // sparkle — flawless paint
      return (
        <svg {...common}>
          <path d="M12 3l1.9 4.9L19 9.8l-5.1 1.9L12 16.6l-1.9-4.9L5 9.8l5.1-1.9L12 3z" />
          <path d="M18 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" />
        </svg>
      );
    case 'craft': // badge — professional standard
      return (
        <svg {...common}>
          <circle cx="12" cy="9.5" r="5.2" />
          <path d="M9 13.8L8 21l4-2 4 2-1-7.2" />
        </svg>
      );
    case 'price': // tag — transparent pricing
      return (
        <svg {...common}>
          <path d="M4 11.6V4.8A.8.8 0 014.8 4h6.8a.8.8 0 01.57.24l7.1 7.1a.8.8 0 010 1.13l-6.8 6.8a.8.8 0 01-1.13 0l-7.1-7.1A.8.8 0 014 11.6z" />
          <circle cx="8.3" cy="8.3" r="1.2" />
        </svg>
      );
    case 'time': // clock — your time matters
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.3V12l3 1.8" />
        </svg>
      );
  }
}

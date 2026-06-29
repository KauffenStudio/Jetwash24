/**
 * Geographic landing pages — one indexable page per service area.
 *
 * The single-page home can rank for "car detailing Algarve" but not for the
 * high-intent local searches that actually convert: "lavagem automóvel
 * Albufeira", "car detailing Vilamoura", "detailing Faro". Each entry below
 * is the single source for one /<locale>/detailing/<slug> page, its copy,
 * its Service JSON-LD (areaServed) and its metadata.
 *
 * Slugs are place names — identical across locales — so the URL is stable
 * and keyword-bearing in both languages (/pt/detailing/albufeira,
 * /en/detailing/albufeira).
 *
 * IMPORTANT: only list areas the business genuinely serves. Keep the set in
 * sync with BUSINESS.areaServed in lib/seo/business.ts for NAP/schema
 * consistency.
 */

import type { FaqItem } from './faq';

export type LocationContent = {
  slug: string;
  /** Slug of the most relevant blog article, for the in-page read-more link. */
  relatedArticle: string;
  pt: LocationCopy;
  en: LocationCopy;
};

type LocationCopy = {
  /** Display name of the city/area, e.g. "Albufeira". */
  city: string;
  metaTitle: string;
  metaDescription: string;
  /** Eyebrow above the H1, e.g. "Car Detailing · Albufeira". */
  eyebrow: string;
  h1: string;
  tagline: string;
  /** One-line proximity / how-to-get-here note. */
  distance: string;
  /** 2–3 paragraph intro, written for this specific area. */
  intro: string[];
  /** Why choose JetWash24 for this area. */
  reasons: { title: string; body: string }[];
  /** Local, area-specific FAQ (rendered on-page + as FAQPage schema). */
  faq: FaqItem[];
};

export const LOCATIONS: LocationContent[] = [
  {
    slug: 'albufeira',
    relatedArticle: 'tirar-areia-praia-interior',
    pt: {
      city: 'Albufeira',
      metaTitle: 'Car Detailing em Albufeira — Lavagem e Detalhe Automóvel',
      metaDescription:
        'Detailing profissional de interiores e exteriores para Albufeira, a poucos minutos do centro. Tira a areia da praia, o sal e o pó. Reserve online na JetWash24.',
      eyebrow: 'Car Detailing · Albufeira',
      h1: 'Car Detailing em Albufeira',
      tagline:
        'O seu carro tratado ao detalhe, a poucos minutos do centro de Albufeira.',
      distance:
        'Estamos em Guia, a cerca de 8 minutos do centro de Albufeira pela N125 — junto ao AlgarveShopping.',
      intro: [
        'Albufeira vive de praia, sol e estrada — e isso nota-se no carro. A areia entra para o interior, o sal do mar agride a pintura e o pó das obras e das estradas acumula-se mais depressa do que em qualquer outra zona do Algarve. Uma lavagem de rotina não chega para tirar tudo isto.',
        'A JetWash24 faz detailing profissional para toda a zona de Albufeira a partir das nossas instalações em Guia, a poucos minutos do centro. Interior, exterior, restauro de faróis ou o pacote completo — devolvemos ao seu carro o aspeto e o cheiro de novo, com reserva online em menos de 2 minutos.',
      ],
      reasons: [
        {
          title: 'Especialistas em pós-praia',
          body: 'Areia entranhada nos tapetes e bancos, sal na pintura, protetor solar nos estofos — é o que mais tratamos. Extração profunda que uma lavagem normal não faz.',
        },
        {
          title: 'A minutos do centro',
          body: 'Em Guia, junto ao AlgarveShopping. Deixa o carro, faz as suas compras ou vai à praia, e levanta-o pronto.',
        },
        {
          title: 'Ideal para carros de aluguer e revenda',
          body: 'Vai entregar um rental ou vender o carro? Deixamo-lo impecável para evitar custos de limpeza e valorizar a venda.',
        },
      ],
      faq: [
        {
          q: 'Servem a zona de Albufeira?',
          a: 'Sim. Estamos em Guia, a cerca de 8 minutos do centro de Albufeira pela N125, e recebemos clientes de toda a zona — Olhos de Água, Areias de São João, Ferreiras e Sesmarias incluídas.',
        },
        {
          q: 'Conseguem tirar a areia da praia toda do interior?',
          a: 'Sim. Usamos aspiração profunda e extração que remove a areia entranhada nos tapetes, debaixo dos bancos e nas calhas — onde a aspiração de rotina não chega.',
        },
        {
          q: 'Preciso de marcar com antecedência?',
          a: 'No verão a agenda enche rápido, por isso recomendamos reservar online com pelo menos um ou dois dias de antecedência. Reserva em menos de 2 minutos.',
        },
      ],
    },
    en: {
      city: 'Albufeira',
      metaTitle: 'Car Detailing in Albufeira — Professional Wash & Detail',
      metaDescription:
        'Professional interior & exterior car detailing for Albufeira, minutes from the centre. We remove beach sand, salt and dust. Book online with JetWash24.',
      eyebrow: 'Car Detailing · Albufeira',
      h1: 'Car Detailing in Albufeira',
      tagline:
        'Your car detailed to perfection, minutes from the centre of Albufeira.',
      distance:
        'We’re in Guia, about 8 minutes from Albufeira centre on the N125 — right by AlgarveShopping.',
      intro: [
        'Albufeira runs on beach, sun and the open road — and your car shows it. Sand works its way into the interior, sea salt attacks the paint, and road and construction dust builds up faster here than almost anywhere in the Algarve. A routine wash simply won’t lift all of it.',
        'JetWash24 provides professional detailing for the whole Albufeira area from our base in Guia, just minutes from the centre. Interior, exterior, headlight restoration or the complete package — we bring back that fresh, new-car look and smell, with online booking in under 2 minutes.',
      ],
      reasons: [
        {
          title: 'After-the-beach specialists',
          body: 'Sand ground into mats and seats, salt on the paint, suncream on the upholstery — it’s what we treat most. Deep extraction a normal wash can’t do.',
        },
        {
          title: 'Minutes from the centre',
          body: 'In Guia, right by AlgarveShopping. Drop the car, hit the shops or the beach, and pick it up ready to go.',
        },
        {
          title: 'Great for rentals and resale',
          body: 'Returning a rental or selling your car? We leave it spotless to avoid cleaning fees and boost the sale value.',
        },
      ],
      faq: [
        {
          q: 'Do you cover the Albufeira area?',
          a: 'Yes. We’re in Guia, about 8 minutes from Albufeira centre on the N125, and welcome customers from across the area — including Olhos de Água, Areias de São João, Ferreiras and Sesmarias.',
        },
        {
          q: 'Can you get all the beach sand out of the interior?',
          a: 'Yes. We use deep vacuuming and extraction that lifts sand ground into the mats, under the seats and in the rails — where a routine vacuum can’t reach.',
        },
        {
          q: 'Do I need to book in advance?',
          a: 'In summer the diary fills up fast, so we recommend booking online at least a day or two ahead. Booking takes under 2 minutes.',
        },
      ],
    },
  },
  {
    slug: 'guia',
    relatedArticle: 'frequencia-lavar-carro-algarve',
    pt: {
      city: 'Guia',
      metaTitle: 'Car Detailing em Guia — Junto ao AlgarveShopping',
      metaDescription:
        'Lavagem e detailing automóvel em Guia, a 3 minutos do AlgarveShopping. Interior, exterior e restauro de faróis. Reserve online na JetWash24.',
      eyebrow: 'Car Detailing · Guia',
      h1: 'Car Detailing em Guia',
      tagline: 'O detailing da sua zona — em Guia, a 3 minutos do AlgarveShopping.',
      distance:
        'Estamos na N125 em Guia, a 3 minutos do AlgarveShopping. Fácil de chegar e com estacionamento.',
      intro: [
        'A JetWash24 é o seu centro de detailing aqui em Guia. Trabalhamos a partir da N125, a três minutos do AlgarveShopping, o que torna fácil deixar o carro connosco enquanto faz as compras, vai ao cinema ou trata de recados.',
        'Seja morador de Guia, das Ferreiras ou de Albufeira, fazemos limpeza profissional de interiores e exteriores, restauro de faróis e correção de pintura — o tipo de trabalho que devolve ao carro o aspeto de novo e que uma lavagem de rotina nunca faz. Reserve online e escolha a hora que lhe dá jeito.',
      ],
      reasons: [
        {
          title: 'No coração de Guia',
          body: 'Na N125, a 3 minutos do AlgarveShopping. Combine a visita com as suas compras e levante o carro pronto.',
        },
        {
          title: 'O detailer de confiança da zona',
          body: 'Moradores de Guia, Ferreiras e Albufeira confiam-nos os carros — interior, exterior e correção de pintura feitos por profissionais.',
        },
        {
          title: 'Reserva online sem telefonemas',
          body: 'Escolha serviço, dia e hora em menos de 2 minutos. Recebe confirmação e tratamos do resto.',
        },
      ],
      faq: [
        {
          q: 'Onde fica exatamente a JetWash24?',
          a: 'Na N125 610, 8800-076 Guia, a cerca de 3 minutos do AlgarveShopping. Tem o mapa e o trajeto na nossa página principal.',
        },
        {
          q: 'Posso deixar o carro enquanto vou ao AlgarveShopping?',
          a: 'Sim, é o que muitos clientes fazem. Deixa o carro à hora marcada, vai às compras e levanta-o já tratado. Combine a duração do serviço connosco.',
        },
        {
          q: 'Quanto tempo demora um serviço?',
          a: 'Depende do serviço: desde 30–40 minutos numa lavagem expresso até cerca de 3 horas no pacote completo. Indicamos sempre a duração ao reservar.',
        },
      ],
    },
    en: {
      city: 'Guia',
      metaTitle: 'Car Detailing in Guia — Right by AlgarveShopping',
      metaDescription:
        'Car wash & detailing in Guia, 3 minutes from AlgarveShopping. Interior, exterior and headlight restoration. Book online with JetWash24.',
      eyebrow: 'Car Detailing · Guia',
      h1: 'Car Detailing in Guia',
      tagline: 'Your local detailer — in Guia, 3 minutes from AlgarveShopping.',
      distance:
        'We’re on the N125 in Guia, 3 minutes from AlgarveShopping. Easy to reach, with parking.',
      intro: [
        'JetWash24 is your detailing centre right here in Guia. We work from the N125, three minutes from AlgarveShopping, which makes it easy to drop your car with us while you shop, catch a film or run errands.',
        'Whether you live in Guia, Ferreiras or Albufeira, we provide professional interior and exterior cleaning, headlight restoration and paint correction — the kind of work that brings a car back to new and that a routine wash never does. Book online and pick a time that suits you.',
      ],
      reasons: [
        {
          title: 'In the heart of Guia',
          body: 'On the N125, 3 minutes from AlgarveShopping. Pair your visit with your shopping and pick the car up ready.',
        },
        {
          title: 'The area’s trusted detailer',
          body: 'Locals from Guia, Ferreiras and Albufeira trust us with their cars — interior, exterior and paint correction done by professionals.',
        },
        {
          title: 'Online booking, no phone calls',
          body: 'Choose your service, day and time in under 2 minutes. You get a confirmation and we handle the rest.',
        },
      ],
      faq: [
        {
          q: 'Where exactly is JetWash24?',
          a: 'At N125 610, 8800-076 Guia, about 3 minutes from AlgarveShopping. You’ll find the map and directions on our home page.',
        },
        {
          q: 'Can I leave the car while I go to AlgarveShopping?',
          a: 'Yes, many customers do exactly that. Drop the car at your booked time, go shopping and pick it up detailed. Just check the service duration with us.',
        },
        {
          q: 'How long does a service take?',
          a: 'It depends on the service: from 30–40 minutes for an express wash up to around 3 hours for the complete package. We always show the duration when you book.',
        },
      ],
    },
  },
  {
    slug: 'vilamoura',
    relatedArticle: 'proteger-pintura-verao',
    pt: {
      city: 'Vilamoura',
      metaTitle: 'Car Detailing em Vilamoura — Detalhe Automóvel Premium',
      metaDescription:
        'Detailing premium para Vilamoura: correção de pintura, restauro de faróis e proteção. Cuidado ao detalhe para o seu carro. Reserve online na JetWash24.',
      eyebrow: 'Car Detailing · Vilamoura',
      h1: 'Car Detailing em Vilamoura',
      tagline: 'Cuidado premium ao detalhe — para o seu carro em Vilamoura.',
      distance:
        'Estamos em Guia, a cerca de 12 minutos de Vilamoura pela N125 / A22. Fácil de combinar com a marina ou o golfe.',
      intro: [
        'Vilamoura é sinónimo de marina, golfe e carros que merecem ser cuidados ao detalhe. O sol intenso, o salitre vindo do mar e o pó fino das estradas tiram o brilho à pintura e amarelecem os faróis mais depressa do que se imagina — e num carro premium isso nota-se logo.',
        'A JetWash24 oferece detailing de nível premium para a zona de Vilamoura a partir de Guia, a poucos minutos pela N125. Correção de pintura, restauro de faróis, restauração de interiores em couro e proteção — o trabalho minucioso que mantém o seu carro a parecer (e a valer) o que deve. Reserve online a hora que lhe der jeito.',
      ],
      reasons: [
        {
          title: 'Acabamento premium',
          body: 'Correção de pintura, hidratação de couro e proteção UV — o nível de detalhe que um carro de gama alta exige.',
        },
        {
          title: 'A minutos da marina',
          body: 'Em Guia, a cerca de 12 minutos de Vilamoura. Deixe o carro connosco enquanto aproveita a marina ou o golfe.',
        },
        {
          title: 'Protege o valor do carro',
          body: 'Pintura corrigida e protegida e interior tratado preservam o aspeto e o valor de revenda do seu carro.',
        },
      ],
      faq: [
        {
          q: 'Fazem correção de pintura para carros premium?',
          a: 'Sim. Removemos riscos finos, marcas de lavagem e perda de brilho com polimento por etapas, e podemos aplicar proteção para manter o resultado. Avaliamos sempre a pintura antes.',
        },
        {
          q: 'Servem a zona de Vilamoura?',
          a: 'Sim. Estamos em Guia, a cerca de 12 minutos de Vilamoura pela N125 / A22, e recebemos clientes de Vilamoura, Quarteira e Falésia.',
        },
        {
          q: 'Tratam interiores em couro?',
          a: 'Sim. Limpamos, higienizamos e hidratamos o couro para evitar que seque e estale com o calor do Algarve, devolvendo-lhe o toque e a cor.',
        },
      ],
    },
    en: {
      city: 'Vilamoura',
      metaTitle: 'Car Detailing in Vilamoura — Premium Auto Detailing',
      metaDescription:
        'Premium detailing for Vilamoura: paint correction, headlight restoration and protection. Meticulous care for your car. Book online with JetWash24.',
      eyebrow: 'Car Detailing · Vilamoura',
      h1: 'Car Detailing in Vilamoura',
      tagline: 'Premium, detail-obsessed care — for your car in Vilamoura.',
      distance:
        'We’re in Guia, about 12 minutes from Vilamoura via the N125 / A22 — easy to pair with the marina or a round of golf.',
      intro: [
        'Vilamoura means marina, golf and cars that deserve proper care. Strong sun, sea salt and fine road dust dull the paint and yellow the headlights faster than you’d think — and on a premium car it shows immediately.',
        'JetWash24 offers premium-level detailing for the Vilamoura area from our base in Guia, just minutes away on the N125. Paint correction, headlight restoration, leather interior restoration and protection — the meticulous work that keeps your car looking (and worth) what it should. Book online at a time that suits you.',
      ],
      reasons: [
        {
          title: 'Premium finish',
          body: 'Paint correction, leather conditioning and UV protection — the level of detail a high-end car deserves.',
        },
        {
          title: 'Minutes from the marina',
          body: 'In Guia, about 12 minutes from Vilamoura. Leave the car with us while you enjoy the marina or the golf.',
        },
        {
          title: 'Protects your car’s value',
          body: 'Corrected, protected paint and a cared-for interior preserve your car’s looks and resale value.',
        },
      ],
      faq: [
        {
          q: 'Do you do paint correction for premium cars?',
          a: 'Yes. We remove light scratches, wash marks and dullness with multi-stage polishing, and can apply protection to lock in the result. We always assess the paint first.',
        },
        {
          q: 'Do you cover the Vilamoura area?',
          a: 'Yes. We’re in Guia, about 12 minutes from Vilamoura via the N125 / A22, and welcome customers from Vilamoura, Quarteira and Falésia.',
        },
        {
          q: 'Do you treat leather interiors?',
          a: 'Yes. We clean, sanitise and condition leather to stop it drying and cracking in the Algarve heat, restoring its feel and colour.',
        },
      ],
    },
  },
  {
    slug: 'faro',
    relatedArticle: 'farois-amarelados-causas-solucao',
    pt: {
      city: 'Faro',
      metaTitle: 'Car Detailing perto de Faro — Lavagem e Detalhe Automóvel',
      metaDescription:
        'Detailing automóvel para a zona de Faro: interior, exterior e restauro de faróis. Ideal antes de devolver um carro de aluguer no aeroporto. Reserve online.',
      eyebrow: 'Car Detailing · Faro',
      h1: 'Car Detailing perto de Faro',
      tagline:
        'Detailing profissional ao alcance de Faro — interior, exterior e faróis como novos.',
      distance:
        'Estamos em Guia, a cerca de 30 minutos de Faro pela A22. Perto do aeroporto para quem devolve um carro de aluguer.',
      intro: [
        'Faro é a porta de entrada do Algarve — aeroporto, trânsito diário e estradas movimentadas que deixam marca no carro. Quem vive ou trabalha na zona sabe que o pó, os insetos e o sol vão desgastando a pintura e o interior ao longo do ano.',
        'A JetWash24 faz detailing profissional ao alcance de Faro, a partir de Guia (cerca de 30 minutos pela A22). Limpeza de interiores, lavagem exterior detalhada e restauro de faróis amarelados — incluindo aquele detalhe que faz diferença antes de devolver um carro de aluguer no aeroporto ou de o pôr à venda. Reserve online em poucos minutos.',
      ],
      reasons: [
        {
          title: 'Perto do aeroporto',
          body: 'A devolver um rental ou a entregar um carro? Deixamo-lo impecável por dentro e por fora para evitar taxas de limpeza.',
        },
        {
          title: 'Restauro de faróis',
          body: 'Faróis amarelados pelo sol do Algarve voltam a ficar transparentes — melhora o aspeto e a segurança na condução noturna.',
        },
        {
          title: 'Para o dia a dia de quem comuta',
          body: 'Carros usados todos os dias entre Faro e o resto do Algarve acumulam pó e insetos. Devolvemos-lhe o aspeto de novo.',
        },
      ],
      faq: [
        {
          q: 'Servem a zona de Faro?',
          a: 'Sim. Estamos em Guia, a cerca de 30 minutos de Faro pela A22, e recebemos clientes da zona de Faro, Loulé e Almancil que procuram um detailing profissional.',
        },
        {
          q: 'Vale a pena detalhar o carro antes de o devolver no aeroporto?',
          a: 'Sim. Muitas empresas de aluguer cobram taxas de limpeza se o carro for entregue sujo. Um detailing fica quase sempre mais barato e evita surpresas na fatura.',
        },
        {
          q: 'Conseguem recuperar faróis muito amarelados?',
          a: 'Na maioria dos casos, sim. Lixamos por etapas e polimos a lente, deixando-a outra vez transparente. Faróis muito degradados podem precisar de proteção extra para durar.',
        },
      ],
    },
    en: {
      city: 'Faro',
      metaTitle: 'Car Detailing near Faro — Professional Wash & Detail',
      metaDescription:
        'Car detailing for the Faro area: interior, exterior and headlight restoration. Ideal before returning a rental at the airport. Book online with JetWash24.',
      eyebrow: 'Car Detailing · Faro',
      h1: 'Car Detailing near Faro',
      tagline:
        'Professional detailing within reach of Faro — interior, exterior and headlights like new.',
      distance:
        'We’re in Guia, about 30 minutes from Faro on the A22 — handy for anyone returning a rental at the airport.',
      intro: [
        'Faro is the gateway to the Algarve — airport, daily traffic and busy roads that take their toll on a car. Anyone living or working in the area knows how dust, insects and sun gradually wear down the paint and interior over the year.',
        'JetWash24 provides professional detailing within reach of Faro, from our base in Guia (about 30 minutes on the A22). Interior cleaning, detailed exterior wash and yellowed-headlight restoration — including that finishing touch that matters before returning a rental at the airport or putting a car up for sale. Book online in minutes.',
      ],
      reasons: [
        {
          title: 'Near the airport',
          body: 'Returning a rental or handing over a car? We leave it spotless inside and out to help you avoid cleaning charges.',
        },
        {
          title: 'Headlight restoration',
          body: 'Headlights yellowed by the Algarve sun go clear again — improving the look and your night-driving safety.',
        },
        {
          title: 'Built for commuters',
          body: 'Cars driven daily between Faro and the rest of the Algarve gather dust and insects. We bring back that new-car look.',
        },
      ],
      faq: [
        {
          q: 'Do you cover the Faro area?',
          a: 'Yes. We’re in Guia, about 30 minutes from Faro on the A22, and welcome customers from the Faro, Loulé and Almancil areas looking for professional detailing.',
        },
        {
          q: 'Is it worth detailing the car before returning it at the airport?',
          a: 'Yes. Many rental companies charge cleaning fees if the car is handed back dirty. A detail is almost always cheaper and avoids nasty surprises on the bill.',
        },
        {
          q: 'Can you fix badly yellowed headlights?',
          a: 'In most cases, yes. We sand the lens in stages and polish it back to clear. Heavily degraded headlights may need extra protection to last.',
        },
      ],
    },
  },
];

export function getLocation(slug: string): LocationContent | undefined {
  return LOCATIONS.find((l) => l.slug === slug);
}

export const LOCATION_SLUGS = LOCATIONS.map((l) => l.slug);

/**
 * Frequently asked questions, localised.
 *
 * Rendered on-page (FaqSection / service pages) AND emitted as FAQPage
 * structured data. Google requires the markup to match visible content,
 * so these two uses MUST share this single source.
 */

export type FaqItem = {
  q: string;
  a: string;
};

type LocalizedFaq = {
  pt: FaqItem[];
  en: FaqItem[];
};

/** General FAQs shown on the home page. */
export const HOME_FAQ: LocalizedFaq = {
  pt: [
    {
      q: 'Onde fica a JetWash24?',
      a: 'Estamos na N125, em Guia, Albufeira — a 3 minutos a pé do Algarve Shopping. Tem estacionamento fácil e pode esperar pelo seu carro num espaço confortável.',
    },
    {
      q: 'Preciso de marcar com antecedência?',
      a: 'Recomendamos reservar online para garantir horário, sobretudo no verão. Aceitamos também sem marcação consoante a disponibilidade do dia. A reserva online demora menos de 2 minutos.',
    },
    {
      q: 'Quanto tempo demora uma lavagem completa?',
      a: 'Uma lavagem exterior expresso demora cerca de 30 minutos; o Pacote Completo (interior + exterior detalhado) demora cerca de 3 horas. Cada serviço indica a duração estimada no momento da reserva.',
    },
    {
      q: 'Que formas de pagamento aceitam?',
      a: 'Aceitamos dinheiro, cartão de crédito/débito e MB Way. O pagamento é feito no local, no fim do serviço.',
    },
    {
      q: 'O preço muda consoante o tamanho do carro?',
      a: 'Sim. Os preços base são para citadinos. Acresce +5€ para carros médios, +10€ para SUV e +15€ para carros grandes/comerciais, devido ao tempo e produto adicionais.',
    },
    {
      q: 'Os produtos são seguros para o meu carro?',
      a: 'Usamos exclusivamente produtos profissionais com pH equilibrado, seguros para pintura, plásticos, couro e vidros. Nada de escovas agressivas que risquem a pintura — técnica de lavagem a duas baldes e microfibras.',
    },
  ],
  en: [
    {
      q: 'Where is JetWash24 located?',
      a: 'We are on the N125 in Guia, Albufeira — a 3-minute walk from Algarve Shopping. Parking is easy and you can wait for your car in a comfortable space.',
    },
    {
      q: 'Do I need to book in advance?',
      a: 'We recommend booking online to secure your slot, especially in summer. We also accept walk-ins subject to daily availability. Booking online takes under 2 minutes.',
    },
    {
      q: 'How long does a full detail take?',
      a: 'An express exterior wash takes about 30 minutes; the Complete Package (detailed interior + exterior) takes around 3 hours. Each service shows its estimated duration when you book.',
    },
    {
      q: 'Which payment methods do you accept?',
      a: 'We accept cash, credit/debit card and MB Way. Payment is made on-site once the service is finished.',
    },
    {
      q: 'Does the price depend on car size?',
      a: 'Yes. Base prices are for city cars. Add +€5 for medium cars, +€10 for SUVs and +€15 for large/commercial vehicles, reflecting the extra time and product.',
    },
    {
      q: 'Are the products safe for my car?',
      a: 'We use only professional, pH-balanced products that are safe for paint, plastics, leather and glass. No aggressive brushes that scratch paint — we use the two-bucket method and microfibre towels.',
    },
  ],
};

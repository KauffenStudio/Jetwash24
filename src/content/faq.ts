/**
 * Frequently asked questions, localised.
 *
 * Rendered on-page (FaqSection / service pages) AND emitted as FAQPage
 * structured data. Google requires the markup to match visible content,
 * so these two uses MUST share this single source.
 *
 * ANSWER LENGTH: aim for 40–60 words per answer. Generative engines quote
 * passages they can lift whole; an answer under ~40 words usually lacks the
 * context to stand alone in a citation, and one over ~60 gets truncated.
 * Every answer should also carry at least one concrete fact — a price, a
 * duration, an address, a measurement — because quantified passages are the
 * ones that get cited. Never add a number here that isn't true.
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
      a: 'A JetWash24 fica na N125, em Guia, Albufeira (8800-076), a 3 minutos a pé do Algarve Shopping. Estamos abertos todos os dias das 09:00 às 17:00, incluindo fins de semana e feriados. O estacionamento é fácil e pode esperar pelo seu carro num espaço confortável ou combinar a recolha mais tarde.',
    },
    {
      q: 'Preciso de marcar com antecedência?',
      a: 'Recomendamos reservar online para garantir horário, sobretudo no verão, quando a procura é maior. A reserva demora menos de 2 minutos e fica confirmada com um sinal de 5€, que é descontado no valor final do serviço. Também aceitamos clientes sem marcação, consoante a disponibilidade do dia.',
    },
    {
      q: 'Quanto tempo demora uma lavagem completa?',
      a: 'Depende do serviço. A Lavagem Exterior Express demora cerca de 30 minutos e a Limpeza Interior Expresso 40 minutos. Os serviços detalhados levam entre 1h30 e 2 horas, e o Pacote Completo, que junta interior e exterior, cerca de 3 horas. Cada serviço mostra a duração estimada no momento da reserva.',
    },
    {
      q: 'Quanto custa polir um carro na JetWash24?',
      a: 'O Polimento de Brilho começa em 149€ e demora cerca de 2h30: é uma fase de máquina que devolve brilho à pintura e atenua marcas de lavagem. A Correção de Pintura, em duas fases, começa em 249€ e demora cerca de 5 horas, removendo swirls e riscos ligeiros do verniz.',
    },
    {
      q: 'Qual a diferença entre uma lavagem e um detailing?',
      a: 'Uma lavagem remove a sujidade à superfície e demora 30 a 40 minutos. Um detailing trata cada material com o produto certo — extração de manchas nos tecidos, hidratação do couro, descontaminação e proteção da pintura — e demora de 1h30 a 3 horas. A lavagem mantém o carro; o detailing recupera-o.',
    },
    {
      q: 'Removem areia da praia e pelos de animais?',
      a: 'Sim. A areia é o problema mais comum no Algarve e sai com aspiração profunda, já incluída em qualquer serviço de interior a partir de 39,90€. Os pelos de animal exigem ferramentas próprias e trabalho manual que o aspirador não resolve sozinho, por isso são um extra de 12€.',
    },
    {
      q: 'Que formas de pagamento aceitam?',
      a: 'Aceitamos dinheiro, cartão de crédito e débito, e MB Way. Se reservar online, paga apenas um sinal de 5€ por cartão no momento da reserva; o restante é pago no local, no fim do serviço. Pode pedir fatura com NIF — basta indicá-lo na altura do pagamento.',
    },
    {
      q: 'O preço muda consoante o tamanho do carro?',
      a: 'Sim. Os preços indicados são a base, para citadinos. Acresce 10€ para carros médios, 20€ para SUV, 30€ para carros grandes e comerciais, e 50€ para supercarros. O acréscimo reflete o tempo e a quantidade de produto que um carro maior exige. O valor final aparece antes de confirmar a reserva.',
    },
    {
      q: 'Os produtos são seguros para o meu carro?',
      a: 'Sim. Usamos apenas produtos profissionais de pH equilibrado, seguros para pintura, plásticos, couro e vidros. Nunca usamos escovas de rolo, que são a principal causa de micro-riscos: lavamos à mão pelo método dos dois baldes, com luvas de microfibra, e secamos com toalhas próprias para não marcar o verniz.',
    },
  ],
  en: [
    {
      q: 'Where is JetWash24 located?',
      a: 'JetWash24 is on the N125 in Guia, Albufeira (8800-076), a 3-minute walk from Algarve Shopping. We are open every day from 09:00 to 17:00, including weekends and public holidays. Parking is easy and you can wait for your car in a comfortable space or arrange a later pickup.',
    },
    {
      q: 'Do I need to book in advance?',
      a: 'We recommend booking online to secure your slot, especially in summer when demand is highest. Booking takes under 2 minutes and is confirmed with a 5€ deposit, which is deducted from the final price of the service. We also accept walk-ins, subject to availability on the day.',
    },
    {
      q: 'How long does a full detail take?',
      a: 'It depends on the service. The Express Exterior Wash takes about 30 minutes and the Express Interior Refresh 40 minutes. The detailed services take between 1h30 and 2 hours, and the Complete Package, which combines interior and exterior, around 3 hours. Each service shows its estimated duration when you book.',
    },
    {
      q: 'How much does it cost to polish a car at JetWash24?',
      a: 'The Gloss Polish starts at €149 and takes about 2h30: a single machine stage that brings gloss back to the paint and softens wash marks. Paint Correction, in two stages, starts at €249 and takes around 5 hours, removing swirls and light scratches from the clear coat.',
    },
    {
      q: 'What is the difference between a wash and a detail?',
      a: 'A wash removes surface dirt and takes 30 to 40 minutes. A detail treats each material with the right product — stain extraction from fabric, leather conditioning, decontamination and paint protection — and takes from 1h30 to 3 hours. A wash maintains the car; a detail brings it back.',
    },
    {
      q: 'Do you remove beach sand and pet hair?',
      a: 'Yes. Sand is the most common problem in the Algarve and comes out with the deep vacuum already included in any interior service from €39.90. Pet hair needs dedicated tools and hand work that a vacuum alone will not solve, so it is a €12 add-on.',
    },
    {
      q: 'Which payment methods do you accept?',
      a: 'We accept cash, credit and debit card, and MB Way. If you book online you pay only a €5 deposit by card at the time of booking; the balance is paid on-site once the service is finished. You can request an invoice with your tax number when you pay.',
    },
    {
      q: 'Does the price depend on car size?',
      a: 'Yes. The listed prices are the base, for city cars. Add €10 for medium cars, €20 for SUVs, €30 for large and commercial vehicles, and €50 for supercars. The surcharge reflects the extra time and product a bigger car needs. The final price is shown before you confirm the booking.',
    },
    {
      q: 'Are the products safe for my car?',
      a: 'Yes. We use only professional, pH-balanced products that are safe on paint, plastics, leather and glass. We never use roller brushes, the main cause of micro-scratches: we wash by hand using the two-bucket method with microfibre mitts, and dry with dedicated towels so the clear coat is not marked.',
    },
  ],
};

/**
 * Shop FAQs shown on the catalogue page.
 *
 * These answer the questions that decide a purchase — where we ship, what it
 * costs, how long it takes, how to send it back — and they are the passages an
 * answer engine can lift when someone asks where to buy detailing products in
 * the EU. Every figure here is read from lib/shop/shipping.ts: free delivery
 * to all 27 EU countries, a EUR 10 order minimum, a 7-15 working-day default
 * window, and the 14-day withdrawal right.
 */
export const SHOP_FAQ: LocalizedFaq = {
  pt: [
    {
      q: 'Para que países enviam?',
      a: 'Enviamos para os 27 países da União Europeia, de Portugal à Finlândia, incluindo Madeira e Açores. Vendemos apenas dentro da UE de propósito: não há declarações aduaneiras nem taxas de importação à chegada, por isso o preço que vê ao pagar é o preço final.',
    },
    {
      q: 'Quanto custam os portes de envio?',
      a: 'Nada. Os portes são grátis para toda a União Europeia, sem valor mínimo para ter envio gratuito. A única condição é que a encomenda chegue aos 10€ — abaixo disso o custo do envio ultrapassaria a margem do produto e não conseguimos expedir.',
    },
    {
      q: 'Quanto tempo demora a entrega?',
      a: 'A maioria das encomendas chega em 7 a 15 dias úteis após o pagamento. Alguns produtos saem de armazém europeu e chegam bem mais depressa — o pulverizador de espuma em 5 a 7 dias e a polidora compacta em 3 a 7. Cada produto indica o seu prazo.',
    },
    {
      q: 'Posso devolver um produto?',
      a: 'Sim. Tem 14 dias a contar da receção para devolver a encomenda, sem ter de justificar, como prevê a lei europeia do consumo. Escreva-nos para jetwash24detailing@gmail.com ou pelo WhatsApp para +351 928 380 478 e explicamos como enviar de volta.',
    },
    {
      q: 'Como posso pagar?',
      a: 'O pagamento é processado pela Stripe, que também trata dos pagamentos de milhares de lojas europeias. Aceitamos cartão de crédito e débito, MB WAY, Apple Pay e Klarna, entre outros métodos que variam consoante o país de quem compra. Não guardamos dados do seu cartão.',
    },
    {
      q: 'São os mesmos produtos que usam no centro?',
      a: 'São. Vendemos apenas o que usamos todos os dias nos carros dos nossos clientes no centro da Guia, em Albufeira. Se um produto não passa no nosso próprio trabalho, não entra na loja — é esse o único critério do catálogo.',
    },
  ],
  en: [
    {
      q: 'Which countries do you ship to?',
      a: 'We ship to all 27 European Union countries, from Portugal to Finland, including Madeira and the Azores. Selling only inside the EU is deliberate: no customs declarations and no import charges on arrival, so the price you see at checkout is the price you pay.',
    },
    {
      q: 'How much does shipping cost?',
      a: 'Nothing. Shipping is free across the whole European Union, with no minimum to unlock it. The only condition is that the order reaches EUR 10 — below that the postage costs more than the product margin, so we cannot dispatch it.',
    },
    {
      q: 'How long does delivery take?',
      a: 'Most orders arrive 7 to 15 working days after payment. Some products ship from an EU warehouse and arrive much sooner — the foam sprayer in 5 to 7 days, the compact polisher in 3 to 7. Each product page states its own window.',
    },
    {
      q: 'Can I return a product?',
      a: 'Yes. You have 14 days from delivery to return your order without giving a reason, as EU consumer law provides. Email jetwash24detailing@gmail.com or message us on WhatsApp at +351 928 380 478 and we will explain how to send it back.',
    },
    {
      q: 'How can I pay?',
      a: 'Payment is handled by Stripe, which also processes payments for thousands of European shops. We accept credit and debit cards, MB WAY, Apple Pay and Klarna, among other methods that vary with the buyer country. We never store your card details.',
    },
    {
      q: 'Are these the same products you use at the centre?',
      a: 'They are. We only sell what we use every day on our customers cars at our centre in Guia, Albufeira. If a product does not hold up in our own work it does not reach the shop — that is the only rule the catalogue follows.',
    },
  ],
};

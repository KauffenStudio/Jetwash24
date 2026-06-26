/**
 * Long-form, indexable content for individual service pages.
 *
 * These pages exist to capture specific, high-intent searches
 * ("restauro de faróis Albufeira", "correção de pintura Algarve")
 * that the single-page home cannot rank for on its own. Each entry is the
 * single source for the page copy, its <Service> JSON-LD and its metadata.
 *
 * Slugs are deliberately language-neutral so the URL is stable across
 * locales (/pt/services/<slug> and /en/services/<slug>).
 */

import type { FaqItem } from './faq';

export type ServiceContent = {
  slug: string;
  /** From-price in EUR (city-car base). */
  fromPrice: number;
  durationLabelPt: string;
  durationLabelEn: string;
  pt: ServiceCopy;
  en: ServiceCopy;
};

type ServiceCopy = {
  name: string;
  /** Short eyebrow above the H1. */
  eyebrow: string;
  /** Meta title (without brand suffix). */
  metaTitle: string;
  metaDescription: string;
  /** One-line hero subtitle. */
  tagline: string;
  /** 2–3 paragraph intro. */
  intro: string[];
  /** What's included bullets. */
  includes: string[];
  /** Step-by-step process. */
  process: { title: string; body: string }[];
  /** "Ideal for" chips. */
  idealFor: string[];
  faq: FaqItem[];
};

export const SERVICES: ServiceContent[] = [
  {
    slug: 'interior-detailing',
    fromPrice: 15,
    durationLabelPt: '40 min – 3 h',
    durationLabelEn: '40 min – 3 h',
    pt: {
      name: 'Detailing de Interiores',
      eyebrow: 'Interior',
      metaTitle: 'Detailing de Interiores em Guia, Albufeira',
      metaDescription:
        'Limpeza e restauração profissional do interior do seu carro em Guia, Albufeira. Bancos, tapetes, plásticos e couro como novos. Reserve online.',
      tagline: 'O interior do seu carro tratado ao detalhe, como saído do stand.',
      intro: [
        'No clima do Algarve, a areia da praia, o pó e o calor desgastam rapidamente o interior de qualquer carro. O nosso detailing de interiores remove sujidade entranhada, manchas, maus odores e a gordura acumulada que uma lavagem normal não tira.',
        'Trabalhamos por camadas — aspiração profunda, extração de manchas, limpeza de plásticos e hidratação de superfícies — para devolver ao habitáculo o toque e o cheiro de carro novo. Escolha entre o serviço Expresso (refrescar rápido) e a Restauração Premium (recuperação completa).',
      ],
      includes: [
        'Aspiração profunda de bancos, tapetes e mala',
        'Extração de manchas em tecido e estofos',
        'Limpeza e proteção de plásticos e painel',
        'Limpeza de vidros interiores sem riscos',
        'Higienização e eliminação de odores',
        'Hidratação de couro (serviço Premium)',
      ],
      process: [
        { title: 'Avaliação', body: 'Inspecionamos o estado do interior e identificamos manchas e zonas críticas.' },
        { title: 'Aspiração e descontaminação', body: 'Removemos toda a sujidade solta, areia e detritos de cada recanto.' },
        { title: 'Limpeza por superfície', body: 'Cada material recebe o produto certo — tecido, plástico, couro e vidro.' },
        { title: 'Proteção e acabamento', body: 'Aplicamos proteção UV nos plásticos e hidratante no couro, e higienizamos o ar.' },
      ],
      idealFor: ['Carros de família', 'Antes de vender', 'Pós-praia / pós-areia', 'Fumadores', 'Donos de animais'],
      faq: [
        {
          q: 'Conseguem tirar manchas antigas dos bancos?',
          a: 'Na maioria dos casos, sim. Usamos extração por injeção que remove manchas de café, lama e gordura entranhadas. Manchas muito antigas podem aliviar sem sair a 100% — avaliamos sempre antes.',
        },
        {
          q: 'Quanto tempo demora a secar?',
          a: 'Com a extração, os tecidos ficam ligeiramente húmidos durante 2 a 4 horas. No verão seca mais rápido. Entregamos o carro pronto a usar.',
        },
      ],
    },
    en: {
      name: 'Interior Detailing',
      eyebrow: 'Interior',
      metaTitle: 'Interior Car Detailing in Guia, Albufeira',
      metaDescription:
        'Professional interior cleaning and restoration in Guia, Albufeira. Seats, mats, plastics and leather like new. Book online.',
      tagline: 'Your car’s interior detailed to perfection — like it just left the showroom.',
      intro: [
        'In the Algarve climate, beach sand, dust and heat quickly wear down any car interior. Our interior detailing removes ground-in dirt, stains, bad odours and built-up grime that a regular wash leaves behind.',
        'We work in layers — deep vacuum, stain extraction, plastic cleaning and surface conditioning — to bring back that new-car feel and smell. Choose between the Express service (a quick refresh) and the Premium Restoration (a full recovery).',
      ],
      includes: [
        'Deep vacuum of seats, mats and boot',
        'Stain extraction from fabric and upholstery',
        'Cleaning and protection of plastics and dashboard',
        'Streak-free interior glass cleaning',
        'Sanitising and odour removal',
        'Leather conditioning (Premium service)',
      ],
      process: [
        { title: 'Assessment', body: 'We inspect the interior and flag stains and problem areas.' },
        { title: 'Vacuum & decontamination', body: 'We remove all loose dirt, sand and debris from every corner.' },
        { title: 'Surface-by-surface cleaning', body: 'Each material gets the right product — fabric, plastic, leather and glass.' },
        { title: 'Protection & finish', body: 'We apply UV protection to plastics, conditioner to leather, and sanitise the air.' },
      ],
      idealFor: ['Family cars', 'Before selling', 'After the beach', 'Smokers', 'Pet owners'],
      faq: [
        {
          q: 'Can you remove old stains from the seats?',
          a: 'In most cases, yes. We use injection extraction that lifts ground-in coffee, mud and grease stains. Very old stains may fade rather than disappear fully — we always assess first.',
        },
        {
          q: 'How long does it take to dry?',
          a: 'After extraction, fabrics stay slightly damp for 2 to 4 hours. It dries faster in summer. We hand the car back ready to use.',
        },
      ],
    },
  },
  {
    slug: 'exterior-detailing',
    fromPrice: 15,
    durationLabelPt: '30 min – 1 h 30',
    durationLabelEn: '30 min – 1 h 30',
    pt: {
      name: 'Lavagem e Detailing Exterior',
      eyebrow: 'Exterior',
      metaTitle: 'Lavagem e Detailing Exterior em Guia, Albufeira',
      metaDescription:
        'Lavagem exterior profissional sem riscos em Guia, Albufeira. Método de dois baldes, descontaminação e brilho duradouro. Reserve online.',
      tagline: 'Brilho profundo e proteção, sem um único risco na pintura.',
      intro: [
        'Lavar o carro mal faz mais mal do que bem — escovas de rolo e panos sujos enchem a pintura de micro-riscos. Usamos o método dos dois baldes, pré-lavagem com espuma ativa e luvas de microfibra para uma lavagem segura.',
        'No detailing exterior detalhado vamos além da lavagem: descontaminamos a pintura, tratamos jantes e pneus e aplicamos proteção que faz a água escorrer e mantém o brilho durante semanas.',
      ],
      includes: [
        'Pré-lavagem com espuma ativa (snow foam)',
        'Lavagem segura a dois baldes',
        'Limpeza profunda de jantes e cavas',
        'Descontaminação da pintura (detalhado)',
        'Secagem com microfibra premium',
        'Selante de proteção e brilho nos pneus',
      ],
      process: [
        { title: 'Pré-lavagem', body: 'Espuma ativa solta a sujidade antes do contacto, reduzindo o risco de riscos.' },
        { title: 'Jantes e cavas', body: 'As zonas mais sujas primeiro, com produtos dedicados e seguros para a jante.' },
        { title: 'Lavagem de contacto', body: 'Método dos dois baldes com luva de microfibra, de cima para baixo.' },
        { title: 'Secagem e proteção', body: 'Secagem sem riscos e aplicação de selante que repele a água.' },
      ],
      idealFor: ['Manutenção semanal', 'Carros do dia a dia', 'Antes de eventos', 'Recuperar brilho'],
      faq: [
        {
          q: 'A lavagem risca a pintura?',
          a: 'Não. Evitamos escovas de rolo e usamos o método dos dois baldes com luvas de microfibra limpas, a técnica mais segura para a pintura.',
        },
        {
          q: 'Quanto tempo dura a proteção?',
          a: 'O selante que aplicamos na lavagem detalhada protege e dá brilho durante várias semanas, dependendo da exposição e da frequência de lavagem.',
        },
      ],
    },
    en: {
      name: 'Exterior Wash & Detailing',
      eyebrow: 'Exterior',
      metaTitle: 'Exterior Car Wash & Detailing in Guia, Albufeira',
      metaDescription:
        'Professional swirl-free exterior wash in Guia, Albufeira. Two-bucket method, decontamination and lasting shine. Book online.',
      tagline: 'Deep shine and protection — without a single scratch on your paint.',
      intro: [
        'Washing a car badly does more harm than good — roller brushes and dirty cloths fill the paint with micro-scratches. We use the two-bucket method, an active foam pre-wash and microfibre mitts for a safe wash.',
        'Our detailed exterior goes beyond a wash: we decontaminate the paint, treat wheels and tyres, and apply protection that beads water and keeps the shine for weeks.',
      ],
      includes: [
        'Active foam pre-wash (snow foam)',
        'Safe two-bucket contact wash',
        'Deep clean of wheels and arches',
        'Paint decontamination (detailed)',
        'Drying with premium microfibre',
        'Protective sealant and tyre shine',
      ],
      process: [
        { title: 'Pre-wash', body: 'Active foam lifts dirt before contact, reducing the risk of scratches.' },
        { title: 'Wheels & arches', body: 'The dirtiest areas first, with dedicated wheel-safe products.' },
        { title: 'Contact wash', body: 'Two-bucket method with a microfibre mitt, top to bottom.' },
        { title: 'Dry & protect', body: 'Scratch-free drying and a water-repellent sealant.' },
      ],
      idealFor: ['Weekly maintenance', 'Daily drivers', 'Before events', 'Restoring shine'],
      faq: [
        {
          q: 'Will the wash scratch my paint?',
          a: 'No. We avoid roller brushes and use the two-bucket method with clean microfibre mitts — the safest technique for paintwork.',
        },
        {
          q: 'How long does the protection last?',
          a: 'The sealant applied in the detailed wash protects and adds shine for several weeks, depending on exposure and wash frequency.',
        },
      ],
    },
  },
  {
    slug: 'headlight-restoration',
    fromPrice: 30,
    durationLabelPt: '45 min – 1 h',
    durationLabelEn: '45 min – 1 h',
    pt: {
      name: 'Restauro de Faróis',
      eyebrow: 'Restauro',
      metaTitle: 'Restauro de Faróis (Polimento) em Guia, Albufeira',
      metaDescription:
        'Faróis amarelados ou baços? Polimento e restauro de faróis em Guia, Albufeira — mais visibilidade e segurança. Resultado imediato. Reserve online.',
      tagline: 'Faróis transparentes outra vez — mais visibilidade, mais segurança, melhor aspeto.',
      intro: [
        'Com o sol intenso do Algarve, o policarbonato dos faróis amarela e fica baço, reduzindo a luz na estrada até 60% e fazendo o carro parecer mais velho. O restauro devolve a transparência sem trocar o farol.',
        'Lixamos progressivamente a camada oxidada, polimos a ótica e aplicamos um selante UV que atrasa o reaparecimento do amarelo. Resultado imediato, visível ao primeiro olhar — e mais segurança na condução noturna.',
      ],
      includes: [
        'Lixagem progressiva da oxidação',
        'Polimento da ótica do farol',
        'Acabamento cristalino',
        'Selante de proteção UV',
        'Recuperação da intensidade de luz',
      ],
      process: [
        { title: 'Proteção', body: 'Isolamos a pintura à volta do farol com fita de mascarar.' },
        { title: 'Lixagem', body: 'Removemos a camada amarelada com lixas de grão progressivo.' },
        { title: 'Polimento', body: 'Devolvemos a transparência com polish e máquina.' },
        { title: 'Selagem UV', body: 'Aplicamos proteção que atrasa a nova oxidação.' },
      ],
      idealFor: ['Faróis amarelados', 'Carros com 5+ anos', 'Inspeção (IPO)', 'Antes de vender'],
      faq: [
        {
          q: 'O amarelo volta a aparecer?',
          a: 'Com o selante UV que aplicamos, a oxidação demora muito mais a regressar. A durabilidade depende da exposição ao sol; um farol ao sol direto todos os dias dura menos que um à sombra.',
        },
        {
          q: 'Vale a pena restaurar ou trocar o farol?',
          a: 'O restauro custa uma fração de um farol novo e resolve a grande maioria dos casos de amarelecimento. Só faróis fissurados por dentro ou com humidade interna justificam substituição.',
        },
      ],
    },
    en: {
      name: 'Headlight Restoration',
      eyebrow: 'Restoration',
      metaTitle: 'Headlight Restoration (Polishing) in Guia, Albufeira',
      metaDescription:
        'Yellowed or hazy headlights? Headlight polishing and restoration in Guia, Albufeira — more visibility and safety. Instant results. Book online.',
      tagline: 'Clear headlights again — more visibility, more safety, better looks.',
      intro: [
        'Under the intense Algarve sun, headlight polycarbonate yellows and goes hazy, cutting road light by up to 60% and making the car look older. Restoration brings back clarity without replacing the unit.',
        'We progressively sand the oxidised layer, polish the lens and apply a UV sealant that slows the yellowing from returning. Instant, visible results — and safer night driving.',
      ],
      includes: [
        'Progressive sanding of oxidation',
        'Polishing of the headlight lens',
        'Crystal-clear finish',
        'UV protective sealant',
        'Restored light output',
      ],
      process: [
        { title: 'Protection', body: 'We mask off the paint around the headlight.' },
        { title: 'Sanding', body: 'We remove the yellowed layer with progressive-grit sandpaper.' },
        { title: 'Polishing', body: 'We restore clarity with polish and a machine.' },
        { title: 'UV sealing', body: 'We apply protection that delays new oxidation.' },
      ],
      idealFor: ['Yellowed headlights', 'Cars 5+ years old', 'Before inspection', 'Before selling'],
      faq: [
        {
          q: 'Will the yellowing come back?',
          a: 'With the UV sealant we apply, oxidation takes much longer to return. Durability depends on sun exposure; a headlight in direct sun every day lasts less than one in the shade.',
        },
        {
          q: 'Restore or replace the headlight?',
          a: 'Restoration costs a fraction of a new unit and solves the vast majority of yellowing cases. Only headlights cracked inside or with internal moisture justify replacement.',
        },
      ],
    },
  },
  {
    slug: 'paint-correction',
    fromPrice: 90,
    durationLabelPt: '3 h+',
    durationLabelEn: '3 h+',
    pt: {
      name: 'Correção de Pintura',
      eyebrow: 'Premium',
      metaTitle: 'Correção de Pintura (Polimento) em Guia, Albufeira',
      metaDescription:
        'Remova riscos, swirls e marcas de lavagem com correção de pintura profissional em Guia, Albufeira. Brilho de espelho duradouro. Reserve online.',
      tagline: 'Removemos riscos e swirls e devolvemos um brilho de espelho profundo.',
      intro: [
        'Micro-riscos, swirls e marcas de lavagem tiram profundidade e brilho à pintura, sobretudo em cores escuras. A correção de pintura remove fisicamente essas imperfeições da camada de verniz, em vez de as esconder temporariamente.',
        'Com máquina rotativa/orbital e polishes de corte progressivo, nivelamos o verniz e revelamos a cor real do carro. Recomendamos finalizar com proteção (selante ou cerâmico) para manter o resultado.',
      ],
      includes: [
        'Lavagem e descontaminação prévia',
        'Avaliação da espessura do verniz',
        'Correção em uma ou várias fases',
        'Remoção de swirls e riscos ligeiros',
        'Brilho profundo e uniforme',
        'Proteção final (opcional)',
      ],
      process: [
        { title: 'Preparação', body: 'Lavagem segura e descontaminação para uma superfície limpa.' },
        { title: 'Diagnóstico', body: 'Medimos o verniz e definimos o nível de correção seguro.' },
        { title: 'Polimento', body: 'Corte e refinamento por painéis até remover as imperfeições.' },
        { title: 'Proteção', body: 'Selamos o resultado com proteção à escolha.' },
      ],
      idealFor: ['Cores escuras', 'Carros com swirls', 'Antes de cerâmico', 'Recuperar valor'],
      faq: [
        {
          q: 'Qual a diferença entre polimento e correção de pintura?',
          a: 'Um polimento simples dá brilho mas pode mascarar riscos temporariamente. A correção remove de facto as imperfeições do verniz, com diagnóstico e fases de corte — o resultado é permanente (até novos riscos).',
        },
        {
          q: 'É preciso aplicar proteção depois?',
          a: 'Recomendamos. Depois de corrigir, o verniz fica no seu melhor; um selante ou revestimento cerâmico protege esse trabalho e facilita futuras lavagens.',
        },
      ],
    },
    en: {
      name: 'Paint Correction',
      eyebrow: 'Premium',
      metaTitle: 'Paint Correction (Polishing) in Guia, Albufeira',
      metaDescription:
        'Remove scratches, swirls and wash marks with professional paint correction in Guia, Albufeira. Lasting mirror shine. Book online.',
      tagline: 'We remove scratches and swirls and bring back a deep, mirror-like shine.',
      intro: [
        'Micro-scratches, swirls and wash marks rob paint of depth and shine, especially on dark colours. Paint correction physically removes these defects from the clear coat instead of hiding them temporarily.',
        'Using rotary/orbital machines and progressive-cut polishes, we level the clear coat and reveal the car’s true colour. We recommend finishing with protection (sealant or ceramic) to preserve the result.',
      ],
      includes: [
        'Prior wash and decontamination',
        'Clear-coat thickness assessment',
        'Single- or multi-stage correction',
        'Removal of swirls and light scratches',
        'Deep, uniform shine',
        'Final protection (optional)',
      ],
      process: [
        { title: 'Preparation', body: 'Safe wash and decontamination for a clean surface.' },
        { title: 'Diagnosis', body: 'We measure the clear coat and set a safe correction level.' },
        { title: 'Polishing', body: 'Cut and refine panel by panel until defects are gone.' },
        { title: 'Protection', body: 'We seal the result with your choice of protection.' },
      ],
      idealFor: ['Dark colours', 'Cars with swirls', 'Before ceramic coating', 'Restoring value'],
      faq: [
        {
          q: 'What is the difference between a polish and paint correction?',
          a: 'A simple polish adds shine but can mask scratches temporarily. Correction actually removes defects from the clear coat, with diagnosis and cutting stages — the result is permanent (until new scratches appear).',
        },
        {
          q: 'Do I need protection afterwards?',
          a: 'We recommend it. After correction the clear coat is at its best; a sealant or ceramic coating protects that work and makes future washes easier.',
        },
      ],
    },
  },
  {
    slug: 'complete-package',
    fromPrice: 85,
    durationLabelPt: '≈ 3 h',
    durationLabelEn: '≈ 3 h',
    pt: {
      name: 'Pacote Completo',
      eyebrow: 'Melhor Valor',
      metaTitle: 'Pacote Completo de Detailing em Guia, Albufeira',
      metaDescription:
        'Interior + exterior detalhado num só serviço em Guia, Albufeira. O carro como novo por dentro e por fora, com poupança. Reserve online.',
      tagline: 'Interior e exterior detalhados num só serviço — o carro como novo, com poupança.',
      intro: [
        'O nosso serviço mais procurado: combina o detailing de interiores detalhado com a lavagem exterior detalhada, num único agendamento e a um preço mais vantajoso do que reservar os dois em separado.',
        'Ideal para uma renovação completa — antes de uma viagem, de vender o carro ou simplesmente para o pôr impecável de dentro para fora. Sai daqui com o carro a parecer e a cheirar a novo.',
      ],
      includes: [
        'Tudo do Interior Detalhado',
        'Tudo do Exterior Detalhado',
        'Aspiração e extração de manchas',
        'Plásticos, couro e vidros tratados',
        'Lavagem segura + descontaminação',
        'Proteção de pintura e brilho nos pneus',
      ],
      process: [
        { title: 'Exterior primeiro', body: 'Pré-lavagem, jantes, lavagem de contacto e descontaminação.' },
        { title: 'Interior em profundidade', body: 'Aspiração, extração de manchas e limpeza por superfície.' },
        { title: 'Acabamentos', body: 'Couro, plásticos, vidros e proteção de pintura.' },
        { title: 'Inspeção final', body: 'Revisão ao detalhe antes da entrega.' },
      ],
      idealFor: ['Renovação total', 'Antes de viajar', 'Antes de vender', 'Presente'],
      faq: [
        {
          q: 'Vale mais a pena que reservar separado?',
          a: 'Sim. O Pacote Completo custa menos do que o Interior Detalhado e o Exterior Detalhado reservados em separado, e fica tudo feito numa única visita.',
        },
        {
          q: 'Quanto tempo fica o carro connosco?',
          a: 'Cerca de 3 horas, dependendo do estado e do tamanho do carro. Pode esperar no espaço junto ao Algarve Shopping ou combinar a recolha mais tarde.',
        },
      ],
    },
    en: {
      name: 'Complete Package',
      eyebrow: 'Best Value',
      metaTitle: 'Complete Detailing Package in Guia, Albufeira',
      metaDescription:
        'Detailed interior + exterior in one service in Guia, Albufeira. Your car like new inside and out, with savings. Book online.',
      tagline: 'Detailed interior and exterior in one service — your car like new, with savings.',
      intro: [
        'Our most popular service: it combines the detailed interior with the detailed exterior wash in a single booking, at a better price than booking both separately.',
        'Ideal for a full refresh — before a trip, before selling, or simply to get the car spotless inside and out. You leave with a car that looks and smells brand new.',
      ],
      includes: [
        'Everything in Detailed Interior',
        'Everything in Detailed Exterior',
        'Vacuum and stain extraction',
        'Plastics, leather and glass treated',
        'Safe wash + decontamination',
        'Paint protection and tyre shine',
      ],
      process: [
        { title: 'Exterior first', body: 'Pre-wash, wheels, contact wash and decontamination.' },
        { title: 'Interior in depth', body: 'Vacuum, stain extraction and surface-by-surface cleaning.' },
        { title: 'Finishing', body: 'Leather, plastics, glass and paint protection.' },
        { title: 'Final inspection', body: 'A detailed check before handover.' },
      ],
      idealFor: ['Full refresh', 'Before a trip', 'Before selling', 'A gift'],
      faq: [
        {
          q: 'Is it better value than booking separately?',
          a: 'Yes. The Complete Package costs less than the Detailed Interior and Detailed Exterior booked separately, and it’s all done in a single visit.',
        },
        {
          q: 'How long do you keep the car?',
          a: 'About 3 hours, depending on the car’s condition and size. You can wait at the spot next to Algarve Shopping or arrange a later pickup.',
        },
      ],
    },
  },
];

export function getService(slug: string): ServiceContent | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);

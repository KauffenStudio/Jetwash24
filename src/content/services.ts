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
  /** From-price in EUR (city-car base) — the current "now" price. */
  fromPrice: number;
  /** Optional crossed-out "before" price to show a promotional discount. */
  compareAtPrice?: number;
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
    fromPrice: 39.9,
    compareAtPrice: 50,
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
          a: 'Na maioria dos casos, sim. Usamos extração por injeção, que empurra solução de limpeza para dentro do tecido e volta a aspirá-la, removendo café, lama e gordura entranhados. Manchas com anos, tinta ou lixívia podem aliviar sem sair a 100% — avaliamos o estado dos bancos antes de começar e dizemos-lhe o que é realista esperar.',
        },
        {
          q: 'Quanto tempo demora a secar?',
          a: 'Depois da extração, os tecidos ficam ligeiramente húmidos durante 2 a 4 horas. No verão algarvio, com as janelas abertas, seca mais perto das 2 horas; no inverno pode chegar às 4. Entregamos sempre o carro pronto a usar — não precisa de esperar que seque para conduzir.',
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
          a: 'In most cases, yes. We use injection extraction, which pushes cleaning solution into the fabric and vacuums it back out, lifting ground-in coffee, mud and grease. Stains that are years old, or ink and bleach marks, may fade rather than disappear — we assess the seats before starting and tell you what is realistic.',
        },
        {
          q: 'How long does it take to dry?',
          a: 'After extraction, fabrics stay slightly damp for 2 to 4 hours. In the Algarve summer, with the windows down, it dries closer to 2 hours; in winter it can take the full 4. We always hand the car back ready to use — you do not need to wait for it to dry before driving.',
        },
      ],
    },
  },
  {
    slug: 'exterior-detailing',
    fromPrice: 29.9,
    compareAtPrice: 40,
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
          a: 'Não. Os riscos circulares que se vêem ao sol vêm quase sempre de escovas de rolo e de panos sujos. Evitamos ambos: pré-lavagem com espuma ativa para soltar a sujidade antes de qualquer contacto, método dos dois baldes com luva de microfibra, e secagem com toalhas limpas e dedicadas.',
        },
        {
          q: 'Quanto tempo dura a proteção?',
          a: 'O selante aplicado na lavagem detalhada protege e dá brilho durante várias semanas. A duração real depende da exposição: um carro estacionado ao sol e perto do mar perde proteção mais depressa do que um que fica na garagem. Lavagens em túneis de rolos encurtam bastante esse prazo.',
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
          a: 'No. The circular swirls you see in sunlight almost always come from roller brushes and dirty cloths. We avoid both: an active foam pre-wash lifts dirt before anything touches the paint, then the two-bucket method with a microfibre mitt, and drying with clean, dedicated towels.',
        },
        {
          q: 'How long does the protection last?',
          a: 'The sealant applied in the detailed wash protects and adds shine for several weeks. How long it really lasts depends on exposure: a car parked in the sun near the coast loses protection faster than one kept in a garage. Roller-tunnel car washes cut that time down sharply.',
        },
      ],
    },
  },
  {
    slug: 'headlight-restoration',
    fromPrice: 44.9,
    compareAtPrice: 55,
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
          a: 'Com o selante UV que aplicamos, a oxidação demora muito mais tempo a regressar, mas não é permanente — o policarbonato do farol continua a envelhecer ao sol. A durabilidade depende da exposição: um carro que fica ao sol todos os dias no Algarve precisa de retoque mais cedo do que um que dorme à sombra.',
        },
        {
          q: 'Vale a pena restaurar ou trocar o farol?',
          a: 'Restaurar custa uma fração de um farol novo e resolve a grande maioria dos casos de amarelecimento, que é oxidação da camada exterior do policarbonato. Só justifica substituição quando o farol tem fissuras internas, humidade acumulada lá dentro ou o refletor danificado — nesses casos o polimento não recupera a luz.',
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
          a: 'With the UV sealant we apply, oxidation takes far longer to return, but it is not permanent — the headlight polycarbonate keeps ageing in the sun. Durability depends on exposure: a car left in the Algarve sun every day needs a touch-up sooner than one that sits in the shade.',
        },
        {
          q: 'Restore or replace the headlight?',
          a: 'Restoring costs a fraction of a new unit and solves the vast majority of yellowing cases, which are oxidation of the outer polycarbonate layer. Replacement is only justified when the headlight is cracked internally, has trapped moisture inside, or the reflector is damaged — polishing will not restore light output there.',
        },
      ],
    },
  },
  {
    slug: 'gloss-polish',
    fromPrice: 149,
    compareAtPrice: 190,
    durationLabelPt: '2 h 30 – 3 h',
    durationLabelEn: '2 h 30 – 3 h',
    pt: {
      name: 'Polimento de Brilho',
      eyebrow: 'Polimento',
      metaTitle: 'Polimento de Carro em Guia, Albufeira',
      metaDescription:
        'Polimento a máquina numa fase em Guia, Albufeira. Devolve brilho e profundidade à pintura e atenua marcas de lavagem. Desde 149€. Reserve online.',
      tagline: 'O polimento que devolve o brilho de stand à sua pintura, numa só fase.',
      intro: [
        'Ao fim de alguns anos ao sol e ao sal do Algarve, a pintura perde brilho e ganha um aspeto baço mesmo depois de lavada. O polimento de brilho corrige exatamente isso: uma fase de máquina que refina o verniz, reaviva a cor e faz a luz voltar a refletir como deve ser.',
        'É o passo intermédio entre uma lavagem detalhada e a correção de pintura completa. Não remove riscos profundos — para isso existe a Correção de Pintura — mas atenua marcas de lavagem ligeiras e devolve profundidade à cor por uma fração do preço.',
      ],
      includes: [
        'Lavagem segura e descontaminação',
        'Tratamento com clay bar',
        'Polimento a máquina numa fase',
        'Atenua marcas de lavagem ligeiras',
        'Selante de proteção',
        'Brilho nos pneus',
      ],
      process: [
        { title: 'Lavagem segura', body: 'Pré-lavagem com espuma e método dos dois baldes, para não introduzir riscos novos.' },
        { title: 'Descontaminação', body: 'Clay bar remove partículas agarradas ao verniz que a lavagem não tira.' },
        { title: 'Polimento numa fase', body: 'Polish de refinamento com máquina orbital, painel a painel, para brilho uniforme.' },
        { title: 'Proteção', body: 'Selante que fixa o resultado, repele a água e facilita as próximas lavagens.' },
      ],
      idealFor: ['Pintura baça', 'Manutenção anual', 'Antes de vender', 'Carros bem tratados', 'Primeiro polimento'],
      faq: [
        {
          q: 'Qual a diferença entre o Polimento de Brilho e a Correção de Pintura?',
          a: 'O Polimento de Brilho é uma fase: refina o verniz, dá brilho e atenua marcas ligeiras. A Correção de Pintura são duas fases (corte + refinamento) e remove mesmo swirls e riscos ligeiros. Se a pintura está sã mas sem brilho, o polimento chega; se vê riscos circulares ao sol, precisa da correção.',
        },
        {
          q: 'O polimento estraga o verniz?',
          a: 'Não, quando é feito com critério. Um polimento numa fase remove uma camada mínima de verniz, muito menos do que uma correção agressiva. Avaliamos sempre a pintura antes de começar e trabalhamos dentro de margens seguras — um carro pode ser polido várias vezes ao longo da vida sem problema.',
        },
        {
          q: 'Quanto tempo dura o resultado?',
          a: 'O brilho é permanente até a pintura voltar a marcar-se, porque a superfície foi mesmo refinada e não apenas preenchida com cera. O selante que aplicamos por cima protege durante vários meses. O que encurta o resultado são lavagens com escovas de rolo, que reintroduzem micro-riscos em poucas passagens.',
        },
      ],
    },
    en: {
      name: 'Gloss Polish',
      eyebrow: 'Polishing',
      metaTitle: 'Car Polishing in Guia, Albufeira',
      metaDescription:
        'Single-stage machine polish in Guia, Albufeira. Brings back gloss and depth and softens wash marks. From €149. Book online.',
      tagline: 'The polish that brings showroom gloss back to your paint, in a single stage.',
      intro: [
        'After a few years under the Algarve sun and salt, paint loses its gloss and looks dull even right after a wash. A gloss polish fixes exactly that: one machine stage that refines the clear coat, revives the colour and gets light reflecting properly again.',
        'It is the middle step between a detailed wash and full paint correction. It will not remove deep scratches — that is what Paint Correction is for — but it softens light wash marks and brings depth back to the colour for a fraction of the price.',
      ],
      includes: [
        'Safe wash and decontamination',
        'Clay bar treatment',
        'Single-stage machine polish',
        'Softens light wash marks',
        'Protective sealant',
        'Tyre shine',
      ],
      process: [
        { title: 'Safe wash', body: 'Foam pre-wash and the two-bucket method, so we never add fresh scratches.' },
        { title: 'Decontamination', body: 'A clay bar lifts bonded particles the wash leaves behind.' },
        { title: 'Single-stage polish', body: 'Refining polish on an orbital machine, panel by panel, for even gloss.' },
        { title: 'Protection', body: 'A sealant locks in the result, beads water and makes future washes easier.' },
      ],
      idealFor: ['Dull paint', 'Yearly maintenance', 'Before selling', 'Well-kept cars', 'A first polish'],
      faq: [
        {
          q: 'What is the difference between a Gloss Polish and Paint Correction?',
          a: 'A Gloss Polish is one stage: it refines the clear coat, adds gloss and softens light marks. Paint Correction is two stages (cut + refine) and actually removes swirls and light scratches. If the paint is sound but dull, the polish is enough; if you can see circular swirls in sunlight, you need the correction.',
        },
        {
          q: 'Does polishing damage the clear coat?',
          a: 'Not when it is done sensibly. A single-stage polish removes a minimal amount of clear coat, far less than an aggressive correction. We always assess the paint before starting and stay within safe margins — a car can be polished several times over its life without trouble.',
        },
        {
          q: 'How long does the result last?',
          a: 'The gloss lasts until the paint marks up again, because the surface was genuinely refined rather than filled with wax. The sealant we apply on top protects for several months. What cuts the result short is roller-brush car washes, which reintroduce micro-scratches within a few passes.',
        },
      ],
    },
  },
  {
    slug: 'paint-correction',
    fromPrice: 249,
    compareAtPrice: 320,
    durationLabelPt: '4 h – 6 h',
    durationLabelEn: '4 h – 6 h',
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
        'Correção em duas fases (corte + refinamento)',
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
          a: 'O nosso Polimento de Brilho (desde 149€) é uma fase: dá brilho e atenua marcas de lavagem ligeiras. A Correção de Pintura são duas fases, com diagnóstico e corte, e remove de facto swirls e riscos ligeiros do verniz — o resultado é permanente (até novos riscos). Se vê riscos circulares ao sol, é correção que precisa.',
        },
        {
          q: 'É preciso aplicar proteção depois?',
          a: 'Recomendamos vivamente. Depois da correção o verniz está no seu melhor estado, mas também desprotegido: sem selante ou revestimento cerâmico volta a marcar-se mais depressa. A proteção mantém o resultado durante meses, faz a água escorrer e torna as lavagens seguintes muito mais rápidas e seguras para a pintura.',
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
        'Two-stage correction (cut + refine)',
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
          a: 'Our Gloss Polish (from €149) is a single stage: it adds shine and softens light wash marks. Paint Correction is two stages, with assessment and a cutting step, and actually removes swirls and light scratches from the clear coat, permanently. If you can see circular swirls in sunlight, correction is what you need.',
        },
        {
          q: 'Do I need protection afterwards?',
          a: 'We strongly recommend it. After correction the clear coat is at its best, but it is also unprotected: without a sealant or ceramic coating it marks up again faster. Protection holds the result for months, makes water bead off, and makes every later wash quicker and safer for the paint.',
        },
      ],
    },
  },
  {
    slug: 'complete-package',
    fromPrice: 139.9,
    compareAtPrice: 150,
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
          a: 'Sim. A Limpeza Interior Detalhada custa 79,90€ e a Limpeza Exterior Detalhada 69,90€ — 149,80€ se as reservar em separado. O Pacote Completo faz as duas por 139,90€, numa única visita de cerca de 3 horas. Além da poupança, evita ter de trazer o carro duas vezes em dias diferentes.',
        },
        {
          q: 'Quanto tempo fica o carro connosco?',
          a: 'Cerca de 3 horas, dependendo do tamanho e do estado do carro — um SUV muito sujo leva mais tempo do que um citadino bem mantido. Como estamos a 3 minutos a pé do Algarve Shopping, a maioria dos clientes aproveita para almoçar ou fazer compras enquanto tratamos do carro.',
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
          a: 'Yes. The Detailed Interior Clean is €79.90 and the Detailed Exterior Clean is €69.90 — €149.80 booked separately. The Complete Package does both for €139.90 in a single visit of about 3 hours. Beyond the saving, it spares you bringing the car in twice on different days.',
        },
        {
          q: 'How long do you keep the car?',
          a: 'About 3 hours, depending on the size and condition of the car — a heavily soiled SUV takes longer than a well-kept city car. Since we are a 3-minute walk from Algarve Shopping, most customers use the time for lunch or shopping while we work on the car.',
        },
      ],
    },
  },
];

export function getService(slug: string): ServiceContent | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);

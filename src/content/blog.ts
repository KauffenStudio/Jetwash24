/**
 * Blog content — localised, indexable articles that target informational
 * searches around car cleaning and detailing in the Algarve. Each post links
 * back to a relevant service to turn readers into bookings, and drives the
 * BlogPosting JSON-LD + page metadata from this single source.
 *
 * Body is a small block model (heading / paragraph / list) so it renders
 * with consistent, on-brand typography without a Markdown dependency.
 */

export type Block =
  | { type: 'h2'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] };

export type Article = {
  slug: string;
  /** ISO date (publication). */
  date: string;
  cover: string;
  /** Slug of the most relevant service, for the in-article CTA. */
  relatedService: string;
  pt: ArticleCopy;
  en: ArticleCopy;
};

type ArticleCopy = {
  category: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  readingMinutes: number;
  body: Block[];
};

export const ARTICLES: Article[] = [
  {
    slug: 'frequencia-lavar-carro-algarve',
    date: '2026-05-20',
    cover: '/blog/frequencia-lavar-carro.jpg',
    relatedService: 'exterior-detailing',
    pt: {
      category: 'Manutenção',
      title: 'Com que frequência deve lavar o carro no Algarve?',
      excerpt:
        'Sal do mar, areia e sol intenso são duros para qualquer carro. Veja a frequência ideal de lavagem para proteger a pintura no clima algarvio.',
      metaDescription:
        'Com que frequência lavar o carro no Algarve? Guia prático: sal, areia e sol e o seu impacto na pintura, e a rotina ideal de lavagem.',
      readingMinutes: 4,
      body: [
        { type: 'p', text: 'O Algarve é um dos melhores sítios para conduzir — e um dos mais exigentes para a pintura do carro. A combinação de ar salgado perto da costa, areia fina das praias e sol intenso quase todo o ano acelera o desgaste do verniz e dos plásticos.' },
        { type: 'h2', text: 'A regra geral' },
        { type: 'p', text: 'Para a maioria dos condutores, uma lavagem exterior a cada 2 semanas é o equilíbrio ideal entre proteção e custo. Quem vive ou estaciona junto ao mar deve aproximar-se das lavagens semanais, porque o sal acumula-se mais depressa.' },
        { type: 'h2', text: 'Fatores que aumentam a frequência' },
        { type: 'ul', items: [
          'Estacionar à beira-mar ou sob pinheiros (resina e excrementos de aves)',
          'Uso diário em estradas com pó e obras',
          'Cor escura — mostra muito mais sujidade e marcas de água',
          'Idas frequentes à praia, que trazem areia para dentro e fora do carro',
        ] },
        { type: 'h2', text: 'Não é só estética' },
        { type: 'p', text: 'Excrementos de aves, resina de árvore e insetos são ácidos e podem marcar o verniz de forma permanente se ficarem ao sol. Removê-los cedo evita reparações caras. Uma camada de proteção (selante) aplicada na lavagem ajuda a que a sujidade adira menos e saia mais facilmente.' },
        { type: 'h2', text: 'A nossa recomendação' },
        { type: 'p', text: 'Alterne lavagens de manutenção regulares com um detailing exterior detalhado de tempos a tempos, que descontamina a pintura e renova a proteção. É a rotina que mantém o carro a brilhar e protegido durante todo o ano algarvio.' },
      ],
    },
    en: {
      category: 'Maintenance',
      title: 'How often should you wash your car in the Algarve?',
      excerpt:
        'Sea salt, sand and intense sun are tough on any car. Here is the ideal wash frequency to protect your paint in the Algarve climate.',
      metaDescription:
        'How often to wash your car in the Algarve? A practical guide: salt, sand and sun and their impact on paint, plus the ideal wash routine.',
      readingMinutes: 4,
      body: [
        { type: 'p', text: 'The Algarve is one of the best places to drive — and one of the harshest for your car’s paint. Salty coastal air, fine beach sand and near year-round intense sun all speed up wear on clear coat and plastics.' },
        { type: 'h2', text: 'The general rule' },
        { type: 'p', text: 'For most drivers, an exterior wash every 2 weeks is the sweet spot between protection and cost. If you live or park near the sea, lean towards weekly washes, because salt builds up faster.' },
        { type: 'h2', text: 'Factors that increase frequency' },
        { type: 'ul', items: [
          'Parking by the sea or under pine trees (sap and bird droppings)',
          'Daily use on dusty roads or near construction',
          'Dark colours — they show far more dirt and water marks',
          'Frequent beach trips that bring sand in and out of the car',
        ] },
        { type: 'h2', text: 'It is not just looks' },
        { type: 'p', text: 'Bird droppings, tree sap and insects are acidic and can permanently mark the clear coat if left in the sun. Removing them early avoids costly repairs. A protective layer (sealant) applied during the wash helps dirt stick less and rinse off more easily.' },
        { type: 'h2', text: 'Our recommendation' },
        { type: 'p', text: 'Alternate regular maintenance washes with a detailed exterior detail every so often, which decontaminates the paint and renews protection. That is the routine that keeps your car shining and protected all year round in the Algarve.' },
      ],
    },
  },
  {
    slug: 'proteger-pintura-verao',
    date: '2026-06-02',
    cover: '/blog/proteger-pintura-verao.jpg',
    relatedService: 'paint-correction',
    pt: {
      category: 'Proteção',
      title: 'Como proteger a pintura do carro no verão algarvio',
      excerpt:
        'O sol forte do Algarve desbota cores e degrada o verniz. Saiba como manter a pintura protegida e brilhante nos meses mais quentes.',
      metaDescription:
        'Proteja a pintura do carro no verão do Algarve: efeitos do sol e do calor, e os passos práticos para manter cor e brilho.',
      readingMinutes: 5,
      body: [
        { type: 'p', text: 'O verão algarvio é implacável com a pintura. Temperaturas de superfície que ultrapassam os 60 °C, raios UV constantes e poeira fazem o verniz oxidar e a cor perder vida mais depressa do que em climas amenos.' },
        { type: 'h2', text: 'O que o sol faz à pintura' },
        { type: 'ul', items: [
          'Oxida o verniz, tornando a cor baça',
          'Acentua riscos e swirls ao refletir a luz',
          'Seca e cristaliza pingos de água, deixando marcas',
          'Degrada plásticos e borrachas exteriores',
        ] },
        { type: 'h2', text: 'Passo 1 — Lavar bem (e à sombra)' },
        { type: 'p', text: 'Nunca lave o carro ao sol direto: a água seca antes de a poder remover e deixa marcas de minerais. Lave à sombra ou ao fim do dia, com método seguro para não criar riscos.' },
        { type: 'h2', text: 'Passo 2 — Proteção que reflete o calor' },
        { type: 'p', text: 'Um selante ou revestimento cerâmico cria uma barreira que repele a água e reduz a aderência de sujidade, ao mesmo tempo que dá proteção UV. É o investimento que mais compensa para quem deixa o carro ao sol.' },
        { type: 'h2', text: 'Passo 3 — Corrigir antes de proteger' },
        { type: 'p', text: 'Se a pintura já tem swirls e marcas, vale a pena fazer uma correção de pintura antes de aplicar proteção — assim sela-se a pintura no seu melhor estado, em vez de bloquear as imperfeições por baixo.' },
        { type: 'h2', text: 'Bónus — Interior também sofre' },
        { type: 'p', text: 'O sol degrada o tablier e resseca o couro. Limpar e hidratar regularmente as superfícies interiores evita fissuras e mantém o habitáculo apresentável.' },
      ],
    },
    en: {
      category: 'Protection',
      title: 'How to protect your car paint in the Algarve summer',
      excerpt:
        'The strong Algarve sun fades colour and degrades clear coat. Learn how to keep paint protected and glossy through the hottest months.',
      metaDescription:
        'Protect your car paint in the Algarve summer: the effects of sun and heat, and the practical steps to keep colour and shine.',
      readingMinutes: 5,
      body: [
        { type: 'p', text: 'The Algarve summer is brutal on paint. Surface temperatures above 60 °C, constant UV and dust make clear coat oxidise and colour fade faster than in milder climates.' },
        { type: 'h2', text: 'What the sun does to paint' },
        { type: 'ul', items: [
          'Oxidises the clear coat, dulling the colour',
          'Highlights scratches and swirls as light reflects',
          'Dries and crystallises water droplets, leaving marks',
          'Degrades exterior plastics and rubbers',
        ] },
        { type: 'h2', text: 'Step 1 — Wash well (and in the shade)' },
        { type: 'p', text: 'Never wash in direct sun: water dries before you can remove it and leaves mineral marks. Wash in the shade or at the end of the day, with a safe method to avoid scratches.' },
        { type: 'h2', text: 'Step 2 — Protection that reflects heat' },
        { type: 'p', text: 'A sealant or ceramic coating creates a barrier that repels water and reduces how much dirt sticks, while adding UV protection. It is the best-value investment for anyone who parks in the sun.' },
        { type: 'h2', text: 'Step 3 — Correct before protecting' },
        { type: 'p', text: 'If the paint already has swirls and marks, it is worth doing paint correction before applying protection — that way you seal the paint at its best, instead of locking defects underneath.' },
        { type: 'h2', text: 'Bonus — the interior suffers too' },
        { type: 'p', text: 'The sun degrades the dashboard and dries out leather. Regularly cleaning and conditioning interior surfaces prevents cracking and keeps the cabin looking good.' },
      ],
    },
  },
  {
    slug: 'tirar-areia-praia-interior',
    date: '2026-06-12',
    cover: '/blog/tirar-areia-interior.jpg',
    relatedService: 'interior-detailing',
    pt: {
      category: 'Interior',
      title: 'Como tirar a areia da praia do interior do carro',
      excerpt:
        'A areia entra em todo o lado e é difícil de remover. Veja as técnicas que usamos para deixar o interior limpo depois de um verão de praia.',
      metaDescription:
        'Tirar areia da praia do carro: porque é tão difícil e as técnicas profissionais para remover areia de tapetes, bancos e recantos.',
      readingMinutes: 4,
      body: [
        { type: 'p', text: 'Quem vive o verão no Algarve conhece bem o problema: por mais que sacuda as toalhas, a areia da praia acaba sempre dentro do carro — nos tapetes, entre os bancos e em recantos impossíveis.' },
        { type: 'h2', text: 'Porque é tão difícil de remover' },
        { type: 'p', text: 'A areia fina das praias algarvias é abrasiva e minúscula. Infiltra-se na trama dos tapetes e tecidos, onde um aspirador doméstico normal não chega com força suficiente. Pior: ao esfregar os bancos, a areia funciona como lixa e pode danificar tecidos e plásticos.' },
        { type: 'h2', text: 'O que fazer em casa' },
        { type: 'ul', items: [
          'Retire os tapetes e sacuda-os bem virados ao contrário',
          'Aspire de fora para dentro, com a maior potência disponível',
          'Use um pincel para soltar a areia das costuras antes de aspirar',
          'Evite esfregar a seco — espalha a areia e risca superfícies',
        ] },
        { type: 'h2', text: 'O que faz a diferença profissional' },
        { type: 'p', text: 'Usamos aspiração de alta potência com bicos finos que chegam às calhas dos bancos e às juntas. Combinamos com escovas específicas que soltam a areia entranhada e, quando preciso, extração por injeção para tecidos. O resultado é um interior verdadeiramente limpo, não apenas à superfície.' },
        { type: 'h2', text: 'Prevenir para o próximo verão' },
        { type: 'p', text: 'Tapetes de borracha em vez de tecido, sacudir o calçado antes de entrar e uma limpeza interior de manutenção a meio do verão mantêm a areia sob controlo.' },
      ],
    },
    en: {
      category: 'Interior',
      title: 'How to get beach sand out of your car interior',
      excerpt:
        'Sand gets everywhere and is hard to remove. Here are the techniques we use to leave interiors spotless after a summer of beach trips.',
      metaDescription:
        'Getting beach sand out of your car: why it is so hard and the professional techniques to remove sand from mats, seats and crevices.',
      readingMinutes: 4,
      body: [
        { type: 'p', text: 'Anyone who spends summer in the Algarve knows the problem well: no matter how much you shake the towels, beach sand always ends up inside the car — in the mats, between the seats and in impossible corners.' },
        { type: 'h2', text: 'Why it is so hard to remove' },
        { type: 'p', text: 'The fine sand of Algarve beaches is abrasive and tiny. It works into the weave of mats and fabrics, where a normal household vacuum cannot reach with enough power. Worse: scrubbing seats turns sand into sandpaper that can damage fabrics and plastics.' },
        { type: 'h2', text: 'What to do at home' },
        { type: 'ul', items: [
          'Take the mats out and shake them well, upside down',
          'Vacuum from the outside in, at the highest power available',
          'Use a brush to loosen sand from seams before vacuuming',
          'Avoid dry scrubbing — it spreads sand and scratches surfaces',
        ] },
        { type: 'h2', text: 'What makes the professional difference' },
        { type: 'p', text: 'We use high-power extraction with fine nozzles that reach the seat rails and joints. We combine it with specific brushes that release ground-in sand and, when needed, injection extraction for fabrics. The result is a truly clean interior, not just clean on the surface.' },
        { type: 'h2', text: 'Prevent it for next summer' },
        { type: 'p', text: 'Rubber mats instead of fabric, shaking off your shoes before getting in, and a mid-summer maintenance interior clean keep sand under control.' },
      ],
    },
  },
  {
    slug: 'farois-amarelados-causas-solucao',
    date: '2026-06-18',
    cover: '/blog/farois-amarelados.jpg',
    relatedService: 'headlight-restoration',
    pt: {
      category: 'Restauro',
      title: 'Faróis amarelados: porque acontece e como resolver',
      excerpt:
        'Faróis baços reduzem a visibilidade e envelhecem o carro. Explicamos a causa e como o restauro devolve a transparência — sem trocar o farol.',
      metaDescription:
        'Faróis amarelados: causas (UV, oxidação) e como o restauro de faróis devolve transparência, visibilidade e segurança sem substituir o farol.',
      readingMinutes: 3,
      body: [
        { type: 'p', text: 'Os faróis modernos são feitos de policarbonato, um plástico resistente mas sensível aos raios UV. Com os anos de sol — e no Algarve são muitos — a camada protetora degrada-se e o farol fica amarelado e baço.' },
        { type: 'h2', text: 'Porque é um problema de segurança' },
        { type: 'p', text: 'Um farol oxidado pode reduzir a luz projetada na estrada até 60%. Isto significa menos visibilidade na condução noturna e maior risco — além do aspeto envelhecido que tira valor ao carro.' },
        { type: 'h2', text: 'Soluções caseiras: funcionam?' },
        { type: 'p', text: 'Truques como pasta de dentes ou repelente de insetos dão um efeito momentâneo, mas não removem a oxidação a sério e não protegem. Em dias ou semanas, o amarelo volta — e por vezes pior.' },
        { type: 'h2', text: 'O restauro profissional' },
        { type: 'ul', items: [
          'Lixagem progressiva que remove a camada oxidada',
          'Polimento que devolve a transparência cristalina',
          'Selante UV que atrasa o reaparecimento do amarelo',
          'Resultado imediato e visível, em menos de uma hora',
        ] },
        { type: 'h2', text: 'Vale a pena?' },
        { type: 'p', text: 'O restauro custa uma fração de um farol novo e resolve a esmagadora maioria dos casos. Só faz sentido substituir se o farol estiver fissurado por dentro ou com humidade interna.' },
      ],
    },
    en: {
      category: 'Restoration',
      title: 'Yellowed headlights: why it happens and how to fix it',
      excerpt:
        'Hazy headlights cut visibility and age the car. We explain the cause and how restoration brings back clarity — without replacing the unit.',
      metaDescription:
        'Yellowed headlights: causes (UV, oxidation) and how headlight restoration brings back clarity, visibility and safety without replacing the unit.',
      readingMinutes: 3,
      body: [
        { type: 'p', text: 'Modern headlights are made of polycarbonate, a tough plastic that is sensitive to UV. After years of sun — and the Algarve has plenty — the protective layer breaks down and the headlight turns yellow and hazy.' },
        { type: 'h2', text: 'Why it is a safety issue' },
        { type: 'p', text: 'An oxidised headlight can cut the light projected onto the road by up to 60%. That means less visibility at night and greater risk — on top of the aged look that lowers the car’s value.' },
        { type: 'h2', text: 'Home remedies: do they work?' },
        { type: 'p', text: 'Tricks like toothpaste or insect repellent give a momentary effect, but they do not properly remove oxidation and offer no protection. Within days or weeks the yellowing returns — sometimes worse.' },
        { type: 'h2', text: 'Professional restoration' },
        { type: 'ul', items: [
          'Progressive sanding that removes the oxidised layer',
          'Polishing that restores crystal-clear clarity',
          'A UV sealant that delays the yellowing returning',
          'Instant, visible results in under an hour',
        ] },
        { type: 'h2', text: 'Is it worth it?' },
        { type: 'p', text: 'Restoration costs a fraction of a new headlight and solves the vast majority of cases. Replacement only makes sense if the headlight is cracked inside or has internal moisture.' },
      ],
    },
  },
  {
    slug: 'erros-lavar-carro-em-casa',
    date: '2026-06-24',
    cover: '/blog/erros-lavar-casa.jpg',
    relatedService: 'exterior-detailing',
    pt: {
      category: 'Dicas',
      title: '5 erros comuns ao lavar o carro em casa',
      excerpt:
        'Lavar mal o carro enche a pintura de micro-riscos. Veja os 5 erros mais comuns e como evitá-los para preservar o brilho.',
      metaDescription:
        '5 erros comuns ao lavar o carro em casa que riscam a pintura — e como evitá-los: método dos dois baldes, microfibras e mais.',
      readingMinutes: 4,
      body: [
        { type: 'p', text: 'Lavar o carro em casa pode parecer inofensivo, mas a maioria dos micro-riscos (os chamados swirls) nasce precisamente de uma lavagem mal feita. Eis os erros mais comuns — e como evitá-los.' },
        { type: 'h2', text: '1. Usar um único balde' },
        { type: 'p', text: 'Quando mergulha a esponja suja no mesmo balde, está a esfregar a pintura com a sujidade que acabou de tirar. Use o método dos dois baldes: um com champô, outro só com água limpa para enxaguar a luva.' },
        { type: 'h2', text: '2. Lavar ao sol' },
        { type: 'p', text: 'O champô e a água secam antes de os remover e deixam marcas de minerais. Lave sempre à sombra e com a superfície fria.' },
        { type: 'h2', text: '3. Esponjas e panos velhos' },
        { type: 'p', text: 'Esponjas comuns arrastam partículas que riscam. Use luvas e toalhas de microfibra limpas, que prendem a sujidade em vez de a arrastar pela pintura.' },
        { type: 'h2', text: '4. Detergente da loiça' },
        { type: 'p', text: 'É demasiado agressivo: remove a cera de proteção e resseca borrachas e plásticos. Use champô automóvel com pH equilibrado.' },
        { type: 'h2', text: '5. Secar ao ar (ou com pano errado)' },
        { type: 'p', text: 'Deixar secar ao ar deixa marcas de água; secar com panos ásperos risca. Use uma microfibra de secagem grande e macia, sem esfregar.' },
        { type: 'h2', text: 'Em resumo' },
        { type: 'p', text: 'Lavar bem dá trabalho e exige material adequado. Se quiser garantir um resultado seguro e sem riscos, uma lavagem detalhada profissional protege a pintura e poupa-lhe tempo.' },
      ],
    },
    en: {
      category: 'Tips',
      title: '5 common mistakes when washing your car at home',
      excerpt:
        'Washing your car badly fills the paint with micro-scratches. Here are the 5 most common mistakes and how to avoid them to keep the shine.',
      metaDescription:
        '5 common car-washing mistakes at home that scratch your paint — and how to avoid them: two-bucket method, microfibre and more.',
      readingMinutes: 4,
      body: [
        { type: 'p', text: 'Washing your car at home may seem harmless, but most micro-scratches (so-called swirls) come precisely from a poorly done wash. Here are the most common mistakes — and how to avoid them.' },
        { type: 'h2', text: '1. Using a single bucket' },
        { type: 'p', text: 'When you dip a dirty sponge back into the same bucket, you are scrubbing the paint with the dirt you just removed. Use the two-bucket method: one with shampoo, one with clean water to rinse the mitt.' },
        { type: 'h2', text: '2. Washing in the sun' },
        { type: 'p', text: 'Shampoo and water dry before you remove them and leave mineral marks. Always wash in the shade with a cool surface.' },
        { type: 'h2', text: '3. Old sponges and cloths' },
        { type: 'p', text: 'Regular sponges drag particles that scratch. Use clean microfibre mitts and towels, which trap dirt instead of dragging it across the paint.' },
        { type: 'h2', text: '4. Dish soap' },
        { type: 'p', text: 'It is too aggressive: it strips protective wax and dries out rubbers and plastics. Use a pH-balanced car shampoo.' },
        { type: 'h2', text: '5. Air drying (or the wrong cloth)' },
        { type: 'p', text: 'Letting it air-dry leaves water marks; drying with rough cloths scratches. Use a large, soft drying microfibre, without scrubbing.' },
        { type: 'h2', text: 'In short' },
        { type: 'p', text: 'Washing well takes effort and the right kit. If you want a safe, swirl-free result, a professional detailed wash protects the paint and saves you time.' },
      ],
    },
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Newest first. */
export const SORTED_ARTICLES = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));

export const ARTICLE_SLUGS = ARTICLES.map((a) => a.slug);

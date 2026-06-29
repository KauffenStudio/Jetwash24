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
  {
    slug: 'revestimento-ceramico-vs-cera',
    date: '2026-06-08',
    cover: '/blog/proteger-pintura-verao.jpg',
    relatedService: 'paint-correction',
    pt: {
      category: 'Proteção',
      title: 'Revestimento cerâmico vs. cera: qual escolher no Algarve?',
      excerpt:
        'Cera, selante ou cerâmico? Comparamos durabilidade, proteção e custo para o sol e o sal do Algarve — e ajudamos a escolher.',
      metaDescription:
        'Revestimento cerâmico vs. cera no Algarve: durabilidade, proteção UV, repelência à água e custo comparados. Saiba qual compensa para o seu carro.',
      readingMinutes: 5,
      body: [
        { type: 'p', text: 'Proteger a pintura no Algarve não é luxo — é manutenção. Entre o sol intenso, o sal do mar e a poeira, a questão não é "se" deve proteger o verniz, mas "com quê". As três opções mais comuns são a cera, o selante e o revestimento cerâmico.' },
        { type: 'h2', text: 'Cera de carnaúba' },
        { type: 'p', text: 'Dá um brilho quente e profundo e é a opção mais barata, mas dura pouco — tipicamente 4 a 8 semanas, menos ainda com o calor do verão algarvio. É ótima para quem gosta de cuidar do carro com frequência, mas exige reaplicação constante.' },
        { type: 'h2', text: 'Selante sintético' },
        { type: 'p', text: 'Um passo acima: protege 4 a 6 meses, repele melhor a água e resiste mais ao calor e aos detergentes. É o equilíbrio sensato entre custo e durabilidade para o uso diário.' },
        { type: 'h2', text: 'Revestimento cerâmico' },
        { type: 'ul', items: [
          'Durabilidade de 1 a vários anos numa única aplicação',
          'Forte proteção UV — trava a oxidação e o desbotar da cor',
          'Repelência à água e à sujidade que facilita as lavagens',
          'Resiste a sal, insetos e excrementos de aves melhor que a cera',
        ] },
        { type: 'p', text: 'É o investimento inicial mais alto, mas o que mais compensa para quem deixa o carro ao sol e quer reduzir a manutenção ao longo do ano.' },
        { type: 'h2', text: 'A nossa recomendação' },
        { type: 'p', text: 'Para a maioria dos carros no Algarve, um selante de qualidade cobre bem as necessidades. Se o carro fica exposto ao sol e quer máxima proteção e menos lavagens, o cerâmico vale a pena. Em qualquer caso, a pintura deve ser corrigida e descontaminada antes — proteger por cima de imperfeições só as sela por baixo.' },
      ],
    },
    en: {
      category: 'Protection',
      title: 'Ceramic coating vs. wax: which to choose in the Algarve?',
      excerpt:
        'Wax, sealant or ceramic? We compare durability, protection and cost for the Algarve sun and salt — and help you choose.',
      metaDescription:
        'Ceramic coating vs. wax in the Algarve: durability, UV protection, water repellency and cost compared. Find out which is worth it for your car.',
      readingMinutes: 5,
      body: [
        { type: 'p', text: 'Protecting your paint in the Algarve isn’t a luxury — it’s maintenance. Between intense sun, sea salt and dust, the question isn’t whether to protect the clear coat, but with what. The three most common options are wax, sealant and ceramic coating.' },
        { type: 'h2', text: 'Carnauba wax' },
        { type: 'p', text: 'It gives a warm, deep shine and is the cheapest option, but it doesn’t last long — typically 4 to 8 weeks, even less in the Algarve summer heat. Great if you enjoy frequent upkeep, but it needs constant reapplication.' },
        { type: 'h2', text: 'Synthetic sealant' },
        { type: 'p', text: 'A step up: it protects for 4 to 6 months, repels water better and stands up to heat and detergents. It’s the sensible balance of cost and durability for daily use.' },
        { type: 'h2', text: 'Ceramic coating' },
        { type: 'ul', items: [
          'Lasts from 1 to several years from a single application',
          'Strong UV protection — slows oxidation and colour fade',
          'Water and dirt repellency that makes washing easier',
          'Resists salt, insects and bird droppings better than wax',
        ] },
        { type: 'p', text: 'It’s the highest upfront cost, but the one that pays off most if your car sits in the sun and you want to cut down on maintenance through the year.' },
        { type: 'h2', text: 'Our recommendation' },
        { type: 'p', text: 'For most cars in the Algarve, a quality sealant covers your needs well. If the car is exposed to the sun and you want maximum protection and fewer washes, ceramic is worth it. Either way, the paint should be corrected and decontaminated first — protecting over imperfections just locks them in underneath.' },
      ],
    },
  },
  {
    slug: 'cuidar-bancos-pele-calor-algarve',
    date: '2026-06-13',
    cover: '/blog/tirar-areia-interior.jpg',
    relatedService: 'interior-detailing',
    pt: {
      category: 'Interior',
      title: 'Como cuidar dos bancos em pele no calor do Algarve',
      excerpt:
        'O calor resseca e estala o couro. Veja como limpar, hidratar e proteger os bancos em pele para durarem anos no clima algarvio.',
      metaDescription:
        'Cuidar de bancos em pele no Algarve: porque o calor resseca o couro, com que frequência hidratar e os erros a evitar para não estalar.',
      readingMinutes: 4,
      body: [
        { type: 'p', text: 'Bancos em pele dão classe ao interior, mas no Algarve são dos materiais que mais sofrem. O calor dentro de um carro ao sol ultrapassa facilmente os 60 °C, e isso resseca o couro, faz perder cor e, com o tempo, leva a fissuras e estalados que já não têm volta.' },
        { type: 'h2', text: 'Porque o couro estala' },
        { type: 'p', text: 'A pele tem óleos naturais que a mantêm flexível. O calor e os raios UV evaporam esses óleos; sem hidratação, a superfície torna-se rígida e racha nos pontos de maior tensão — assentos e laterais.' },
        { type: 'h2', text: 'A rotina certa' },
        { type: 'ul', items: [
          'Limpe o pó e a sujidade com um produto próprio para couro (não detergentes agressivos)',
          'Hidrate com um condicionador de pele a cada 2 a 3 meses no verão',
          'Use parassol e, se possível, estacione à sombra',
          'Limpe de imediato suor, protetor solar e bebidas — mancham e degradam',
        ] },
        { type: 'h2', text: 'Erros comuns' },
        { type: 'p', text: 'Produtos multiusos e álcool retiram os óleos e aceleram o ressecamento. Demasiado condicionador deixa a superfície oleosa e escorregadia. O equilíbrio é limpar bem e hidratar com moderação, sempre com produtos próprios.' },
        { type: 'h2', text: 'Quando vale a pena profissional' },
        { type: 'p', text: 'Se o couro já está baço, manchado ou a começar a estalar, uma restauração de interior limpa em profundidade, hidrata e devolve cor e toque antes que o dano seja permanente. É bem mais barato do que substituir os bancos.' },
      ],
    },
    en: {
      category: 'Interior',
      title: 'How to care for leather seats in the Algarve heat',
      excerpt:
        'Heat dries out and cracks leather. Here’s how to clean, condition and protect leather seats so they last for years in the Algarve climate.',
      metaDescription:
        'Caring for leather seats in the Algarve: why heat dries leather out, how often to condition, and the mistakes to avoid so it doesn’t crack.',
      readingMinutes: 4,
      body: [
        { type: 'p', text: 'Leather seats add class to an interior, but in the Algarve they’re one of the materials that suffer most. The temperature inside a car in the sun easily passes 60 °C, and that dries out the leather, fades the colour and, over time, leads to cracks and splits that can’t be undone.' },
        { type: 'h2', text: 'Why leather cracks' },
        { type: 'p', text: 'Leather has natural oils that keep it supple. Heat and UV evaporate those oils; without conditioning, the surface stiffens and cracks at the highest-stress points — seat bases and bolsters.' },
        { type: 'h2', text: 'The right routine' },
        { type: 'ul', items: [
          'Clean off dust and dirt with a dedicated leather product (not harsh detergents)',
          'Condition with a leather conditioner every 2 to 3 months in summer',
          'Use a sunshade and park in the shade where you can',
          'Wipe up sweat, suncream and drinks straight away — they stain and degrade',
        ] },
        { type: 'h2', text: 'Common mistakes' },
        { type: 'p', text: 'All-purpose cleaners and alcohol strip the oils and speed up drying. Too much conditioner leaves the surface oily and slippery. The balance is to clean well and condition in moderation, always with dedicated products.' },
        { type: 'h2', text: 'When a professional is worth it' },
        { type: 'p', text: 'If the leather is already dull, stained or starting to crack, an interior restoration deep-cleans, conditions and brings back colour and feel before the damage becomes permanent. It’s far cheaper than replacing the seats.' },
      ],
    },
  },
  {
    slug: 'lavar-mao-vs-maquina-rolos',
    date: '2026-06-18',
    cover: '/blog/erros-lavar-casa.jpg',
    relatedService: 'exterior-detailing',
    pt: {
      category: 'Manutenção',
      title: 'Lavar o carro à mão vs. máquina de rolos: o que é melhor?',
      excerpt:
        'As máquinas de rolos são rápidas e baratas, mas riscam a pintura. Comparamos com a lavagem à mão e explicamos quando vale a pena cada uma.',
      metaDescription:
        'Lavagem à mão vs. máquina de rolos: qual risca menos a pintura, qual limpa melhor e quando compensa cada opção. Guia prático para o Algarve.',
      readingMinutes: 4,
      body: [
        { type: 'p', text: 'A máquina de rolos é tentadora: cinco minutos, alguns euros e o carro sai molhado e aparentemente limpo. Mas "aparentemente" é a palavra-chave — e a longo prazo pode sair caro à pintura.' },
        { type: 'h2', text: 'O problema das máquinas de rolos' },
        { type: 'ul', items: [
          'As escovas arrastam areia e sujidade de outros carros pela sua pintura',
          'Isso cria swirls e micro-riscos visíveis ao sol',
          'Não chegam a recantos, frisos e jantes como deve ser',
          'Detergentes agressivos podem remover proteção e ressecar borrachas',
        ] },
        { type: 'h2', text: 'Porque a lavagem à mão ganha' },
        { type: 'p', text: 'Uma lavagem à mão bem feita usa o método de dois baldes e luvas de microfibra macias, removendo a sujidade sem a esfregar contra o verniz. O resultado é mais seguro, mais completo e respeita a proteção da pintura.' },
        { type: 'h2', text: 'Quando a máquina serve' },
        { type: 'p', text: 'Num carro mais antigo, de trabalho, em que o aspeto não é prioridade, a máquina de rolos resolve. Para qualquer carro que queira manter bonito e valorizado, não compensa o risco.' },
        { type: 'h2', text: 'A alternativa inteligente' },
        { type: 'p', text: 'Alterne lavagens à mão de manutenção com um detailing exterior detalhado de tempos a tempos, que descontamina a pintura e renova a proteção. É o que mantém o verniz sem swirls e a brilhar todo o ano.' },
      ],
    },
    en: {
      category: 'Maintenance',
      title: 'Hand wash vs. rollover car wash: which is better?',
      excerpt:
        'Rollover washes are fast and cheap, but they scratch the paint. We compare them with hand washing and explain when each makes sense.',
      metaDescription:
        'Hand wash vs. rollover car wash: which scratches less, which cleans better and when each is worth it. A practical guide for the Algarve.',
      readingMinutes: 4,
      body: [
        { type: 'p', text: 'The rollover wash is tempting: five minutes, a few euros and the car comes out wet and seemingly clean. But "seemingly" is the key word — and over time it can cost the paint dearly.' },
        { type: 'h2', text: 'The problem with rollover washes' },
        { type: 'ul', items: [
          'The brushes drag sand and dirt from other cars across your paint',
          'That creates swirls and micro-scratches visible in the sun',
          'They don’t properly reach nooks, trims and wheels',
          'Harsh detergents can strip protection and dry out rubber seals',
        ] },
        { type: 'h2', text: 'Why hand washing wins' },
        { type: 'p', text: 'A proper hand wash uses the two-bucket method and soft microfibre mitts, lifting dirt away rather than grinding it against the clear coat. The result is safer, more thorough and respects the paint’s protection.' },
        { type: 'h2', text: 'When the machine is fine' },
        { type: 'p', text: 'On an older, work car where looks aren’t a priority, the rollover does the job. For any car you want to keep looking good and holding its value, the risk isn’t worth it.' },
        { type: 'h2', text: 'The smart alternative' },
        { type: 'p', text: 'Alternate maintenance hand washes with a detailed exterior detail every so often, which decontaminates the paint and renews protection. That’s what keeps the clear coat swirl-free and shining all year.' },
      ],
    },
  },
  {
    slug: 'detailing-antes-de-vender-carro',
    date: '2026-06-23',
    cover: '/blog/frequencia-lavar-carro.jpg',
    relatedService: 'complete-package',
    pt: {
      category: 'Dicas',
      title: 'Vale a pena fazer detailing antes de vender o carro?',
      excerpt:
        'Um carro impecável vende mais depressa e por mais dinheiro. Veja o retorno real de um detailing antes da venda e por onde começar.',
      metaDescription:
        'Detailing antes de vender o carro: quanto pode valorizar a venda, que serviços fazem mais diferença e se compensa o investimento.',
      readingMinutes: 4,
      body: [
        { type: 'p', text: 'A primeira impressão vende. Quando um comprador abre a porta e o interior cheira a limpo, os plásticos brilham e a pintura está sem marcas, a perceção de valor sobe — e a margem de negociação desce a seu favor.' },
        { type: 'h2', text: 'O retorno é real' },
        { type: 'p', text: 'Um detailing completo custa uma fração do que pode acrescentar ao preço de venda. Carros bem apresentados vendem mais depressa e seguram melhor o valor pedido, porque transmitem que foram cuidados — algo que tranquiliza qualquer comprador.' },
        { type: 'h2', text: 'O que faz mais diferença' },
        { type: 'ul', items: [
          'Interior detalhado — bancos, tapetes e cheiro a novo são o que mais impressiona',
          'Restauro de faróis — faróis transparentes rejuvenescem a frente do carro',
          'Correção de pintura — remove swirls e devolve brilho à cor',
          'Limpeza de jantes e pneus — o detalhe que fecha a boa impressão',
        ] },
        { type: 'h2', text: 'Fotos que vendem' },
        { type: 'p', text: 'A maioria das vendas começa online. Um carro detalhado fotografa muito melhor: a pintura reflete, o interior parece novo e o anúncio destaca-se entre dezenas de outros. Mais cliques significam vender mais depressa.' },
        { type: 'h2', text: 'Por onde começar' },
        { type: 'p', text: 'Para vender, o pacote completo é geralmente o que mais compensa — trata interior e exterior de uma vez. Se o orçamento for curto, priorize o interior e os faróis, que são o que o comprador mais nota.' },
      ],
    },
    en: {
      category: 'Tips',
      title: 'Is it worth detailing your car before selling it?',
      excerpt:
        'A spotless car sells faster and for more. Here’s the real return of detailing before a sale and where to start.',
      metaDescription:
        'Detailing before selling your car: how much it can add to the sale, which services make the biggest difference and whether it pays off.',
      readingMinutes: 4,
      body: [
        { type: 'p', text: 'First impressions sell. When a buyer opens the door and the interior smells clean, the plastics shine and the paint is mark-free, perceived value goes up — and the negotiation tips in your favour.' },
        { type: 'h2', text: 'The return is real' },
        { type: 'p', text: 'A full detail costs a fraction of what it can add to the sale price. Well-presented cars sell faster and hold their asking price better, because they signal that they’ve been looked after — something that reassures any buyer.' },
        { type: 'h2', text: 'What makes the biggest difference' },
        { type: 'ul', items: [
          'Detailed interior — fresh seats, mats and smell are what impress most',
          'Headlight restoration — clear headlights rejuvenate the front of the car',
          'Paint correction — removes swirls and brings the colour’s shine back',
          'Wheel and tyre cleaning — the detail that completes the impression',
        ] },
        { type: 'h2', text: 'Photos that sell' },
        { type: 'p', text: 'Most sales start online. A detailed car photographs far better: the paint reflects, the interior looks new and the listing stands out among dozens of others. More clicks means a faster sale.' },
        { type: 'h2', text: 'Where to start' },
        { type: 'p', text: 'For selling, the complete package is usually the best value — it covers interior and exterior in one go. On a tight budget, prioritise the interior and the headlights, which are what buyers notice most.' },
      ],
    },
  },
  {
    slug: 'o-que-e-correcao-de-pintura',
    date: '2026-06-27',
    cover: '/blog/farois-amarelados.jpg',
    relatedService: 'paint-correction',
    pt: {
      category: 'Detailing',
      title: 'O que é a correção de pintura e quando precisa dela',
      excerpt:
        'Swirls, riscos e pintura baça têm solução. Explicamos o que é a correção de pintura, como funciona e quando vale a pena.',
      metaDescription:
        'Correção de pintura explicada: o que são swirls e riscos, como funciona o polimento por etapas e quando o seu carro precisa de correção.',
      readingMinutes: 5,
      body: [
        { type: 'p', text: 'Já reparou que, ao sol, a pintura do carro mostra uma teia de riscos circulares? Chamam-se swirls, e são o resultado de lavagens mal feitas, máquinas de rolos e panos errados. A correção de pintura é o processo que os remove de verdade — não os esconde.' },
        { type: 'h2', text: 'O que são swirls e marcas' },
        { type: 'p', text: 'O verniz é uma camada transparente fina por cima da cor. Pequenos riscos nessa camada refletem a luz em todas as direções, dando aquele aspeto baço e "riscado". A maioria está só no verniz — e é aí que a correção atua.' },
        { type: 'h2', text: 'Como funciona' },
        { type: 'ul', items: [
          'Lava-se e descontamina-se a pintura para tirar toda a sujidade aderente',
          'Com máquina de polir e abrasivos, remove-se uma camada microscópica de verniz',
          'Isso nivela os riscos, em vez de os tapar temporariamente',
          'Aplica-se proteção para selar a pintura no seu melhor estado',
        ] },
        { type: 'h2', text: 'Correção vs. cera de disfarce' },
        { type: 'p', text: 'Ceras e "polishes" de loja preenchem os riscos por umas semanas e depois eles voltam. A correção remove-os de forma permanente (até à próxima vez que se risquem). É a diferença entre maquilhar e tratar.' },
        { type: 'h2', text: 'Quando precisa de correção' },
        { type: 'p', text: 'Se a pintura está baça, cheia de swirls ao sol, ou se vai aplicar um revestimento cerâmico, vale a pena corrigir primeiro. Não faz sentido selar imperfeições por baixo de uma proteção que vai durar anos.' },
        { type: 'h2', text: 'Um aviso importante' },
        { type: 'p', text: 'O verniz é fino e limitado — corrigir em excesso ou com técnica errada pode danificá-lo. Por isso a correção de pintura deve ser feita por quem sabe avaliar a espessura e escolher o passo certo para cada carro.' },
      ],
    },
    en: {
      category: 'Detailing',
      title: 'What is paint correction and when do you need it?',
      excerpt:
        'Swirls, scratches and dull paint can be fixed. We explain what paint correction is, how it works and when it’s worth it.',
      metaDescription:
        'Paint correction explained: what swirls and scratches are, how multi-stage polishing works and when your car needs correction.',
      readingMinutes: 5,
      body: [
        { type: 'p', text: 'Ever noticed that, in the sun, your car’s paint shows a web of circular scratches? They’re called swirls, and they come from poor washing, rollover machines and the wrong cloths. Paint correction is the process that genuinely removes them — it doesn’t just hide them.' },
        { type: 'h2', text: 'What swirls and marks are' },
        { type: 'p', text: 'Clear coat is a thin transparent layer over the colour. Tiny scratches in that layer reflect light in every direction, giving that dull, "scratched" look. Most of them sit only in the clear coat — and that’s where correction works.' },
        { type: 'h2', text: 'How it works' },
        { type: 'ul', items: [
          'The paint is washed and decontaminated to remove all bonded dirt',
          'With a polishing machine and abrasives, a microscopic layer of clear coat is removed',
          'This levels the scratches, instead of covering them temporarily',
          'Protection is applied to seal the paint at its best',
        ] },
        { type: 'h2', text: 'Correction vs. cover-up wax' },
        { type: 'p', text: 'Shop waxes and "polishes" fill scratches for a few weeks and then they’re back. Correction removes them permanently (until they’re scratched again). It’s the difference between make-up and treatment.' },
        { type: 'h2', text: 'When you need correction' },
        { type: 'p', text: 'If the paint is dull, full of swirls in the sun, or you’re about to apply a ceramic coating, it’s worth correcting first. There’s no point sealing imperfections under protection that will last for years.' },
        { type: 'h2', text: 'An important warning' },
        { type: 'p', text: 'Clear coat is thin and finite — over-correcting or using the wrong technique can damage it. That’s why paint correction should be done by someone who can judge the thickness and choose the right step for each car.' },
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

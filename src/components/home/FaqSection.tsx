import { getLocale } from 'next-intl/server';
import { HOME_FAQ } from '@/content/faq';
import FaqAccordion from '@/components/ui/FaqAccordion';
import FaqSchema from '@/components/seo/FaqSchema';
import Reveal from '@/components/ui/Reveal';

export default async function FaqSection() {
  const locale = await getLocale();
  const isPt = locale === 'pt';
  const items = isPt ? HOME_FAQ.pt : HOME_FAQ.en;

  return (
    <section id="faq" className="py-24 bg-white">
      <FaqSchema items={items} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-12">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">
            {isPt ? 'Perguntas Frequentes' : 'Frequently Asked'}
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-black">
            {isPt ? 'Tudo o que precisa de saber' : 'Everything you need to know'}
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <FaqAccordion items={items} />
        </Reveal>
      </div>
    </section>
  );
}

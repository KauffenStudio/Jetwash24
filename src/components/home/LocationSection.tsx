import { useTranslations } from 'next-intl';

export default function LocationSection() {
  const t = useTranslations('location');

  const googleMapsUrl = 'https://maps.app.goo.gl/pP9NLzLJMNvBpoL19';
  const embedUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d424.0!2d-8.2733417!3d37.1286649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1acf577a43e0c5%3A0x10c71f9cc1de2b20!2sJetWash24%20-%20Lavagem%20Autom%C3%B3vel!5e0!3m2!1spt!2spt!4v1742600000000!5m2!1spt!2spt';

  return (
    <section id="location" className="py-24 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">{t('directions')}</p>
          <h2 className="text-4xl sm:text-5xl font-black text-black">{t('title')}</h2>
          <p className="text-surface-500 mt-4">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Info panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Address */}
            <div>
              <p className="text-xs font-semibold tracking-widest text-surface-400 uppercase mb-3">{t('address')}</p>
              <div className="space-y-1">
                <p className="font-bold text-black text-lg">JetWash24 Detailing</p>
                <p className="text-surface-600">N125 610</p>
                <p className="text-surface-600">8800-076 Guia</p>
                <p className="text-surface-600">Algarve, Portugal</p>
              </div>
              {/* Near shopping badge */}
              <div className="mt-4 inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#C9A84C"/>
                </svg>
                <span className="text-gold text-sm font-medium">{t('nearShopping')}</span>
              </div>
            </div>

            {/* Hours */}
            <div>
              <p className="text-xs font-semibold tracking-widest text-surface-400 uppercase mb-3">{t('hours')}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-surface-600">Seg – Dom</span>
                  <span className="font-semibold text-black">09:00 – 17:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-green-600 text-sm font-medium">
                    {new Date().getHours() >= 9 && new Date().getHours() < 17
                      ? 'Aberto agora'
                      : 'Fechado agora'}
                  </span>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <p className="text-xs font-semibold tracking-widest text-surface-400 uppercase mb-3">{t('phone')}</p>
              <a href="tel:+351928380478" className="text-black font-semibold hover:text-gold transition-colors">
                +351 928 380 478
              </a>
            </div>

            {/* CTA */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded hover:bg-surface-800 transition-colors duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {t('openMaps')}
            </a>
          </div>

          {/* Map */}
          <div className="lg:col-span-3 rounded-lg overflow-hidden shadow-lg border border-surface-200 h-[400px] lg:h-[500px]">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="JetWash24 Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <p className="text-2xl font-black tracking-widest mb-3">
              JETWASH<span className="text-gold">24</span>
            </p>
            <p className="text-white/50 text-sm leading-relaxed">{t('tagline')}</p>
            <div className="mt-4 space-y-1">
              <p className="text-white/40 text-xs">N125 610, 8800-076 Guia</p>
              <p className="text-white/40 text-xs">Algarve, Portugal</p>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">{t('links')}</p>
            <nav className="space-y-3">
              <Link href={`/${locale}/services`} className="block text-white/70 hover:text-white text-sm transition-colors">
                {locale === 'pt' ? 'Serviços' : 'Services'}
              </Link>
              <Link href={`/${locale}/blog`} className="block text-white/70 hover:text-white text-sm transition-colors">
                Blog
              </Link>
              <a href={`/${locale}#gallery`} className="block text-white/70 hover:text-white text-sm transition-colors">
                {locale === 'pt' ? 'Galeria' : 'Gallery'}
              </a>
              <Link href={`/${locale}/booking`} className="block text-white/70 hover:text-white text-sm transition-colors">
                {locale === 'pt' ? 'Reservar' : 'Book Now'}
              </Link>
              <a href={`/${locale}#location`} className="block text-white/70 hover:text-white text-sm transition-colors">
                {locale === 'pt' ? 'Localização' : 'Location'}
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">{t('contact')}</p>
            <div className="space-y-3">
              <a
                href="https://wa.me/351928380478"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                <span className="text-green-400">WhatsApp</span>
                <span>+351 928 380 478</span>
              </a>
              <a
                href="mailto:jetwash24detailing@gmail.com"
                className="block text-sm text-white/70 hover:text-white transition-colors"
              >
                jetwash24detailing@gmail.com
              </a>
              <p className="text-sm text-white/40">
                {locale === 'pt' ? 'Todos os dias: 09:00 – 17:00' : 'Every day: 09:00 – 17:00'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {year} JetWash24 Detailing. {t('rights')}.
          </p>
          <a
            href="https://kauffen.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] font-light tracking-[0.15em] uppercase text-white/30 hover:text-white/60 transition-colors duration-300 no-underline"
          >
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" aria-hidden="true">
              <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 6.5" className="animate-crafted-spin-a origin-center"/>
              <circle cx="16" cy="16" r="6.5" stroke="currentColor" strokeWidth="1.1" strokeDasharray="5.5 5" className="animate-crafted-spin-b origin-center"/>
              <circle cx="16" cy="16" r="1.6" fill="currentColor"/>
            </svg>
            <span>Crafted by Kauffen Studios</span>
          </a>
          <p className="text-white/20 text-xs">
            jetwash24.com
          </p>
        </div>
      </div>
    </footer>
  );
}

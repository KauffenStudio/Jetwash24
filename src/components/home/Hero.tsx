import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] overflow-hidden">
      {/* Background gradient decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Tagline */}
        <p className="text-gold text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase mb-6 animate-fade-in">
          {t('tagline')}
        </p>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-[0.95] tracking-tight mb-8 animate-slide-up">
          {t('headline')}
        </h1>

        {/* Description */}
        <p className="text-white/50 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up">
          {t('description')}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
          <Link
            href={`/${locale}/booking`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold text-black font-bold text-base tracking-wide rounded hover:bg-gold-light transition-all duration-200 hover:scale-105"
          >
            {t('cta')}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <a
            href={`/${locale}#services`}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-medium text-base tracking-wide rounded hover:border-white/50 hover:bg-white/5 transition-all duration-200"
          >
            {t('scrollDown')}
          </a>
        </div>

        {/* Stats strip */}
        <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-3 gap-8">
          {[
            { value: '100%', label: locale === 'pt' ? 'Resultados garantidos' : 'Results guaranteed' },
            { value: '5★', label: locale === 'pt' ? 'Avaliação dos clientes' : 'Customer rating' },
            { value: '1 dia', label: locale === 'pt' ? 'Reserva online' : 'Online booking' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-black text-white">{stat.value}</p>
              <p className="text-white/40 text-xs sm:text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/30" />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 6L8 11L13 6" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}

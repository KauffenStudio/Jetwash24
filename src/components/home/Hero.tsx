import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import HeroVideo from './HeroVideo';

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] overflow-hidden">

      {/* ── Video background ─────────────────────────────────────────── */}
      <HeroVideo />

      {/* ── Cinematic overlays ───────────────────────────────────────── */}

      {/* Top vignette */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

      {/* Side vignettes */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0A0A0A]/60 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0A0A0A]/60 to-transparent z-10 pointer-events-none" />

      {/* Film grain texture */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Gold horizontal scan line */}
      <div
        className="absolute inset-x-0 z-10 pointer-events-none"
        style={{
          height: '1px',
          top: '50%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.15) 30%, rgba(201,168,76,0.4) 50%, rgba(201,168,76,0.15) 70%, transparent 100%)',
        }}
      />

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="relative z-20 text-center px-4 sm:px-6 max-w-5xl mx-auto">

        {/* Tagline */}
        <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
          <div className="h-px w-8 bg-gold/60" />
          <p className="text-gold text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase">
            {t('tagline')}
          </p>
          <div className="h-px w-8 bg-gold/60" />
        </div>

        {/* Main headline */}
        <h1
          className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-[0.92] tracking-tight mb-8 animate-slide-up"
          style={{ textShadow: '0 4px 40px rgba(0,0,0,0.6)' }}
        >
          {t('headline')}
        </h1>

        {/* Description */}
        <p className="text-white/50 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10 animate-slide-up">
          {t('description')}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
          <Link
            href={`/${locale}/booking`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold text-black font-bold text-base tracking-wide rounded hover:bg-gold-light transition-all duration-200 hover:scale-105"
            style={{ boxShadow: '0 0 30px rgba(201,168,76,0.35)' }}
          >
            {t('cta')}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <a
            href={`/${locale}#services`}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-medium text-base tracking-wide rounded hover:border-white/50 hover:bg-white/5 transition-all duration-200 backdrop-blur-sm"
          >
            {t('scrollDown')}
          </a>
        </div>

        {/* Stats strip */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 sm:gap-8">
          {[
            { value: '100%', label: locale === 'pt' ? 'Satisfação garantida' : 'Satisfaction guaranteed' },
            { value: '5★', label: locale === 'pt' ? 'Avaliação' : 'Rating' },
            { value: locale === 'pt' ? 'Seg–Dom' : 'Mon–Sun', label: locale === 'pt' ? 'Aberto todos os dias' : 'Open every day' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl sm:text-3xl font-black text-white" style={{ textShadow: '0 0 20px rgba(201,168,76,0.3)' }}>
                {stat.value}
              </p>
              <p className="text-white/40 text-[11px] sm:text-sm mt-1 leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce z-20">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/30" />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 6L8 11L13 6" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}

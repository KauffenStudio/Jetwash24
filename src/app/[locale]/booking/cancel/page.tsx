import Link from 'next/link';

interface CancelPageProps {
  params: { locale: string };
}

export default function CancelPage({ params }: CancelPageProps) {
  const { locale } = params;

  const t = {
    title: locale === 'pt' ? 'Reserva Cancelada' : 'Booking Cancelled',
    desc: locale === 'pt'
      ? 'A sua reserva foi cancelada. Pode tentar novamente quando quiser.'
      : 'Your booking has been cancelled. You can try again whenever you like.',
    tryAgain: locale === 'pt' ? 'Tentar Novamente' : 'Try Again',
    backHome: locale === 'pt' ? 'Voltar ao Início' : 'Back to Home',
  };

  return (
    <div className="min-h-screen bg-white pt-20 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M10 10L26 26M26 10L10 26" stroke="#737373" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="text-3xl font-black text-black mb-4">{t.title}</h1>
        <p className="text-surface-400 mb-10">{t.desc}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/${locale}`} className="px-6 py-3 border border-surface-300 text-black font-semibold rounded hover:border-black transition-colors">
            {t.backHome}
          </Link>
          <Link href={`/${locale}/booking`} className="px-6 py-3 bg-black text-white font-semibold rounded hover:bg-surface-800 transition-colors">
            {t.tryAgain}
          </Link>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SessionProvider } from '@/components/providers/SessionProvider';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'JetWash24 | Detailing Profissional no Algarve',
    template: '%s | JetWash24 Detailing',
  },
  description:
    'Detailing profissional de interiores e exteriores em Guia, Algarve. Reserva online. A 3 minutos do Algarve Shopping.',
  keywords: [
    'car detailing algarve',
    'detailing guia',
    'limpeza carro algarve',
    'limpeza interior carro',
    'polish carro',
    'jetwash24',
  ],
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    alternateLocale: 'en_GB',
    siteName: 'JetWash24 Detailing',
    title: 'JetWash24 | Detailing Profissional no Algarve',
    description: 'Detailing profissional em Guia, Algarve. Reserve online.',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? 'https://jetwash24.com'),
};

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return [{ locale: 'pt' }, { locale: 'en' }];
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

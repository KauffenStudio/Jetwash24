import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SessionProvider } from '@/components/providers/SessionProvider';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import { SITE_URL, LOCALES } from '@/lib/seo/business';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

/** Google tag (gtag.js) — shared by GA4 and Google Ads conversion tracking. */
const GA_MEASUREMENT_ID = 'G-5CEH9TTQ3B';

/** Per-locale SEO copy so each language version is indexed on its own terms. */
const SEO = {
  pt: {
    title: 'JetWash24 | Detailing Profissional no Algarve',
    description:
      'Detailing profissional de interiores e exteriores em Guia, Algarve. Reserva online. A 3 minutos do Algarve Shopping.',
    ogTitle: 'JetWash24 | Detailing Profissional no Algarve',
    ogDescription: 'Detailing profissional em Guia, Algarve. Reserve online.',
    ogLocale: 'pt_PT',
    keywords: [
      'car detailing algarve',
      'detailing guia',
      'lavagem automóvel guia',
      'limpeza carro algarve',
      'limpeza interior carro',
      'polimento faróis algarve',
      'detailing albufeira',
      'jetwash24',
    ],
  },
  en: {
    title: 'JetWash24 | Professional Car Detailing in the Algarve',
    description:
      'Professional interior & exterior car detailing in Guia, Algarve. Book online. A 3-minute walk from Algarve Shopping.',
    ogTitle: 'JetWash24 | Professional Car Detailing in the Algarve',
    ogDescription: 'Professional car detailing in Guia, Algarve. Book online.',
    ogLocale: 'en_GB',
    keywords: [
      'car detailing algarve',
      'car detailing guia',
      'car wash guia',
      'car cleaning algarve',
      'interior car cleaning',
      'headlight restoration algarve',
      'car detailing albufeira',
      'jetwash24',
    ],
  },
} as const;

type LocaleKey = keyof typeof SEO;

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const key: LocaleKey = locale === 'en' ? 'en' : 'pt';
  const copy = SEO[key];

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: copy.title,
      template: '%s | JetWash24 Detailing',
    },
    description: copy.description,
    keywords: [...copy.keywords],
    alternates: {
      canonical: `/${key}`,
      languages: {
        'pt-PT': '/pt',
        'en-GB': '/en',
        'x-default': '/pt',
      },
    },
    openGraph: {
      type: 'website',
      locale: copy.ogLocale,
      alternateLocale: key === 'pt' ? 'en_GB' : 'pt_PT',
      siteName: 'JetWash24 Detailing',
      url: `${SITE_URL}/${key}`,
      title: copy.ogTitle,
      description: copy.ogDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.ogTitle,
      description: copy.ogDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
    // Bing Webmaster Tools site ownership. Set BING_SITE_VERIFICATION in Vercel
    // to the code Bing gives you (the value of the `content` attribute, not the
    // whole tag) and redeploy; the tag is omitted entirely when unset so we
    // never ship an empty meta. Not needed if you verify by importing from
    // Google Search Console, which carries ownership across automatically.
    ...(process.env.BING_SITE_VERIFICATION && {
      verification: {
        other: { 'msvalidate.01': process.env.BING_SITE_VERIFICATION },
      },
    }),
  };
}

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
  // The middleware matcher skips anything containing a dot, so requests like
  // /ads.txt or /foo.php reach this segment with `locale` set to that string.
  // Without this guard they rendered the home page at HTTP 200 — an unbounded
  // set of soft-404 duplicates of "/" that search engines can index.
  if (!LOCALES.includes(locale as (typeof LOCALES)[number])) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale === 'en' ? 'en-GB' : 'pt-PT'} className={inter.variable}>
      <body className={inter.className}>
        {/* Google tag (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <LocalBusinessSchema locale={locale} />
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

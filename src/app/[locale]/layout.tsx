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
import SummerPromoPopup from '@/components/promo/SummerPromoPopup';
import { CartProvider } from '@/components/shop/CartProvider';
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
    title: 'JetWash24 | Produtos de Limpeza Auto e Detailing no Algarve',
    description:
      'Loja de produtos de limpeza automóvel e acessórios de detailing, com portes grátis para toda a União Europeia. Centro de detailing em Guia, Albufeira.',
    ogTitle: 'JetWash24 | Produtos de Limpeza Auto e Detailing',
    ogDescription:
      'Produtos de limpeza auto e acessórios de detailing com portes grátis para toda a Europa. Detailing profissional em Guia, Algarve.',
    ogLocale: 'pt_PT',
    keywords: [
      'produtos de limpeza auto',
      'produtos detailing europa',
      'produtos detailing portugal',
      'acessórios detailing',
      'loja detailing online',
      'shampoo auto',
      'cera para carro',
      'car detailing algarve',
      'detailing guia',
      'lavagem automóvel guia',
      'detailing albufeira',
      'jetwash24',
    ],
  },
  en: {
    title: 'JetWash24 | Car Cleaning Products & Detailing in the Algarve',
    description:
      'Car cleaning products and detailing accessories with free shipping across the European Union. Professional detailing centre in Guia, Albufeira.',
    ogTitle: 'JetWash24 | Car Cleaning Products & Detailing',
    ogDescription:
      'Car cleaning products and detailing accessories with free shipping across Europe. Professional detailing in Guia, Algarve.',
    ogLocale: 'en_GB',
    keywords: [
      'car cleaning products europe',
      'car cleaning products portugal',
      'car detailing products',
      'detailing accessories',
      'car wax',
      'car shampoo',
      'car detailing algarve',
      'car detailing guia',
      'car cleaning algarve',
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
            <CartProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <WhatsAppButton />
              <SummerPromoPopup />
            </CartProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

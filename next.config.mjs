import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'blob.vercel-storage.com',
      },
    ],
  },
  // The shop and the paint-correction service were retired. Their URLs were in
  // the sitemap and may be indexed or linked, so they move permanently to the
  // closest page that still exists instead of turning into 404s.
  async redirects() {
    return [
      { source: '/:locale(pt|en)/shop', destination: '/:locale/services', permanent: true },
      { source: '/:locale(pt|en)/shop/:path*', destination: '/:locale/services', permanent: true },
      {
        source: '/:locale(pt|en)/services/paint-correction',
        destination: '/:locale/services/gloss-polish',
        permanent: true,
      },
      {
        source: '/:locale(pt|en)/blog/o-que-e-correcao-de-pintura',
        destination: '/:locale/services/gloss-polish',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);

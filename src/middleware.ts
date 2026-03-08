import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['pt', 'en'],
  defaultLocale: 'pt'
});

export const config = {
  // Match every path EXCEPT:
  //  • /api/*          – API routes (handled separately)
  //  • /_next/*        – Next.js internals
  //  • /_vercel/*      – Vercel internals
  //  • Paths with a file extension (static assets: .ico, .png, .svg …)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};

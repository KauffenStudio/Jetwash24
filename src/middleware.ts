import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['pt', 'en'],
  defaultLocale: 'pt'
});

export const config = {
  // Match every path EXCEPT:
  //  • /api/*               – API routes (handled separately)
  //  • /_next/*             – Next.js internals
  //  • /_vercel/*           – Vercel internals
  //  • /icon, /apple-icon   – root metadata icon routes (no file extension, so
  //                           they'd otherwise be locale-prefixed and 404)
  //  • Paths with a file extension (static assets: .ico, .png, .svg …)
  matcher: ['/((?!api|_next|_vercel|icon|apple-icon|.*\\..*).*)'],
};

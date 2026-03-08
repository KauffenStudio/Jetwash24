import { getRequestConfig } from 'next-intl/server';

const locales = ['pt', 'en'] as const;
type Locale = (typeof locales)[number];
const defaultLocale: Locale = 'pt';

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale is Promise<string | undefined> in next-intl >= 3.22
  const requested = await requestLocale;

  // Fall back to default if segment is missing or not in the allowed list
  const locale: Locale =
    requested && (locales as readonly string[]).includes(requested)
      ? (requested as Locale)
      : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

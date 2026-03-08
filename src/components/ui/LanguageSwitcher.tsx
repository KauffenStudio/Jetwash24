'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    // Replace the current locale prefix with the new one
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <div className="flex items-center gap-1 bg-white/10 rounded p-1">
      <button
        onClick={() => switchLocale('pt')}
        className={`px-2 py-1 text-xs font-semibold rounded transition-colors duration-200 ${
          locale === 'pt'
            ? 'bg-white text-black'
            : 'text-white/70 hover:text-white'
        }`}
      >
        PT
      </button>
      <button
        onClick={() => switchLocale('en')}
        className={`px-2 py-1 text-xs font-semibold rounded transition-colors duration-200 ${
          locale === 'en'
            ? 'bg-white text-black'
            : 'text-white/70 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
}

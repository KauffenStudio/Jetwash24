'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import CartButton from '@/components/shop/CartButton';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  const navLinks = [
    { href: `/${locale}/shop`, label: t('shop') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}#gallery`, label: t('gallery') },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}#location`, label: t('contact') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHomePage
          ? 'bg-black/95 backdrop-blur-sm shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <span className="text-xl md:text-2xl font-black tracking-widest text-white group-hover:text-gold transition-colors duration-200">
              JETWASH<span className="text-gold">24</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/80 hover:text-white tracking-wide transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            <CartButton />
            <LanguageSwitcher />
            <Link
              href={`/${locale}/booking`}
              className="hidden sm:inline-flex items-center px-5 py-2.5 bg-gold text-black text-sm font-semibold rounded tracking-wide hover:bg-gold-light transition-colors duration-200"
            >
              {t('booking')}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-white"
              aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`block h-0.5 bg-white transition-all duration-300 ${
                    menuOpen ? 'rotate-45 translate-y-2.5' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 bg-white transition-all duration-300 ${
                    menuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 bg-white transition-all duration-300 ${
                    menuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="bg-black/98 border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-white/80 hover:text-white py-2 text-base tracking-wide transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            href={`/${locale}/booking`}
            onClick={() => setMenuOpen(false)}
            className="mt-2 inline-flex justify-center items-center px-5 py-3 bg-gold text-black font-semibold rounded tracking-wide hover:bg-gold-light transition-colors"
          >
            {t('booking')}
          </Link>
        </nav>
      </div>
    </header>
  );
}

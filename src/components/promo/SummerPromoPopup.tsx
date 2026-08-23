'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import DiscountBadge from '@/components/ui/DiscountBadge';
import { discountPercent, formatEuro } from '@/lib/utils';
import {
  PROMO,
  PROMO_SAVING,
  isPromoLive,
  promoTimeLeft,
  splitCountdown,
} from '@/lib/promo';

const WHATSAPP_NUMBER = '351928380478';

/**
 * Routes where the popup stays shut. Interrupting someone mid-booking costs a
 * conversion instead of winning one, and staff tools are not a sales surface.
 */
const MUTED_PATHS = ['/booking', '/admin', '/worker'];

/** Idle delay before the popup opens on its own, in ms. */
const OPEN_AFTER_MS = 7000;

/** Fraction of the page scrolled that opens the popup early. */
const OPEN_AFTER_SCROLL = 0.3;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Summer campaign popup: hand wash + express interior for 29,90€.
 *
 * Opens once per visitor on whichever comes first — a short dwell, a scroll
 * past the fold, or the mouse leaving for the tab bar — then remembers the
 * dismissal in localStorage so it never nags. It disarms itself the moment the
 * campaign ends (see lib/promo), so nothing has to be removed by hand.
 */
export default function SummerPromoPopup() {
  const t = useTranslations('promo');
  const locale = useLocale();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [msLeft, setMsLeft] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<Element | null>(null);

  const percent = discountPercent(PROMO.price, PROMO.compareAtPrice);
  const includes = t.raw('includes') as string[];
  // formatEuro() is pt-PT (comma decimal, trailing €); English prices read
  // "€29.90", so the separator and the symbol's side both follow the locale.
  const isPt = locale === 'pt';
  const euro = (amount: number) =>
    isPt ? formatEuro(amount) : amount.toFixed(2).replace(/\.00$/, '');
  const savingLabel = euro(PROMO_SAVING);

  const close = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(PROMO.storageKey, '1');
    } catch {
      // Private browsing can refuse writes — a popup that reappears next
      // session is a far smaller problem than one that throws on close.
    }
    if (openerRef.current instanceof HTMLElement) openerRef.current.focus();
  }, []);

  // ── Arm the triggers ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPromoLive()) return;
    if (MUTED_PATHS.some((p) => pathname.startsWith(`/${locale}${p}`))) return;

    // ?promo=1 reopens it after a dismissal — for checking the live page, and
    // for ad or social links that should land on the offer directly.
    const forced = new URLSearchParams(window.location.search).get('promo') === '1';

    try {
      if (!forced && window.localStorage.getItem(PROMO.storageKey)) return;
    } catch {
      // Storage unavailable: fall through and show it.
    }

    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      openerRef.current = document.activeElement;
      setOpen(true);
      window.gtag?.('event', 'promo_view', {
        promo_id: 'summer-2026',
        value: PROMO.price,
        currency: 'EUR',
      });
      cleanup();
    };

    const onScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= OPEN_AFTER_SCROLL) fire();
    };

    // Exit intent, pointer devices only — on touch there is no cursor to lose.
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) fire();
    };

    // Asked for explicitly, so do not make them wait out the dwell timer.
    const timer = window.setTimeout(fire, forced ? 0 : OPEN_AFTER_MS);
    const pointer = window.matchMedia('(pointer: fine)').matches;

    window.addEventListener('scroll', onScroll, { passive: true });
    if (pointer) document.addEventListener('mouseout', onMouseOut);

    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseout', onMouseOut);
    }
    return cleanup;
  }, [locale, pathname]);

  // ── Countdown, only while visible ───────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const tick = () => {
      const left = promoTimeLeft();
      setMsLeft(left);
      if (left === 0) setOpen(false);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [open]);

  // ── Modal behaviour: scroll lock, Esc, focus trap ───────────────────────
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  if (!open || msLeft === null) return null;

  const { days, hours, minutes, seconds } = splitCountdown(msLeft);
  const cells = [
    { value: days, label: t('countdown.days') },
    { value: hours, label: t('countdown.hours') },
    { value: minutes, label: t('countdown.minutes') },
    { value: seconds, label: t('countdown.seconds') },
  ];

  const onBook = () => {
    window.gtag?.('event', 'promo_click', {
      promo_id: 'summer-2026',
      value: PROMO.price,
      currency: 'EUR',
    });
    close();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="presentation"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label={t('aria.close')}
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-black/80 backdrop-blur-sm animate-fade-in"
        tabIndex={-1}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-title"
        tabIndex={-1}
        className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-lg border border-gold/30 bg-[#0A0A0A] shadow-[0_24px_80px_rgba(0,0,0,0.7)] animate-slide-up motion-reduce:animate-none focus:outline-none"
      >
        {/* Gold glow behind the price, echoing the hero treatment */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-70"
          style={{
            background:
              'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(201,168,76,0.22) 0%, transparent 70%)',
          }}
        />
        {/* Gold hairline across the top edge */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.7) 50%, transparent 100%)',
          }}
        />

        <button
          type="button"
          onClick={close}
          aria-label={t('aria.close')}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="relative px-6 pb-6 pt-7 sm:px-8 sm:pb-7 sm:pt-8">
          {/* Eyebrow */}
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-6 bg-gold/60" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold sm:text-xs">
              {t('eyebrow')}
            </p>
          </div>

          <h2
            id="promo-title"
            className="text-2xl font-black leading-[1.05] tracking-tight text-white sm:text-3xl"
          >
            {t('title')}
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-white/55">{t('subtitle')}</p>

          {/* Price */}
          <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-2">
            <span className="text-5xl font-black tracking-tight text-gold tabular-nums sm:text-6xl">
              {!isPt && <span className="mr-1 text-2xl align-top sm:text-3xl">€</span>}
              {euro(PROMO.price)}
              {isPt && <span className="ml-1 text-2xl align-top sm:text-3xl">€</span>}
            </span>
            <span className="pb-2 text-lg text-white/35 line-through tabular-nums">
              {isPt ? `${euro(PROMO.compareAtPrice)}€` : `€${euro(PROMO.compareAtPrice)}`}
            </span>
            {percent !== null && <DiscountBadge percent={percent} variant="dark" className="mb-3" />}
          </div>
          <p className="mt-2 text-sm font-semibold text-white/70">
            {t('save', { amount: savingLabel })}
          </p>

          {/* Countdown */}
          <div className="mt-5 rounded border border-white/10 bg-white/[0.03] p-3.5">
            <p className="mb-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45">
              {t('countdown.label')}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {cells.map((cell) => (
                <div key={cell.label} className="rounded bg-black/60 py-2 text-center">
                  <div className="text-xl font-black tabular-nums text-gold sm:text-2xl">
                    {String(cell.value).padStart(2, '0')}
                  </div>
                  <div className="mt-0.5 text-[9px] uppercase tracking-wider text-white/40">
                    {cell.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What's included */}
          <ul className="mt-5 grid gap-1.5">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-white/75">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C9A84C"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <Link
            href={`/${locale}/booking?serviceId=${PROMO.serviceId}`}
            onClick={onBook}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-gold px-6 py-3.5 text-base font-bold tracking-wide text-black transition-all duration-200 hover:bg-gold-light hover:scale-[1.02] motion-reduce:hover:scale-100"
          >
            {t('cta')}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('whatsappMessage'))}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onBook}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 hover:border-white/30 hover:text-white"
          >
            {t('whatsapp')}
          </a>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-white/35">
            {t('finePrint')}
          </p>

          <button
            type="button"
            onClick={close}
            className="mx-auto mt-3 block text-xs text-white/30 underline underline-offset-4 hover:text-white/60"
          >
            {t('dismiss')}
          </button>
        </div>
      </div>
    </div>
  );
}

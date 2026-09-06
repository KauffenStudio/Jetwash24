'use client';

import { useEffect, useRef, useState } from 'react';
import type { PurchaseProof as Proof } from '@/lib/shop/social-proof';

/**
 * Social proof line under the price: a pulsing dot, a number that counts up,
 * and a soft rise on entry.
 *
 * The number is rounded down to a round figure ("12 pessoas" reads as a
 * measurement, "10+ pessoas" reads as a claim) but it is never invented —
 * see lib/shop/social-proof.ts. Renders nothing when there is no honest
 * claim to make.
 */

/** Rounds down to a round figure so the line reads as a claim, not a readout. */
function approximate(n: number): { label: string; target: number } {
  if (n < 10) return { label: String(n), target: n };
  const step = n < 50 ? 10 : n < 200 ? 25 : 50;
  const floor = Math.floor(n / step) * step;
  return { label: `${floor}+`, target: floor };
}

/** Counts from 0 to `target`, easing out, unless the visitor prefers no motion. */
function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(target);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || target === 0) {
      setValue(target);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutCubic — fast start, gentle landing.
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };

    setValue(0);
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    };
  }, [target, duration]);

  return value;
}

export default function PurchaseProof({
  proof,
  locale,
}: {
  proof: Proof | null;
  locale: string;
}) {
  const { label, target } = approximate(proof?.buyers ?? 0);
  const count = useCountUp(target);
  const [shown, setShown] = useState(false);

  // A beat after paint, so the rise is visible rather than already finished.
  useEffect(() => {
    const id = setTimeout(() => setShown(true), 120);
    return () => clearTimeout(id);
  }, []);

  if (!proof) return null;

  const isPt = locale === 'pt';
  const window = isPt ? proof.windowPt : proof.windowEn;
  const plural = target === 1 ? 'singular' : 'plural';

  // Mid-count the figure is a plain number; it settles into "10+" at the end.
  const shownFigure = count < target ? String(count) : label;

  return (
    <p
      className={`mt-3 flex items-center gap-2 text-sm font-semibold text-black transition-all duration-500 ease-out motion-reduce:transition-none ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
      }`}
    >
      <span aria-hidden className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
      </span>
      <span>
        <span className="tabular-nums">{shownFigure}</span>{' '}
        {isPt
          ? `${plural === 'singular' ? 'pessoa comprou' : 'pessoas compraram'} ${window}`
          : `${plural === 'singular' ? 'person bought' : 'people bought'} this ${window}`}
      </span>
    </p>
  );
}

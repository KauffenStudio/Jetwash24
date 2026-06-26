'use client';

import { useRef, type ReactNode } from 'react';

/**
 * Wraps a dark hero section and paints a soft gold spotlight that follows
 * the cursor (pointer devices only). Purely decorative — uses a CSS variable
 * updated on pointermove to avoid React re-renders.
 */
export default function Spotlight({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgba(201,168,76,0.16), transparent 65%)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

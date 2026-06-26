'use client';

import { useState } from 'react';
import type { FaqItem } from '@/content/faq';

/**
 * Accessible, animated FAQ accordion. The same `items` MUST also feed
 * <FaqSchema> so the structured data matches the visible content.
 */
export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-surface-200 border-t border-b border-surface-200">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="group flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span
                  className={`text-base sm:text-lg font-bold transition-colors ${
                    isOpen ? 'text-gold' : 'text-black group-hover:text-gold'
                  }`}
                >
                  {item.q}
                </span>
                <span
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen
                      ? 'rotate-45 border-gold bg-gold text-black'
                      : 'border-surface-300 text-surface-500 group-hover:border-gold group-hover:text-gold'
                  }`}
                  aria-hidden
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-6 pr-10 text-surface-600 leading-relaxed">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

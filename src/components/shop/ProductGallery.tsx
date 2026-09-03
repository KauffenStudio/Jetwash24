'use client';

import Image from 'next/image';
import { useState } from 'react';

/** Product photos: one large frame plus thumbnails when there's more than one. */
export default function ProductGallery({
  images,
  alt,
  emptyLabel,
}: {
  images: string[];
  alt: string;
  emptyLabel: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-surface-200 bg-surface-50 text-surface-300">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-surface-200 bg-white">
        <Image
          src={images[Math.min(active, images.length - 1)]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-6"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${alt} — ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-square overflow-hidden rounded-lg border bg-white transition-colors ${
                i === active ? 'border-black' : 'border-surface-200 hover:border-surface-400'
              }`}
            >
              <Image src={src} alt="" fill sizes="20vw" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel: string;
  afterLabel: string;
  alt: string;
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
  alt,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    updatePosition(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) updatePosition(e.clientX);
  };

  const handleMouseUp = () => { isDragging.current = false; };

  const handleTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-lg select-none cursor-ew-resize"
      style={{ aspectRatio: '4/3' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchStart={(e) => updatePosition(e.touches[0].clientX)}
    >
      {/* After image (background) */}
      <div className="absolute inset-0">
        <Image src={afterSrc} alt={`${alt} — after`} fill className="object-cover" draggable={false} />
        <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded tracking-wide">
          {afterLabel}
        </span>
      </div>

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image src={beforeSrc} alt={`${alt} — before`} fill className="object-cover" draggable={false} />
        <span className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded tracking-wide">
          {beforeLabel}
        </span>
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 8H1M15 8H11M5 5L1 8L5 11M11 5L15 8L11 11" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Range input overlay for accessibility */}
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        aria-label="Before/After comparison slider"
      />
    </div>
  );
}

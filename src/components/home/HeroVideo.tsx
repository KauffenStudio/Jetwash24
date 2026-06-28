'use client';

import { useEffect, useRef, useState } from 'react';

// Carousel of short detailing clips used as the hero background.
// Same fullscreen layout/dimensions as before — clips crossfade and auto-advance.
const CLIPS = [
  '/hero/detergente.mp4',
  '/hero/aspirar.mp4',
  '/hero/vapor.mp4',
  '/hero/brushes.mp4',
  '/hero/farois.mp4',
  '/hero/exterior.mp4',
];

export default function HeroVideo() {
  const [active, setActive] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Play the active clip from the start whenever it changes.
  useEffect(() => {
    const v = videoRefs.current[active];
    if (v) {
      v.currentTime = 0;
      v.muted = true;
      v.play().catch(() => {});
    }
  }, [active]);

  const goNext = () => setActive((i) => (i + 1) % CLIPS.length);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {CLIPS.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            videoRefs.current[i] = el;
          }}
          autoPlay={i === 0}
          muted
          playsInline
          preload={i === 0 ? 'auto' : 'metadata'}
          onEnded={i === active ? goNext : undefined}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{
            filter: 'brightness(0.55) saturate(0.85)',
            opacity: i === active ? 1 : 0,
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      ))}
    </div>
  );
}

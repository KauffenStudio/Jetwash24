'use client';

import { useEffect, useRef, useState } from 'react';

// Carousel of short detailing clips used as the hero background.
// Each clip has a lightweight poster (first frame) so something paints
// instantly — the poster is the LCP element, not the video. Clips load
// lazily: only the active clip and the next one are fetched, instead of
// all six up front, which keeps the mobile payload small.
const CLIPS = [
  { src: '/hero/detergente.mp4', poster: '/hero/detergente.jpg' },
  { src: '/hero/aspirar.mp4', poster: '/hero/aspirar.jpg' },
  { src: '/hero/vapor.mp4', poster: '/hero/vapor.jpg' },
  { src: '/hero/brushes.mp4', poster: '/hero/brushes.jpg' },
  { src: '/hero/farois.mp4', poster: '/hero/farois.jpg' },
  { src: '/hero/exterior.mp4', poster: '/hero/exterior.jpg' },
];

export default function HeroVideo() {
  const [active, setActive] = useState(0);
  // Indices whose <source> has been mounted. Start with the first clip only.
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0]));
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Mount the source for the active clip and the next one (for a seamless
  // crossfade), leaving the rest unfetched until they're needed.
  useEffect(() => {
    const next = (active + 1) % CLIPS.length;
    setLoaded((prev) => {
      if (prev.has(active) && prev.has(next)) return prev;
      const s = new Set(prev);
      s.add(active);
      s.add(next);
      return s;
    });
  }, [active]);

  // Play the active clip from the start, and warm the next one so the
  // crossfade has something to show.
  useEffect(() => {
    const v = videoRefs.current[active];
    if (v) {
      if (v.readyState === 0) v.load(); // pick up a lazily-added source
      v.currentTime = 0;
      v.muted = true;
      v.play().catch(() => {});
    }
    const next = videoRefs.current[(active + 1) % CLIPS.length];
    if (next && next.readyState === 0 && next.querySelector('source')) {
      next.load();
    }
  }, [active, loaded]);

  const goNext = () => setActive((i) => (i + 1) % CLIPS.length);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {CLIPS.map((clip, i) => (
        <video
          key={clip.src}
          ref={(el) => {
            videoRefs.current[i] = el;
          }}
          autoPlay={i === 0}
          muted
          playsInline
          poster={clip.poster}
          preload={i === 0 ? 'auto' : 'none'}
          onEnded={i === active ? goNext : undefined}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{
            filter: 'brightness(0.55) saturate(0.85)',
            opacity: i === active ? 1 : 0,
          }}
        >
          {loaded.has(i) && <source src={clip.src} type="video/mp4" />}
        </video>
      ))}
    </div>
  );
}

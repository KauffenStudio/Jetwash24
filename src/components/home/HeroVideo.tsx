'use client';

import { useEffect, useRef } from 'react';

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
      style={{ filter: 'brightness(0.55) saturate(0.85)' }}
    >
      <source src="/hero-video.mp4" type="video/mp4" />
    </video>
  );
}

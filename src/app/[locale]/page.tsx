import { Suspense } from 'react';
import Hero from '@/components/home/Hero';
import ServicesSection from '@/components/home/ServicesSection';
import GallerySection from '@/components/home/GallerySection';
import BookingCTA from '@/components/home/BookingCTA';
import LocationSection from '@/components/home/LocationSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<SectionSkeleton />}>
        <ServicesSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton dark />}>
        <GallerySection />
      </Suspense>
      <BookingCTA />
      <LocationSection />
    </>
  );
}

function SectionSkeleton({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`py-24 ${dark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`h-8 rounded w-64 mx-auto mb-4 ${dark ? 'bg-white/10' : 'bg-surface-100'} animate-pulse`} />
        <div className={`h-4 rounded w-40 mx-auto mb-12 ${dark ? 'bg-white/10' : 'bg-surface-100'} animate-pulse`} />
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-48 rounded-lg ${dark ? 'bg-white/5' : 'bg-surface-100'} animate-pulse`} />
          ))}
        </div>
      </div>
    </div>
  );
}

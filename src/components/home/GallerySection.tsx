import { getTranslations, getLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider';

async function getGalleryImages() {
  return prisma.galleryImage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    take: 6,
  });
}

export default async function GallerySection() {
  const t = await getTranslations('gallery');
  const locale = await getLocale();
  const images = await getGalleryImages();

  return (
    <section id="gallery" className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">{t('before')} / {t('after')}</p>
          <h2 className="text-4xl sm:text-5xl font-black text-white">{t('title')}</h2>
          <p className="text-white/40 mt-4 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        {images.length === 0 ? (
          /* Empty state */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] bg-white/5 border border-white/10 rounded-lg flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="rgba(255,255,255,0.3)"/>
                    <path d="M21 15L16 10L11 15" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 17.5L10 13.5L3 21" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-white/30 text-sm text-center px-6">{t('noPhotosDesc')}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => {
              const desc = locale === 'pt' ? image.descriptionPt : image.descriptionEn;
              return (
                <div key={image.id} className="group">
                  <BeforeAfterSlider
                    beforeSrc={image.beforeImageUrl}
                    afterSrc={image.afterImageUrl}
                    beforeLabel={t('before')}
                    afterLabel={t('after')}
                    alt={desc ?? 'Detailing transformation'}
                  />
                  {(desc || image.servicePerformed) && (
                    <div className="mt-3">
                      {image.servicePerformed && (
                        <span className="text-gold text-xs font-semibold tracking-wide uppercase">
                          {image.servicePerformed}
                        </span>
                      )}
                      {desc && (
                        <p className="text-white/50 text-sm mt-1">{desc}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

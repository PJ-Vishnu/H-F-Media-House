
"use client";

import Image from 'next/image';
import type { GalleryImage } from '@/modules/gallery/gallery.schema';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { cn } from '@/lib/utils';

type GallerySectionProps = {
  data: GalleryImage[];
};

export function GallerySection({ data }: GallerySectionProps) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="w-full py-24 bg-background">
      <ScrollFadeIn className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold tracking-widest uppercase mb-2">Amazing Work We've Done</p>
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Moments We've Captured</h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            A glimpse into our creative world, showcasing a diverse range of projects from breathtaking landscapes to intimate portraits.
          </p>
        </div>

        <div 
          className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4"
          style={{ gridAutoFlow: 'dense' }}
        >
          {data.map((image, index) => {
            // Default to 1 if not specified
            const colSpan = image.colSpan || 1;
            const rowSpan = image.rowSpan || 1;

            // Ensure spans don't exceed max grid columns
            const finalColSpan = `span ${Math.min(colSpan, 4)}`;
            const finalRowSpan = `span ${rowSpan}`;

            return (
              <div
                key={image.id}
                className="relative rounded-xl overflow-hidden group shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                style={{
                    gridColumn: finalColSpan,
                    gridRow: finalRowSpan,
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
              </div>
            );
          })}
        </div>
      </ScrollFadeIn>
    </section>
  );
}

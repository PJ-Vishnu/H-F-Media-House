
"use client";

import Image from 'next/image';
import type { GalleryImage } from '@/modules/gallery/gallery.schema';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type GallerySectionProps = {
  data: GalleryImage[];
};

export function GallerySection({ data }: GallerySectionProps) {
  return (
    <section id="gallery" className="w-full py-24 bg-secondary/50">
      <ScrollFadeIn className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold tracking-widest uppercase mb-2">Amazing Work We've Done</p>
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Moments We've Captured</h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            A glimpse into our creative world, showcasing a diverse range of projects from breathtaking landscapes to intimate portraits.
          </p>
        </div>

        <ScrollArea className="w-full whitespace-nowrap rounded-lg">
          <div className="flex w-max space-x-4 p-4">
            {data.map((image) => (
              <div
                key={image.id}
                className="relative shrink-0 w-80 h-96 rounded-lg overflow-hidden shadow-lg group transition-transform hover:scale-105"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </ScrollFadeIn>
    </section>
  );
}

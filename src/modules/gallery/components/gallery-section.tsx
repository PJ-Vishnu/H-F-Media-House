"use client";

import Image from 'next/image';
import type { GalleryImage } from '@/modules/gallery/gallery.schema';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { chunk } from 'lodash-es';
import { cn } from '@/lib/utils';

type GallerySectionProps = {
  data: GalleryImage[];
};

const GalleryPage = ({ images }: { images: GalleryImage[] }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-fr gap-4 h-[600px]">
    {images.map((image) => (
      <div
        key={image.id}
        className={cn(
          "relative rounded-lg overflow-hidden shadow-lg group transition-transform hover:scale-105",
          `col-span-${image.colSpan || 1}`,
          `row-span-${image.rowSpan || 1}`,
          `md:col-span-${image.colSpan || 1}`,
          `md:row-span-${image.rowSpan || 1}`,
        )}
        style={{
            gridColumn: `span ${image.colSpan || 1}`,
            gridRow: `span ${image.rowSpan || 1}`
        }}
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
);

export function GallerySection({ data }: GallerySectionProps) {
  const pages = chunk(data, 6);

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
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {pages.map((pageImages, index) => (
              <CarouselItem key={index}>
                <GalleryPage images={pageImages} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-[-50px]" />
          <CarouselNext className="right-[-50px]" />
        </Carousel>
      </ScrollFadeIn>
    </section>
  );
}

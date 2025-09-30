
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

type GallerySectionProps = {
  data: GalleryImage[];
};

// Helper function to chunk array into smaller arrays
const chunk = <T,>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

export function GallerySection({ data }: GallerySectionProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // We can group by a certain number, e.g. 6 items per slide, to allow for interesting layouts.
  // The user can configure this by how they set colSpan/rowSpan.
  const imageChunks = chunk(data, 6);

  return (
    <section id="gallery" className="w-full py-24 bg-background">
      <ScrollFadeIn className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold tracking-widest uppercase mb-2">Amazing Work We've Done</p>
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Moments We've Captured</h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            A glimpse into our creative world, showcasing a diverse range of projects.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: imageChunks.length > 1,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {imageChunks.map((chunk, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <div className="grid grid-cols-4 grid-auto-rows-fr gap-4 aspect-square md:aspect-[16/9]">
                    {chunk.map((image) => {
                      const colSpan = image.colSpan || 1;
                      const rowSpan = image.rowSpan || 1;
                      return (
                       <div
                        key={image.id}
                        className="relative rounded-xl overflow-hidden group shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                        style={{
                            gridColumn: `span ${colSpan}`,
                            gridRow: `span ${rowSpan}`
                        }}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
                      </div>
                    )})}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {imageChunks.length > 1 && (
            <>
                <CarouselPrevious className="hidden sm:flex left-[-50px]" />
                <CarouselNext className="hidden sm:flex right-[-50px]" />
            </>
          )}
        </Carousel>
      </ScrollFadeIn>
    </section>
  );
}

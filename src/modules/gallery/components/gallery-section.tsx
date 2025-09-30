
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

const chunkImagesForSlides = (images: GalleryImage[]) => {
  if (!images.length) return [];
  
  const slides: GalleryImage[][] = [];
  let currentSlide: GalleryImage[] = [];
  let currentWidth = 0;
  const maxSlideWidth = 4; // Max columns for a slide

  images.forEach(image => {
    const imageWidth = image.colSpan || 1;
    
    // If the current slide is empty and this image is too big, it gets its own slide.
    // Or if adding this image exceeds the max width, start a new slide.
    if (currentWidth > 0 && currentWidth + imageWidth > maxSlideWidth) {
      slides.push(currentSlide);
      currentSlide = [];
      currentWidth = 0;
    }
    
    currentSlide.push(image);
    currentWidth += imageWidth;
  });
  
  // Add the last running slide if it has images
  if (currentSlide.length > 0) {
    slides.push(currentSlide);
  }
  
  return slides;
};


export function GallerySection({ data }: GallerySectionProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const slides = chunkImagesForSlides(data);

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
            loop: slides.length > 1,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <div className="grid grid-cols-4 auto-rows-fr gap-4 aspect-[16/9]">
                    {slide.map((image) => {
                      const colSpan = image.colSpan || 1;
                      const rowSpan = image.rowSpan || 1;
                      return (
                       <div
                        key={image.id}
                        className="relative rounded-xl overflow-hidden group shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                        style={{
                            gridColumn: `span ${Math.min(colSpan, 4)}`,
                            gridRow: `span ${Math.min(rowSpan, 3)}`
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
          {slides.length > 1 && (
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

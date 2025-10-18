"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { GalleryImage } from '@/modules/gallery/gallery.schema';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import Autoplay from "embla-carousel-autoplay";

function groupImagesIntoSlides(images: GalleryImage[]): GalleryImage[][] {
  if (!images || images.length === 0) {
    return [];
  }

  const slides: GalleryImage[][] = [];
  let currentSlide: GalleryImage[] = [];
  let currentArea = 0;
  const maxArea = 16; // 4x4 grid

  images.forEach(image => {
    const colSpan = Math.max(1, Math.min(image.colSpan || 1, 4));
    const rowSpan = Math.max(1, Math.min(image.rowSpan || 1, 4));
    const imageArea = colSpan * rowSpan;

    if (imageArea > maxArea) {
      if (currentSlide.length > 0) {
        slides.push(currentSlide);
      }
      slides.push([image]);
      currentSlide = [];
      currentArea = 0;
      return;
    }

    if (currentArea + imageArea > maxArea && currentSlide.length > 0) {
      slides.push(currentSlide);
      currentSlide = [image];
      currentArea = imageArea;
    } else {
      currentSlide.push(image);
      currentArea += imageArea;
    }
  });

  if (currentSlide.length > 0) {
    slides.push(currentSlide);
  }

  return slides;
}

export function GallerySection() {
  const [data, setData] = useState<GalleryImage[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/gallery');
        const fetchedData: GalleryImage[] = await res.json();
        setData(fetchedData);
      } catch (error) {
        console.error("Failed to fetch gallery data:", error);
      }
    }
    fetchData();
  }, []);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  if (!data) {
     return (
      <section id="gallery" className="w-full py-24 bg-background">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Skeleton className="h-6 w-1/3 mx-auto mb-2" />
              <Skeleton className="h-10 w-2/3 mx-auto mb-6" />
              <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
            </div>
            <Skeleton className="w-full h-[50vh] rounded-lg" />
        </div>
      </section>
    );
  }
  
  if (data.length === 0) {
    return null;
  }

  const slides = groupImagesIntoSlides(data);

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
          opts={{ loop: true }}
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          className="w-full"
        >
          <CarouselContent>
            {slides.map((slide, slideIndex) => (
              <CarouselItem key={slideIndex}>
                <div className="p-1">
                  <div className="grid grid-cols-4 grid-rows-4 gap-4 aspect-video">
                    {slide.map((image) => {
                      const colSpan = Math.max(1, Math.min(image.colSpan || 1, 4));
                      const rowSpan = Math.max(1, Math.min(image.rowSpan || 1, 4));

                      return (
                        <div
                          key={image.id}
                          className="relative rounded-xl overflow-hidden group shadow-lg transition-all duration-300 hover:shadow-2xl"
                          style={{
                            gridColumn: `span ${colSpan}`,
                            gridRow: `span ${rowSpan}`,
                          }}
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            sizes={`(max-width: 768px) ${100 / colSpan}vw, (max-width: 1200px) ${50 / colSpan}vw, ${33 / colSpan}vw`}
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
                        </div>
                      );
                    })}
                  </div>
                </div>
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

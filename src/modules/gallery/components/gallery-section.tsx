
"use client";

import { useState } from 'react';
import Image from 'next/image';
import type { GalleryImage } from '@/modules/gallery/gallery.schema';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type GallerySectionProps = {
  data: GalleryImage[];
};

const ITEMS_PER_PAGE = 6;

function GalleryPage({ images }: { images: GalleryImage[] }) {
  // Defensive check for empty images array to avoid layout errors
  if (!images || images.length === 0) return null;

  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-4 w-full h-[600px]">
      {images.map((image) => {
        // Dynamically create grid classes from the database values
        const gridClasses = `col-span-${image.colSpan || 1} row-span-${image.rowSpan || 1}`;
        
        return (
          <div
            key={image.id}
            className={cn(
              "relative rounded-xl overflow-hidden group shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]",
              gridClasses
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
            />
             <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
          </div>
        )
      })}
    </div>
  );
}


export function GallerySection({ data }: GallerySectionProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const paginatedData = Array.from({ length: totalPages }, (_, i) =>
    data.slice(i * ITEMS_PER_PAGE, (i + 1) * ITEMS_PER_PAGE)
  );

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };
  

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

        <div className="relative">
          {paginatedData.map((pageImages, index) => (
            <div key={index} className={cn(currentPage === index ? 'block' : 'hidden')}>
               <GalleryPage images={pageImages} />
            </div>
          ))}

          {totalPages > 1 && (
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-[-2rem]">
               <Button onClick={handlePrev} variant="ghost" size="icon" className="bg-white/50 hover:bg-white/80 rounded-full h-12 w-12 shadow-md">
                 <ChevronLeft className="h-6 w-6" />
               </Button>
               <Button onClick={handleNext} variant="ghost" size="icon" className="bg-white/50 hover:bg-white/80 rounded-full h-12 w-12 shadow-md">
                 <ChevronRight className="h-6 w-6" />
               </Button>
            </div>
          )}
        </div>

      </ScrollFadeIn>
    </section>
  );
}

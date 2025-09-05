"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import useEmblaCarousel from 'embla-carousel-react'
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel as UICarousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

type CarouselProps = {
  images: { src: string; alt: string; "data-ai-hint": string }[];
  className?: string;
};

const DesktopCarousel = ({ images }: { images: CarouselProps['images'] }) => {
    return (
      <div
        className="w-full overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {[...images, ...images].map((image, i) => (
            <div
              key={i}
              className="relative w-[300px] h-[400px] mx-4 flex-shrink-0"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={800}
                data-ai-hint={image["data-ai-hint"]}
                className="object-cover w-full h-full rounded-xl shadow-2xl"
              />
            </div>
          ))}
        </div>
      </div>
    );
};

const MobileCarousel = ({ images }: { images: CarouselProps['images'] }) => {
    return (
        <UICarousel
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full"
        >
            <CarouselContent className="-ml-4">
                {images.map((image, index) => (
                    <CarouselItem key={index} className="pl-4 basis-1/2 md:basis-1/3">
                        <div className="p-1 h-[400px]">
                             <Image
                                src={image.src}
                                alt={image.alt}
                                width={600}
                                height={800}
                                data-ai-hint={image["data-ai-hint"]}
                                className="object-cover w-full h-full rounded-xl shadow-2xl"
                                />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </UICarousel>
    )
}

export function Carousel({ images, className }: CarouselProps) {
    const isMobile = useIsMobile();
    
    return (
        <div
            className={cn(
                "relative w-full h-[400px] overflow-hidden group",
                className
            )}
        >
            { isMobile ? <MobileCarousel images={images} /> : <DesktopCarousel images={images} /> }
        </div>
    )
}

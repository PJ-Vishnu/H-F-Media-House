"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CylinderCarouselProps = {
  images: { src: string; alt: string; 'data-ai-hint': string }[];
  className?: string;
};

export function CylinderCarousel({ images, className }: CylinderCarouselProps) {
  const [rotation, setRotation] = useState(0);
  const totalImages = images.length;
  const angle = 360 / totalImages;
  const radius = 280; 

  const rotate = useCallback((direction: "next" | "prev") => {
    setRotation((prev) => prev + (direction === "next" ? -angle : angle));
  }, [angle]);

  useEffect(() => {
    const interval = setInterval(() => {
      rotate('next');
    }, 4000);
    return () => clearInterval(interval);
  }, [rotate]);

  return (
    <div className={cn("relative h-96 w-full flex items-center justify-center group", className)}>
      <div className="w-[200px] h-[300px] [perspective:1200px]">
        <div
          className="w-full h-full relative [transform-style:preserve-3d] transition-transform duration-1000 ease-in-out"
          style={{ transform: `rotateY(${rotation}deg)` }}
        >
          {images.map((image, i) => (
            <div
              key={i}
              className="absolute w-[220px] h-[330px] overflow-hidden rounded-xl shadow-2xl"
              style={{
                transform: `rotateY(${i * angle}deg) translateZ(${radius}px)`,
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={800}
                data-ai-hint={image['data-ai-hint']}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/80"
        onClick={() => rotate("prev")}
        aria-label="Previous image"
      >
        <ChevronLeft className="text-primary" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/80"
        onClick={() => rotate("next")}
        aria-label="Next image"
      >
        <ChevronRight className="text-primary" />
      </Button>
    </div>
  );
}

"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type CarouselProps = {
  images: { src: string; alt: string; "data-ai-hint": string }[];
  className?: string;
};

export function Carousel({ images, className }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Duplicate images for smooth infinite marquee effect
  const loopImages = [...images, ...images];

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-[400px] overflow-hidden group",
        className
      )}
    >
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-background to-transparent z-20" />
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent z-20" />
      
      <div
        className="flex animate-marquee group-hover:pause"
      >
        {loopImages.map((image, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 p-2"
            style={{ height: '400px' }}
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
       <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Carousel as ShadcnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type CarouselProps = {
  images: { src: string; alt: string }[];
  className?: string;
};

export function Carousel({ images, className }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Duplicate images for smooth infinite marquee
  const loopImages = [...images, ...images];

  // measured width of the viewport container
  const [containerWidth, setContainerWidth] = useState<number>(0);
  // current window width to determine breakpoint
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    function measure() {
      setWindowWidth(window.innerWidth);
      setContainerWidth(containerRef.current?.clientWidth ?? 0);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // determine visible count by breakpoint
  const visibleCount = windowWidth >= 1024 ? 4 : windowWidth >= 768 ? 3 : 1;

  // item widths (px) and track widths (px)
  const itemWidth = containerWidth && visibleCount ? containerWidth / visibleCount : 0;
  const originalWidth = itemWidth * images.length; // width of the single (non-duplicated) sequence
  const trackWidth = itemWidth * loopImages.length; // total track width with duplicates

  // animation duration (seconds) — adjust speed (px/s)
  const speedPxPerSecond = 100; // change this to make it faster/slower
  const durationSeconds = originalWidth > 0 ? Math.max(10, originalWidth / speedPxPerSecond) : 0;

  // Style props for the marquee track (CSS variables for keyframes)
  const marqueeStyle: React.CSSProperties & { [k: string]: any } = {
    width: trackWidth ? `${trackWidth}px` : undefined,
    // css variables used in the keyframes
    ["--marquee-distance"]: originalWidth ? `${originalWidth}px` : "0px",
    ["--marquee-duration"]: `${durationSeconds}s`,
    // fade in once measured to avoid a jump on hydration
    opacity: containerWidth ? 1 : 0,
  };

  return (
    <div
      className={cn(
        "relative w-full h-[400px] overflow-hidden flex items-center justify-center",
        className
      )}
    >
      {/* --------------------------
          MD+ marquee (3 on md, 4 on lg+). arcs shown.
          -------------------------- */}
      <div
        ref={containerRef}
        className="hidden md:block relative w-full h-full overflow-hidden"
        aria-hidden={false}
      >
        {/* Arcs (only shown on md+) */}
        <div className="absolute top-0 left-0 w-full h-16 z-20 pointer-events-none rotate-180">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,100 C50,0 50,0 100,100 Z" fill="white" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 z-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,100 C50,0 50,0 100,100 Z" fill="white" />
          </svg>
        </div>

        {/* marquee track */}
        <div
          className="flex will-change-transform"
          style={marqueeStyle}
          // Use a class name for animation; CSS below uses the same keyframe and variables
        >
          {loopImages.map((image, i) => (
            <div
              key={i}
              // each item is fixed pixel width so we always see `visibleCount` items in the viewport
              style={{
                width: itemWidth ? `${itemWidth}px` : undefined,
                flex: "0 0 auto",
                paddingLeft: "0.5rem",
                paddingRight: "0.5rem",
                height: "400px",
              }}
            >
              <Image
                src={image.src.replace(/(\d+)\/(\d+)/, "800/600")}
                alt={image.alt}
                width={800}
                height={600}
                className="object-cover w-full h-full rounded-xl shadow-2xl"
              />
            </div>
          ))}
        </div>
      </div>

      {/* -------------------------
          Small screens: shadcn carousel, no arcs
          ------------------------- */}
      <div className="flex md:hidden relative w-full h-[400px]">
        <ShadcnCarousel className="w-full">
          <CarouselContent>
            {images.map((image, i) => (
              <CarouselItem key={i} className="w-full h-[400px]">
                <Image
                  src={image.src.replace(/(\d+)\/(\d+)/, "800/600")}
                  alt={image.alt}
                  width={800}
                  height={600}
                  className="object-cover w-full h-full rounded-xl shadow-2xl"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 bg-black/40 text-white" />
          <CarouselNext className="right-2 bg-black/40 text-white" />
        </ShadcnCarousel>
      </div>

      {/* -------------------------
          Styles for marquee animation (uses CSS variables set inline on the track)
          ------------------------- */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(var(--marquee-distance) * -1));
          }
        }

        /* Apply the animation when measured (duration comes from CSS var) */
        .flex[style] {
          animation-name: marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-duration: var(--marquee-duration);
        }

        /* optional: pause on hover for desktop */
        .flex[style]:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}


"use client";

import { useRef } from "react";
import type { AboutData } from "@/modules/about/about.schema";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

type AboutCarouselProps = {
    features: AboutData['features'];
}

export function AboutCarousel({ features }: AboutCarouselProps) {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  
  return (
    <>
      {/* Desktop View: Side-by-side cards */}
      <div className="absolute inset-0 hidden md:flex flex-row items-center justify-center p-6 gap-6">
          {features.map((feature, i) => (
              <div
                  key={i}
                  className="bg-black/60 text-white rounded-xl p-6 w-full max-w-sm h-auto backdrop-blur-sm flex flex-col"
              >
                  <h3 className="text-lg font-semibold mb-2">
                  {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed">
                  {feature.description}
                  </p>
              </div>
          ))}
      </div>

      {/* Mobile View: Carousel */}
       <div className="absolute inset-0 flex md:hidden items-center justify-center p-4">
         <Carousel 
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            className="w-full max-w-xs"
         >
            <CarouselContent>
              {features.map((feature, i) => (
                  <CarouselItem key={i}>
                    <div className="p-1">
                        <div className="bg-black/60 text-white rounded-xl p-6 h-[250px] backdrop-blur-sm flex flex-col justify-center">
                          <h3 className="text-lg font-semibold mb-2 text-center">
                            {feature.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-center">
                            {feature.description}
                          </p>
                        </div>
                    </div>
                  </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious aria-label="Previous feature" className="left-[-1rem]" />
            <CarouselNext aria-label="Next feature" className="right-[-1rem]" />
         </Carousel>
      </div>
    </>
  );
}

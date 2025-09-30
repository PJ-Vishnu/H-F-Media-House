
"use client";

import Image from "next/image";
import type { AboutData } from "@/modules/about/about.schema";
import { ScrollFadeIn } from "@/components/shared/scroll-fade-in";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

type AboutSectionProps = {
  data: AboutData;
};

export function AboutSection({ data }: AboutSectionProps) {
  const hasFeatures = data.features && data.features.length > 0;
  
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <section id="about" className="w-full py-24 bg-secondary/50">
      <ScrollFadeIn className="container mx-auto px-4">
        {/* Section heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-primary font-semibold tracking-widest uppercase mb-2">
            Passion. Creativity. Precision.
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">
            {data.title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {data.content}
          </p>
        </div>

        {/* Full-width image with overlayed cards */}
        <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          {data.imageUrl && (
            <Image
              src={data.imageUrl}
              alt="About H&F Media House"
              fill
              priority
              className="object-cover"
            />
          )}
          
          {hasFeatures && (
            <>
              {/* Desktop View: Side-by-side cards */}
              <div className="absolute inset-0 hidden md:flex flex-row items-center justify-center p-6 gap-6">
                  {(data.features || []).map((feature, i) => (
                      <div
                          key={i}
                          className="bg-black/60 text-white rounded-xl p-6 w-full max-w-sm h-1/2 backdrop-blur-sm flex flex-col"
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
                      {(data.features || []).map((feature, i) => (
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
                    <CarouselPrevious className="left-[-1rem]" />
                    <CarouselNext className="right-[-1rem]" />
                 </Carousel>
              </div>
            </>
          )}
        </div>
      </ScrollFadeIn>
    </section>
  );
}

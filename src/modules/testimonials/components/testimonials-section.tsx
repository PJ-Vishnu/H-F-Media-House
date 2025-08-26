"use client";

import type { Testimonial } from '@/modules/testimonials/testimonials.schema';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import Autoplay from "embla-carousel-autoplay";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type TestimonialsSectionProps = {
  data: Testimonial[];
};

export function TestimonialsSection({ data }: TestimonialsSectionProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const isMobile = useIsMobile();
  
  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", onSelect)

    return () => {
      api.off("select", onSelect)
    }
  }, [api])


  return (
    <section id="testimonials" className="w-full py-24 bg-background">
      <ScrollFadeIn className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold tracking-widest uppercase mb-2">Client Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Loved by People, Backed by Stories</h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">Real feedback from our valued partners.</p>
        </div>
        <Carousel
            setApi={setApi}
            opts={{
                align: "center",
                loop: true,
            }}
            plugins={[autoplayPlugin.current]}
            className="w-full max-w-6xl mx-auto"
        >
            <CarouselContent>
                {data.map((testimonial, index) => (
                    <CarouselItem key={testimonial.id} className="basis-full md:basis-1/2 lg:basis-1/3">
                        <div className="p-4">
                            <Card className={cn(
                                "rounded-xl shadow-lg p-8 h-full transition-all duration-500",
                                !isMobile && index === current ? 'bg-yellow-300' : 'bg-white',
                                isMobile ? 'bg-white' : 'bg-secondary/50'
                            )}>
                                <CardContent className="p-0 flex flex-col items-start text-left h-full">
                                    <div className="flex items-center mb-4">
                                        <Image src={`https://i.pravatar.cc/150?u=${testimonial.author}`} alt={testimonial.author} width={50} height={50} className="rounded-full" />
                                        <div className="ml-4">
                                           <div className="font-bold text-lg">{testimonial.author}</div>
                                           <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                                        </div>
                                    </div>
                                    <div className="flex mb-4">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />)}
                                    </div>
                                    <blockquote className="text-lg font-medium leading-relaxed">
                                        “{testimonial.quote}”
                                    </blockquote>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
      </ScrollFadeIn>
    </section>
  );
}

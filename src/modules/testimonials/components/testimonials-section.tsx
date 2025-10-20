
"use client";

import { useState, useEffect, useRef } from 'react';
import type { Testimonial } from '@/modules/testimonials/testimonials.schema';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { Skeleton } from '@/components/ui/skeleton';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Autoplay from "embla-carousel-autoplay";

export function TestimonialsSection() {
  const [data, setData] = useState<Testimonial[] | null>(null);
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/testimonials');
        if (!res.ok) throw new Error('Failed to fetch');
        const fetchedData: Testimonial[] = await res.json();
        setData(fetchedData);
      } catch (error) {
        console.error("Failed to fetch testimonials data:", error);
      }
    }
    fetchData();
  }, []);

  if (!data) {
    return (
      <section id="testimonials" className="w-full py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-6 w-1/3 mx-auto mb-2" />
            <Skeleton className="h-10 w-2/3 mx-auto mb-6" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl hidden md:block" />
              <Skeleton className="h-64 w-full rounded-xl hidden lg:block" />
          </div>
        </div>
      </section>
    );
  }

  if (data.length === 0) return null;

  return (
    <section id="testimonials" className="w-full py-24 bg-background">
      <ScrollFadeIn className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold tracking-widest uppercase mb-2">Client Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Loved by People, Backed by Stories</h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">Real feedback from our valued partners.</p>
        </div>
        <Carousel
            plugins={[plugin.current]}
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent className="-ml-4">
                {data.map((testimonial) => (
                    <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                        <div className="p-1 h-full">
                            <Card className="rounded-xl shadow-lg p-8 h-full bg-card hover:bg-primary/10 transition-colors">
                                <CardContent className="p-0 flex flex-col items-start text-left h-full">
                                    <div className="flex items-center mb-4">
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                            <Image src={testimonial.avatar || `https://i.pravatar.cc/150?u=${testimonial.id}`} alt={testimonial.author} fill className="object-cover" />
                                        </div>
                                        <div className="ml-4">
                                           <div className="font-bold text-lg">{testimonial.author}</div>
                                           <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                                        </div>
                                    </div>
                                    <div className="flex mb-4">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
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
            <CarouselPrevious aria-label="Previous testimonial" />
            <CarouselNext aria-label="Next testimonial" />
        </Carousel>
      </ScrollFadeIn>
    </section>
  );
}

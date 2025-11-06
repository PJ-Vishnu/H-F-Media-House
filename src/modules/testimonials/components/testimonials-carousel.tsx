
"use client";

import { useRef } from 'react';
import type { Testimonial } from '@/modules/testimonials/testimonials.schema';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Autoplay from "embla-carousel-autoplay";

export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
    const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
    
    return (
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
                {testimonials.map((testimonial) => (
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
    );
}

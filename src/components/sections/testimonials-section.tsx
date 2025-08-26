import type { Testimonial } from '@/lib/definitions';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { Star } from 'lucide-react';
import Image from 'next/image';

type TestimonialsSectionProps = {
  data: Testimonial[];
};

export function TestimonialsSection({ data }: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className="w-full py-24 bg-background">
      <ScrollFadeIn className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold tracking-widest uppercase mb-2">Client Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Loved by People, Backed by Stories</h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">Real feedback from our valued partners.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {data.map((testimonial, index) => (
              <Card key={testimonial.id} className={`rounded-xl shadow-lg p-8 ${index === 1 ? 'bg-yellow-300' : 'bg-secondary/50'}`}>
                  <CardContent className="p-0 flex flex-col items-start text-left">
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
            ))}
        </div>
      </ScrollFadeIn>
    </section>
  );
}

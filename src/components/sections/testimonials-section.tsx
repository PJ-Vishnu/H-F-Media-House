import type { Testimonial } from '@/lib/definitions';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';

type TestimonialsSectionProps = {
  data: Testimonial[];
};

export function TestimonialsSection({ data }: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className="w-full py-24 bg-background">
      <ScrollFadeIn className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">What Our Clients Say</h2>
          <p className="text-lg text-muted-foreground mt-2">Real feedback from our valued partners.</p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {data.map((testimonial) => (
              <CarouselItem key={testimonial.id}>
                <div className="p-1">
                  <Card className="border-0 shadow-none">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                      <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-6">
                        “{testimonial.quote}”
                      </blockquote>
                      <cite className="not-italic">
                        <div className="font-bold text-lg">{testimonial.author}</div>
                        <div className="text-muted-foreground">{testimonial.company}</div>
                      </cite>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </ScrollFadeIn>
    </section>
  );
}


import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { Skeleton } from '@/components/ui/skeleton';
import { getTestimonialsData } from '../testimonials.data';
import { TestimonialsCarousel } from './testimonials-carousel';

export async function TestimonialsSection() {
  const data = await getTestimonialsData();

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
        <TestimonialsCarousel testimonials={data} />
      </ScrollFadeIn>
    </section>
  );
}

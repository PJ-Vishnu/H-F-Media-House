import type { HeroData } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { CylinderCarousel } from '@/components/shared/cylinder-carousel';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import Link from 'next/link';

type HeroSectionProps = {
  data: HeroData;
};

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <section id="hero" className="w-full py-20 md:py-32 lg:py-40 bg-secondary/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollFadeIn className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-headline tracking-tighter leading-tight mb-4">
              {data.headline}
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-muted-foreground mb-8">
              {data.subheadline}
            </p>
            <Link href={data.ctaLink}>
              <Button size="lg" className="bg-primary text-primary-foreground font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:bg-primary/90 transition-transform hover:scale-105">
                {data.ctaText}
              </Button>
            </Link>
          </ScrollFadeIn>
          <ScrollFadeIn className="relative w-full h-96">
            <CylinderCarousel images={data.images} />
          </ScrollFadeIn>
        </div>
      </div>
    </section>
  );
}

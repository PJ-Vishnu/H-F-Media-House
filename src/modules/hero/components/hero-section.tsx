import type { HeroData } from '@/modules/hero/hero.schema';
import { Button } from '@/components/ui/button';
import { CylinderCarousel } from '@/components/shared/cylinder-carousel';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import Link from 'next/link';

type HeroSectionProps = {
  data: HeroData;
};

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <section id="hero" className="w-full pt-20 md:pt-32 lg:pt-40 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
            <ScrollFadeIn>
                <p className="text-primary font-semibold tracking-widest uppercase mb-2">Capturing Moments</p>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold font-headline tracking-tighter leading-tight mb-4">
                    {data.headline}
                </h1>
                <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-8">
                    {data.subheadline}
                </p>
                <Link href={data.ctaLink}>
                    <Button size="lg" className="bg-primary text-primary-foreground font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:bg-primary/90 transition-transform hover:scale-105">
                        {data.ctaText}
                    </Button>
                </Link>
            </ScrollFadeIn>
            <div className="relative w-full h-[500px] mt-16">
                <CylinderCarousel images={data.images} />
            </div>
        </div>
      </div>
    </section>
  );
}

import Image from 'next/image';
import type { AboutData } from '@/lib/definitions';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { Button } from '../ui/button';
import Link from 'next/link';

type AboutSectionProps = {
  data: AboutData;
};

export function AboutSection({ data }: AboutSectionProps) {
  return (
    <section id="about" className="w-full py-24 bg-secondary/50">
      <ScrollFadeIn className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="w-full h-80 lg:h-[500px] relative rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={data.imageUrl}
              alt="About H&F Media House"
              fill
              data-ai-hint={data['data-ai-hint']}
              className="object-cover"
            />
          </div>
          <div className="text-center lg:text-left">
            <p className="text-primary font-semibold tracking-widest uppercase mb-2">Positive Company Process</p>
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">{data.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {data.content}
            </p>
            <Button asChild size="lg" variant="outline" className="rounded-full font-bold">
                <Link href="#contact">More About Us</Link>
            </Button>
          </div>
        </div>
      </ScrollFadeIn>
    </section>
  );
}

import Image from 'next/image';
import type { AboutData } from '@/lib/definitions';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';

type AboutSectionProps = {
  data: AboutData;
};

export function AboutSection({ data }: AboutSectionProps) {
  return (
    <section id="about" className="w-full py-24 bg-background">
      <ScrollFadeIn className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6 text-primary">{data.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {data.content}
            </p>
          </div>
          <div className="w-full h-80 lg:h-96 relative rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={data.imageUrl}
              alt="About H&F Media House"
              fill
              data-ai-hint={data['data-ai-hint']}
              className="object-cover"
            />
          </div>
        </div>
      </ScrollFadeIn>
    </section>
  );
}

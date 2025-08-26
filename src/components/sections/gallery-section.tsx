import Image from 'next/image';
import type { GalleryImage } from '@/lib/definitions';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';

type GallerySectionProps = {
  data: GalleryImage[];
};

export function GallerySection({ data }: GallerySectionProps) {
  return (
    <section id="gallery" className="w-full py-24 bg-secondary/50">
      <ScrollFadeIn className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold tracking-widest uppercase mb-2">Amazing Work We've Done</p>
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Moments We've Captured</h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            A glimpse into our creative world, showcasing a diverse range of projects from breathtaking landscapes to intimate portraits.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {data.slice(0, 4).map((image, index) => (
            <div
              key={image.id}
              className={`relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg group transition-transform hover:scale-105 
              ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}
              ${index === 3 ? 'md:col-span-2' : ''}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                data-ai-hint={image['data-ai-hint']}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            </div>
          ))}
        </div>
      </ScrollFadeIn>
    </section>
  );
}

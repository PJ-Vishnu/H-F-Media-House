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
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Our Gallery</h2>
          <p className="text-lg text-muted-foreground mt-2">A glimpse into our creative world.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.map((image, index) => (
            <div
              key={image.id}
              className={`relative aspect-video rounded-lg overflow-hidden shadow-lg group transition-transform hover:scale-105 ${
                index === 0 ? 'md:col-span-2 md:row-span-2 md:aspect-square' : ''
              }`}
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

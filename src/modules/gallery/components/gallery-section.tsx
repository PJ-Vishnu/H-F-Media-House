
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { Skeleton } from '@/components/ui/skeleton';
import { getGalleryData } from '../gallery.data';
import { GalleryCarousel } from './gallery-carousel';

export async function GallerySection() {
  const data = await getGalleryData();

  if (!data) {
     return (
      <section id="gallery" className="w-full py-24 bg-background">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Skeleton className="h-6 w-1/3 mx-auto mb-2" />
              <Skeleton className="h-10 w-2/3 mx-auto mb-6" />
              <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
            </div>
            <Skeleton className="w-full aspect-video rounded-lg" />
        </div>
      </section>
    );
  }
  
  if (data.length === 0) {
    return null; // Don't render section if there are no images
  }

  return (
    <section id="gallery" className="w-full py-24 bg-background">
      <ScrollFadeIn className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold tracking-widest uppercase mb-2">Amazing Work We've Done</p>
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Moments We've Captured</h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            A glimpse into our creative world, showcasing a diverse range of projects.
          </p>
        </div>

        <GalleryCarousel images={data} />
      </ScrollFadeIn>
    </section>
  );
}


import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { Skeleton } from '@/components/ui/skeleton';
import { VideoPlayer } from './video-player';
import { getVideoData } from '../video.data';

export async function VideoSection() {
  const data = await getVideoData();

  if (!data) {
     return (
      <section id="video" className="w-full py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
              <Skeleton className="h-6 w-3/4 mx-auto" />
            </div>
            <Skeleton className="aspect-video w-full rounded-xl" />
        </div>
      </section>
    );
  }

  return (
    <section id="video" className="w-full py-24 bg-secondary/50">
      <ScrollFadeIn className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">{data.title}</h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                {data.description}
            </p>
        </div>
        
        <VideoPlayer data={data} />
      </ScrollFadeIn>
    </section>
  );
}

import type { VideoData } from '@/modules/video/video.schema';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type VideoSectionProps = {
  data: VideoData;
};

const VideoPlayer = ({ data }: VideoSectionProps) => {
  if (!data.videoUrl) {
    return (
      <div className="aspect-video relative rounded-xl overflow-hidden bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No video configured.</p>
      </div>
    );
  }

  if (data.videoType === 'youtube') {
    return (
      <div className="aspect-video relative rounded-xl overflow-hidden shadow-2xl">
        <iframe
          src={data.videoUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
    );
  }

  if (data.videoType === 'upload') {
    return (
      <div className="aspect-video relative rounded-xl overflow-hidden shadow-2xl">
        <video
          controls
          src={data.videoUrl}
          poster={data.videoThumbnail}
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }
  
  return (
     <div className="aspect-video relative rounded-xl overflow-hidden shadow-2xl">
        <Image src={data.videoThumbnail || "https://picsum.photos/1280/720?random=51"} alt="Video thumbnail" fill style={{objectFit: 'cover'}}/>
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Button variant="ghost" size="icon" className="w-20 h-20 bg-white/30 hover:bg-white/50 rounded-full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white w-8 h-8 ml-1">
                    <path d="M5 4.5V19.5L19 12L5 4.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
            </Button>
        </div>
    </div>
  );
};


export function VideoSection({ data }: VideoSectionProps) {
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

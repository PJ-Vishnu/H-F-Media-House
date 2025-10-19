
"use client";

import { useState, useEffect } from 'react';
import type { VideoData } from '@/modules/video/video.schema';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Play } from 'lucide-react';

const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const VideoPlayer = ({ data }: { data: VideoData }) => {
  const [play, setPlay] = useState(false);

  const effectiveThumbnail = data.videoThumbnail || '';
  
  if (data.videoType === 'youtube') {
    const videoId = getYouTubeVideoId(data.videoUrl || '');
    const thumbnailUrl = effectiveThumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '');
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;

    if (!embedUrl) {
      return (
          <div className="aspect-video relative rounded-xl overflow-hidden bg-muted flex items-center justify-center">
            <p className="text-destructive">Invalid YouTube URL.</p>
          </div>
      );
    }
    
    if (play) {
      return (
        <div className="aspect-video relative rounded-xl overflow-hidden shadow-2xl">
          <iframe src={embedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
        </div>
      );
    }

    return (
      <div onClick={() => setPlay(true)} className="aspect-video relative rounded-xl overflow-hidden shadow-2xl cursor-pointer group">
        {thumbnailUrl && <Image src={thumbnailUrl} alt="Video thumbnail" fill className="object-cover" />}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Button variant="ghost" size="icon" className="w-20 h-20 bg-white/30 hover:bg-white/50 rounded-full transition-transform group-hover:scale-110">
                <Play className="text-white w-10 h-10 ml-1 fill-white" />
            </Button>
        </div>
      </div>
    );
  }

  if (data.videoType === 'upload' && data.videoUrl) {
    return (
      <div className="aspect-video relative rounded-xl overflow-hidden shadow-2xl">
        <video controls src={data.videoUrl} poster={effectiveThumbnail} className="w-full h-full object-cover bg-black">
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }
  
  return (
     <div className="aspect-video relative rounded-xl overflow-hidden bg-muted flex items-center justify-center">
        {effectiveThumbnail ? <Image src={effectiveThumbnail} alt="Video thumbnail" fill className="object-cover"/> : <p className="text-muted-foreground">No video configured.</p>}
    </div>
  );
};

export function VideoSection() {
  const [data, setData] = useState<VideoData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/video');
        if (!res.ok) throw new Error('Failed to fetch');
        const fetchedData = await res.json();
        setData(fetchedData);
      } catch (error) {
        console.error("Failed to fetch video data:", error);
      }
    }
    fetchData();
  }, []);

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

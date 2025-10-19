
"use client";

import { useState, useEffect } from 'react';
import type { VideoData } from '@/modules/video/video.schema';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const getYouTubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    const videoId = (match && match[2].length === 11) ? match[2] : null;
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

const VideoPlayer = ({ data }: { data: VideoData }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
     return (
      <div className="aspect-video relative rounded-xl overflow-hidden bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Loading video...</p>
      </div>
    );
  }

  if (!data.videoUrl) {
    return (
      <div className="aspect-video relative rounded-xl overflow-hidden bg-muted flex items-center justify-center">
        {data.videoThumbnail ? (
            <Image src={data.videoThumbnail} alt="Video thumbnail" fill style={{objectFit: 'cover'}}/>
        ) : (
            <p className="text-muted-foreground">No video configured.</p>
        )}
      </div>
    );
  }

  if (data.videoType === 'youtube') {
    const embedUrl = getYouTubeEmbedUrl(data.videoUrl);
    if (!embedUrl) {
      return (
        <div className="aspect-video relative rounded-xl overflow-hidden bg-muted flex items-center justify-center">
          <p className="text-destructive">Invalid YouTube URL provided.</p>
        </div>
      );
    }
    return (
      <div className="aspect-video relative rounded-xl overflow-hidden shadow-2xl">
        <iframe
          src={embedUrl}
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
          poster={data.videoThumbnail || ''}
          className="w-full h-full object-cover bg-black"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }
  
  return (
     <div className="aspect-video relative rounded-xl overflow-hidden shadow-2xl">
        <Image src={data.videoThumbnail || ""} alt="Video thumbnail" fill style={{objectFit: 'cover'}}/>
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


export function VideoSection() {
  const [data, setData] = useState<VideoData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/video');
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

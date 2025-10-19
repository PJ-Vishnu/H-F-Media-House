
"use client";

import { useState, useEffect } from 'react';
import type { HeroData } from '@/modules/hero/hero.schema';
import { Button } from '@/components/ui/button';
import { Carousel } from '@/components/shared/cylinder-carousel';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export function HeroSection() {
  const [data, setData] = useState<HeroData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/hero');
        if (!res.ok) throw new Error('Failed to fetch');
        const fetchedData: HeroData = await res.json();
        setData(fetchedData);
      } catch (error) {
        console.error("Failed to fetch hero data:", error);
      }
    }
    fetchData();
  }, []);

  if (!data) {
    return (
      <section id="hero" className="w-full pt-20 md:pt-32 lg:pt-40 bg-background overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-16 w-full max-w-4xl mb-4" />
            <Skeleton className="h-6 w-full max-w-2xl mb-8" />
            <Skeleton className="h-12 w-40 rounded-full" />
            <div className="relative w-full h-[500px] mt-4">
              <Skeleton className="w-full h-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="hero" className="w-full pt-20 md:pt-32 lg:pt-40 bg-background overflow-hidden">
      <div className=" mx-auto px-4">
        <div className="flex flex-col items-center text-center">
            <ScrollFadeIn>
                <p className="text-primary font-semibold tracking-widest uppercase mb-2">Capturing Moments</p>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold font-headline tracking-tighter leading-tight mb-4">
                    {data.headline}
                </h1>
                <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-8">
                    {data.subheadline}
                </p>
                <Button size="lg" asChild className="bg-primary text-primary-foreground font-bold text-lg px-8 rounded-full shadow-lg hover:bg-primary/90 transition-transform hover:scale-105">
                    <Link href={data.ctaLink}>
                        {data.ctaText}
                    </Link>
                </Button>
            </ScrollFadeIn>
            <div className="relative w-full h-[500px] mt-4">
                <Carousel images={Array.isArray(data.images) ? data.images : []} />
            </div>
        </div>
      </div>
    </section>
  );
}

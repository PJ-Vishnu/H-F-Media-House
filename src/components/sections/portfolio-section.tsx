"use client";

import { useState } from 'react';
import Image from 'next/image';
import type { PortfolioItem } from '@/lib/definitions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { cn } from '@/lib/utils';

type PortfolioSectionProps = {
  data: PortfolioItem[];
};

export function PortfolioSection({ data }: PortfolioSectionProps) {
  const categories = ['All', ...Array.from(new Set(data.map(item => item.category)))];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = activeCategory === 'All'
    ? data
    : data.filter(item => item.category === activeCategory);

  return (
    <section id="portfolio" className="w-full py-24 bg-secondary/50">
      <ScrollFadeIn className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Our Portfolio</h2>
          <p className="text-lg text-muted-foreground mt-2">A selection of our finest work.</p>
        </div>
        <div className="flex justify-center flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              className={cn(
                "rounded-full",
                activeCategory === category && "bg-primary text-primary-foreground"
              )}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <Card key={item.id} className="overflow-hidden group shadow-lg hover:shadow-2xl transition-shadow">
              <div className="relative h-60 w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  data-ai-hint={item['data-ai-hint']}
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <p className="text-sm font-semibold text-primary">{item.category}</p>
                <h3 className="text-xl font-bold font-headline mt-1">{item.title}</h3>
                <p className="text-muted-foreground mt-2">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollFadeIn>
    </section>
  );
}

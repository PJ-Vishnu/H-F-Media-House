
"use client";

import { useState } from 'react';
import Image from 'next/image';
import type { PortfolioItem } from '@/modules/portfolio/portfolio.schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PortfolioListProps = {
    items: PortfolioItem[];
    categories: string[];
}

export function PortfolioList({ items, categories }: PortfolioListProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(item => item.category === activeCategory);

  return (
    <>
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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
    </>
  );
}

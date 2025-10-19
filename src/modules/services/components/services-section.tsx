
"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import type { Service } from "@/modules/services/services.schema";
import { ScrollFadeIn } from "@/components/shared/scroll-fade-in";
import { Skeleton } from '@/components/ui/skeleton';
import { DynamicIcon } from '@/components/shared/dynamic-icon';

export function ServicesSection() {
  const [data, setData] = useState<Service[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/services');
        const fetchedData: Service[] = await res.json();
        setData(fetchedData);
      } catch (error) {
        console.error("Failed to fetch services data:", error);
      }
    }
    fetchData();
  }, []);

  if (!data) {
     return (
      <section id="services" className="w-full py-24 bg-background">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Skeleton className="h-6 w-1/3 mx-auto mb-2" />
              <Skeleton className="h-10 w-2/3 mx-auto mb-6" />
              <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Skeleton className="w-full h-[400px] rounded-2xl" />
              <Skeleton className="w-full h-[400px] rounded-2xl" />
              <Skeleton className="w-full h-[400px] rounded-2xl" />
            </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="w-full py-24 bg-background">
      <ScrollFadeIn className="container mx-auto px-4">
        {/* Section heading */}
        <div className="text-center mb-12">
          <p className="text-primary font-semibold tracking-widest uppercase mb-2">
            What We Do Best
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Creative Solutions for Every Need
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            From personal celebrations to professional campaigns, we specialize
            in delivering stunning visuals that highlight every moment, every
            story, and every brand.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((service) => (
            <div
              key={service.id}
              className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Background Image */}
              {service?.image && (
                <Image
                  src={service?.image}
                  alt={service.title}
                  fill
                  style={{objectFit: 'cover'}}
                />
              )}

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="mb-2">
                    <DynamicIcon name={service.icon} className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-2">{service.title}</h3>
                <p className="text-sm leading-relaxed text-white/90">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollFadeIn>
    </section>
  );
}
